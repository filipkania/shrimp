export const queryAPI = <T = any>(
  uri: string,
  token: string | null = null,
  options?: RequestInit
): Promise<T> =>
  fetch(uri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  }).then((x) => x.json());
