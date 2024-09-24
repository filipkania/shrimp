CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),

  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,

  is_admin BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);

CREATE UNIQUE INDEX users_unique_username ON users(username);

-- adds admin user with password `shrimpadmin`
-- INSERT INTO users(username, password_hash, is_admin)
-- VALUES (
--   'admin',
--   '$argon2id$v=19$m=16,t=2,p=1$bkJHcE9MaElhN1pqeGc2Tw$YgvFl0L+jCnD2hVXUunGjQ',
--   true
-- );
