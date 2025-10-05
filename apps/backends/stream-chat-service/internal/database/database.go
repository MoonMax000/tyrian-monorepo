package database

import (
	"database/sql"
	"errors"
	"fmt"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/Capstane/stream-chat-service/internal/config"
	"github.com/Capstane/stream-chat-service/internal/model"
	"github.com/Capstane/stream-chat-service/internal/types"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"

	"github.com/rs/zerolog/log"
)

type database struct {
	gormDB    *gorm.DB
	db        *sql.DB
	insertban chan *dbInsertBan
	deleteban chan *dbDeleteBan
	sync.Mutex
}

type dbInsertBan struct {
	uid         uuid.UUID
	targetuid   uuid.UUID
	ipaddress   *sql.NullString
	reason      string
	starttime   time.Time
	endtime     *sql.NullTime
	retries     uint8
	streamOwner uuid.UUID
}

type dbDeleteBan struct {
	uid uuid.UUID
}

var DB = &database{
	insertban: make(chan *dbInsertBan, 10),
	deleteban: make(chan *dbDeleteBan, 10),
}

func InitDatabase(cfg *config.Config) (*sql.DB, *gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDb,
		cfg.PostgresPort,
	)

	log.Debug().Msgf("dsn: %v", dsn)

	// err := createDatabaseIfNotExists(cfg)
	// if err != nil {
	// 	return nil, err
	// }

	dbpostgres, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.LogLevel(cfg.LogLevel)),
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "chat_",                           // table name prefix, table for `Ban` would be `t_ban`
			SingularTable: true,                              // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase:   false,                             // skip the snake_casing of names
			NameReplacer:  strings.NewReplacer("CID", "Cid"), // use name replacer to change struct/field name before convert it to db name
		},
	})

	if err != nil {
		log.Fatal().Msgf("Failed to connect to database. %v\n", err)
	}

	log.Info().Msg("Connected")
	log.Info().Msg("running migrations")

	err = dbpostgres.AutoMigrate(
		&model.Ban{},
		&model.Mut{},
		&model.User{},
		&model.UsersFeatures{},
	)

	if err != nil {
		log.Fatal().Msgf("failed to run migrations: %v", err)
		return nil, nil, err
	}

	// Uptated!
	sqlDB, err := dbpostgres.DB()
	if err != nil {
		log.Fatal().Msgf("failed to get SQL driver: %v", err)
	}

	DB.gormDB = dbpostgres
	DB.db = sqlDB
	go DB.runInsertBan()
	go DB.runDeleteBan()

	return sqlDB, dbpostgres, nil
}

// func createDatabaseIfNotExists(cfg *config.Config) error {
// 	dsn := fmt.Sprintf(
// 		"host=%s user=%s password=%s port=%d sslmode=disable TimeZone=UTC",
// 		cfg.PostgresHost,
// 		cfg.PostgresUser,
// 		cfg.PostgresPassword,
// 		cfg.PostgresPort,
// 	)
// 	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		return err
// 	}

// 	tx := db.Raw(fmt.Sprintf("SELECT * FROM pg_database WHERE datname = '%s';", cfg.PostgresDb))
// 	if tx.Error != nil {
// 		return tx.Error
// 	}

// 	// if not create it
// 	var records = make(map[string]interface{})
// 	if tx.Find(records); len(records) == 0 {
// 		tx := db.Exec(fmt.Sprintf("CREATE DATABASE \"%s\"", cfg.PostgresDb))
// 		if tx.Error != nil {
// 			return tx.Error
// 		}
// 	}

// 	return nil
// }

func (db *database) getStatement(name string, sql string) *sql.Stmt {
	db.Lock()
	stmt, err := db.db.Prepare(sql)
	db.Unlock()
	if err != nil {
		log.Error().Msgf("Unable to create %v statement, cause error: %v", name, err)
		time.Sleep(100 * time.Millisecond)
		return db.getStatement(name, sql)
	}
	return stmt
}

func (db *database) getInsertBanStatement() *sql.Stmt {
	return db.getStatement("insertBan", `
		INSERT INTO chat_ban (
			userid,
			targetuserid,
			ipaddress,
			reason,
			starttimestamp,
			endtimestamp,
			stream_owner
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		)
	`)
}

func (db *database) getDeleteBanStatement() *sql.Stmt {
	return db.getStatement("deleteBan", `
		UPDATE chat_ban
		SET endtimestamp = NOW()
		WHERE
			targetuserid = $1 AND
			(
				endtimestamp IS NULL OR
				endtimestamp > NOW()
			)
	`)
}

func (db *database) runInsertBan() {
	t := time.NewTimer(time.Minute)
	stmt := db.getInsertBanStatement()
	for {
		select {
		case <-t.C:
			stmt.Close()
			stmt = nil
		case data := <-db.insertban:
			t.Reset(time.Minute)
			if stmt == nil {
				stmt = db.getInsertBanStatement()
			}
			if data.retries > 2 {
				continue
			}
			db.Lock()
			_, err := stmt.Exec(data.uid, data.targetuid, data.ipaddress, data.reason, data.starttime, data.endtime, data.streamOwner)
			db.Unlock()
			if err != nil {
				data.retries++
				log.Error().Msgf("Unable to insert event: %v", err)
				go (func() {
					db.insertban <- data
				})()
			}
		}
	}
}

func (db *database) runDeleteBan() {
	t := time.NewTimer(time.Minute)
	stmt := db.getDeleteBanStatement()
	for {
		select {
		case <-t.C:
			stmt.Close()
			stmt = nil
		case data := <-db.deleteban:
			t.Reset(time.Minute)
			if stmt == nil {
				stmt = db.getDeleteBanStatement()
			}
			db.Lock()
			_, err := stmt.Exec(data.uid)
			db.Unlock()
			if err != nil {
				log.Error().Msgf("Unable to insert event: %v", err)
				go (func() {
					db.deleteban <- data
				})()
			}
		}
	}
}

func (db *database) InsertBan(uid uuid.UUID, targetuid uuid.UUID, ban *types.BanIn, ip string, streamOwner uuid.UUID) {

	ipaddress := &sql.NullString{}
	if ban.BanIP && len(ip) != 0 {
		ipaddress.String = ip
		ipaddress.Valid = true
	}
	starttimestamp := time.Now().UTC()

	endtimestamp := &sql.NullTime{}
	if !ban.Ispermanent {
		endtimestamp.Time = starttimestamp.Add(time.Duration(ban.Duration))
		endtimestamp.Valid = true
	}

	db.insertban <- &dbInsertBan{uid, targetuid, ipaddress, ban.Reason, starttimestamp, endtimestamp, 0, streamOwner}
}

func (db *database) DeleteBan(targetuid uuid.UUID) {
	db.deleteban <- &dbDeleteBan{targetuid}
}

func (db *database) GetBans(f func(uuid.UUID, sql.NullString, sql.NullTime)) {
	db.Lock()
	defer db.Unlock()

	rows, err := db.db.Query(`
		SELECT
			targetuserid,
			ipaddress,
			endtimestamp
		FROM chat_ban
		WHERE
			endtimestamp IS NULL OR
			endtimestamp > NOW()
		GROUP BY targetuserid, ipaddress, endtimestamp
	`)

	if err != nil {
		log.Error().Msgf("Unable to get active bans: %v", err)
		return
	}

	defer rows.Close()
	for rows.Next() {
		var uid uuid.UUID
		var ipaddress sql.NullString
		var endtimestamp sql.NullTime
		err = rows.Scan(&uid, &ipaddress, &endtimestamp)

		if err != nil {
			log.Error().Msgf("Unable to scan bans row: %v", err)
			continue
		}

		f(uid, ipaddress, endtimestamp)
	}
}

func (db *database) GetUser(nick string) (uuid.UUID, bool) {
	stmt := db.getStatement("getUser", `
        SELECT
            u.id_user,
            CASE 
                WHEN 'admin' = ANY(u.feature) THEN TRUE
                ELSE FALSE
            END AS protected
        FROM chat_users_features AS u
        WHERE u.chat_user = $1
    `)

	db.Lock()
	defer stmt.Close()
	defer db.Unlock()

	var uid uuid.UUID
	var protected bool

	err := stmt.QueryRow(nick).Scan(&uid, &protected)
	if err != nil {
		log.Error().Msgf("error looking up %v: %v", nick, err)
		return uuid.Nil, false
	}

	return uid, protected
}

func (db *database) GetFeaturesByChatUserAndChatID(userID uuid.UUID, streamOwner uuid.UUID) ([]string, error) {
	var userFeatures model.UsersFeatures

	if err := db.gormDB.Where("id_user = ? AND chat_id = ?", userID, streamOwner).First(&userFeatures).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return []string{}, nil
		}

		return nil, err
	}
	log.Info().Msgf("[getFeaturesByChatUserAndChatID] Features for user with ID '%s' and username '%s' has been created", userID, userFeatures.Feature)
	return userFeatures.Feature, nil
}

func (db *database) CreateUpdateNameChatUser(userID uuid.UUID, username string, streamOwner uuid.UUID) {
	var userFeatures model.UsersFeatures

	// Check userID
	if err := db.gormDB.Where("id_user = ? AND chat_id = ?", userID, streamOwner).First(&userFeatures).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// No record
			newUser := model.UsersFeatures{
				IdUser:   userID,
				ChatUser: username,
				ChatID:   streamOwner,
				Feature:  []string{},
			}

			// Create the new user
			if tx := db.gormDB.Create(&newUser); tx.Error != nil {
				log.Error().Msgf("[createUpdateNameChatUser]error creating new user: %v", tx.Error)
			}

			log.Info().Msgf("[createUpdateNameChatUser] New user with ID '%s' and username '%s' has been created", userID, username)

		}

		log.Error().Msgf("[createUpdateNameChatUser] error checking for existing user: %v", err)
	}

	if userFeatures.ChatUser != username {
		// Update username
		if tx := db.gormDB.Model(&userFeatures).Where("id_user = ?", userID).Update("chat_user", username); tx.Error != nil {
			log.Error().Msgf("[createUpdateNameChatUser] error updating username for user ID '%s': %v", userID, tx.Error)
		}

		log.Info().Msgf("[createUpdateNameChatUser] Username for user ID '%s' has been updated to '%s'", userID, username)
	} else {
		log.Info().Msgf("[createUpdateNameChatUser] Username for user ID '%s' is up-to-date", userID)
	}

}

func (db *database) InitAdminStream(adminid uuid.UUID) {
	var existingUser model.UsersFeatures

	if err := db.gormDB.Where("stream_owner = ?", adminid).First(&existingUser).Error; err == nil {
		log.Info().Msgf("[initAdminStream] [database] Admin with ChatUser %s and StreamOwner %s already exists", adminid, adminid)
		return
	}

	admin := model.UsersFeatures{
		IdUser:      adminid,
		StreamOwner: adminid,
		ChatID:      adminid,
		Feature:     []string{"admin"},
	}

	tx := db.gormDB.Create(&admin)
	if tx.Error != nil {
		log.Error().Msgf("[initAdminStream] [database] Error creating StreamOwner %s: %v", adminid, tx.Error)
		return
	}

	log.Info().Msgf("[initAdminStream] [database] Admin with ChatUser %s and StreamOwner %s created successfully", adminid, adminid)
}

func (db *database) RequestBans(streamOwner uuid.UUID) []uuid.UUID {
	log.Info().Msgf("[requestBans] [database] Admin with ChatUser %s", streamOwner)
	now := time.Now()

	var activeBans []uuid.UUID

	err := db.gormDB.Model(&model.Ban{}).
		Where("stream_owner = ? AND (endtimestamp IS NULL OR endtimestamp > ?)", streamOwner, now).
		Distinct("targetuserid").
		Pluck("targetuserid", &activeBans).Error

	if err != nil {
		log.Error().Msgf("[requestBans] [database] Error get Bans: %s", err)
	}

	return activeBans
}

func (db *database) GetChatUserById(userId uuid.UUID) string {
	var userFeature model.UsersFeatures

	err := db.gormDB.Where("id_user = ?", userId).First(&userFeature).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ""
		}
		return ""
	}

	return userFeature.ChatUser
}

func (db *database) RequestModerator(streamOwner uuid.UUID) []string {
	log.Info().Msgf("[requestModerator] [database] Admin with ChatUser %s", streamOwner)

	var moderators []string

	err := db.gormDB.Model(&model.UsersFeatures{}).
		Where("chat_id = ?", streamOwner).
		Where("feature @> ?", pq.Array([]string{"moderator"})).
		Pluck("chat_user", &moderators).Error

	if err != nil {
		log.Error().Msgf("[requestModerator] [database] Error getting moderators: %s", err)
	}

	return moderators
}

func (db *database) findUserFeatures(uid uuid.UUID, chatid uuid.UUID) (*model.UsersFeatures, error) {
	var userFeatures model.UsersFeatures

	// cehcking record
	if err := db.gormDB.Where("id_user = ? AND chat_id = ?", uid, chatid).First(&userFeatures).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Warn().Msgf("[findUserFeatures] [database] No record found for IdUser %s and ChatID %s", uid, chatid)
			return nil, nil
		}
		log.Error().Msgf("[findUserFeatures] [database] Error finding record for IdUser %s and ChatID %s: %v", uid, chatid, err)
		return nil, err
	}

	return &userFeatures, nil
}

func (db *database) updateUserFeatures(uid uuid.UUID, chatid uuid.UUID, newFeature []string) error {
	// Update the record
	tx := db.gormDB.Model(&model.UsersFeatures{}).
		Where("id_user = ? AND chat_id = ?", uid, chatid).
		Update("feature", pq.StringArray(newFeature))

	if tx.Error != nil {
		log.Error().Msgf("[updateUserFeatures] [database] Error updating role for IdUser %s and ChatID %s: %v", uid, chatid, tx.Error)
		return tx.Error
	}

	return nil
}

func (db *database) RequestSetRole(uid uuid.UUID, chatid uuid.UUID, role string) {
	userFeatures, err := db.findUserFeatures(uid, chatid)
	if err != nil || userFeatures == nil {
		return
	}

	if slices.Contains(userFeatures.Feature, role) {
		log.Info().Msgf("Role '%s' already exists for IdUser %s and ChatID %s", role, uid, chatid)
		return
	}

	newFeature := append(userFeatures.Feature, role)

	if err := db.updateUserFeatures(uid, chatid, newFeature); err != nil {
		return
	}

	log.Info().Msgf("Role '%s' successfully added for IdUser %s and ChatID %s", role, uid, chatid)
}

func (db *database) RequestDeleteRole(uid uuid.UUID, chatid uuid.UUID, role string) {
	userFeatures, err := db.findUserFeatures(uid, chatid)
	if err != nil || userFeatures == nil {
		return
	}

	if !slices.Contains(userFeatures.Feature, role) {
		log.Warn().Msgf("[requestDeleteRole] [database] Role '%s' not found in features for IdUser %s and ChatID %s", role, uid, chatid)
		return
	}

	newFeature := []string{}
	for _, r := range userFeatures.Feature {
		if r != role {
			newFeature = append(newFeature, r)
		}
	}

	if err := db.updateUserFeatures(uid, chatid, newFeature); err != nil {
		return
	}

	log.Info().Msgf("Role '%s' successfully removed for IdUser %s and ChatID %s", role, uid, chatid)
}

func (db *database) CreateHistoryTable(chatId string) error {
	db.Lock()
	defer db.Unlock()

	tableName := fmt.Sprintf("%s_%s", "history", strings.ReplaceAll(chatId, "-", "_"))

	// Удаляем таблицу, если она существует, история с прошлого стрима
	dropQuery := fmt.Sprintf("DROP TABLE IF EXISTS %s;", tableName)
	_, err := db.db.Exec(dropQuery)
	if err != nil {
		log.Error().Msgf("Unable to drop history table '%s': %v", tableName, err)
		return err
	}

	// Создание новой таблицы
	query := fmt.Sprintf(`
        CREATE TABLE IF NOT EXISTS %s (
            id UUID PRIMARY KEY,
            sender UUID NOT NULL,
			nick TEXT NOT NULL,
            message TEXT NOT NULL,
			timestamp_message TIMESTAMP
        );
    `, tableName)

	_, err = db.db.Exec(query)
	if err != nil {
		log.Error().Msgf("Unable to create history table '%s': %v", tableName, err)
		return err
	}

	log.Info().Msgf("Table '%s' initialized successfully", tableName)
	return nil
}

func (db *database) InsertMessage(messageId uuid.UUID, adminID uuid.UUID, author uuid.UUID, nick string, msg string, timeMessage int64) error {
	db.Lock()
	defer db.Unlock()

	tableName := fmt.Sprintf("%s_%s", "history", strings.ReplaceAll(adminID.String(), "-", "_"))

	query := fmt.Sprintf(`
        INSERT INTO %s (id, sender, nick, message, timestamp_message)
        VALUES ($1, $2, $3, $4, $5)
    `, tableName)

	_, err := db.db.Exec(query, messageId, author, nick, msg, time.Unix(timeMessage/1000, 0))
	if err != nil {
		log.Error().Msgf("Unable to insert message into table '%s': %v", tableName, err)
		return err
	}

	log.Debug().Msgf("Message inserted successfully into table '%s'", tableName)
	return nil
}

func (db *database) DeleteMessage(messageID string, table string) error {
	db.Lock()
	defer db.Unlock()

	messageId, err := uuid.Parse(messageID)
	if err != nil {
		return fmt.Errorf("invalid message ID format: %s. Expected valid UUID", messageID)
	}

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1", table)

	result, err := db.db.Exec(query, messageId)
	if err != nil {
		log.Printf("ERROR: failed to delete message %s from table %s: %v", messageID, table, err)
		return fmt.Errorf("failed to delete message: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("WARNING: could not get rows affected for deletion of message %s in table %s", messageID, table)
	} else if rowsAffected == 0 {
		log.Printf("INFO: no message found with ID %s in table %s", messageID, table)
		return fmt.Errorf("message not found")
	} else {
		log.Printf("SUCCESS: deleted message %s from table %s (affected %d row(s))", messageID, table, rowsAffected)
	}

	return nil
}
