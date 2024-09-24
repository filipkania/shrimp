use crate::common::{get_token, RequestBuilderExt, RequestExt, ResponseParserExt, DEFAULT_CONFIG};
use axum::extract::Request;
use http::StatusCode;
use serde_json::json;
use shrimp_server::create_app;
use sqlx::PgPool;

#[sqlx::test(fixtures("../fixtures/users.sql", "../fixtures/domains.sql"))]
async fn test_should_return_domains(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::get("/v1/domains")
    .with_auth(token)
    .send(&mut app)
    .await;

  let domains = resp.parse_json().await;
  assert!(domains.is_array());

  let domain = domains[0].clone();
  assert!(domain.is_object());

  assert_eq!(domain["domain"], "shrimp.email");

  assert!(domain["owner"].is_object());
  assert_eq!(domain["owner"]["username"], "admin");
}

#[sqlx::test(fixtures("../fixtures/users.sql", "../fixtures/domains.sql"))]
async fn test_should_create_domain(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::post("/v1/domains")
    .with_auth(token.clone())
    .json(json!({
      "domain": "example.com",
      "owner_id": "8b1c2635-6995-4acd-abe3-7b2eef884340", // admin's uuid
    }))
    .send(&mut app)
    .await;

  let domain = resp.parse_json().await;
  assert!(domain.is_object());

  assert_eq!(domain["domain"], "example.com");

  assert!(domain["owner"].is_object());
  assert_eq!(domain["owner"]["username"], "admin");

  // check if /v1/domains returns newly inserted domain
  let resp = Request::get("/v1/domains")
    .with_auth(token)
    .send(&mut app)
    .await
    .parse_json()
    .await;

  assert!(resp
    .as_array()
    .unwrap()
    .iter()
    .any(|d| d["domain"] == "example.com"));
}

#[sqlx::test(fixtures("../fixtures/users.sql", "../fixtures/domains.sql"))]
async fn test_should_delete_domain(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::delete("/v1/domains/1b6c3679-3b92-45a9-a411-b3fe02568040")
    .with_auth(token)
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::OK);
}
