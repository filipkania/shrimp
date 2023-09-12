import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api";

export const useMails = () => {
  const auth = useAuth();

  return useQuery({
    queryKey: ["mails"],
    queryFn: async () => {
      const res = await API.get("/mails", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return res.data;
    }
  });
}