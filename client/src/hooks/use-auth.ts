import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { validateSession, secureLogout, type AuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Client-side validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email format").max(255),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  fullName: z.string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  isSeller: z.boolean().optional(),
});

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Validate session on mount and periodically
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: validateSession,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (sessionQuery.data) {
      setUser(sessionQuery.data);
    } else {
      setUser(null);
    }
  }, [sessionQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Validate input client-side first
      const validatedData = loginSchema.parse(data);
      
      const response = await apiRequest("POST", "/api/auth/login", validatedData);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    },
    onError: (error: any) => {
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
      // Validate input client-side first
      const validatedData = registerSchema.parse(data);
      
      const response = await apiRequest("POST", "/api/auth/register", validatedData);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    },
  });

  const logout = async () => {
    try {
      await secureLogout();
      setUser(null);
      queryClient.clear();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending || sessionQuery.isLoading,
  };
}