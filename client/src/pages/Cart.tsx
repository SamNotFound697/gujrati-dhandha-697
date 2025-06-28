import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { SecurePaymentForm } from "@/components/SecurePaymentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Cart() {
  const { cartItems, updateCart, removeFromCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Please Log In
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                You need to be logged in to view your cart.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + (price * item.quantity);
  }, 0);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCart(itemId, newQuantity);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setShowThankYou(true);
    // Clear cart after successful payment
    cartItems.forEach(item => removeFromCart(item.id));
  };

  const ThankYouModal = () => (
    <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
      <DialogContent className="max-w-md theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <DialogHeader>
          <DialogTitle className="text-center" style={{ color: 'var(--text-primary)' }}>
            🎉 Thank You!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center p-6">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Order Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your order has been successfully placed. You'll receive a confirmation email shortly.
            </p>
          </div>
          <Button 
            onClick={() => setShowThankYou(false)}
            className="w-full bg-accent hover:bg-orange-600 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Shopping Cart ({cartItems.length} items)
        </h1>

        {cartItems.length === 0 ? (
          <Card className="max-w-md mx-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Your cart is empty
              </h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                Add some products to get started!
              </p>
              <Button asChild className="bg-accent hover:bg-orange-600 text-white">
                <a href="/">Start Shopping</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {item.product?.name || 'Unknown Product'}
                        </h3>
                        {item.variant && (
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Variant: {item.variant}
                          </p>
                        )}
                        <p className="font-bold" style={{ color: 'var(--accent)' }}>
                          ${item.product ? parseFloat(item.product.price).toFixed(2) : '0.00'}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="theme-transition sticky top-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <CardHeader>
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                    <span style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
                    <span style={{ color: 'var(--text-primary)' }}>$5.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Tax:</span>
                    <span style={{ color: 'var(--text-primary)' }}>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                    <span style={{ color: 'var(--accent)' }}>${(total + 5.99 + total * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-accent hover:bg-orange-600 text-white font-medium py-3"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Secure Checkout</DialogTitle>
            </DialogHeader>
            <SecurePaymentForm
              total={total + 5.99 + total * 0.08}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </DialogContent>
        </Dialog>

        {/* Thank You Modal */}
        <ThankYouModal />
      </main>
    </div>
  );
}