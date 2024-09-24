import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { API } from "../api.mjs";

import { type Mail } from "@shrimp/server/bindings/Mail";
import { ErrorResponse } from "@shrimp/server/bindings/ErrorResponse";

export const useMail = (id: number | string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["mail", id],
    queryFn: async () => {
      const { data, status } = await API.get(`/v1/mails/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status == 404) {
        throw new Error((data as ErrorResponse).message);
      }

      return data as Mail;
    },
    staleTime: Infinity,
    enabled: !!token && !!id,
  });
};
