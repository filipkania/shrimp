CREATE TABLE domains(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  domain TEXT NOT NULL,
  owner_id UUID NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,

  CONSTRAINT domains_fk_owner FOREIGN KEY(owner_id) REFERENCES users(id)
);
