use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use super::DBResult;

#[derive(Debug, Serialize)]
pub struct User {
  pub id: Uuid,

  pub username: String,
  #[serde(skip_serializing)]
  pub password: String,

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

  pub async fn create(pool: &PgPool, username: String, password: String) -> DBResult<User> {
    sqlx::query_as!(
      Self,
      r#"
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        RETURNING *;
      "#,
      username,
      password
    )
    .fetch_one(pool)
    .await
  }

  pub async fn save(&self, pool: &PgPool) -> DBResult<User> {
    sqlx::query_as!(
      Self,
      r#"
        UPDATE users SET username = $2, password = $3, updated_at = now()
        WHERE id = $1 RETURNING *;
      "#,
      self.id,
      self.username,
      self.password
    )
    .fetch_one(pool)
    .await
  }
}
