use anyhow::{anyhow, Result};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use tokio::task::spawn_blocking;

pub async fn verify(hash: String, password: String) -> Result<bool> {
  spawn_blocking(move || {
    let hash =
      PasswordHash::new(&hash).map_err(|e| anyhow!(e).context("PasswordHash::new() failed"))?;

    match Argon2::default().verify_password(password.as_bytes(), &hash) {
      Ok(_) => Ok(true),
      Err(argon2::password_hash::Error::Password) => Ok(false),
      Err(e) => Err(anyhow!(e).context("Argon2::verify_password() failed")),
    }
  })
  .await?
}
