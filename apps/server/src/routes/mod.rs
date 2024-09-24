use axum::{middleware, Extension, Json, Router};
use sqlx::PgPool;
use tower_http::trace::TraceLayer;

use crate::utils::config::AppConfig;
use crate::utils::middlewares::{admin_middleware, auth_middleware};

pub mod auth;
pub mod domain;
mod error;
pub mod mail;
pub mod mailbox;
pub mod user;

mod admin;

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
        .merge(mail::router())
        .merge(domain::router())
        .merge(mailbox::router())
        .layer(middleware::from_fn(auth_middleware)),
    )
    .merge(
      /* admin routes */
      Router::new()
        .merge(admin::user::router())
        .layer(middleware::from_fn(admin_middleware)),
    )
    .layer(Extension(pool))
    .layer(Extension(config))
    .layer(TraceLayer::new_for_http())
}
