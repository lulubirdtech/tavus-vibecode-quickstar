import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  ShoppingCart,
  Loader,
  Crown,
  User,
  Stethoscope,
  Video,
  Clock,
  PhoneOff,
  Phone,
  Lock,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { aiService } from '../services/aiService';
import { tavusService } from '../services/tavusService';
import TavusAvatar from '../components/TavusAvatar';
import DoctorSelector from '../components/DoctorSelector';
import toast from 'react-hot-toast';
import PurchaseModal from '../components/PurchaseModal';

const StartConsultation: React.FC = () => {
  const { user, subscription } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadDoctors();
    }
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_available_doctors', { target_user_id: user?.id });

      if (error) throw error;
      setDoctors(data || []);
      
      // Set General Physician as default
      const defaultDoctor = (data || []).find((doc: any) => doc.specialty === 'General Practitioner');
      if (defaultDoctor) {
        setSelectedDoctor(defaultDoctor);
      }
    } catch (err) {
      console.error('Error loading doctors:', err);
      toast.error('Failed to load doctors');
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      if (aiService.isConfigured()) {
        const result = await aiService.generateSymptomDiagnosis(
          symptoms,
          [],
          'moderate',
          '1-3 days'
        );
        setDiagnosis(result);
        toast.success('Symptoms analyzed successfully!');
      } else {
        // Demo analysis
        setTimeout(() => {
          setDiagnosis({
            condition: 'Common Cold (Demo)',
            confidence: 85,
            description: 'Demo analysis - Configure API keys in Settings for real AI analysis.',
            naturalRemedies: [
              'Rest and adequate sleep',
              'Drink warm fluids',
              'Use honey for sore throat',
              'Apply warm compress',
              'Practice deep breathing'
            ],
            foods: [
              'Chicken soup with vegetables',
              'Citrus fruits for Vitamin C',
              'Ginger tea for inflammation',
              'Garlic for immune support',
              'Leafy greens for nutrients'
            ],
            medications: [
              'Paracetamol for fever and pain',
              'Throat lozenges for sore throat',
              'Saline nasal spray for congestion'
            ],
            administration: [
              'Take medications with food',
              'Drink plenty of fluids',
              'Get adequate rest',
              'Monitor symptoms'
            ],
            warning: 'This is demo content. Seek medical attention if symptoms worsen.'
          });
          setIsAnalyzing(false);
        }, 2000);
        return;
      }
    } catch (error: any) {
      console.error('Symptom analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startConsultation = async (doctor: any) => {
    if (!doctor.is_available && doctor.is_premium) {
      toast.error('This specialist requires a premium subscription');
      return;
    }

    setIsLoading(true);

    try {
      const replicaData = await tavusService.getReplicaStatus(doctor.tavus_replica_id);

      if (replicaData.status !== 'completed') {
        toast.error(`Replica not ready: ${replicaData.status}`);
        return;
      }

      const conversation = await tavusService.startConsultation(
        doctor.tavus_replica_id,
        doctor.tavus_persona_id
      );

      setConversationId(conversation.conversation_id);
      setIsConnected(true);
      setSessionDuration(0);

      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: user?.id,
          doctor_id: doctor.id,
          doctor_type: doctor.specialty,
          symptoms: symptoms || 'General consultation',
          tavus_conversation_id: conversation.conversation_id,
          status: 'active',
        });

      if (error) throw error;

      toast.success(`Connected to ${doctor.name}`);
    } catch (err: any) {
      console.error('Error starting consultation:', err);
      toast.error(err.message || 'Consultation start failed');
    } finally {
      setIsLoading(false);
    }
  };

  const endConsultation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      await tavusService.endConsultation(conversationId);

      await supabase
        .from('consultations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('tavus_conversation_id', conversationId);

      setIsConnected(false);
      setConversationId(null);
      setSessionDuration(0);

      toast.success('Consultation ended');
    } catch (err) {
      console.error('Error ending consultation:', err);
      toast.error('Failed to end consultation');
    } finally {
      setIsLoading(false);
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

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const isPremiumUser = subscription === 'monthly' || subscription === 'yearly';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Start Consultation</h1>
        <p className="text-gray-600">Connect with AI medical specialists for personalized health consultations and treatment recommendations.</p>
      </motion.div>

      {/* Premium Plan Banner */}
      {!isPremiumUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 shadow-medical p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-800">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600">Access all specialist doctors and advanced features</p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Doctor Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-medical-primary mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Select a Doctor - Choose your specialist</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DoctorSelector
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
            />
          </div>
          
          <div>
            {selectedDoctor && (
              <TavusAvatar
                doctor={selectedDoctor}
                isActive={isConnected}
                onStart={() => startConsultation(selectedDoctor)}
                onEnd={endConsultation}
                symptoms={symptoms}
                className="h-full"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Symptoms Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Describe Your Symptoms</h2>
        
        <div className="space-y-4">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Please describe your symptoms in detail... (e.g., I have a headache, feel tired, and have a runny nose)"
            className="w-full p-4 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors backdrop-blur-sm h-32 resize-none text-gray-800 placeholder:text-gray-500"
          />
          
          <button
            onClick={handleAnalyzeSymptoms}
            disabled={!symptoms.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze Symptoms with AI
              </>
            )}
          </button>
          
          {diagnosis && (
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Recommended Medicine & Food
            </button>
          )}
        </div>
      </motion.div>

      {/* Analysis Results */}
      {diagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis Results</h2>
          
          <div className="space-y-4">
            {/* Diagnosis */}
            <div className="bg-gradient-to-r from-medical-primary/20 to-medical-secondary/20 rounded-xl p-4 border-2 border-medical-primary/30">
              <h3 className="font-semibold text-gray-800 mb-2">Likely Condition</h3>
              <h4 className="text-lg font-bold text-gray-800 mb-2">{diagnosis.condition}</h4>
              <p className="text-sm text-gray-700 mb-2">{diagnosis.description}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-700">Confidence: </span>
                <span className="font-semibold text-gray-800 ml-1">{diagnosis.confidence}%</span>
              </div>
            </div>

            {/* Natural Remedies */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <h3 className="font-semibold text-gray-800 mb-3">🌿 Natural Remedies</h3>
              <ul className="space-y-2">
                {diagnosis.naturalRemedies.map((remedy: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {remedy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Healing Foods */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
              <h3 className="font-semibold text-gray-800 mb-3">🥗 Healing Foods & Diet</h3>
              <ul className="space-y-2">
                {diagnosis.foods.map((food: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {food}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medications */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
              <h3 className="font-semibold text-gray-800 mb-3">💊 Recommended Medications</h3>
              <ul className="space-y-2">
                {diagnosis.medications.map((med: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {med}
                  </li>
                ))}
              </ul>
            </div>

            {/* Administration */}
            {diagnosis.administration && (
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-2 border-blue-300">
                <h3 className="font-semibold text-gray-800 mb-3">🕒 How to Take Treatment</h3>
                <ul className="space-y-2">
                  {diagnosis.administration.map((instruction: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning */}
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-gray-800 mb-2">⚠️ Important Warning</h3>
              <p className="text-sm text-gray-700">{diagnosis.warning}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={diagnosis?.naturalRemedies || []}
      />
    </div>
  );
};

export default StartConsultation;