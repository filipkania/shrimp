use axum::{middleware, Extension, Json, Router};
use sqlx::PgPool;
use tower_http::trace::TraceLayer;

use crate::utils::config::AppConfig;
use crate::utils::middlewares::auth_middleware;

pub mod auth;
pub mod user;
mod error;

pub use self::error::APIError;

type JSONResponse<T, E = APIError> = Result<Json<T>, E>;

pub fn create_app(pool: PgPool, config: AppConfig) -> Router {
  Router::new()
    /* routers */
    .merge(auth::router())
    .merge(
      /* protected routes */
      Router::new()
        .merge(user::router())
        .layer(middleware::from_fn(auth_middleware)),
    )
    .layer(Extension(pool))
    .layer(Extension(config))
    .layer(TraceLayer::new_for_http())
}
