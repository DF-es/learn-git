CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guild` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`completedQuests` integer DEFAULT 0 NOT NULL,
	`usedRewards` integer DEFAULT 0 NOT NULL,
	`description` text,
	`avatar` text,
	`userId` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`guildId` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`points` integer NOT NULL,
	`category` text DEFAULT 'logic' NOT NULL,
	`rewardExp` integer DEFAULT 0 NOT NULL,
	`rewardGp` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'routine' NOT NULL,
	`recurrence` text,
	`isCompleted` integer DEFAULT false NOT NULL,
	`lastCompleted` text,
	`guildId` integer NOT NULL,
	`parentQuestId` integer,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentQuestId`) REFERENCES `quest`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reward` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`points` integer NOT NULL,
	`guildId` integer NOT NULL,
	FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `userStatus` (
	`userId` text PRIMARY KEY NOT NULL,
	`logicExp` integer DEFAULT 0 NOT NULL,
	`physicalExp` integer DEFAULT 0 NOT NULL,
	`mentalExp` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`totalExp` integer DEFAULT 0 NOT NULL,
	`currentGp` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
