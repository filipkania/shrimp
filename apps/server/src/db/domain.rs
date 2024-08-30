use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use ts_rs::TS;
use uuid::Uuid;

use super::{DBResult, User};

#[derive(Debug, Clone, Serialize, TS, sqlx::FromRow, sqlx::Type)]
#[ts(export)]
pub struct Domain {
  pub id: Uuid,

  pub domain: String,
  pub owner: User,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}

impl Domain {
  pub async fn find_by_owner(pool: &PgPool, owner_id: Uuid) -> DBResult<Vec<Domain>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT
          d.id,
          d.domain,
          d.created_at,
          d.updated_at,
          (
            u.id,
            u.username,
            u.password_hash,
            u.created_at,
            u.updated_at
          ) AS "owner!: User"
        FROM domains d
        INNER JOIN users u ON u.id = d.owner_id
        WHERE d.owner_id = $1;
      "#,
      owner_id
    )
    .fetch_all(pool)
    .await
  }

  pub async fn find_by_id(pool: &PgPool, id: Uuid) -> DBResult<Option<Domain>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT
          d.id,
          d.domain,
          d.created_at,
          d.updated_at,
          (
            u.id,
            u.username,
            u.password_hash,
            u.created_at,
            u.updated_at
          ) AS "owner!: User"
        FROM domains d
        INNER JOIN users u ON u.id = d.owner_id
        WHERE d.id = $1;
      "#,
      id
    )
    .fetch_optional(pool)
    .await
  }

  pub async fn create(pool: &PgPool, domain: String, owner_id: Uuid) -> DBResult<Domain> {
    sqlx::query_as!(
      Self,
      r#"
        WITH inserted_domain AS (
          INSERT INTO domains(domain, owner_id)
          VALUES ($1, $2)
          RETURNING *
        )
        SELECT
          d.id,
          d.domain,
          d.created_at,
          d.updated_at,
          (
            u.id,
            u.username,
            u.password_hash,
            u.created_at,
            u.updated_at
          ) AS "owner!: User"
        FROM inserted_domain d
        INNER JOIN users u ON u.id = d.owner_id;
      "#,
      domain,
      owner_id
    )
    .fetch_one(pool)
    .await
  }

  pub async fn delete(pool: &PgPool, id: Uuid) -> DBResult<()> {
    sqlx::query(
      r#"
        DELETE FROM domains
        WHERE id = $1;
      "#,
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(())
  }
}
