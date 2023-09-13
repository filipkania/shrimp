import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api";
import { Contact } from "@/types/API";

export type Mail = {
  id: number;

  fromId: number;
  fromName: string;
  from: Contact;

  headers: {
    [key: string]: string;
  };
  messageId: string;
  references: Array<string> | null;

  receivedAt: string;

  subject: string;
  text: string;
  html: string | null;
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
