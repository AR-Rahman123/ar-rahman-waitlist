import React from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdminAuthData {
  password: string;
}

export function useSimpleAdminAuth() {
  const queryClient = useQueryClient();
  
  // Check auth status from server
  const { data: authStatus, isLoading } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: AdminAuthData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: () => {
      // Force refresh of auth status
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
      queryClient.refetchQueries({ queryKey: ['/api/admin/status'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", null);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });

  const isAuthenticated = authStatus?.authenticated === true;

  return {
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}