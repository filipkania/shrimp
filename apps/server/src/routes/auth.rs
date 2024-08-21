use axum::{routing::post, Extension, Json, Router};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::Deserialize;
use sqlx::PgPool;
use validator::Validate;

use super::{APIError, JSONResponse};
use crate::{db::User, utils};

pub fn router() -> Router {
  Router::new().route("/v1/auth/login", post(login))
}

static USERNAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"^[a-zA-Z0-9_\.]+$").unwrap());

#[derive(Deserialize, Validate)]
struct LoginRequest {
  #[validate(length(min = 3, max = 32), regex(path = *USERNAME_REGEX))]
  username: String,
  #[validate(length(min = 8))]
  password: String,
}

async fn login(
  Extension(pool): Extension<PgPool>,
  Json(data): Json<LoginRequest>,
) -> JSONResponse<User> {
  data.validate()?;

  if let Some(user) = User::find_by_username(&pool, data.username).await? {
    if utils::password::verify(user.password.to_owned(), data.password).await? {
      return Ok(Json(user));
    }
  }

  Err(APIError::InvalidUsernameOrPassword)
}
