mod user;
mod mail;
mod mailpreview;
mod domain;
mod mailbox;

pub use user::User;
pub use mail::Mail;
pub use mailpreview::MailPreview;
pub use domain::Domain;
pub use mailbox::Mailbox;

type DBResult<T> = Result<T, sqlx::Error>;
