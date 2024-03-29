export type MeQuery = {
  id: number;
  username: string;
};

export type SignInQuery = {
  token: string;
};

export type APIError = {
  message: string;
};

export type Contact = {
  id: number;
  name: string;
  address: string;
};
