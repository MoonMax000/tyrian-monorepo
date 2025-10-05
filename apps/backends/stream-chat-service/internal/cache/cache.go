package cache

import (
	"fmt"
	"time"

	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/types"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/tideland/golib/redis"
)

var (
	rds               *redis.Database
	rdsCircularBuffer string
	rdsGetIPCache     string
	rdsSetIPCache     string
)

// how many log lines to buffer for the scrollback
const CHATLOGLINES = 150

func RedisGetConn() *redis.Connection {
again:
	conn, err := rds.Connection()
	if err != nil {
		log.Error().Msgf("Error getting a redis connection", err)
		if conn != nil {
			conn.Return()
		}
		time.Sleep(500 * time.Millisecond)
		goto again
	}

	return conn
}

func InitRedis(addr string, db int64, pw string) {
	var err error
	rds, err = redis.Open(
		redis.TcpConnection(addr, 1*time.Second),
		redis.Index(int(db), pw),
		redis.PoolSize(50),
	)
	if err != nil {
		log.Error().Msgf("[initRedis] [cache] Error making the redis pool: %s", err)
	}

	conn := RedisGetConn()
	defer conn.Return()

	rdsCircularBuffer, err = conn.DoString("SCRIPT", "LOAD", `
		local key = KEYS[1]
		local maxlength = tonumber(ARGV[1])
		local payload = ARGV[2]

		if not key then
			return {err = "INVALID KEY"}
		end
		if not payload then
			return {err = "INVALID PAYLOAD"}
		end
		if not maxlength then
			return {err = "INVALID MAXLENGTH"}
		end

		-- push the payload onto the end
		redis.call("RPUSH", key, payload)

		local delcount = 0
		-- get rid of excess lines from the front
		local numlines = redis.call("LLEN", key)
		for _ = numlines - 1, maxlength, -1 do
			redis.call("LPOP", key)
			delcount = delcount + 1
		end

		return delcount
	`)
	if err != nil {
		log.Error().Msgf("[initRedis] [cache] Circular buffer script loading error: %s", err)
	}

	rdsGetIPCache, err = conn.DoString("SCRIPT", "LOAD", `
		local key = KEYS[1]
		return redis.call("ZRANGEBYSCORE", key, 1, 3)
	`)
	if err != nil {
		log.Error().Msgf("[initRedis] [cache] Get IP Cache script loading error: %s", err)
	}

	rdsSetIPCache, err = conn.DoString("SCRIPT", "LOAD", `
		local key, value, maxlength = KEYS[1], ARGV[1], 3
		
		local count = redis.call("ZCOUNT", key, 1, maxlength)
		local existingscore = redis.call("ZSCORE", key, value)
		if existingscore then
			-- renumber all the elements and make this one the last
			local elements = redis.call("ZRANGEBYSCORE", key, 1, maxlength)
			local i = 1
			for _, v in ipairs(elements) do
				if v == value then
					redis.call("ZADD", key, count, v)
				else
					redis.call("ZADD", key, i, v)
					i = i + 1
				end
			end
			return
		end
		
		if count == maxlength then
			-- delete the first element, modify the other elements score down
			-- and add the new one to the end
			redis.call("ZREMRANGEBYSCORE", key, 1, 1)
			local elements = redis.call("ZRANGEBYSCORE", key, 2, maxlength)
			local i = 1
			for _, v in ipairs(elements) do
				redis.call("ZADD", key, i, v)
				i = i + 1
			end
			return redis.call("ZADD", key, count, value)
		else
			-- otherwise just insert it with the next score
			return redis.call("ZADD", key, count + 1, value)
		end
	`)
	if err != nil {
		log.Error().Msgf("[initRedis] [cache] Set IP Cache script loading error: %s", err)
	}
}

func CacheIPForUser(userid uuid.UUID, ip string) {
	if ip == "127.0.0.1" {
		return
	}

	conn := RedisGetConn()
	defer conn.Return()

	_, err := conn.Do("EVALSHA", rdsSetIPCache, 1, fmt.Sprintf("CHAT:userips-%d", userid), ip)
	if err != nil {
		log.Error().Msgf("[banUser] [hub] cacheIPForUser redis error %s", err)
	}
}

func GetIPCacheForUser(userid uuid.UUID) []string {
	conn := RedisGetConn()
	defer conn.Return()

	ips, err := conn.DoStrings("EVALSHA", rdsGetIPCache, 1, fmt.Sprintf("CHAT:userips-%d", userid))
	if err != nil {
		log.Error().Msgf("[banUser] [hub] getIPCacheForUser redis error %s", err)
	}

	return ips
}

func isSubErr(sub *redis.Subscription, err error) bool {
	if err != nil {
		log.Error().Msgf("[banUser] [hub] Getting a subscription failed with error %s", err)
		if sub != nil {
			sub.Close()
		}
		time.Sleep(500 * time.Millisecond)
		return true
	}
	return false
}

func SetupRedisSubscription(channel string, redisdb int64, cb func(*redis.PublishedValue)) {
again:
	sub, err := rds.Subscription()
	if isSubErr(sub, err) {
		goto again
	}

	err = sub.Subscribe(fmt.Sprintf("%s-%d", channel, redisdb))
	if isSubErr(sub, err) {
		goto again
	}

	for {
		result, err := sub.Pop()
		if isSubErr(sub, err) {
			goto again
		}

		if result.Value.IsNil() {
			continue
		}

		cb(result)
	}
}

func redisGetBytes(key string) ([]byte, error) {
	conn := RedisGetConn()
	defer conn.Return()

	result, err := conn.Do("GET", key)
	if err != nil {
		return []byte{}, err
	}

	value, err := result.ValueAt(0)
	if err != nil {
		return []byte{}, err
	}

	return value.Bytes(), err
}

func CacheChatEvent(msg *types.Message, streamOwner uuid.UUID) {
	conn := RedisGetConn()
	defer conn.Return()

	data, err := internal.Pack(msg.Event, msg.Data.([]byte))
	if err != nil {
		log.Error().Msgf("[banUser] [hub] cacheChatEvent pack error %s", err)
		return
	}

	redisKey := "CHAT:chatlog:" + streamOwner.String()
	_, err = conn.Do(
		"EVALSHA",
		rdsCircularBuffer,
		1,
		redisKey,
		CHATLOGLINES,
		data,
	)

	if err != nil {
		log.Error().Msgf("[banUser] [hub] cacheChatEvent redis error %s", err)
	}
}

func CacheConnectedUsers(marshallednames []byte, streamOwner uuid.UUID) {
	conn := RedisGetConn()
	defer conn.Return()

	connectedUsers := "CHAT:connectedUsers:" + streamOwner.String()
	_, err := conn.DoOK("SET", connectedUsers, marshallednames)

	if err != nil {
		log.Error().Msgf("[banUser] [hub] Error caching connected users %s", err)
	}
}

func RemoveElementFromList(key string, value string) error {
	conn := RedisGetConn()
	defer conn.Return()

	_, err := conn.Do("LREM", key, 1, value)
	if err != nil {
		return fmt.Errorf("error removing element: %w", err)
	}

	log.Info().Msgf("[removeElementFromList] Delete msg from redis")
	return nil
}
