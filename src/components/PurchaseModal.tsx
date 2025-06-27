import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard,
  MapPin,
  Phone,
  User,
  Loader
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { paystackService } from '../services/paystackService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PurchaseItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price_ngn: number;
  price_usd: number;
  quantity: number;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedItems?: string[];
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, recommendedItems = [] }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [basket, setBasket] = useState<PurchaseItem[]>([]);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    receiverName: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
  }, [isOpen]);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('in_stock', true)
        .order('category', { ascending: true });

      if (error) throw error;

      const itemsWithQuantity = (data || []).map(item => ({
        ...item,
        quantity: 1
      }));

      setItems(itemsWithQuantity);

      // Auto-add recommended items to basket
      if (recommendedItems.length > 0) {
        const recommended = itemsWithQuantity.filter(item => 
          recommendedItems.some(rec => 
            item.name.toLowerCase().includes(rec.toLowerCase()) ||
            item.tags?.some(tag => rec.toLowerCase().includes(tag.toLowerCase()))
          )
        );
        setBasket(recommended.slice(0, 5)); // Limit to 5 items
      }
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    }
  };

  const addToBasket = (item: PurchaseItem) => {
    const existingItem = basket.find(b => b.id === item.id);
    if (existingItem) {
      setBasket(basket.map(b => 
        b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b
      ));
    } else {
      setBasket([...basket, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to basket`);
  };

  const removeFromBasket = (itemId: string) => {
    setBasket(basket.filter(b => b.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(itemId);
      return;
    }
    setBasket(basket.map(b => 
      b.id === itemId ? { ...b, quantity } : b
    ));
  };

  const calculateTotal = () => {
    return basket.reduce((total, item) => {
      const price = currency === 'NGN' ? item.price_ngn : item.price_usd;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    if (basket.length === 0) {
      toast.error('Your basket is empty');
      return;
    }

    if (!deliveryInfo.address || !deliveryInfo.phone || !deliveryInfo.receiverName) {
      toast.error('Please fill in all delivery information');
      return;
    }

    setIsLoading(true);

    try {
      const total = calculateTotal();

      // Initialize payment
      const response = await paystackService.initializePayment({
        email: user.email,
        amount: total, // Amount in major currency unit
        currency: currency,
        metadata: {
          user_id: user.id,
          items: basket,
          delivery_info: deliveryInfo
        }
      });

      if (!response.status || !response.data) {
        throw new Error('Payment initialization failed');
      }

      // Open payment modal
      paystackService.openPaymentModal({
        key: paystackService.publicKey,
        email: user.email,
        amount: Math.round(total * 100), // Convert to kobo for modal
        currency: currency,
        ref: response.data.reference,
        callback: async (response: any) => {
          if (response.status === 'success') {
            await savePurchase(response.reference);
            toast.success('Payment successful! Your items are on the way 📞 +234 905 555 7312');
            onClose();
          }
        },
        onClose: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const savePurchase = async (reference: string) => {
    try {
      const total = calculateTotal();
      
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: user?.id,
          items: basket,
          total_price_ngn: currency === 'NGN' ? total : null,
          total_price_usd: currency === 'USD' ? total : null,
          currency: currency,
          payment_provider: 'paystack',
          payment_status: 'completed',
          payment_info: { reference },
          delivery_address: deliveryInfo,
          receiver_name: deliveryInfo.receiverName,
          phone_number: deliveryInfo.phone
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  };

  const formatPrice = (priceNgn: number, priceUsd: number) => {
    const price = currency === 'NGN' ? priceNgn : priceUsd;
    const symbol = currency === 'NGN' ? '₦' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-medical-primary" />
              Buy Medicine & Food
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Items List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Available Items</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrency('NGN')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currency === 'NGN' 
                        ? 'bg-medical-primary text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ₦ NGN
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currency === 'USD' 
                        ? 'bg-medical-primary text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <p className="text-lg font-bold text-medical-primary">
                          {formatPrice(item.price_ngn, item.price_usd)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'medicine' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'food' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => addToBasket(item)}
                      className="w-full bg-medical-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-medical-secondary transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Basket
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Basket */}
            <div className="w-80 bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Basket</h3>
              
              {basket.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your basket is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {basket.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                          <button
                            onClick={() => removeFromBasket(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-medical-primary">
                            {formatPrice(
                              item.price_ngn * item.quantity, 
                              item.price_usd * item.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4 mb-6">
                    <div className="flex items-center justify-between text-lg font-bold text-gray-800">
                      <span>Total:</span>
                      <span className="text-medical-primary">
                        {currency === 'NGN' ? '₦' : '$'}{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Delivery Information</h4>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Receiver Name"
                            value={deliveryInfo.receiverName}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, receiverName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                          />
                        </div>
                        
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={deliveryInfo.phone}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                          />
                        </div>
                        
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <textarea
                            placeholder="Delivery Address"
                            value={deliveryInfo.address}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800 h-20 resize-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay with Paystack
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseModal;