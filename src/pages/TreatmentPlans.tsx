import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Leaf,
  Apple,
  Activity,
  Heart,
  Shield,
  User,
  Loader,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import PurchaseModal from '../components/PurchaseModal';
import toast from 'react-hot-toast';

const TreatmentPlans: React.FC = () => {
  const { user } = useAuth();
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadTreatmentPlans();
    }
  }, [user?.id]);

  const loadTreatmentPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTreatmentPlans(data || []);
      
      // Set the first active plan as the current active plan
      const active = (data || []).find(plan => plan.status === 'active');
      if (active) {
        setActivePlan(active);
      }
    } catch (error) {
      console.error('Error loading treatment plans:', error);
      toast.error('Failed to load treatment plans');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlanStatus = async (planId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('treatment_plans')
        .update({ 
          status,
          ...(status === 'active' ? { started_at: new Date().toISOString() } : {}),
          ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {})
        })
        .eq('id', planId);

      if (error) throw error;

      await loadTreatmentPlans();
      toast.success(`Treatment plan ${status}`);
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Failed to update treatment plan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-300';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'paused': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'completed': return CheckCircle;
      case 'paused': return Pause;
      default: return AlertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-medical-primary" />
          <p className="text-gray-600">Loading treatment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Treatment Plans</h1>
        <p className="text-gray-600">Manage your personalized treatment plans and track your progress towards better health.</p>
      </motion.div>

      {treatmentPlans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-12"
        >
          <Pill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Treatment Plans Yet</h3>
          <p className="text-gray-600 mb-6">Start a consultation or photo diagnosis to get your personalized treatment plan.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all duration-200">
              Start Consultation
            </button>
            <button className="bg-white border-2 border-medical-primary/30 text-gray-800 py-2 px-4 rounded-xl font-medium hover:bg-medical-primary/5 transition-colors">
              Photo Diagnosis
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Treatment Plans List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Plans</h2>
            {treatmentPlans.map((plan, index) => {
              const StatusIcon = getStatusIcon(plan.status);
              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlan(plan)}
                  className={`backdrop-blur-md bg-glass-white rounded-2xl border-2 shadow-medical p-4 cursor-pointer transition-all duration-200 ${
                    activePlan?.id === plan.id 
                      ? 'border-medical-primary/50 shadow-green-glow' 
                      : 'border-medical-primary/20 hover:border-medical-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">Treatment Plan #{index + 1}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(plan.status)}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Created: {formatDate(plan.created_at)}
                  </p>
                  {plan.started_at && (
                    <p className="text-sm text-gray-600">
                      Started: {formatDate(plan.started_at)}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Active Plan Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {activePlan ? (
              <div className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Active Treatment Plan</h2>
                  <div className="flex space-x-2">
                    {activePlan.status === 'draft' && (
                      <button
                        onClick={() => updatePlanStatus(activePlan.id, 'active')}
                        className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all duration-200 flex items-center"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Plan
                      </button>
                    )}
                    {activePlan.status === 'active' && (
                      <>
                        <button
                          onClick={() => updatePlanStatus(activePlan.id, 'paused')}
                          className="bg-yellow-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </button>
                        <button
                          onClick={() => updatePlanStatus(activePlan.id, 'completed')}
                          className="bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </button>
                      </>
                    )}
                    {activePlan.status === 'paused' && (
                      <button
                        onClick={() => updatePlanStatus(activePlan.id, 'active')}
                        className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all duration-200 flex items-center"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </button>
                    )}
                  </div>
                </div>

                {/* Lifecycle Phases */}
                {activePlan.lifecycle_phases && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-medical-primary" />
                      Treatment Phases
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(activePlan.lifecycle_phases).map(([phase, description], index) => (
                        <div key={phase} className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-300">
                          <h4 className="font-medium text-gray-800 mb-2">Phase {index + 1}</h4>
                          <p className="text-sm text-gray-700">{description as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Natural Remedies */}
                {activePlan.natural_remedies && activePlan.natural_remedies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-600" />
                      Natural Remedies
                    </h3>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
                      <ul className="space-y-2">
                        {activePlan.natural_remedies.map((remedy: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {remedy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommended Foods */}
                {activePlan.recommended_foods && activePlan.recommended_foods.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Apple className="h-5 w-5 mr-2 text-orange-600" />
                      Recommended Foods
                    </h3>
                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 border-2 border-orange-300">
                      <ul className="space-y-2">
                        {activePlan.recommended_foods.map((food: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Medications */}
                {activePlan.medications && activePlan.medications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Pill className="h-5 w-5 mr-2 text-purple-600" />
                      Medications
                    </h3>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300">
                      <ul className="space-y-2">
                        {activePlan.medications.map((medication: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {medication}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Exercises */}
                {activePlan.exercises && activePlan.exercises.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-cyan-600" />
                      Recommended Exercises
                    </h3>
                    <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-4 border-2 border-cyan-300">
                      <ul className="space-y-2">
                        {activePlan.exercises.map((exercise: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Daily Schedule */}
                {activePlan.daily_schedule && activePlan.daily_schedule.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                      Daily Schedule
                    </h3>
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 border-2 border-indigo-300">
                      <div className="space-y-3">
                        {activePlan.daily_schedule.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center">
                              <span className="font-mono text-sm font-medium text-indigo-700 mr-3">
                                {item.time}
                              </span>
                              <span className="text-sm text-gray-700">{item.activity}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === 'medication' ? 'bg-purple-100 text-purple-700' :
                              item.type === 'nutrition' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Prevention Tips */}
                {activePlan.prevention_tips && activePlan.prevention_tips.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                      Prevention Tips
                    </h3>
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl p-4 border-2 border-emerald-300">
                      <ul className="space-y-2">
                        {activePlan.prevention_tips.map((tip: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-4 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Recommended Items
                  </button>
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6 text-center">
                <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Treatment Plan</h3>
                <p className="text-gray-600">Choose a treatment plan from the list to view its details and manage your progress.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={[
          ...(activePlan?.natural_remedies || []),
          ...(activePlan?.recommended_foods || []),
          ...(activePlan?.medications || [])
        ]}
      />
    </div>
  );
};

export default TreatmentPlans;