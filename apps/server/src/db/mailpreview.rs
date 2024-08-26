use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use ts_rs::TS;
use uuid::Uuid;

use crate::utils::mailaddress::{MailAddress, MailAddressList};

use super::DBResult;

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct MailPreview {
  pub id: Uuid,
  pub message_id: Option<String>,

  pub from: MailAddress,
  pub to: MailAddressList,

  pub subject: Option<String>,
  pub text: Option<String>,

  pub received_at: DateTime<Utc>,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}

impl MailPreview {
  pub async fn find_by_id(pool: &PgPool, id: Uuid) -> DBResult<Option<MailPreview>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT 
          id, message_id, "from",
          "to", subject, text, received_at,
          created_at, updated_at
        FROM mails m WHERE id = $1;
      "#,
      id
    )
    .fetch_optional(pool)
    .await
  }

  pub async fn find_many(pool: &PgPool, offset: usize, limit: usize) -> DBResult<Vec<MailPreview>> {
    sqlx::query_as!(
      Self,
      r#"
        SELECT 
          id, message_id, "from",
          "to", subject, text, received_at,
          created_at, updated_at
        FROM mails m
        LIMIT $1
        OFFSET $2;
      "#,
      limit as i64,
      offset as i64
    )
    .fetch_all(pool)
    .await
  }
}
