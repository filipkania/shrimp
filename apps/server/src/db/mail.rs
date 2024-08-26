use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::PgPool;
use ts_rs::TS;
use uuid::Uuid;

use crate::utils::mailaddress::{MailAddress, MailAddressList};

use super::DBResult;

#[derive(Debug, Clone, Serialize, TS)]
#[ts(export)]
pub struct Mail {
  pub id: Uuid,
  pub message_id: Option<String>,

  pub technical_sender: String,
  pub from: MailAddress, // TODO: change to MailAddress struct

  pub technical_rcpt: String,
  pub to: MailAddressList,
  pub ccs: MailAddressList,
  pub reply_to: MailAddressList,

  pub headers: Option<String>,

  pub subject: Option<String>,
  pub text: Option<String>,
  pub html: Option<String>,

  pub received_at: DateTime<Utc>,

  pub created_at: DateTime<Utc>,
  pub updated_at: Option<DateTime<Utc>>,
}

impl Mail {
  pub async fn find_by_id(pool: &PgPool, id: Uuid) -> DBResult<Option<Mail>> {
    sqlx::query_as!(Self, "SELECT * FROM mails m WHERE id = $1", id)
      .fetch_optional(pool)
      .await
  }

  pub async fn find_many(pool: &PgPool, offset: usize, limit: usize) -> DBResult<Vec<Mail>> {
    sqlx::query_as!(
      Self,
      "SELECT * FROM mails m ORDER BY received_at DESC LIMIT $1 OFFSET $2",
      limit as i64,
      offset as i64
    )
    .fetch_all(pool)
    .await
  }
}
