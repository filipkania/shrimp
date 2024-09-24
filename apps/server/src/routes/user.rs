use axum::{routing::get, Extension, Json, Router};

use crate::db::User;

use super::JSONResponse;

pub fn router() -> Router {
  Router::new().route("/v1/me", get(me))
}

async fn me(
  Extension(user): Extension<User>,
) -> JSONResponse<User> {
  Ok(Json(user))
}
