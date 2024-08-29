#![allow(dead_code)]

use std::{borrow::BorrowMut, future::Future, usize};

use axum::{
  body::{to_bytes, Body},
  http::{header::CONTENT_TYPE, request, Request, Response},
  Router,
};
use http::request::Builder;
use once_cell::sync::Lazy;
use serde_json::json;
use shrimp_server::AppConfig;
use tower::ServiceExt;

pub trait RequestBuilderExt {
  fn with_auth(self, token: String) -> Builder;
  fn send(self, app: &mut Router) -> impl Future<Output = Response<Body>>;
  fn json(self, json: serde_json::Value) -> Request<Body>;
}

impl RequestBuilderExt for request::Builder {
  fn with_auth(self, token: String) -> Builder {
    self.header(http::header::AUTHORIZATION, format!("Bearer {}", token))
  }

  async fn send(self, app: &mut Router) -> Response<Body> {
    app
      .borrow_mut()
      .oneshot(self.body(Body::empty()).expect("failed to build request"))
      .await
      .unwrap()
  }

  fn json(self, json: serde_json::Value) -> Request<Body> {
    self
      .header(http::header::CONTENT_TYPE, "application/json")
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
  async fn parse_json(self) -> serde_json::Value
  {
    assert_eq!(
      self
        .headers()
        .get(CONTENT_TYPE)
        .expect("Couldn't get Content-Type header"),
      "application/json"
    );

    let bytes = to_bytes(self.into_body(), usize::MAX)
      .await
      .expect("to_bytes() failed");

    serde_json::from_slice(&bytes[..]).expect("failed to parse body as json")
  }
}

// --

pub static DEFAULT_CONFIG: Lazy<AppConfig> = Lazy::new(|| AppConfig {
  JWT_SECRET: String::from("wbWX2InUoMI1L5GT1JGuRA=="),
  JWT_EXPIRES_AFTER: "24h".parse().unwrap(),
});

pub async fn get_token(app: &mut Router) -> String {
  let resp = Request::post("/v1/auth/login")
    .json(json!({
      "username": "admin",
      "password": "admin",
    }))
    .send(app)
    .await;

  // apparently, serde_json adds quotes if using .to_string()
  return resp.parse_json().await["token"].as_str().unwrap().into();
}
