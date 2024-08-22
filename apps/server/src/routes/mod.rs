use axum::{Extension, Json, Router};
use sqlx::PgPool;
use tower_http::trace::TraceLayer;

pub mod auth;
mod error;

pub use self::error::APIError;

type JSONResponse<T, E = APIError> = Result<Json<T>, E>;

pub fn create_app(pool: PgPool) -> Router {
  Router::new()
    /* routers */
    .merge(auth::router())
    .layer(TraceLayer::new_for_http())
    .layer(Extension(pool))
}
