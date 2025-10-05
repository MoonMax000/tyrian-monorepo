package model

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type UsersFeatures struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"`
	IdUser      uuid.UUID      `gorm:"not null;type:uuid"`
	StreamOwner uuid.UUID      `gorm:"type:uuid"`
	ChatID      uuid.UUID      `gorm:"type:uuid"`
	ChatUser    string         `gorm:"not null;type:text"`
	Feature     pq.StringArray `gorm:"type:text[]"`
}

// CREATE TABLE `dfl_users_features` (
// 	`id` int(14) NOT NULL AUTO_INCREMENT,
// 	`userId` int(14) NOT NULL,
// 	`featureId` int(14) NOT NULL,
// 	PRIMARY KEY (`id`),
// 	KEY `userId` (`userId`),
// 	KEY `featureId` (`featureId`),
// 	CONSTRAINT `dfl_users_features_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `dfl_users` (`userId`),
// 	CONSTRAINT `dfl_users_features_ibfk_2` FOREIGN KEY (`featureId`) REFERENCES `dfl_features` (`featureId`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// CREATE TABLE `dfl_features` (
// 	`featureId` int(14) NOT NULL AUTO_INCREMENT,
// 	`featureName` varchar(100) NOT NULL,
// 	`featureLabel` varchar(100) NOT NULL,
// 	`imageId` int(14) DEFAULT NULL,
// 	`locked` tinyint(1) NOT NULL,
// 	`hidden` tinyint(1) NOT NULL,
// 	`priority` tinyint(2) NOT NULL,
// 	`color` varchar(16) DEFAULT NULL,
// 	`createdDate` datetime NOT NULL,
// 	`modifiedDate` datetime NOT NULL,
// 	PRIMARY KEY (`featureId`),
// 	UNIQUE KEY `featureName` (`featureName`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// INSERT INTO `dfl_features` (`featureId`, `featureName`, `featureLabel`, `locked`, `hidden`, `priority`, `createdDate`, `modifiedDate`) VALUES
// (1, 'protected', 'Protected', 0, 1, 50, NOW(), NOW()),
// (2, 'subscriber', 'Subscriber', 0, 1, 50, NOW(), NOW()),
// (3, 'vip', 'VIP', 0, 1, 50, NOW(), NOW()),
// (4, 'moderator', 'Moderator', 0, 1, 50, NOW(), NOW()),
// (5, 'admin', 'Admin', 0, 1, 50, NOW(), NOW()),
// (6, 'bot', 'Bot', 0, 1, 50, NOW(), NOW()),
// (7, 'flair1', 'Subscriber Tier 2', 0, 1, 50, NOW(), NOW()),
// (8, 'flair2', 'Notable', 0, 1, 50, NOW(), NOW()),
// (9, 'flair3', 'Subscriber Tier 3', 0, 1, 50, NOW(), NOW()),
// (10, 'flair4', 'Trusted', 0, 1, 50, NOW(), NOW()),
// (11, 'flair5', 'Contributor', 0, 1, 50, NOW(), NOW()),
// (12, 'flair6', 'Composition Winner', 0, 1, 50, NOW(), NOW()),
// (13, 'flair7', 'Eve', 0, 1, 50, NOW(), NOW()),
// (14, 'flair8', 'Subscriber Tier 4', 0, 1, 50, NOW(), NOW()),
// (15, 'flair10', 'StarCraft 2', 0, 1, 50, NOW(), NOW()),
// (16, 'flair11', 'Bot 2', 0, 1, 50, NOW(), NOW()),
// (17, 'flair12', 'Broadcaster', 0, 1, 50, NOW(), NOW()),
// (18, 'flair14', 'Minecraft VIP', 0, 1, 50, NOW(), NOW()),
// (19, 'flair15', 'DGG Bday', 0, 1, 50, NOW(), NOW()),
// (20, 'flair19', 'DGG Shirt Designer', 0, 1, 50, NOW(), NOW()),
// (21, 'flair13', 'Subscriber Tier 1', 0, 1, 50, NOW(), NOW()),
// (22, 'flair9', 'Twitch Subscriber', 0, 1, 50, NOW(), NOW());
