CREATE TABLE `catalog` (
	`id` text PRIMARY KEY NOT NULL,
	`price` integer NOT NULL,
	`available` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`customer` text NOT NULL,
	`phone` text NOT NULL,
	`delivery` text NOT NULL,
	`detail` text NOT NULL,
	`slot` text NOT NULL,
	`items` text NOT NULL,
	`total` integer NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Recebido' NOT NULL,
	`payments` text DEFAULT '[]' NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`payment_intent` text DEFAULT 'Na retirada' NOT NULL
);
