use axum::{routing::post, Extension, Json, Router};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use tracing::debug;
use ts_rs::TS;
use validator::Validate;

use super::{APIError, JSONResponse};
use crate::{
  db::User,
  utils::{self, jwt::sign_token},
  AppConfig,
};

pub fn router() -> Router {
  Router::new().route("/v1/auth/login", post(login))
}

static USERNAME_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"^[a-zA-Z0-9_\.]+$").unwrap());

#[derive(Deserialize, Validate)]
struct LoginRequest {
  #[validate(length(min = 3, max = 32), regex(path = *USERNAME_REGEX))]
  username: String,
  password: String,
}

#[derive(Serialize, TS)]
#[ts(export)]
struct TokenResponse {
  token: String,
}

async fn login(
  Extension(pool): Extension<PgPool>,
  Extension(config): Extension<AppConfig>,
  Json(data): Json<LoginRequest>,
) -> JSONResponse<TokenResponse> {
  data.validate()?;
  debug!("{:?}", config);

  if let Some(user) = User::find_by_username(&pool, data.username).await? {
    if utils::password::verify(user.password_hash.to_owned(), data.password).await? {
      let token = sign_token(user.username.clone(), &config)?;
      return Ok(Json(TokenResponse{ token }));
    }
  }

  Err(APIError::InvalidUsernameOrPassword)
}
