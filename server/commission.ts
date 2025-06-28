import { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface CommissionPayment {
  orderId: number;
  sellerId: number;
  totalAmount: number;
  platformCommission: number; // 10%
  sellerPayout: number; // 90%
  stripePaymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
}

export class CommissionPaymentProcessor {
  private platformCommissionRate = 0.10; // 10% commission

  async processOrderPayment(
    orderId: number,
    sellerId: number,
    totalAmount: number,
    customerPaymentMethodId: string
  ): Promise<CommissionPayment> {
    try {
      // Calculate commission split
      const platformCommission = totalAmount * this.platformCommissionRate;
      const sellerPayout = totalAmount - platformCommission;

      // Create payment intent for full amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        payment_method: customerPaymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        metadata: {
          orderId: orderId.toString(),
          sellerId: sellerId.toString(),
          platformCommission: platformCommission.toString(),
          sellerPayout: sellerPayout.toString(),
        },
      });

      // If payment succeeds, schedule seller payout
      if (paymentIntent.status === 'succeeded') {
        await this.scheduleSellerPayout(sellerId, sellerPayout, orderId);
      }

      return {
        orderId,
        sellerId,
        totalAmount,
        platformCommission,
        sellerPayout,
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      };
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('Payment processing failed');
    }
  }

  private async scheduleSellerPayout(
    sellerId: number,
    amount: number,
    orderId: number
  ): Promise<void> {
    try {
      // In production, you'd get seller's Stripe Connect account ID
      const sellerStripeAccountId = await this.getSellerStripeAccount(sellerId);
      
      if (sellerStripeAccountId) {
        // Transfer to seller's connected account (minus platform fee)
        await stripe.transfers.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          destination: sellerStripeAccountId,
          metadata: {
            orderId: orderId.toString(),
            sellerId: sellerId.toString(),
          },
        });
      } else {
        // Store pending payout for manual processing
        console.log(`Pending payout for seller ${sellerId}: $${amount}`);
      }
    } catch (error) {
      console.error('Seller payout failed:', error);
    }
  }

  private async getSellerStripeAccount(sellerId: number): Promise<string | null> {
    // In production, this would fetch from your database
    // For now, return null to indicate manual payout needed
    return null;
  }

  // For underage entrepreneurs - setup with guardian assistance
  async setupMinorBusinessAccount(
    guardianEmail: string,
    businessName: string,
    guardianSSN: string // Your brother's SSN for legal compliance
  ): Promise<string> {
    try {
      // Create Stripe Express account with guardian as responsible party
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: guardianEmail,
        business_type: 'individual',
        individual: {
          email: guardianEmail,
        },
        business_profile: {
          name: businessName,
          product_description: 'Online marketplace commission',
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      return account.id;
    } catch (error) {
      console.error('Account setup failed:', error);
      throw new Error('Business account setup failed');
    }
  }
}

export const commissionProcessor = new CommissionPaymentProcessor();