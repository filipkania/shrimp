use axum::{
  http::StatusCode,
  response::{IntoResponse, Response},
  Json,
};
use serde::Serialize;
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

  /* response errors */
  #[error("{0}")]
  Conflict(&'static str),

  #[error("{0}")]
  Unauthorized(&'static str),

  /* auth errors */
  #[error("Invalid username or password.")]
  InvalidUsernameOrPassword,
}

impl IntoResponse for APIError {
  fn into_response(self) -> Response {
    #[derive(Serialize)]
    struct ErrorResponse<'a> {
      code: u16,
      message: String,

      errors: Option<&'a ValidationErrors>,
    }

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
      ValidationError(_) => StatusCode::BAD_REQUEST,
      Conflict(_) => StatusCode::CONFLICT,
      Unauthorized(_) | InvalidUsernameOrPassword => StatusCode::UNAUTHORIZED,
    }
  }
}
