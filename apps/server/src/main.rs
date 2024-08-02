pub mod utils;
pub mod routes;

use axum::{response::Html, routing::get, Router};
use log::info;
use utils::logger::Logger;

const BIND: &'static str = "0.0.0.0:8080";
static LOGGER: Logger = Logger;

#[tokio::main]
async fn main() {
  log::set_logger(&LOGGER)
    .map(|()| log::set_max_level(log::LevelFilter::Info))
    .unwrap();

  let app = Router::new()
    .route("/", get(root))
    /* login routes */
    .route("/auth/login", get(routes::auth::login));

  let listener = tokio::net::TcpListener::bind(BIND)
    .await
    .expect("Couldn't bind Shrimp's server");

  info!("Listening on {BIND}...");
  axum::serve(listener, app).await.unwrap();
}

async fn root() -> Html<&'static str> {
  Html("asdf")
}
