use axum::{Extension, Router};
use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

pub mod models;
mod routes;

const BIND: &str = "0.0.0.0:8080";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  let _ = dotenvy::dotenv();
  tracing_subscriber::fmt::init();

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
  let database_url = dotenvy::var("DATABASE_URL")?;

  let pool = PgPoolOptions::new()
    .connect(&database_url)
    .await
    .expect("Can't connect to database");

  sqlx::migrate!().run(&pool).await?;

  Ok(pool)
}
