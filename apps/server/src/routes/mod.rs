use axum::Json;

pub mod auth;
mod error;

pub use self::error::APIError;

type JSONResponse<T, E = APIError> = Result<Json<T>, E>;
