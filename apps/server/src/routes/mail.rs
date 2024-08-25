use axum::{
  extract::{Path, Query},
  routing::get,
  Extension, Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::db::Mail;

use super::JSONResponse;

pub fn router() -> Router {
  Router::new()
    .route("/v1/mails", get(get_mails))
    .route("/v1/mails/:mail_id", get(get_mail_by_id))
}

#[derive(Deserialize)]
struct Pagination {
  offset: usize,
  limit: usize,
}

async fn get_mails(
  Extension(pool): Extension<PgPool>,
  pagination: Query<Pagination>,
) -> JSONResponse<Vec<Mail>> {
  let mails = Mail::find_many(&pool, pagination.offset, pagination.limit).await?;
  Ok(Json(mails))
}

async fn get_mail_by_id(
  Extension(pool): Extension<PgPool>,
  Path(mail_id): Path<Uuid>,
) -> JSONResponse<Option<Mail>> {
  let mail = Mail::find_by_id(&pool, mail_id).await?;
  Ok(Json(mail))
}
