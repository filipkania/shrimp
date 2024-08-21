mod user;

pub use user::User;

type DBResult<T> = Result<T, sqlx::Error>;
