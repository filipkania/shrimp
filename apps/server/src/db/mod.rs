mod user;
mod mail;
mod mailpreview;

pub use user::User;
pub use mail::Mail;
pub use mailpreview::MailPreview;

type DBResult<T> = Result<T, sqlx::Error>;
