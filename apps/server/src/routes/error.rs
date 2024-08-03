use axum::{
  http::StatusCode,
  response::{IntoResponse, Response},
  Json,
};
use serde::Serialize;
use validator::ValidationErrors;

// thx sqlx!
#[derive(thiserror::Error, Debug)]
pub enum Error {
  #[error("Database Error")]
  Sqlx(#[from] sqlx::Error),

  #[error("Internal Server Error")]
  Anyhow(#[from] anyhow::Error),

  #[error("Validation Error")]
  ValidationError(#[from] ValidationErrors),

  #[error("{0}")]
  Conflict(String),
}

impl IntoResponse for Error {
  fn into_response(self) -> Response {
    #[derive(Serialize)]
    struct ErrorResponse<'a> {
      code: u16,
      message: String,

      errors: Option<&'a ValidationErrors>,
    }

    let errors = match &self {
      Error::ValidationError(errors) => Some(errors),
      _ => None,
    };

    match self {
      Self::Anyhow(_) | Self::Sqlx(_) => {
        tracing::error!("ERR: {self:?}");
      },
      _ => {},
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

impl Error {
  fn status_code(&self) -> StatusCode {
    use Error::*;

    match self {
      Anyhow(_) | Sqlx(_) => StatusCode::INTERNAL_SERVER_ERROR,
      ValidationError(_) => StatusCode::BAD_REQUEST,
      Conflict(_) => StatusCode::CONFLICT,
    }
  }
}
