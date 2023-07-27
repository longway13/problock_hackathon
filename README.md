최초 dbeaver table 만들기 문.

CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(20),
sex VARCHAR(1), -- 'M' 또는 'F' 값으로 저장될 것입니다.
age INTEGER,
address VARCHAR(200),
job VARCHAR(100)
)

CREATE TABLE complaints (
complaint_id SERIAL PRIMARY KEY,
part VARCHAR(100),
status VARCHAR(20),
title VARCHAR(200),
text TEXT,
user_id INTEGER REFERENCES users(user_id),
released_time timestamp,
views int4 default 0,
total_pros int4 default 0,
total_cons int4 default 0
)
