import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";
import type { CartItem, Product } from "@shared/schema";

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

export function useCart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cartCount, setCartCount] = useState(0);

  const cartQuery = useQuery({
    queryKey: ["/api/cart", user?.id],
    enabled: !!user,
  });

  const cartItems = cartQuery.data as CartItemWithProduct[] || [];

  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCartMutation = useMutation({
    mutationFn: async (data: { 
      productId: number; 
      quantity?: number; 
      variant?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to add to cart");
      
      const response = await apiRequest("POST", "/api/cart", {
        userId: user.id,
        productId: data.productId,
        quantity: data.quantity || 1,
        variant: data.variant,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user?.id] });
      toast({
        title: "Success",
        description: "Item added to cart!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async (data: { id: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${data.id}`, {
        quantity: data.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/cart/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", user?.id] });
      toast({
        title: "Success",
        description: "Item removed from cart!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  return {
    cartItems,
    cartCount,
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
}
