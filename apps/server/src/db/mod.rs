mod user;
mod mail;

pub use user::User;
pub use mail::Mail;

type DBResult<T> = Result<T, sqlx::Error>;
