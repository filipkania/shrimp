use axum::Json;

pub mod auth;
mod error;

pub use self::error::Error;

type JSONResponse<T, E = Error> = Result<Json<T>, E>;
