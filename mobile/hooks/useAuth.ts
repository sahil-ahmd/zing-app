import { useApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface SyncUserPayload {
  clerkId: string;
  email: string | undefined;
  name: string | null;
  image: string;
}

export const useAuthCallback = () => {
  const api = useApi();

  const result = useMutation({
    mutationFn: async (userData: SyncUserPayload) => {
      const { data } = await api.post("/auth/callback", userData);
      return data;
    },
  });
  return result;
};
