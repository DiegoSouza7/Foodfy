CREATE DATABASE foodfy;

CREATE TABLE users (
  "id" SERIAL,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  PRIMARY KEY (id)
);

CREATE TABLE files (
  "id" SERIAL,
  "name" TEXT,
  "path" TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE chefs (
  "id" SERIAL,
  "name" TEXT NOT NULL,
  "file_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "updated_at" timestamp DEFAULT (now()),
  PRIMARY KEY (id),
  CONSTRAINT fk_chefs_files FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE,
  CONSTRAINT fk_chefs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE recipes (
  "id" SERIAL,
  "chef_id" INTEGER,
  "title" TEXT NOT NULL,
  "ingredients" TEXT [],
  "preparation" TEXT [],
  "information" TEXT,
  "created_at" timestamp DEFAULT (now()),
  PRIMARY KEY (id),
  CONSTRAINT fk_recipes_chef FOREIGN KEY (chef_id) REFERENCES chefs (id) ON DELETE CASCADE
);

CREATE TABLE recipe_files (
  "id" SERIAL,
  "recipe_id" INTEGER,
  "file_id" INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT fk_recipefiles_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
  CONSTRAINT fk_recipefiles_files FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS = FALSE);

ALTER TABLE
  "session"
ADD
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- create procedure
CREATE FUNCTION trigger_set_timestamp_update() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE FUNCTION trigger_set_timestamp_created() RETURNS TRIGGER AS $ $ BEGIN NEW.created_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

-- auto updated_at chefs
CREATE TRIGGER set_timestamp BEFORE
UPDATE
  ON chefs FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp_update();

-- auto created_at chefs
CREATE TRIGGER set_timestamp BEFORE
UPDATE
  ON recipes FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp_created();

-- to run seeds
DELETE FROM
  chefs;

DELETE FROM
  recipes;

DELETE FROM
  files;

DELETE FROM
  recipe_files;

DELETE FROM
  users;

-- restart sequence auto_increment from tables ids
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;

ALTER SEQUENCE files_id_seq RESTART WITH 1;

ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;

ALTER SEQUENCE recipes_id_seq RESTART WITH 1;

ALTER SEQUENCE users_id_seq RESTART WITH 1;