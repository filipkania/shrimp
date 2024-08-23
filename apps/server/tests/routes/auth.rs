use std::time::Duration;

use crate::common::{get_token, RequestBuilderExt, RequestExt, ResponseParserExt, DEFAULT_CONFIG};
use axum::http::{Request, StatusCode};
use serde_json::json;
use shrimp_server::{create_app, jwt};
use sqlx::PgPool;
use tokio::time::sleep;

#[sqlx::test(fixtures("../fixtures/users.sql"))]
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

#[sqlx::test(fixtures("../fixtures/users.sql"))]
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

#[sqlx::test]
async fn test_wrong_jwt(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());

  let resp = Request::get("/v1/me")
    .with_auth("some_not_working_token".into())
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}

#[sqlx::test(fixtures("../fixtures/users.sql"))]
async fn test_jwt_expiration(pool: PgPool) {
  let mut config = DEFAULT_CONFIG.clone();
  config.JWT_EXPIRES_AFTER = "1s".parse().unwrap();

  let mut app = create_app(pool, config);
  let token = get_token(&mut app).await;

  sleep(Duration::from_secs(2)).await;

  let resp = Request::get("/v1/me").with_auth(token).send(&mut app).await;

  assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
}
