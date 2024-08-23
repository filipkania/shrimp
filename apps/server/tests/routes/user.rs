use crate::common::{get_token, RequestBuilderExt, ResponseParserExt, DEFAULT_CONFIG};
use axum::extract::Request;
use shrimp_server::create_app;
use sqlx::PgPool;

#[sqlx::test(fixtures("../fixtures/users.sql"))]
async fn test_me(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::get("/v1/me").with_auth(token).send(&mut app).await;

  let user = resp.parse_json().await;
  assert_eq!(user["id"], "8b1c2635-6995-4acd-abe3-7b2eef884340");
  assert_eq!(user["username"], "admin");

  // ensure that we're not sending user's password back
  assert!(user["password_hash"].is_null());
}
