use axum::extract::Request;
use shrimp_server::create_app;
use sqlx::PgPool;

use crate::common::{get_token, RequestBuilderExt, ResponseParserExt, DEFAULT_CONFIG};

#[sqlx::test(fixtures("../fixtures/users.sql", "../fixtures/example_mail.sql"))]
async fn test_should_return_mails(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::get("/v1/mails")
    .with_auth(token)
    .send(&mut app)
    .await;

  let mails = resp.parse_json().await;
  assert!(mails.is_array());
  println!("{:?}", mails);

  let mail = mails[0].clone();
  assert_eq!(mail["id"], "004d92b3-1a32-46e9-9219-786a1bca3ae8");

  assert_eq!(mail["from"]["address"], "hello@example.com");
  assert!(mail["to"].is_array());

  assert!(mail["text"].is_string());

  // mail previews should not have html/headers field
  assert!(mail["html"].is_null());
  assert!(mail["headers"].is_null());
}

#[sqlx::test(fixtures("../fixtures/users.sql", "../fixtures/example_mail.sql"))]
async fn test_should_return_mail(pool: PgPool) {
  let mut app = create_app(pool, DEFAULT_CONFIG.clone());
  let token = get_token(&mut app).await;

  let resp = Request::get("/v1/mails/004d92b3-1a32-46e9-9219-786a1bca3ae8")
    .with_auth(token)
    .send(&mut app)
    .await;

  let mail = resp.parse_json().await;
  assert!(mail.is_object());
  println!("{:?}", mail);

  assert_eq!(mail["id"], "004d92b3-1a32-46e9-9219-786a1bca3ae8");

  assert!(mail["from"].is_object());
  assert_eq!(mail["from"]["name"], "Hello World");
  assert_eq!(mail["from"]["address"], "hello@example.com");

  assert!(mail["to"].is_array());
  assert_eq!(mail["to"][0]["name"], "Somebody");
  assert_eq!(mail["to"][0]["address"], "somebody@shrimp.email");

  assert_eq!(mail["subject"], "Hello!");
  assert!(mail["text"].is_string());
  assert!(mail["html"].is_null());
}
