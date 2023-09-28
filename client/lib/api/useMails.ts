import { useQuery } from "@tanstack/react-query";
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

export const useMails = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["mails", token],
    queryFn: async () => {
      if (!token) return null;
      const res = await API.get("/mails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data as Array<Mail>;
    },
  });
};
