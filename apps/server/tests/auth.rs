use axum::http::{Request, StatusCode};
use common::{RequestBuilderExt, RequestExt, ResponseParserExt, DEFAULT_CONFIG};
use serde_json::json;
use shrimp_server::{create_app, jwt};
use sqlx::PgPool;

mod common;

#[sqlx::test(fixtures("users"))]
async fn test_login(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());

  let resp = Request::post("/v1/auth/login")
    .json(json!({
      "username": "admin",
      "password": "admin",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::OK);

  let resp = resp.parse_json().await;
  assert!(resp["token"].is_string());

  let decoded_token = jwt::decode_token(
    resp["token"].as_str().unwrap().to_string(),
    &DEFAULT_CONFIG.clone(),
  );
  assert!(decoded_token.is_ok());
}

#[sqlx::test(fixtures("users"))]
async fn test_wrong_creds(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());

  // invalid password
  let resp = Request::post("/v1/auth/login")
    .json(json!({
      "username": "admin",
      "password": "hello!",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);

  // invalid username
  let resp = Request::post("/v1/auth/login")
    .json(json!({
      "username": "asdf",
      "password": "admin",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}

// TODO: add JWT expiration
