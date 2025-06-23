import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // TODO: Show auth modal or redirect to login
      return;
    }
    addToCart({ productId: product.id });
  };

  const renderRating = () => {
    const rating = parseFloat(product.rating || "0");
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
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
        <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>
          ({rating.toFixed(1)}) {product.reviewCount} reviews
        </span>
      </div>
    );
  };

  return (
    <Card className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow theme-transition"
          style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <Link href={`/product/${product.id}`}>
        <div className="cursor-pointer">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold mb-2 cursor-pointer hover:text-accent transition-colors" 
              style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-2">
          {renderRating()}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {product.salesCount} sold
          </span>
        </div>
        
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.variants.slice(0, 3).map((variant, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {variant}
              </Badge>
            ))}
            {product.variants.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{product.variants.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0}
          className="w-full bg-accent hover:bg-orange-600 text-white transition-colors"
        >
          {isAddingToCart ? (
            "Adding..."
          ) : product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
