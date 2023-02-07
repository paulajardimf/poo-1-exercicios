-- Active: 1675807585466@@127.0.0.1@3306
CREATE TABLE videos (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  title TEXT NOT NULL,
  duration INTEGER NOT NULL,
  upload_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO videos (id, title, duration)
VALUES
("v001", "Video React", 300),
("v002", "Video Typescript", 360);

SELECT * FROM videos;
