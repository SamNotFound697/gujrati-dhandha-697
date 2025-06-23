import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ShoppingCart, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, Review } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const productQuery = useQuery({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["/api/reviews", id],
    enabled: !!id,
  });

  const relatedProductsQuery = useQuery({
    queryKey: ["/api/products", { category: productQuery.data?.category }],
    enabled: !!productQuery.data?.category,
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      if (!user) throw new Error("Must be logged in to add review");
      
      const response = await apiRequest("POST", "/api/reviews", {
        userId: user.id,
        productId: parseInt(id!),
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", id] });
      setReviewComment("");
      setReviewRating(5);
      toast({
        title: "Success",
        description: "Review added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add review",
        variant: "destructive",
      });
    },
  });

  const product = productQuery.data as Product;
  const reviews = reviewsQuery.data as Review[] || [];
  const relatedProducts = relatedProductsQuery.data as Product[] || [];

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                <div className="bg-gray-300 h-16 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Product Not Found
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              The product you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      variant: selectedVariant || undefined,
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "Please log in to add a review",
        variant: "destructive",
      });
      return;
    }
    
    addReviewMutation.mutate({
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars 
                ? 'fill-current' 
                : i === fullStars && hasHalfStar 
                  ? 'fill-current opacity-50' 
                  : 'fill-none'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {product.name}
              </h1>
              <div className="flex items-center mb-4">
                {renderRating(parseFloat(product.rating || "0"))}
                <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ({parseFloat(product.rating || "0").toFixed(1)}) {product.reviewCount} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {product.salesCount} sold
                </span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
            </div>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Select Variant
                </Label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Quantity
              </Label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0 || !isAuthenticated}
                className="flex-1 bg-accent hover:bg-orange-600 text-white"
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : !isAuthenticated ? (
                  "Login to Add to Cart"
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            {/* Shipping Info */}
            <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Shipping Information
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Shipping Fee: ${parseFloat(product.shippingFee || "0").toFixed(2)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Estimated Delivery: 3-5 business days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-12 theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Customer Reviews
            </h2>

            {/* Add Review Form */}
            {isAuthenticated && (
              <form onSubmit={handleAddReview} className="mb-8 p-4 border rounded-lg">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Write a Review
                </h3>
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Rating
                  </Label>
                  <Select value={reviewRating.toString()} onValueChange={(value) => setReviewRating(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Comment
                  </Label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addReviewMutation.isPending}
                  className="bg-accent hover:bg-orange-600 text-white"
                >
                  {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      {renderRating(review.rating)}
                      <span className="ml-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                        User {review.userId}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
