CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mails` (
	`id` integer PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`headers` text,
	`content` text
);
--> statement-breakpoint
CREATE TABLE `recipients` (
	`mail_id` integer NOT NULL,
	`contact_id` integer NOT NULL,
	FOREIGN KEY (`mail_id`) REFERENCES `mails`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_email_unique` ON `contacts` (`email`);