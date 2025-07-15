import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdminAuthData {
  password: string;
}

export function useAdminAuth() {
  const queryClient = useQueryClient();

  const { data: authStatus, isLoading, error } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AdminAuthData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: () => {
      // Force refresh the auth status immediately
      queryClient.setQueryData(['/api/admin/status'], { authenticated: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", null);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
      queryClient.clear(); // Clear all cached data on logout
    },
  });

  return {
    isAuthenticated: authStatus?.authenticated === true,
    isLoading: isLoading && !error, // Don't show loading if there's an error
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}