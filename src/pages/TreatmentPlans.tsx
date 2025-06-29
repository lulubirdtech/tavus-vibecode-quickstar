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
  User,
  Heart,
  Activity,
  Leaf,
  Apple,
  Dumbbell,
  ShoppingCart,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import PurchaseModal from '../components/PurchaseModal';
import toast from 'react-hot-toast';

interface TreatmentPlan {
  id: string;
  diagnosis_id: string;
  plan_data: any;
  lifecycle_phases: any;
  natural_remedies: string[];
  recommended_foods: string[];
  medications: string[];
  exercises: string[];
  daily_schedule: any[];
  prevention_tips: string[];
  status: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

const TreatmentPlans: React.FC = () => {
  const { user } = useAuth();
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      loadTreatmentPlans();
    }
  }, [user?.id]);

  const loadTreatmentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTreatmentPlans(data || []);
      
      // Select the first active plan by default
      const activePlan = (data || []).find(plan => plan.status === 'active');
      if (activePlan) {
        setSelectedPlan(activePlan);
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
      const updates: any = { status };
      
      if (status === 'active') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('treatment_plans')
        .update(updates)
        .eq('id', planId);

      if (error) throw error;
      
      await loadTreatmentPlans();
      toast.success(`Treatment plan ${status}`);
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Failed to update plan status');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'remedies', name: 'Natural Remedies', icon: Leaf },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'exercises', name: 'Exercises', icon: Dumbbell },
    { id: 'schedule', name: 'Daily Schedule', icon: Calendar },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto mb-4"></div>
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
          className="text-center py-12 backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical"
        >
          <Pill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Treatment Plans Yet</h3>
          <p className="text-gray-600 mb-6">Start a consultation or photo diagnosis to get your personalized treatment plan.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all duration-200">
              Start Consultation
            </button>
            <button className="bg-white/70 hover:bg-white/90 border-2 border-medical-primary/30 text-gray-800 py-2 px-4 rounded-xl font-medium transition-colors">
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
            className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Treatment Plans</h2>
            <div className="space-y-3">
              {treatmentPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlan?.id === plan.id
                      ? 'border-medical-primary bg-medical-primary/10'
                      : 'border-white/30 bg-white/50 hover:border-medical-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">
                      {plan.plan_data?.condition || 'Treatment Plan'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
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
              ))}
            </div>
          </motion.div>

          {/* Treatment Plan Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical"
          >
            {selectedPlan ? (
              <div>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedPlan.plan_data?.condition || 'Treatment Plan'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {selectedPlan.status === 'draft' && (
                        <button
                          onClick={() => updatePlanStatus(selectedPlan.id, 'active')}
                          className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-lg font-medium hover:shadow-green-glow transition-all duration-200 flex items-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Plan
                        </button>
                      )}
                      {selectedPlan.status === 'active' && (
                        <>
                          <button
                            onClick={() => updatePlanStatus(selectedPlan.id, 'paused')}
                            className="bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </button>
                          <button
                            onClick={() => updatePlanStatus(selectedPlan.id, 'completed')}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Complete
                          </button>
                        </>
                      )}
                      {selectedPlan.status === 'paused' && (
                        <button
                          onClick={() => updatePlanStatus(selectedPlan.id, 'active')}
                          className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-lg font-medium hover:shadow-green-glow transition-all duration-200 flex items-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </button>
                      )}
                      <button
                        onClick={() => setShowPurchaseModal(true)}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Items
                      </button>
                    </div>
                  </div>

                  {/* Lifecycle Phases */}
                  {selectedPlan.lifecycle_phases && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                        <h4 className="font-medium text-blue-800 mb-1">Phase 1</h4>
                        <p className="text-sm text-blue-700">{selectedPlan.lifecycle_phases.phase1}</p>
                      </div>
                      <div className="bg-purple-100 rounded-lg p-3 border border-purple-300">
                        <h4 className="font-medium text-purple-800 mb-1">Phase 2</h4>
                        <p className="text-sm text-purple-700">{selectedPlan.lifecycle_phases.phase2}</p>
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                        <h4 className="font-medium text-green-800 mb-1">Phase 3</h4>
                        <p className="text-sm text-green-700">{selectedPlan.lifecycle_phases.phase3}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-medical-primary text-medical-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-800">{selectedPlan.natural_remedies?.length || 0}</p>
                          <p className="text-xs text-gray-600">Natural Remedies</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <Apple className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-800">{selectedPlan.recommended_foods?.length || 0}</p>
                          <p className="text-xs text-gray-600">Recommended Foods</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <Pill className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-800">{selectedPlan.medications?.length || 0}</p>
                          <p className="text-xs text-gray-600">Medications</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Dumbbell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-800">{selectedPlan.exercises?.length || 0}</p>
                          <p className="text-xs text-gray-600">Exercises</p>
                        </div>
                      </div>
                      
                      {selectedPlan.plan_data?.description && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">Treatment Overview</h4>
                          <p className="text-sm text-gray-700">{selectedPlan.plan_data.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'remedies' && (
                    <div className="space-y-3">
                      {selectedPlan.natural_remedies?.length > 0 ? (
                        selectedPlan.natural_remedies.map((remedy, index) => (
                          <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                            <Leaf className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                            <p className="text-sm text-gray-700">{remedy}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No natural remedies specified</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'nutrition' && (
                    <div className="space-y-3">
                      {selectedPlan.recommended_foods?.length > 0 ? (
                        selectedPlan.recommended_foods.map((food, index) => (
                          <div key={index} className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <Apple className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                            <p className="text-sm text-gray-700">{food}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No food recommendations specified</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'medications' && (
                    <div className="space-y-3">
                      {selectedPlan.medications?.length > 0 ? (
                        selectedPlan.medications.map((medication, index) => (
                          <div key={index} className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <Pill className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                            <p className="text-sm text-gray-700">{medication}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No medications specified</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'exercises' && (
                    <div className="space-y-3">
                      {selectedPlan.exercises?.length > 0 ? (
                        selectedPlan.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Dumbbell className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                            <p className="text-sm text-gray-700">{exercise}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No exercises specified</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'schedule' && (
                    <div className="space-y-3">
                      {selectedPlan.daily_schedule?.length > 0 ? (
                        selectedPlan.daily_schedule.map((item, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="h-5 w-5 text-gray-600 mr-3" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">{item.time}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.type === 'medication' ? 'bg-purple-100 text-purple-700' :
                                  item.type === 'nutrition' ? 'bg-orange-100 text-orange-700' :
                                  item.type === 'exercise' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{item.activity}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No daily schedule specified</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Pill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Treatment Plan</h3>
                <p className="text-gray-600">Choose a treatment plan from the list to view details and manage your progress.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <PurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        recommendedItems={[
          ...(selectedPlan?.natural_remedies || []),
          ...(selectedPlan?.recommended_foods || []),
          ...(selectedPlan?.medications || [])
        ]}
      />
    </div>
  );
};

export default TreatmentPlans;