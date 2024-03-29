import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api.mjs";
import { Mail } from "./useMails";

export const useMail = (id: number | string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["mail", id],
    queryFn: async () => {
      const { data } = await API.get(`/mails/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.length === 0) {
        throw new Error("Mail not found.");
      }

      return data as Mail;
    },
    retry: false,
    staleTime: Infinity,
    enabled: !!token && !!id,
  });
};
