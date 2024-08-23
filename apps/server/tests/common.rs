use std::{borrow::BorrowMut, future::Future, usize};

use axum::{
  body::{to_bytes, Body},
  http::{header::CONTENT_TYPE, request, Request, Response},
  Router,
};
use once_cell::sync::Lazy;
use shrimp_server::AppConfig;
use tower::ServiceExt;

pub trait RequestBuilderExt {
  fn json(self, json: serde_json::Value) -> Request<Body>;
}

impl RequestBuilderExt for request::Builder {
  fn json(self, json: serde_json::Value) -> Request<Body> {
    self
      .header("Content-Type", "application/json")
      .body(Body::from(json.to_string()))
      .expect("failed to build request")
  }
}

// --

pub trait RequestExt {
  fn send(self, app: &mut Router) -> impl Future<Output = Response<Body>>;
}

impl RequestExt for Request<Body> {
  async fn send(self, app: &mut Router) -> Response<Body> {
    app.borrow_mut().oneshot(self).await.unwrap()
  }
}

// --

pub trait ResponseParserExt {
  fn parse_json(self) -> impl Future<Output = serde_json::Value>;
}

impl ResponseParserExt for Response<Body> {
  async fn parse_json(self) -> serde_json::Value {
    assert_eq!(
      self
        .headers()
        .get(CONTENT_TYPE)
        .expect("Content-Type doesn't equal application/json"),
      "application/json"
    );

    let bytes = to_bytes(self.into_body(), usize::MAX)
      .await
      .expect("to_bytes() failed");

    serde_json::from_slice::<serde_json::Value>(&bytes[..]).expect("failed to parse body as json")
  }
}

// --

pub static DEFAULT_CONFIG: Lazy<AppConfig> = Lazy::new(|| AppConfig {
  JWT_SECRET: String::from("wbWX2InUoMI1L5GT1JGuRA=="),
  JWT_EXPIRES_AFTER: "24h".parse().unwrap(),
});
