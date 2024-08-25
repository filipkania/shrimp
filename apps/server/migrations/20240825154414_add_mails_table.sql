CREATE TABLE mails (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  message_id TEXT,

  -- this is envelope sender
  technical_sender TEXT NOT NULL,
  "from" TEXT,

  technical_rcpt TEXT NOT NULL,
  "to" TEXT[] NOT NULL DEFAULT '{}',
  ccs TEXT[] NOT NULL DEFAULT '{}',
  reply_to TEXT[] NOT NULL DEFAULT '{}',

  headers TEXT NOT NULL,

  subject TEXT,
  text TEXT,
  html TEXT,

  received_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);
