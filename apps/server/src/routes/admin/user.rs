use axum::{routing::get, Extension, Json, Router};
use sqlx::PgPool;

use crate::{db::User, routes::JSONResponse};

pub fn router() -> Router {
  Router::new().route("/v1/admin/users", get(list_users))
}

async fn list_users(Extension(pool): Extension<PgPool>) -> JSONResponse<Vec<User>> {
  // TODO: add pagination
  let users = User::get_all(&pool).await?;
  Ok(Json(users))
}
