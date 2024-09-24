import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/AuthContext";
import { API } from "@/lib/api.mjs";

import { type User } from "@shrimp/server/bindings/User";

export const useUsers = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["admin/users"],
    queryFn: async () => {
      const { data } = await API.get(`/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data as Array<User>;
    },
    enabled: !!token,
  });
};
