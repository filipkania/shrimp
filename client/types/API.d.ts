export type MeQuery = {
  id: number;
  username: string;
};

export type LoginQuery = {
  token: string;
};

export type APIError = {
  message: string;
};


export type Contact = {
  id: number;
  name: string;
  address: string;
}