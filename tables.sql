CREATE TABLE IF NOT EXISTS mapping (
  "longURL" varchar(2048) NOT NULL,
  "shortURL" varchar(2048) NOT NULL,
  "createdAtUnix" bigint DEFAULT extract(epoch from now()),
  PRIMARY KEY ("longURL")
)