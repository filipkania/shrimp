-- Add migration script here
CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),

  username TEXT NOT NULL,

  srp_salt CHAR(64) NOT NULL,
  srp_verifier CHAR(1024) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);

CREATE UNIQUE INDEX users_unique_username ON users(username);
