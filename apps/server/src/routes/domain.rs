use axum::{
  extract::Path,
  routing::{delete, get, post},
  Extension, Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::db::{Domain, User};

use super::{APIError, JSONResponse};

pub fn router() -> Router {
  Router::new()
    .route("/v1/domains", get(get_domains))
    .route("/v1/domains", post(create_domain))
    .route("/v1/domains/:domain_id", delete(delete_domain))
}

async fn get_domains(
  Extension(pool): Extension<PgPool>,
  Extension(user): Extension<User>,
) -> JSONResponse<Vec<Domain>> {
  let domains = Domain::find_by_owner(&pool, user.id).await?;
  Ok(Json(domains))
}

#[derive(Deserialize, Validate)]
struct CreateDomain {
  // TODO: add some regex validation?
  #[validate(length(min = 3, max = 64))]
  domain: String,
}

async fn create_domain(
  Extension(pool): Extension<PgPool>,
  Extension(user): Extension<User>,
  Json(data): Json<CreateDomain>,
) -> JSONResponse<Domain> {
  Ok(Json(Domain::create(&pool, data.domain, user.id).await?))
}

async fn delete_domain(
  Extension(pool): Extension<PgPool>,
  Extension(user): Extension<User>,
  Path(domain_id): Path<Uuid>,
) -> JSONResponse<()> {
  let Some(domain) = Domain::find_by_id(&pool, domain_id).await? else {
    return Err(APIError::NotFound("Couldn't find any domain with this id"));
  };

  if domain.owner.id != user.id {
    return Err(APIError::BadRequest("You don't have permissions to this domain"));
  }

  Domain::delete(&pool, domain_id).await?;
  Ok(Json(()))
}
