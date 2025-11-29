import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAdminAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/auth-status"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/auth-status", undefined);
      return await res.json() as { isAuthenticated: boolean };
    },
    retry: false,
  });

  return {
    isAuthenticated: data?.isAuthenticated || false,
    isLoading,
  };
}
