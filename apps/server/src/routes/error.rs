use axum::{
  http::StatusCode,
  response::{IntoResponse, Response},
  Json,
};
use serde::Serialize;
use ts_rs::TS;
use validator::ValidationErrors;

// thx sqlx!
#[derive(thiserror::Error, Debug)]
pub enum APIError {
  #[error("Database Error")]
  Sqlx(#[from] sqlx::Error),

  #[error("Internal Server Error")]
  Anyhow(#[from] anyhow::Error),

  #[error("Validation Error")]
  ValidationError(#[from] ValidationErrors),

  /* http errors */
  #[error("{0}")]
  Unauthorized(&'static str),

  #[error("{0}")]
  BadRequest(&'static str),

  #[error("{0}")]
  NotFound(&'static str),

  /* auth errors */
  #[error("Invalid username or password.")]
  InvalidUsernameOrPassword,
}

#[derive(Serialize, TS)]
#[ts(export)]
struct ErrorResponse<'a> {
  code: u16,
  message: String,

  #[ts(skip)]
  errors: Option<&'a ValidationErrors>,
}

impl IntoResponse for APIError {
  fn into_response(self) -> Response {
    let errors = match &self {
      APIError::ValidationError(errors) => Some(errors),
      _ => None,
    };

    match self {
      Self::Anyhow(_) | Self::Sqlx(_) => {
        tracing::error!("ERR: {self:?}");
      }
      _ => {}
    }

    (
      self.status_code(),
      Json(ErrorResponse {
        code: self.status_code().as_u16(),
        message: self.to_string(),

        errors,
      }),
    )
      .into_response()
  }
}

impl APIError {
  fn status_code(&self) -> StatusCode {
    use APIError::*;

    match self {
      Anyhow(_) | Sqlx(_) => StatusCode::INTERNAL_SERVER_ERROR,
      ValidationError(_) | BadRequest(_) => StatusCode::BAD_REQUEST,
      Unauthorized(_) | InvalidUsernameOrPassword => StatusCode::UNAUTHORIZED,
      NotFound(_) => StatusCode::NOT_FOUND,
    }
  }
}
