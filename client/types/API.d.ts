export type MeQuery = {
  id: number;
  username: string;
};

export type LoginQuery = {
  id: number;
  username: string;
  token: string;
};

export type APIError = {
  message: string;
};
