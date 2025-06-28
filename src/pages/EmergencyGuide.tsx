import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Heart, Thermometer, Zap, Clock, MapPin, User, Activity, Stethoscope, Eye, Brain, Settings as Lungs, Shield, Info, ChevronDown, ChevronUp } from 'lucide-react';

const EmergencyGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const emergencyNumbers = [
    { country: 'Nigeria', number: '199', service: 'Emergency Services' },
    { country: 'Nigeria', number: '112', service: 'Universal Emergency' },
    { country: 'Nigeria', number: '767', service: 'Police Emergency' },
    { country: 'USA', number: '911', service: 'Emergency Services' },
    { country: 'UK', number: '999', service: 'Emergency Services' },
    { country: 'EU', number: '112', service: 'European Emergency' }
  ];

  const criticalSymptoms = [
    {
      id: 'chest-pain',
      title: 'Chest Pain',
      icon: Heart,
      severity: 'critical',
      symptoms: [
        'Severe chest pain or pressure',
        'Pain radiating to arm, jaw, or back',
        'Shortness of breath',
        'Sweating, nausea, or dizziness'
      ],
      action: 'Call emergency services immediately. This could be a heart attack.',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'breathing',
      title: 'Difficulty Breathing',
      icon: Lungs,
      severity: 'critical',
      symptoms: [
        'Severe shortness of breath',
        'Cannot speak in full sentences',
        'Blue lips or fingernails',
        'Wheezing or gasping'
      ],
      action: 'Seek immediate medical attention. This could be a respiratory emergency.',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'stroke',
      title: 'Signs of Stroke',
      icon: Brain,
      severity: 'critical',
      symptoms: [
        'Sudden face drooping',
        'Arm weakness or numbness',
        'Speech difficulty or slurring',
        'Sudden severe headache'
      ],
      action: 'Call emergency services immediately. Time is critical for stroke treatment.',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'severe-bleeding',
      title: 'Severe Bleeding',
      icon: Activity,
      severity: 'critical',
      symptoms: [
        'Heavy bleeding that won\'t stop',
        'Blood spurting from wound',
        'Signs of shock (pale, weak, dizzy)',
        'Large or deep wounds'
      ],
      action: 'Apply direct pressure and call emergency services immediately.',
      color: 'from-red-500 to-red-600'
    }
  ];

  const urgentSymptoms = [
    {
      id: 'high-fever',
      title: 'High Fever',
      icon: Thermometer,
      severity: 'urgent',
      symptoms: [
        'Fever above 103°F (39.4°C)',
        'Fever with severe headache',
        'Fever with stiff neck',
        'Fever with confusion'
      ],
      action: 'Seek medical attention within 2-4 hours.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'severe-pain',
      title: 'Severe Abdominal Pain',
      icon: Activity,
      severity: 'urgent',
      symptoms: [
        'Sudden, severe abdominal pain',
        'Pain with vomiting',
        'Rigid or tender abdomen',
        'Pain that worsens with movement'
      ],
      action: 'Seek medical attention promptly. Could indicate serious condition.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'head-injury',
      title: 'Head Injury',
      icon: Brain,
      severity: 'urgent',
      symptoms: [
        'Loss of consciousness',
        'Persistent vomiting',
        'Severe headache',
        'Confusion or memory loss'
      ],
      action: 'Seek immediate medical evaluation.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const firstAidSteps = [
    {
      title: 'Check Responsiveness',
      steps: [
        'Tap shoulders and shout "Are you okay?"',
        'Check for normal breathing',
        'Look for signs of life',
        'Call for help if unresponsive'
      ]
    },
    {
      title: 'Control Bleeding',
      steps: [
        'Apply direct pressure with clean cloth',
        'Elevate the injured area if possible',
        'Do not remove embedded objects',
        'Apply pressure around the object'
      ]
    },
    {
      title: 'CPR Basics',
      steps: [
        'Place heel of hand on center of chest',
        'Push hard and fast at least 2 inches deep',
        'Allow complete chest recoil',
        'Give 30 compressions, then 2 rescue breaths'
      ]
    },
    {
      title: 'Choking Response',
      steps: [
        'Encourage coughing if person can speak',
        'Give 5 back blows between shoulder blades',
        'Give 5 abdominal thrusts (Heimlich)',
        'Alternate back blows and abdominal thrusts'
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'urgent': return 'border-orange-500 bg-orange-50';
      default: return 'border-yellow-500 bg-yellow-50';
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
        <p className="text-gray-600">Quick reference for medical emergencies and first aid procedures. In case of emergency, always call professional medical services first.</p>
      </motion.div>

      {/* Emergency Numbers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="backdrop-blur-md bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border-2 border-red-300 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Phone className="h-5 w-5 mr-2 text-red-600" />
          Emergency Contact Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyNumbers.map((contact, index) => (
            <div key={index} className="bg-white/70 rounded-xl p-4 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{contact.country}</h3>
                  <p className="text-sm text-gray-600">{contact.service}</p>
                </div>
                <div className="text-2xl font-bold text-red-600">{contact.number}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Critical Symptoms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Critical Emergency Symptoms
        </h2>
        <p className="text-sm text-gray-600 mb-4">These symptoms require immediate emergency medical attention. Call emergency services immediately.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalSymptoms.map((symptom) => (
            <div key={symptom.id} className={`rounded-xl p-4 border-2 ${getSeverityColor(symptom.severity)}`}>
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${symptom.color}`}>
                  <symptom.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 ml-3">{symptom.title}</h3>
              </div>
              
              <div className="space-y-2 mb-3">
                {symptom.symptoms.map((s, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {s}
                  </div>
                ))}
              </div>
              
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800">{symptom.action}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Urgent Symptoms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Urgent Medical Symptoms
        </h2>
        <p className="text-sm text-gray-600 mb-4">These symptoms require prompt medical attention within a few hours.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urgentSymptoms.map((symptom) => (
            <div key={symptom.id} className={`rounded-xl p-4 border-2 ${getSeverityColor(symptom.severity)}`}>
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${symptom.color}`}>
                  <symptom.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 ml-3">{symptom.title}</h3>
              </div>
              
              <div className="space-y-2 mb-3">
                {symptom.symptoms.map((s, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {s}
                  </div>
                ))}
              </div>
              
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                <p className="text-sm font-medium text-orange-800">{symptom.action}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* First Aid Procedures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-medical-primary" />
          Basic First Aid Procedures
        </h2>
        
        <div className="space-y-4">
          {firstAidSteps.map((procedure, index) => (
            <div key={index} className="bg-white/50 rounded-xl border-2 border-white/30">
              <button
                onClick={() => toggleSection(`procedure-${index}`)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-white/70 transition-colors rounded-xl"
              >
                <h3 className="font-semibold text-gray-800">{procedure.title}</h3>
                {expandedSection === `procedure-${index}` ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              {expandedSection === `procedure-${index}` && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    {procedure.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start">
                        <div className="w-6 h-6 bg-medical-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Important Disclaimers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="backdrop-blur-md bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 shadow-medical p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-yellow-600" />
          Important Disclaimers
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>This guide is for informational purposes only.</strong> It does not replace professional medical training or emergency medical services.
            </p>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>Always call emergency services first</strong> in life-threatening situations before attempting any first aid procedures.
            </p>
          </div>
          
          <div className="flex items-start">
            <Stethoscope className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>Get proper first aid training</strong> from certified organizations like the Red Cross or local emergency services.
            </p>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <strong>Know your local emergency numbers</strong> and the location of the nearest hospital or emergency room.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyGuide;