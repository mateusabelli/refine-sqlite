PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "categories" (
	"id"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL,
	PRIMARY KEY("id")
);
INSERT INTO categories VALUES(1,'Enim Alias Autem');
INSERT INTO categories VALUES(2,'Dolorem Assumenda Optio');
INSERT INTO categories VALUES(3,'Quasi Facilis Optio');
INSERT INTO categories VALUES(4,'Natus Quibusdam Id');
INSERT INTO categories VALUES(5,'Aut Corrupti Doloribus');
CREATE TABLE IF NOT EXISTS "posts" (
	"id" INTEGER NOT NULL,
	"title" TEXT NOT NULL,
	"category_id" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("category_id") REFERENCES "categories"("id")
);
INSERT INTO posts VALUES(1,'Soluta et est est.',2);
INSERT INTO posts VALUES(2,'Quia ducimus voluptate.',4);
INSERT INTO posts VALUES(3,'Numquam dolores quisquam.',1);
INSERT INTO posts VALUES(4,'Dolores facere quibusdam dicta.',3);
INSERT INTO posts VALUES(5,'Dolorem eum non quis officiis iusto.',5);
INSERT INTO posts VALUES(6,'Dolorem unde et officiis.',2);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('posts',6);
COMMIT;
