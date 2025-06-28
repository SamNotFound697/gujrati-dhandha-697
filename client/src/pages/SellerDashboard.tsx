import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { AffiliateTracker } from "@/components/AffiliateTracker";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    shippingFee: '',
    variants: [] as string[],
    newVariant: '',
  });

  const productsQuery = useQuery({
    queryKey: ["/api/seller", user?.id, "products"],
    enabled: !!user,
  });

  const products = productsQuery.data as Product[] || [];

  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest("POST", "/api/products", {
        ...productData,
        sellerId: user?.id,
        variants: productForm.variants,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller", user?.id, "products"] });
      setIsAddProductModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("DELETE", `/api/products/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller", user?.id, "products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      shippingFee: '',
      variants: [],
      newVariant: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate({
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      category: productForm.category,
      stock: parseInt(productForm.stock),
      shippingFee: productForm.shippingFee || "0",
    });
  };

  const addVariant = () => {
    if (productForm.newVariant.trim()) {
      setProductForm(prev => ({
        ...prev,
        variants: [...prev.variants, prev.newVariant.trim()],
        newVariant: '',
      }));
    }
  };

  const removeVariant = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalSales = products.reduce((sum, p) => sum + parseFloat(p.price) * p.salesCount, 0);
  const totalOrders = products.reduce((sum, p) => sum + p.salesCount, 0);
  const averageRating = products.length > 0 
    ? products.reduce((sum, p) => sum + parseFloat(p.rating || "0"), 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Seller Dashboard
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Manage your products and track your sales
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: 'var(--text-primary)' }}>
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                {totalProducts}
              </p>
            </CardContent>
          </Card>

          <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: 'var(--text-primary)' }}>
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                ${totalSales.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: 'var(--text-primary)' }}>
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">
                {totalOrders}
              </p>
            </CardContent>
          </Card>

          <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ color: 'var(--text-primary)' }}>
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-500">
                {averageRating.toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Analytics */}
        <div className="mb-8">
          <AffiliateTracker />
        </div>

        {/* Products Section */}
        <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle style={{ color: 'var(--text-primary)' }}>Your Products</CardTitle>
              <Button
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-accent hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {productsQuery.isLoading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: 'var(--text-primary)' }}>Product</TableHead>
                    <TableHead style={{ color: 'var(--text-primary)' }}>Price</TableHead>
                    <TableHead style={{ color: 'var(--text-primary)' }}>Stock</TableHead>
                    <TableHead style={{ color: 'var(--text-primary)' }}>Sales</TableHead>
                    <TableHead style={{ color: 'var(--text-primary)' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg mr-4 object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {product.name}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell style={{ color: 'var(--text-primary)' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </TableCell>
                      <TableCell style={{ color: 'var(--text-primary)' }}>
                        {product.stock}
                      </TableCell>
                      <TableCell style={{ color: 'var(--text-primary)' }}>
                        {product.salesCount}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Product Modal */}
      <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
        <DialogContent 
          className="max-w-2xl max-h-screen overflow-y-auto theme-transition"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--text-primary)' }}>Add New Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Product Name</Label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label style={{ color: 'var(--text-secondary)' }}>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Category</Label>
                <Select 
                  value={productForm.category} 
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Stock Quantity</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label style={{ color: 'var(--text-secondary)' }}>Shipping Fee</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={productForm.shippingFee}
                  onChange={(e) => setProductForm(prev => ({ ...prev, shippingFee: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <Label style={{ color: 'var(--text-secondary)' }}>Variants (Colors/Sizes)</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={productForm.newVariant}
                  onChange={(e) => setProductForm(prev => ({ ...prev, newVariant: e.target.value }))}
                  placeholder="e.g., Red, Blue, Green"
                  className="flex-1"
                />
                <Button type="button" onClick={addVariant} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productForm.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    <span>{variant}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="ml-1 p-0 h-auto text-red-500"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddProductModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addProductMutation.isPending}
                className="bg-accent hover:bg-orange-600 text-white"
              >
                {addProductMutation.isPending ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}