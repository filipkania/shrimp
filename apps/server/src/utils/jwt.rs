use anyhow::{Context, Error};
use chrono::Utc;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::AppConfig;

#[derive(Serialize, Deserialize, Debug)]
pub struct TokenValues {
  pub exp: i64,
  pub username: String,
}

pub fn sign_token(username: String, config: &AppConfig) -> Result<String, Error> {
  let values = TokenValues {
    username,
    exp: (Utc::now() + *config.JWT_EXPIRES_AFTER).timestamp(),
  };

  encode(
    &Header::new(Algorithm::HS512),
    &values,
    &EncodingKey::from_secret(config.JWT_SECRET.as_bytes()),
  )
  .context("jsonwebtoken::encode() failed")
}

pub fn decode_token(token: String, config: &AppConfig) -> Result<TokenValues, Error> {
  let mut validation = Validation::new(Algorithm::HS512);
  validation.leeway = 0;

  decode::<TokenValues>(
    &token,
    &DecodingKey::from_secret(config.JWT_SECRET.as_bytes()),
    &validation,
  )
  .map(|token_data| token_data.claims)
  .context("jsonwebtoken::decode() failed")
}
