use axum::{extract::Request, middleware::Next, response::Response};
use sqlx::PgPool;
use tracing::debug;

use crate::{db::User, routes::APIError, utils::jwt::decode_token, AppConfig};

pub async fn auth_middleware(mut request: Request, next: Next) -> Result<Response, APIError> {
  query_user(&mut request).await?;
  Ok(next.run(request).await)
}

pub async fn admin_middleware(mut request: Request, next: Next) -> Result<Response, APIError> {
  query_user(&mut request).await?;
  let user = request
    .extensions()
    .get::<User>()
    .ok_or_else(|| APIError::InternalServerError("Couldn't get user info from request extensions."))?;

  if user.is_admin == false {
    return Err(APIError::Unauthorized(
      "You don't have permission to do this.",
    ));
  }

  Ok(next.run(request).await)
}

async fn query_user(request: &mut Request) -> Result<(), APIError> {
  let config = request
    .extensions()
    .get::<AppConfig>()
    .expect("AppConfig not found in middleware");

  let pool = request
    .extensions()
    .get::<PgPool>()
    .expect("PgPool not found in middleware");

  let mut auth_header = match request.headers().get(http::header::AUTHORIZATION) {
    Some(header) => header
      .to_str()
      .map_err(|_| APIError::BadRequest("Invalid header value"))?
      .split_whitespace(),
    None => {
      return Err(APIError::Unauthorized("Unauthorized"));
    }
  };

  let token = auth_header.next_back();
  if auth_header.next() != Some("Bearer") || token.is_none() {
    return Err(APIError::BadRequest("Token is missing"));
  }

  let token_values = decode_token(token.unwrap().into(), config).map_err(|e| {
    debug!("Invalid token: {:?} (err: {})", token, e.root_cause());

    APIError::Unauthorized("Unauthorized")
  })?;

  debug!("header value: {:?}", token);
  debug!("token: {:?}", &token_values);

  let Some(user) = User::find_by_username(pool, token_values.username).await? else {
    return Err(APIError::Unauthorized("Unauthorized"));
  };

  // current user's object should be accessible
  // using `Extension(user): Ext<User>` in routes
  debug!("user: {:?}", user);
  request.extensions_mut().insert(user);

  Ok(())
}
