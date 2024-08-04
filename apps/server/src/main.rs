use axum::{Extension, Router};
use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

mod routes;
pub mod models;

const BIND: &'static str = "0.0.0.0:8080";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  tracing_subscriber::fmt()
    .with_max_level(tracing::Level::DEBUG)
    .init();

  let pool = init_db_pool().await?;

  let app = Router::new()
    /* routers */
    .merge(routes::auth::router())
    .layer(TraceLayer::new_for_http())
    .layer(Extension(pool));

  let listener = TcpListener::bind(BIND).await?;

  tracing::info!("Listening on {}...", listener.local_addr().unwrap());
  axum::serve(listener, app).await?;

  Ok(())
}

async fn init_db_pool() -> anyhow::Result<PgPool> {
  let database_url = dotenvy::var("DATABASE_URL")
    .unwrap_or_else(|_| "postgresql://postgres:postgres@localhost/shrimp".into());

  let pool = PgPoolOptions::new()
    .connect(&database_url)
    .await
    .expect("Can't connect to database");

  sqlx::migrate!().run(&pool).await?;

  Ok(pool)
}
