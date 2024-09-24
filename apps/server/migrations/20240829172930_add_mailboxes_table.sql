CREATE TABLE mailboxes(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  alias TEXT NOT NULL,
  owner_id UUID NOT NULL,
  domain_id UUID NOT NULL,

  is_catch_all BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,

  CONSTRAINT mailboxes_fk_owner FOREIGN KEY(owner_id) REFERENCES users(id),
  CONSTRAINT mailboxes_fk_domain FOREIGN KEY(domain_id) REFERENCES domains(id)
);

CREATE INDEX idx_mailboxes_alias ON mailboxes(alias);
