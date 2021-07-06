CREATE TABLE users(
    id serial PRIMARY KEY,
    first_name text,
    last_name text,
    email varchar(200),
    password varchar(2000),
    UNIQUE(email)
);

CREATE TABLE links(
    id serial PRIMARY KEY,
    userID integer REFERENCES users(id),
    uuid text,
    custom_link text,
    target_url varchar(2000),
    title varchar(200),
    date_added datetime default now(),
    click_count integer default 0
);

