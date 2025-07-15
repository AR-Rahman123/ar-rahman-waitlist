import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import React from "react";

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
      // Set authenticated state immediately and force refresh
      queryClient.setQueryData(['/api/admin/status'], { authenticated: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
      // Force page reload to ensure clean state
      setTimeout(() => window.location.reload(), 500);
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

  // Use server authentication status only
  const isAuthenticated = authStatus?.authenticated === true;

  // Debug authentication state
  console.log('Auth Debug:', { 
    authStatus: authStatus?.authenticated, 
    isAuthenticated,
    isLoading,
    error: error?.message 
  });

  return {
    isAuthenticated,
    isLoading: isLoading && !error,
    login: loginMutation.mutate,
    logout: (data, options) => {
      // Clear cache and logout
      queryClient.setQueryData(['/api/admin/status'], { authenticated: false });
      logoutMutation.mutate(data, options);
    },
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}