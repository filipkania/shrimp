use axum::Json;

pub async fn login() -> Json<&'static str> {
  Json("Login API will _eventually_ be here.")
}
