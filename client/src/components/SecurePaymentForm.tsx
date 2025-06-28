import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { creditCardSchema, addressSchema } from "@/lib/validation";
import { z } from "zod";

interface SecurePaymentFormProps {
  total: number;
  onPaymentSuccess: () => void;
}

export function SecurePaymentForm({ total, onPaymentSuccess }: SecurePaymentFormProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    // Credit card info (would be handled by secure payment processor)
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    
    // Billing address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      creditCardSchema.parse({
        number: paymentData.cardNumber.replace(/\s/g, ''),
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear,
        cvv: paymentData.cvv,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
    }

    try {
      addressSchema.parse({
        street: paymentData.street,
        city: paymentData.city,
        state: paymentData.state,
        zipCode: paymentData.zipCode,
        country: paymentData.country,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // In a real application, this would integrate with a secure payment processor
      // like Stripe, PayPal, or Square. Never process payments client-side!
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: `Payment of $${total.toFixed(2)} processed successfully!`,
      });
      
      onPaymentSuccess();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Card className="theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <CardHeader>
        <CardTitle style={{ color: 'var(--text-primary)' }}>
          🔒 Secure Payment - ${total.toFixed(2)}
        </CardTitle>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your payment information is encrypted and secure
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Credit Card Information */}
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Payment Information
            </h3>
            
            <div>
              <Label>Cardholder Name</Label>
              <Input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                className={errors.cardholderName ? 'border-red-500' : ''}
                required
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>
            
            <div>
              <Label>Card Number</Label>
              <Input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(e.target.value) 
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={errors.number ? 'border-red-500' : ''}
                required
              />
              {errors.number && (
                <p className="text-red-500 text-xs mt-1">{errors.number}</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Month</Label>
                <Input
                  type="text"
                  value={paymentData.expiryMonth}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                  placeholder="MM"
                  maxLength={2}
                  className={errors.expiryMonth ? 'border-red-500' : ''}
                  required
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="text"
                  value={paymentData.expiryYear}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryYear: e.target.value }))}
                  placeholder="YYYY"
                  maxLength={4}
                  className={errors.expiryYear ? 'border-red-500' : ''}
                  required
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={4}
                  className={errors.cvv ? 'border-red-500' : ''}
                  required
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Billing Address
            </h3>
            
            <div>
              <Label>Street Address</Label>
              <Input
                type="text"
                value={paymentData.street}
                onChange={(e) => setPaymentData(prev => ({ ...prev, street: e.target.value }))}
                placeholder="123 Main St"
                className={errors.street ? 'border-red-500' : ''}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  value={paymentData.city}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="New York"
                  className={errors.city ? 'border-red-500' : ''}
                  required
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  type="text"
                  value={paymentData.state}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="NY"
                  className={errors.state ? 'border-red-500' : ''}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>ZIP Code</Label>
              <Input
                type="text"
                value={paymentData.zipCode}
                onChange={(e) => setPaymentData(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="12345"
                className={errors.zipCode ? 'border-red-500' : ''}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-accent hover:bg-orange-600 text-white font-medium py-3"
          >
            {isProcessing ? (
              "Processing Payment..."
            ) : (
              `🔒 Pay $${total.toFixed(2)} Securely`
            )}
          </Button>
          
          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            🔒 Your payment is secured with 256-bit SSL encryption
          </p>
        </form>
      </CardContent>
    </Card>
  );
}