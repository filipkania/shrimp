import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api";

export type Mail = {
  id: number;

  from_id: number;
  from_name: string;
  from_address: string;

  message_id?: string;
  references?: string;

  headers: string;
  subject?: string;

  text?: string;
  html?: string;

  received_at: string;
};

const LIMIT = 25;

export const useMails = (searchQuery?: string) => {
  const { token } = useAuth();

  return useInfiniteQuery({
    queryKey: ["mails", token, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      if (!token) return null;
      const res = await API.get(
        `/mails?offset=${pageParam}&limit=${LIMIT}&query=${encodeURIComponent(
          searchQuery || ""
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data as Array<Mail>;
    },
    getNextPageParam: (lastPage, pages) => {
      if ((lastPage || []).length < LIMIT) {
        return null;
      }

      return pages.length * LIMIT;
    },
  });
};
