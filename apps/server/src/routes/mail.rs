use axum::{
  extract::{Path, Query},
  routing::get,
  Extension, Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::db::{Mail, MailPreview};

use super::{APIError, JSONResponse};

pub fn router() -> Router {
  Router::new()
    .route("/v1/mails", get(get_mails))
    .route("/v1/mails/:mail_id", get(get_mail_by_id))
}

#[derive(Deserialize)]
struct Pagination {
  offset: Option<usize>,
  limit: Option<usize>,
}

async fn get_mails(
  Extension(pool): Extension<PgPool>,
  pagination: Query<Pagination>,
) -> JSONResponse<Vec<MailPreview>> {
  let mails = MailPreview::find_many(
    &pool,
    pagination.offset.unwrap_or(0),
    pagination.limit.unwrap_or(25),
  )
  .await?;

  Ok(Json(mails))
}

async fn get_mail_by_id(
  Extension(pool): Extension<PgPool>,
  Path(mail_id): Path<Uuid>,
) -> JSONResponse<Option<Mail>> {
  let mail = Mail::find_by_id(&pool, mail_id).await?;

  if mail.is_none() {
    return Err(APIError::NotFound("This mail could not be found."));
  }

  Ok(Json(mail))
}
