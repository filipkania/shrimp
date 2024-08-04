use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(FromRow, Serialize, Debug)]
pub struct User {
  pub id: Uuid,

  pub username: String,
  pub srp_salt: String,
  pub srp_verifier: String,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}
