import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getStoredUser, setStoredUser, type AuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setStoredUser(data.user);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { 
      username: string; 
      email: string; 
      password: string; 
      fullName: string;
      isSeller?: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setStoredUser(data.user);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    setUser(null);
    setStoredUser(null);
    queryClient.clear();
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
}
