import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api.mjs";

import { type MailPreview } from "@shrimp/server/bindings/MailPreview";

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

      return res.data as Array<MailPreview>;
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
