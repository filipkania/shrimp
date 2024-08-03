use axum::{routing::get, Extension, Json, Router};
use sqlx::PgPool;

use super::JSONResponse;

pub fn router() -> Router {
  Router::new().route("/v1/register", get(register))
}

async fn register(Extension(pool): Extension<PgPool>) -> JSONResponse<i32> {
  let data = sqlx::query!("select (1 + $1) as asdf", 1i32)
    .fetch_one(&pool)
    .await?;

  Ok(Json(data.asdf.unwrap_or(-1)))
}
