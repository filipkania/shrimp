use crate::common::{get_token, RequestBuilderExt, RequestExt, ResponseParserExt, DEFAULT_CONFIG};
use axum::extract::Request;
use http::StatusCode;
use serde_json::json;
use shrimp_server::create_app;
use sqlx::PgPool;

#[sqlx::test(fixtures(
  "../fixtures/users.sql",
  "../fixtures/domains.sql",
  "../fixtures/mailboxes.sql"
))]
async fn test_should_return_mailboxes(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::get("/v1/mailboxes")
    .with_auth(token)
    .send(&mut app)
    .await;

  let mailboxes = resp.parse_json().await;
  assert!(mailboxes.is_array());

  let mailbox = mailboxes[0].clone();
  assert!(mailbox.is_object());

  assert_eq!(mailbox["alias"], "hello");
  assert_eq!(mailbox["is_catch_all"], true);

  assert_eq!(mailbox["owner"]["username"], "admin");
  assert_eq!(mailbox["domain"]["domain"], "shrimp.email");
}

#[sqlx::test(fixtures(
  "../fixtures/users.sql",
  "../fixtures/domains.sql"
))]
async fn test_should_create_mailbox(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::post("/v1/mailboxes")
    .with_auth(token.clone())
    .json(json!({
      "alias": "asdf",
      "is_catch_all": false,
      "domain_id": "1b6c3679-3b92-45a9-a411-b3fe02568040",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::OK);

  let resp = Request::get("/v1/mailboxes")
    .with_auth(token)
    .send(&mut app)
    .await;

  let mailboxes = resp.parse_json().await;

  assert!(mailboxes
    .as_array()
    .unwrap()
    .iter()
    .any(|m| m["alias"] == "asdf" && m["domain"]["domain"] == "shrimp.email"));
}

#[sqlx::test(fixtures(
  "../fixtures/users.sql",
  "../fixtures/domains.sql"
))]
async fn test_should_fail_invalid_domain(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::post("/v1/mailboxes")
    .with_auth(token.clone())
    .json(json!({
      "alias": "asdf",
      "is_catch_all": false,
      "domain_id": "11111111-1111-1111-1111-111111111111",
    }))
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
}

#[sqlx::test(fixtures(
  "../fixtures/users.sql",
  "../fixtures/domains.sql",
  "../fixtures/mailboxes.sql"
))]
async fn test_should_delete_mailbox(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::delete("/v1/mailboxes/9f769145-e238-4259-8dde-35a2869695f3")
    .with_auth(token.clone())
    .send(&mut app)
    .await;

  assert_eq!(resp.status(), StatusCode::OK);
}
