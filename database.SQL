CREATE DATABASE foodfy;

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
    "updated_at" timestamp DEFAULT (now()),
    PRIMARY KEY (id),
    CONSTRAINT fk_chefs_files FOREIGN KEY (file_id) REFERENCES files (id)
    ON DELETE CASCADE
);

CREATE TABLE recipes (
    "id" SERIAL,
    "chef_id" INTEGER,
    "title" TEXT NOT NULL,
    "ingredients" TEXT[],
    "preparation" TEXT[],
    "information" TEXT,
    "created_at" timestamp DEFAULT (now()),
    PRIMARY KEY (id),
    CONSTRAINT fk_recipes_chef FOREIGN KEY (chef_id) REFERENCES chefs (id)
    ON DELETE CASCADE
);

CREATE TABLE recipe_files (
    "id" SERIAL,
    "recipe_id" INTEGER,
    "file_id" INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_recipefiles_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    CONSTRAINT fk_recipefiles_files FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
);
