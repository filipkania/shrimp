mod user;
mod mail;
mod mailpreview;
mod domain;

pub use user::User;
pub use mail::Mail;
pub use mailpreview::MailPreview;
pub use domain::Domain;

type DBResult<T> = Result<T, sqlx::Error>;
