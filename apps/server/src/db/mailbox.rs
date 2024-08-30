use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use ts_rs::TS;
use uuid::Uuid;

use super::{DBResult, User};

#[derive(Debug, Clone, Serialize, TS, sqlx::FromRow)]
#[ts(export)]
pub struct Mailbox {
  pub id: Uuid,

  pub alias: String,
  pub owner: User,
  pub domain_id: Uuid,

  pub is_catch_all: bool,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}

impl Mailbox {
  pub async fn find_by_owner(pool: &PgPool, owner_id: Uuid) -> DBResult<Vec<Mailbox>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT
          m.id,
          m.alias,
          m.is_catch_all,
          m.domain_id,

          (
            u.id,
            u.username,
            u.password_hash,
            u.is_admin,
            u.created_at,
            u.updated_at
          ) AS "owner!: User",

          m.created_at,
          m.updated_at

        FROM mailboxes m
        INNER JOIN users u ON u.id = m.owner_id
        INNER JOIN domains d ON d.id = m.domain_id
        WHERE m.owner_id = $1;
      "#,
      owner_id
    )
    .fetch_all(pool)
    .await
  }

  pub async fn find_by_id(pool: &PgPool, id: Uuid) -> DBResult<Option<Mailbox>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT
          m.id,
          m.alias,
          m.is_catch_all,
          m.domain_id,

          (
            u.id,
            u.username,
            u.password_hash,
            u.is_admin,
            u.created_at,
            u.updated_at
          ) AS "owner!: User",

          m.created_at,
          m.updated_at

        FROM mailboxes m
        INNER JOIN users u ON u.id = m.owner_id
        INNER JOIN domains d ON d.id = m.domain_id
        WHERE m.id = $1;
      "#,
      id
    )
    .fetch_optional(pool)
    .await
  }

  pub async fn create(
    pool: &PgPool,
    alias: String,
    owner_id: Uuid,
    domain_id: Uuid,
    is_catch_all: bool,
  ) -> DBResult<Mailbox> {
    sqlx::query_as!(
      Self,
      r#"
        WITH inserted_mailbox AS (
          INSERT INTO mailboxes(alias, owner_id, domain_id, is_catch_all)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        )
        SELECT
          m.id,
          m.alias,
          m.is_catch_all,
          m.domain_id,

          (
            u.id,
            u.username,
            u.password_hash,
            u.is_admin,
            u.created_at,
            u.updated_at
          ) AS "owner!: User",

          m.created_at,
          m.updated_at

        FROM inserted_mailbox m
        INNER JOIN users u ON u.id = m.owner_id
        INNER JOIN domains d ON d.id = m.domain_id;
      "#,
      alias,
      owner_id,
      domain_id,
      is_catch_all
    )
    .fetch_one(pool)
    .await
  }

  pub async fn delete(pool: &PgPool, id: Uuid) -> DBResult<()> {
    sqlx::query(
      r#"
        DELETE FROM mailboxes
        WHERE id = $1;
      "#,
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(())
  }
}
