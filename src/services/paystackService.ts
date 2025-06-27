class PaystackService {
  public publicKey: string;

  constructor() {
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  }

  async initializePayment(data: {
    email: string;
    amount: number; // in kobo
    currency?: string;
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount,
          currency: data.currency || 'NGN',
          metadata: data.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Paystack payment initialization failed:', error);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await fetch(`/api/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Paystack verification error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Paystack payment verification failed:', error);
      throw error;
    }
  }

  openPaymentModal(data: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref: string;
    callback: (response: any) => void;
    onClose: () => void;
  }) {
    // Load Paystack inline script if not already loaded
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => this.openModal(data);
      document.head.appendChild(script);
    } else {
      this.openModal(data);
    }
  }

  private openModal(data: any) {
    const handler = window.PaystackPop.setup({
      key: this.publicKey,
      email: data.email,
      amount: data.amount,
      currency: data.currency || 'NGN',
      ref: data.ref,
      callback: data.callback,
      onClose: data.onClose
    });
    handler.openIframe();
  }

  generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isConfigured(): boolean {
    return !!this.publicKey;
  }
}

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const paystackService = new PaystackService();