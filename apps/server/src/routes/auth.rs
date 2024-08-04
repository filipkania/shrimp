use axum::{routing::post, Extension, Json, Router};
use serde::Deserialize;
use sqlx::{error::ErrorKind, PgPool};
use validator::Validate;

use crate::models::User;

use super::{APIError, JSONResponse};

pub fn router() -> Router {
  Router::new().route("/v1/auth/register", post(register))
}

#[derive(Deserialize, Validate)]
struct RegisterRequest {
  #[validate(length(min = 3, max = 32))]
  username: String,
  srp_salt: String,
  srp_verifier: String,
}

async fn register(
  Extension(pool): Extension<PgPool>,
  Json(data): Json<RegisterRequest>,
) -> JSONResponse<User> {
  data.validate()?;

  let user = sqlx::query_as!(
    User,
    r#"
      INSERT INTO users(username, srp_salt, srp_verifier)
      VALUES ($1, $2, $3) RETURNING *;
    "#,
    data.username,
    data.srp_salt,
    data.srp_verifier
  )
  .fetch_one(&pool)
  .await
  .map_err(|e| match e {
    sqlx::Error::Database(e) if e.kind() == ErrorKind::UniqueViolation => {
      APIError::Conflict("User with this username already exists.")
    }
    _ => e.into(),
  })?;

  Ok(Json(user))
}
