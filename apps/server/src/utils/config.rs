#![allow(non_snake_case, dead_code)]

use cached::proc_macro::once;
use duration_string::DurationString;
use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
  pub JWT_SECRET: String,
  pub JWT_EXPIRES_AFTER: DurationString,
}

fn get_env(key: &str) -> String {
  env::var(key).unwrap_or_else(|_| panic!("AppConfig: {} not specified", key))
}

fn get_env_optional(key: &str, default: &'static str) -> String {
  env::var(key).unwrap_or(String::from(default))
}

#[once]
pub fn get_config() -> AppConfig {
  AppConfig {
    JWT_SECRET: get_env("JWT_SECRET"),
    JWT_EXPIRES_AFTER: get_env_optional("JWT_EXPIRES_AFTER", "24h")
      .parse()
      .unwrap(),
  }
}
