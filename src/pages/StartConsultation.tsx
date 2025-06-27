import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  ShoppingCart,
  Loader,
  Crown,
  User,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';
import TavusAvatar from '../components/TavusAvatar';
import DoctorSelector from '../components/DoctorSelector';
import toast from 'react-hot-toast';
import PurchaseModal from '../components/PurchaseModal';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: string;
  tavus_replica_id: string;
  tavus_persona_id: string;
  is_premium: boolean;
  is_available: boolean;
}

const StartConsultation: React.FC = () => {
  const { user, subscription } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const loadDoctors = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_available_doctors', { target_user_id: user.id });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (aiService.isConfigured()) {
        const analysis = await aiService.generateSymptomDiagnosis(
          symptoms,
          [],
          'moderate',
          '1-3 days'
        );
        setAiAnalysis(analysis);
      } else {
        // Demo analysis
        setTimeout(() => {
          setAiAnalysis({
            condition: 'Common Cold (Demo)',
            confidence: 85,
            description: 'Based on your symptoms, this appears to be a common cold. Demo mode - configure API keys for real AI analysis.',
            naturalRemedies: [
              'Rest and adequate sleep (8+ hours)',
              'Drink warm ginger tea with honey',
              'Gargle with warm salt water',
              'Use steam inhalation',
              'Apply warm compress'
            ],
            foods: [
              'Chicken soup with garlic',
              'Fresh citrus fruits',
              'Green leafy vegetables',
              'Herbal teas',
              'Avoid dairy temporarily'
            ],
            medications: [
              'Paracetamol 500mg as needed',
              'Vitamin C 1000mg daily',
              'Zinc tablets'
            ]
          });
          setIsAnalyzing(false);
        }, 2000);
        return;
      }
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConversationStart = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Save consultation to database
    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: user?.id,
          doctor_id: selectedDoctor?.id,
          doctor_type: selectedDoctor?.specialty || 'General Physician',
          symptoms: symptoms || 'General consultation',
          tavus_conversation_id: conversationId,
          status: 'active'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  };

  const handleConversationEnd = async () => {
    setActiveConversationId(null);
    
    // Update consultation status in database
    if (activeConversationId) {
      try {
        const { error } = await supabase
          .from('consultations')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('tavus_conversation_id', activeConversationId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating consultation:', error);
      }
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [user]);

  const isPremiumUser = subscription === 'monthly' || subscription === 'yearly';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Start a Consultation</h1>
        <p className="text-gray-600">Connect with AI-powered medical specialists for personalized health consultations.</p>
      </motion.div>

      {/* Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`backdrop-blur-md rounded-2xl border-2 shadow-medical p-4 ${
          isPremiumUser 
            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300' 
            : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPremiumUser ? (
              <Crown className="h-5 w-5 text-yellow-600 mr-2" />
            ) : (
              <User className="h-5 w-5 text-blue-600 mr-2" />
            )}
            <span className="font-medium text-gray-800">
              {isPremiumUser ? `Premium ${subscription} Plan` : 'Free Plan'}
            </span>
          </div>
          {!isPremiumUser && (
            <button className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-green-glow transition-all">
              Upgrade to Premium
            </button>
          )}
        </div>
      </motion.div>

      {/* Doctor Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DoctorSelector
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          onDoctorSelect={setSelectedDoctor}
          defaultSpecialty="General Physician"
        />
      </motion.div>

      {/* Tavus Avatar */}
      {selectedDoctor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TavusAvatar
            doctor={selectedDoctor}
            symptoms={symptoms}
            onConversationStart={handleConversationStart}
            onConversationEnd={handleConversationEnd}
          />
        </motion.div>
      )}

      {/* Symptoms Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <div className="flex items-center mb-4">
          <Stethoscope className="h-5 w-5 text-medical-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Describe Your Symptoms</h2>
        </div>
        
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Tell us about your symptoms, concerns, or health questions in detail..."
          className="w-full p-4 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm h-32 resize-none text-gray-800 placeholder:text-gray-500 mb-4"
        />
        
        <button
          onClick={analyzeSymptoms}
          disabled={!symptoms.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Analyze Symptoms with AI
            </>
          )}
        </button>
      </motion.div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis Results</h3>
          
          <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 rounded-xl p-4 border-2 border-medical-primary/30 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Likely Condition</h4>
            <p className="text-gray-700 mb-2">{aiAnalysis.condition}</p>
            <p className="text-sm text-gray-600">Confidence: {aiAnalysis.confidence}%</p>
            {aiAnalysis.description && (
              <p className="text-sm text-gray-600 mt-2">{aiAnalysis.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
              <h4 className="font-semibold text-gray-800 mb-2">Natural Remedies</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {aiAnalysis.naturalRemedies.map((remedy: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {remedy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-300">
              <h4 className="font-semibold text-gray-800 mb-2">Recommended Foods</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {aiAnalysis.foods.map((food: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Recommended Medicine & Food
          </button>
        </motion.div>
      )}
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={aiAnalysis?.naturalRemedies || []}
      />
    </div>
  );
};

export default StartConsultation;