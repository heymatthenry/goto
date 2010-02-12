CREATE TABLE "places" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR(50),
  "category" VARCHAR(50),
  "checkin" INTEGER, 
  "yahoo_id" INTEGER,
	"last_checkin" DATETIME
);