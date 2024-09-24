use axum::{
  extract::Path,
  routing::{delete, get, post},
  Extension, Json, Router,
};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use uuid::Uuid;
use validator::Validate;

use crate::db::{Mailbox, User};

use super::{APIError, JSONResponse};

pub fn router() -> Router {
  Router::new()
    .route("/v1/mailboxes", get(get_mailboxes))
    .route("/v1/mailboxes", post(create_mailbox))
    .route("/v1/mailboxes/:mailbox_id", delete(delete_mailbox))
}

async fn get_mailboxes(
  Extension(pool): Extension<PgPool>,
  Extension(user): Extension<User>,
) -> JSONResponse<Vec<Mailbox>> {
  let mailboxes = Mailbox::find_by_owner(&pool, user.id).await?;
  Ok(Json(mailboxes))
}

#[derive(Deserialize, Validate)]
struct CreateMailbox {
  alias: String,
  domain_id: Uuid,
  owner_id: Uuid,

  is_catch_all: bool,
}

async fn create_mailbox(
  Extension(pool): Extension<PgPool>,
  Json(data): Json<CreateMailbox>,
) -> JSONResponse<Mailbox> {
  let mailbox = Mailbox::create(
    &pool,
    data.alias,
    data.owner_id,
    data.domain_id,
    data.is_catch_all,
  )
  .await
  .map_err(|e| match e {
    sqlx::Error::Database(e) if e.kind() == ErrorKind::ForeignKeyViolation => {
      APIError::BadRequest("This user or domain does not exist.")
    }
    _ => e.into(),
  })?;

  Ok(Json(mailbox))
}

async fn delete_mailbox(
  Extension(pool): Extension<PgPool>,
  Extension(user): Extension<User>,
  Path(mailbox_id): Path<Uuid>,
) -> JSONResponse<()> {
  let Some(mailbox) = Mailbox::find_by_id(&pool, mailbox_id).await? else {
    return Err(APIError::NotFound(
      "Couldn't find any mailboxes with this id",
    ));
  };

  if mailbox.owner.id != user.id {
    return Err(APIError::BadRequest(
      "You don't have permissions to this mailbox",
    ));
  }

  Mailbox::delete(&pool, mailbox_id).await?;
  Ok(Json(()))
}
