import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import type { Product } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    rating: "",
    ageGroup: "",
    search: "",
  });

  const [showDonationModal, setShowDonationModal] = useState(false);

  const productsQuery = useQuery({
    queryKey: ["/api/products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== "All Categories") {
        params.append("category", filters.category);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.rating && filters.rating !== "all") {
        const ratingValue = filters.rating.replace("+ Stars", "");
        params.append("rating", ratingValue);
      }
      if (filters.priceRange && filters.priceRange !== "all") {
        const [min, max] = parsePriceRange(filters.priceRange);
        if (min !== undefined) params.append("priceMin", min.toString());
        if (max !== undefined) params.append("priceMax", max.toString());
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const parsePriceRange = (range: string): [number | undefined, number | undefined] => {
    switch (range) {
      case "Under $25":
        return [undefined, 25];
      case "$25 - $50":
        return [25, 50];
      case "$50 - $100":
        return [50, 100];
      case "Over $100":
        return [100, undefined];
      default:
        return [undefined, undefined];
    }
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const products = productsQuery.data as Product[] || [];

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header 
        onSearch={handleSearch}
        onShowDonation={() => setShowDonationModal(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <section className="mb-8">
          <div 
            className="relative rounded-xl overflow-hidden shadow-lg h-64 md:h-96 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')"
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Shop Everything</h1>
                <p className="text-xl md:text-2xl mb-6">Discover millions of products from trusted sellers</p>
                <Button className="bg-accent hover:bg-orange-600 text-white px-8 py-3 text-lg font-medium">
                  Start Shopping
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-8">
          <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Filter by:</h3>
                
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="Under $25">Under $25</SelectItem>
                    <SelectItem value="$25 - $50">$25 - $50</SelectItem>
                    <SelectItem value="$50 - $100">$50 - $100</SelectItem>
                    <SelectItem value="Over $100">Over $100</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4+ Stars">4+ Stars</SelectItem>
                    <SelectItem value="3+ Stars">3+ Stars</SelectItem>
                    <SelectItem value="2+ Stars">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.ageGroup} onValueChange={(value) => handleFilterChange('ageGroup', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Teens">Teens</SelectItem>
                    <SelectItem value="Adults">Adults</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Product Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Featured Products
          </h2>
          
          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-gray-300 h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Similar Products Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Smart Watch", price: 129.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
              { name: "Travel Backpack", price: 59.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
              { name: "Gaming Controller", price: 79.99, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
              { name: "Camera Lens", price: 199.99, image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
              { name: "Book Collection", price: 29.99, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
              { name: "Yoga Mat", price: 34.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" },
            ].map((item, index) => (
              <Card key={index} className="rounded-lg shadow-md overflow-hidden theme-transition"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                <CardContent className="p-3">
                  <h4 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </h4>
                  <p className="font-bold" style={{ color: 'var(--accent)' }}>
                    ${item.price}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-12 border-t theme-transition" 
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
                🏪 MarketPlace Pro
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your ultimate destination for online shopping with millions of products from trusted sellers worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Help Center</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Returns</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Shipping Info</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>For Sellers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Sell on MarketPlace</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Seller Dashboard</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Seller Support</a></li>
                <li><a href="#" className="hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>Fees & Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Connect</h4>
              <div className="flex space-x-4">
                {['📘', '🐦', '📷', '💼'].map((icon, i) => (
                  <a key={i} href="#" className="text-xl hover:text-accent theme-transition" style={{ color: 'var(--text-secondary)' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'var(--bg-primary)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              © 2024 MarketPlace Pro. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Donation Modal - TODO: Implement */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  ☕ Buy Me a Coffee
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowDonationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Support our platform and help us keep improving your shopping experience!
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { amount: 3, label: "Coffee" },
                  { amount: 5, label: "Latte" },
                  { amount: 10, label: "Meal" }
                ].map((option) => (
                  <Button
                    key={option.amount}
                    variant="outline"
                    className="p-3 border-2 hover:border-accent transition-colors text-center flex flex-col"
                  >
                    <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                      ${option.amount}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {option.label}
                    </span>
                  </Button>
                ))}
              </div>
              
              <Button className="w-full bg-accent hover:bg-orange-600 text-white py-3 font-medium">
                ❤️ Support Us
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
