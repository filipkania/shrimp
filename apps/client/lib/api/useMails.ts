import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api.mjs";

export type Mail = {
  id: string;

  message_id: string | null;

  technical_sender: string;
  from: string | null;

  technical_rcpt: string;
  to: Array<string>;
  ccs: Array<string>;
  reply_to: Array<string>;

  headers: string;

  subject: string | null;
  text: string | null;
  html: string | null;

  received_at: string;

  created_at: string;
  updated_at: string | null;
};

const LIMIT = 25;

export const useMails = (searchQuery?: string) => {
  const { token } = useAuth();

  return useInfiniteQuery({
    queryKey: ["mails", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await API.get(
        `/v1/mails?offset=${pageParam}&limit=${LIMIT}&query=${encodeURIComponent(
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
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if ((lastPage || []).length < LIMIT) {
        return null;
      }

      return pages.length * LIMIT;
    },

    refetchInterval: 1000 * 60, // 1 min
    enabled: !!token,
  });
};
