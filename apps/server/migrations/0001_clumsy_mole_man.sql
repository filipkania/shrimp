CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`salt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
--> statement-breakpoint
INSERT INTO `users`(`username`, `password`, `salt`) VALUES ('admin', 'ff10ef175ea43f3dc8983e6effb8d6d012bb6750741b3f1be8b6808a13590c3a', 'ea7a9516'); -- admin:admin