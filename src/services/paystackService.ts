class PaystackService {
  public publicKey: string;
  private baseURL = '/api/payments';

  constructor() {
    // Get public key from environment variable
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  }

  async initializePayment(data: {
    email: string;
    amount: number;
    currency: string;
    metadata?: any;
  }) {
    try {
      const response = await fetch(`${this.baseURL}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await fetch(`${this.baseURL}/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  openPaymentModal(config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    callback: (response: any) => void;
    onClose: () => void;
  }) {
    // Check if Paystack script is loaded
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const handler = (window as any).PaystackPop.setup({
        key: config.key,
        email: config.email,
        amount: config.amount,
        currency: config.currency,
        ref: config.ref,
        callback: config.callback,
        onClose: config.onClose,
      });
      handler.openIframe();
    } else {
      // Load Paystack script dynamically
      this.loadPaystackScript().then(() => {
        const handler = (window as any).PaystackPop.setup({
          key: config.key,
          email: config.email,
          amount: config.amount,
          currency: config.currency,
          ref: config.ref,
          callback: config.callback,
          onClose: config.onClose,
        });
        handler.openIframe();
      }).catch((error) => {
        console.error('Failed to load Paystack script:', error);
        config.onClose();
      });
    }
  }

  private loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  }

  isConfigured(): boolean {
    return !!this.publicKey && this.publicKey.length > 10;
  }
}

export const paystackService = new PaystackService();