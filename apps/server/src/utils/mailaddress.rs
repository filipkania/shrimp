use mailparse::{addrparse, MailAddr};
use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
pub struct MailAddress {
  name: Option<String>,
  address: String,
}

#[derive(Debug, Clone, Serialize, TS)]
pub struct MailAddressList(Vec<MailAddress>);

impl From<String> for MailAddress {
  fn from(value: String) -> Self {
    let Ok(info) = addrparse(&value) else {
      return Self {
        name: None,
        address: value,
      };
    };

    match &info[0] {
      MailAddr::Single(info) => Self {
        name: info.display_name.clone(),
        address: info.addr.clone(),
      },
      _ => panic!(),
    }
  }
}

impl From<Vec<String>> for MailAddressList {
  fn from(value: Vec<String>) -> Self {
    MailAddressList(value
      .into_iter()
      .map(|s| MailAddress::from(s))
      .collect::<Vec<_>>())
  }
}
