
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);

CREATE TABLE IF NOT EXISTS UserRecord (
    user_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_record_name TEXT NOT NULL,
    user_record_password TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS Articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title TEXT NULL,
    article_subtitle TEXT NULL,
    article_content TEXT NULL,
    user_record_id  INT NOT NULL, --the user that the record belongs to
    user_record_name  TEXT NOT NULL,
    status TEXT NOT NULL,
    create_date DATE NULL,
    published_on DATE NULL, 
    last_modified_date DATE NULL,
    number_likes INTEGER NULL DEFAULT 0,
    FOREIGN KEY (user_record_id) REFERENCES UserRecord(user_record_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_content TEXT NULL,
    article_id  INT NOT NULL,
    comment_date DATE NULL,
    FOREIGN KEY (article_id) REFERENCES Articles(article_id) ON DELETE CASCADE
);

--insert default data (if necessary here)

INSERT INTO testUsers ("test_name") VALUES ("Simon Star");
INSERT INTO UserRecord ("user_record_name", "user_record_password") VALUES ("john", "password");
INSERT INTO testUserRecords ("test_record_value", "test_user_id") VALUES( "Lorem ipsum dolor sit amet", 1); --try changing the test_user_id to a different number and you will get an error

COMMIT;

