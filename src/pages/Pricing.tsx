import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  Star,
  Users,
  Zap,
  Shield,
  Heart,
  Brain,
  Stethoscope,
  Camera,
  MessageSquare,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { paystackService } from '../services/paystackService';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      priceNgn: 0,
      period: 'Forever',
      description: 'Basic health assistance for everyone',
      features: [
        'General Physician consultations',
        'Basic symptom analysis',
        'Health education articles',
        'Emergency guide access',
        'Natural remedies database'
      ],
      limitations: [
        'Limited to General Physician only',
        'Basic AI analysis',
        'No premium specialists'
      ],
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: 9.99,
      priceNgn: 15000,
      period: 'per month',
      description: 'Full access to all medical specialists',
      features: [
        'All specialist doctors available',
        'Advanced AI-powered diagnosis',
        'Unlimited consultations',
        'Priority support',
        'Personalized treatment plans',
        'Voice alerts & reminders',
        'Photo diagnosis with specialists',
        'Comprehensive health reports'
      ],
      limitations: [],
      color: 'from-medical-primary to-medical-secondary',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: 99.99,
      priceNgn: 150000,
      period: 'per year',
      description: 'Best value with 2 months free',
      features: [
        'Everything in Monthly Premium',
        'Save 17% compared to monthly',
        'Priority customer support',
        'Early access to new features',
        'Family sharing (up to 4 members)',
        'Advanced health analytics',
        'Personalized health insights',
        'Annual health summary report'
      ],
      limitations: [],
      color: 'from-purple-500 to-purple-600',
      popular: false,
      savings: 'Save ₦30,000'
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (plan.id === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan.id);

    try {
      // Initialize payment
      const response = await paystackService.initializePayment({
        email: user.email,
        amount: plan.priceNgn,
        currency: 'NGN',
        metadata: {
          user_id: user.id,
          plan_type: plan.id,
          plan_name: plan.name
        }
      });

      if (!response.status || !response.data) {
        throw new Error('Payment initialization failed');
      }

      // Open payment modal
      paystackService.openPaymentModal({
        key: paystackService.publicKey,
        email: user.email,
        amount: plan.priceNgn * 100, // Convert to kobo
        currency: 'NGN',
        ref: response.data.reference,
        callback: async (paymentResponse: any) => {
          if (paymentResponse.status === 'success') {
            await saveSubscription(plan, paymentResponse.reference);
            toast.success(`Successfully subscribed to ${plan.name}!`);
          }
        },
        onClose: () => {
          setIsLoading(false);
          setSelectedPlan(null);
        }
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Subscription failed. Please try again.');
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const saveSubscription = async (plan: any, reference: string) => {
    try {
      const endDate = plan.id === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user?.id,
          plan_type: plan.id,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          price: plan.priceNgn,
          currency: 'NGN',
          payment_provider: 'paystack',
          payment_id: reference,
          auto_renew: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Health Plan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get access to AI-powered medical consultations with specialist doctors and comprehensive health management tools.
        </p>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">What You Get</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Specialist Doctors</h3>
            <p className="text-sm text-gray-600">Access to cardiologists, dermatologists, and more</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">AI Diagnosis</h3>
            <p className="text-sm text-gray-600">Advanced AI-powered symptom analysis</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Photo Diagnosis</h3>
            <p className="text-sm text-gray-600">Visual analysis of medical images</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">Round-the-clock health assistance</p>
          </div>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className={`relative backdrop-blur-md bg-glass-white rounded-2xl border-2 shadow-medical p-6 ${
              plan.popular 
                ? 'border-medical-primary/50 shadow-green-glow transform scale-105' 
                : 'border-medical-primary/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            {plan.savings && (
              <div className="absolute -top-3 right-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {plan.savings}
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {plan.id === 'free' ? (
                  <Heart className="h-8 w-8 text-white" />
                ) : plan.id === 'monthly' ? (
                  <Crown className="h-8 w-8 text-white" />
                ) : (
                  <Shield className="h-8 w-8 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-800">₦{plan.priceNgn.toLocaleString()}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              {plan.price > 0 && (
                <p className="text-sm text-gray-500">${plan.price} USD</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {plan.limitations.length > 0 && (
              <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Limitations</p>
                {plan.limitations.map((limitation, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-xs text-gray-600">{limitation}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={isLoading && selectedPlan === plan.id}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                plan.id === 'free'
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : plan.popular
                  ? 'bg-gradient-to-r from-medical-primary to-medical-secondary text-white hover:shadow-green-glow transform hover:scale-[1.02]'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading && selectedPlan === plan.id ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : plan.id === 'free' ? (
                'Current Plan'
              ) : (
                `Subscribe to ${plan.name}`
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h3>
            <p className="text-sm text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Is my data secure?</h3>
            <p className="text-sm text-gray-600">Absolutely. We use bank-level encryption and comply with healthcare privacy standards to protect your information.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
            <p className="text-sm text-gray-600">We accept all major credit cards, debit cards, and bank transfers through our secure Paystack integration.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Do you offer refunds?</h3>
            <p className="text-sm text-gray-600">We offer a 7-day money-back guarantee if you're not satisfied with our premium features.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;