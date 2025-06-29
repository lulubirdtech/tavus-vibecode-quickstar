import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Brain, 
  Thermometer,
  Droplets,
  Zap,
  Clock,
  MapPin,
  User,
  Activity,
  Shield,
  Eye,
  Stethoscope,
  Pill,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

const EmergencyGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance' },
    { name: 'Poison Control', number: '1-800-222-1222', description: 'Poisoning emergencies' },
    { name: 'Crisis Hotline', number: '988', description: 'Mental health crisis' },
    { name: 'Local Hospital', number: '+234 905 555 7312', description: 'Nearest emergency room' }
  ];

  const emergencyConditions = [
    {
      id: 'heart-attack',
      title: 'Heart Attack',
      icon: Heart,
      severity: 'critical',
      symptoms: [
        'Chest pain or pressure',
        'Pain radiating to arm, jaw, or back',
        'Shortness of breath',
        'Nausea or vomiting',
        'Cold sweats',
        'Lightheadedness'
      ],
      immediateActions: [
        'Call 911 immediately',
        'Chew aspirin if not allergic (325mg)',
        'Sit upright and stay calm',
        'Loosen tight clothing',
        'Do not drive yourself to hospital'
      ],
      doNots: [
        'Do not ignore symptoms',
        'Do not wait to see if symptoms improve',
        'Do not take nitroglycerin unless prescribed'
      ]
    },
    {
      id: 'stroke',
      title: 'Stroke (FAST Test)',
      icon: Brain,
      severity: 'critical',
      symptoms: [
        'Face drooping (smile is uneven)',
        'Arm weakness (cannot raise both arms)',
        'Speech difficulty (slurred or strange)',
        'Time to call emergency services'
      ],
      immediateActions: [
        'Call 911 immediately',
        'Note the time symptoms started',
        'Keep person calm and lying down',
        'Do not give food or water',
        'Monitor breathing and pulse'
      ],
      doNots: [
        'Do not give aspirin',
        'Do not let person drive',
        'Do not wait for symptoms to improve'
      ]
    },
    {
      id: 'severe-allergic-reaction',
      title: 'Severe Allergic Reaction (Anaphylaxis)',
      icon: AlertTriangle,
      severity: 'critical',
      symptoms: [
        'Difficulty breathing',
        'Swelling of face, lips, tongue',
        'Rapid pulse',
        'Dizziness or fainting',
        'Severe whole-body reaction',
        'Nausea and vomiting'
      ],
      immediateActions: [
        'Call 911 immediately',
        'Use epinephrine auto-injector if available',
        'Have person lie flat with legs elevated',
        'Remove or avoid allergen',
        'Monitor breathing closely'
      ],
      doNots: [
        'Do not assume symptoms will stop',
        'Do not give oral medications',
        'Do not leave person alone'
      ]
    },
    {
      id: 'choking',
      title: 'Choking',
      icon: Thermometer,
      severity: 'critical',
      symptoms: [
        'Cannot speak or breathe',
        'Clutching throat',
        'Blue lips or face',
        'Weak cough',
        'High-pitched sounds when breathing'
      ],
      immediateActions: [
        'Encourage coughing if possible',
        'Perform Heimlich maneuver',
        'Call 911 if object not dislodged',
        'Continue back blows and chest thrusts',
        'Be ready to perform CPR'
      ],
      doNots: [
        'Do not hit back if person can cough',
        'Do not use fingers to remove object',
        'Do not give water'
      ]
    },
    {
      id: 'severe-bleeding',
      title: 'Severe Bleeding',
      icon: Droplets,
      severity: 'urgent',
      symptoms: [
        'Blood spurting from wound',
        'Blood soaking through bandages',
        'Signs of shock',
        'Weakness or dizziness',
        'Rapid heartbeat'
      ],
      immediateActions: [
        'Apply direct pressure to wound',
        'Elevate injured area above heart',
        'Use clean cloth or bandage',
        'Call 911 for severe bleeding',
        'Apply pressure to pressure points if needed'
      ],
      doNots: [
        'Do not remove embedded objects',
        'Do not peek at wound frequently',
        'Do not use tourniquet unless trained'
      ]
    },
    {
      id: 'burns',
      title: 'Severe Burns',
      icon: Zap,
      severity: 'urgent',
      symptoms: [
        'Burns larger than palm size',
        'Burns on face, hands, feet, genitals',
        'Third-degree burns (white/charred)',
        'Chemical or electrical burns',
        'Signs of infection'
      ],
      immediateActions: [
        'Cool burn with cool water (10-20 minutes)',
        'Remove from heat source',
        'Cover with sterile gauze',
        'Call 911 for severe burns',
        'Monitor for shock'
      ],
      doNots: [
        'Do not use ice',
        'Do not break blisters',
        'Do not apply butter or oils'
      ]
    }
  ];

  const firstAidBasics = [
    {
      title: 'CPR Steps',
      steps: [
        'Check responsiveness and breathing',
        'Call 911 and get AED if available',
        'Place hands on center of chest',
        'Push hard and fast at least 2 inches deep',
        'Allow complete chest recoil',
        'Give 30 compressions, then 2 rescue breaths',
        'Continue until help arrives'
      ]
    },
    {
      title: 'Recovery Position',
      steps: [
        'Kneel beside the person',
        'Place arm nearest you at right angle',
        'Bring far arm across chest',
        'Bend far leg at knee',
        'Roll person toward you',
        'Tilt head back to open airway',
        'Monitor breathing continuously'
      ]
    }
  ];

  const filteredConditions = emergencyConditions.filter(condition =>
    condition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.symptoms.some(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'urgent': return 'from-orange-500 to-orange-600';
      case 'moderate': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-300';
      case 'urgent': return 'border-orange-300';
      case 'moderate': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Medical Guide</h1>
        <p className="text-gray-600">Quick reference for medical emergencies and first aid procedures. In case of emergency, always call 911 first.</p>
      </motion.div>

      {/* Emergency Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-red-100 to-red-50 rounded-2xl border-2 border-red-300 shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-red-800">Emergency Alert</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white/70 rounded-xl p-4 border border-red-200">
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-800">{contact.name}</h3>
              </div>
              <p className="text-2xl font-bold text-red-700 mb-1">{contact.number}</p>
              <p className="text-sm text-red-600">{contact.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search emergency conditions or symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800 placeholder:text-gray-500"
          />
        </div>
      </motion.div>

      {/* Emergency Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredConditions.map((condition, index) => (
          <motion.div
            key={condition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className={`backdrop-blur-md bg-glass-white rounded-2xl border-2 ${getSeverityBorder(condition.severity)} shadow-medical p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getSeverityColor(condition.severity)} mr-3`}>
                  <condition.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{condition.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    condition.severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-300' :
                    condition.severity === 'urgent' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                    'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  }`}>
                    {condition.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExpandedSection(expandedSection === condition.id ? null : condition.id)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {expandedSection === condition.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Symptoms Preview */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <Eye className="h-4 w-4 mr-2 text-medical-primary" />
                Key Symptoms
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {condition.symptoms.slice(0, 3).map((symptom, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {symptom}
                  </div>
                ))}
                {condition.symptoms.length > 3 && (
                  <p className="text-sm text-gray-500 mt-1">
                    +{condition.symptoms.length - 3} more symptoms
                  </p>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedSection === condition.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* All Symptoms */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-red-600" />
                    All Symptoms
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {condition.symptoms.map((symptom, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {symptom}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Immediate Actions */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-600" />
                    Immediate Actions
                  </h4>
                  <div className="space-y-2">
                    {condition.immediateActions.map((action, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Do NOTs */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                    Do NOT Do
                  </h4>
                  <div className="space-y-2">
                    {condition.doNots.map((dont, idx) => (
                      <div key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {dont}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* First Aid Basics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Stethoscope className="h-6 w-6 mr-3 text-medical-primary" />
          Essential First Aid Procedures
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {firstAidBasics.map((procedure, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-blue-600" />
                {procedure.title}
              </h3>
              <div className="space-y-3">
                {procedure.steps.map((step, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Important Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 shadow-lg p-6"
      >
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700 leading-relaxed">
              This emergency guide is for informational purposes only and should not replace professional medical training or emergency services. 
              Always call 911 or your local emergency number first in any life-threatening situation. Consider taking a certified first aid and CPR course 
              for proper hands-on training. When in doubt, seek immediate professional medical assistance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyGuide;