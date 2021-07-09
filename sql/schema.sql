CREATE TABLE users(
    id serial PRIMARY KEY,
    first_name text,
    last_name text,
    email varchar(200),
    password varchar(2000),
    characters_shortened int default 0,
    avatar int default 1,
    UNIQUE(email)
);

CREATE TABLE links(
    id serial PRIMARY KEY,
    userID integer REFERENCES users(id),
    uuid text,
    custom_link text default NULL,
    target_url varchar(2000),
    title varchar(200) default NULL,
    date_added TIMESTAMP default NOW(),
    UNIQUE(custom_link),
    UNIQUE(uuid)
);

CREATE TABLE clicks(
    id serial PRIMARY KEY,
    linkID integer REFERENCES links(id),
    date_added TIMESTAMP default NOW()
);