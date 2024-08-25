CREATE TABLE mails (
  id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  message_id TEXT,

  -- this is envelope sender
  technical_sender TEXT NOT NULL,
  "from" TEXT,

  "to" TEXT[],
  ccs TEXT[],
  reply_to TEXT,

  headers TEXT NOT NULL,

  subject TEXT,
  text TEXT,
  html TEXT,

  received_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);
