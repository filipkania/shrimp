use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use ts_rs::TS;
use uuid::Uuid;

use super::DBResult;

#[derive(Debug, Clone, Serialize, TS, sqlx::Type)]
#[ts(export)]
pub struct User {
  pub id: Uuid,

  pub username: String,
  #[ts(skip)]
  #[serde(skip_serializing)]
  pub password_hash: String,
  pub is_admin: bool,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}

impl User {
  pub async fn find_by_id(pool: &PgPool, id: Uuid) -> DBResult<Option<User>> {
    sqlx::query_as!(Self, "SELECT * FROM users WHERE id = $1;", id)
      .fetch_optional(pool)
      .await
  }

  pub async fn find_by_username(pool: &PgPool, username: String) -> DBResult<Option<User>> {
    sqlx::query_as!(Self, "SELECT * FROM users WHERE username = $1;", username)
      .fetch_optional(pool)
      .await
  }

  pub async fn get_all(pool: &PgPool) -> DBResult<Vec<User>> {
    sqlx::query_as!(Self, "SELECT * FROM users;")
      .fetch_all(pool)
      .await
  }

  pub async fn create(pool: &PgPool, username: String, password_hash: String) -> DBResult<User> {
    sqlx::query_as!(
      Self,
      r#"
        INSERT INTO users(username, password_hash)
        VALUES ($1, $2)
        RETURNING *;
      "#,
      username,
      password_hash
    )
    .fetch_one(pool)
    .await
  }

  pub async fn save(&self, pool: &PgPool) -> DBResult<User> {
    sqlx::query_as!(
      Self,
      r#"
        UPDATE users SET username = $2, password_hash = $3, updated_at = now()
        WHERE id = $1 RETURNING *;
      "#,
      self.id,
      self.username,
      self.password_hash
    )
    .fetch_one(pool)
    .await
  }
}
