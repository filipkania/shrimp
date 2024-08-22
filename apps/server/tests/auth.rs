use axum::http::{Request, StatusCode};
use common::{RequestBuilderExt, RequestExt, ResponseParserExt};
use serde_json::json;
use shrimp_server::create_app;
use sqlx::PgPool;

mod common;

#[sqlx::test(fixtures("users"))]
async fn test_login(pool: PgPool) {
  let mut app = create_app(pool);

  let resp = Request::post("/v1/auth/login")
    .json(json!({
      "username": "admin",
      "password": "admin",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::OK);

  let user = resp.parse_json().await;
  assert_eq!(user["id"], "8b1c2635-6995-4acd-abe3-7b2eef884340");
  assert_eq!(user["username"], "admin");

  // ensure that we're not sending user's password_hash back
  assert!(user["password_hash"].is_null());
}

#[sqlx::test(fixtures("users"))]
async fn test_wrong_creds(pool: PgPool) {
  let mut app = create_app(pool);

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
