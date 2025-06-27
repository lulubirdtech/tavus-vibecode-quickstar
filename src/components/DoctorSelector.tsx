import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown, Lock } from 'lucide-react';

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

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  defaultSpecialty?: string;
  className?: string;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctor,
  onDoctorSelect,
  defaultSpecialty = 'General Physician',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter doctors to show default specialty first
  const defaultDoctor = doctors.find(d => d.specialty === defaultSpecialty);
  const otherDoctors = doctors.filter(d => d.specialty !== defaultSpecialty);

  // Set default doctor if none selected
  React.useEffect(() => {
    if (!selectedDoctor && defaultDoctor) {
      onDoctorSelect(defaultDoctor);
    }
  }, [defaultDoctor, selectedDoctor, onDoctorSelect]);

  const handleDoctorSelect = (doctor: Doctor) => {
    onDoctorSelect(doctor);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Doctor Display */}
      <div className="backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedDoctor?.icon || '👨‍⚕️'}</div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {selectedDoctor?.name || 'Select a Doctor'}
              </h3>
              <p className="text-sm text-medical-primary">
                {selectedDoctor?.specialty || 'Choose your specialist'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedDoctor?.is_premium && (
              <div className="flex items-center text-yellow-600">
                <Crown className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Premium</span>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {selectedDoctor && (
          <p className="text-xs text-gray-600 mt-2">{selectedDoctor.description}</p>
        )}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="backdrop-blur-md bg-white rounded-2xl border-2 border-medical-primary/20 shadow-medical overflow-hidden">
              {/* Default Doctor */}
              {defaultDoctor && (
                <div>
                  <div className="px-4 py-2 bg-medical-light/20 border-b border-medical-primary/10">
                    <span className="text-xs font-medium text-medical-primary">Recommended</span>
                  </div>
                  <button
                    onClick={() => handleDoctorSelect(defaultDoctor)}
                    className={`w-full p-4 text-left hover:bg-medical-light/20 transition-colors border-b border-gray-100 ${
                      selectedDoctor?.id === defaultDoctor.id ? 'bg-medical-light/30' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{defaultDoctor.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{defaultDoctor.name}</h4>
                          <div className="flex items-center space-x-1">
                            {!defaultDoctor.is_available && (
                              <Lock className="h-3 w-3 text-gray-400" />
                            )}
                            {defaultDoctor.is_premium && (
                              <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-medical-primary">{defaultDoctor.specialty}</p>
                        <p className="text-xs text-gray-600 mt-1">{defaultDoctor.description}</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Other Doctors */}
              {otherDoctors.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-600">Other Specialists</span>
                  </div>
                  {otherDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      disabled={!doctor.is_available}
                      className={`w-full p-4 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                        doctor.is_available 
                          ? 'hover:bg-gray-50' 
                          : 'opacity-60 cursor-not-allowed'
                      } ${
                        selectedDoctor?.id === doctor.id ? 'bg-medical-light/30' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{doctor.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                            <div className="flex items-center space-x-1">
                              {!doctor.is_available && (
                                <div className="flex items-center text-gray-500">
                                  <Lock className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Premium</span>
                                </div>
                              )}
                              {doctor.is_premium && doctor.is_available && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-medical-primary">{doctor.specialty}</p>
                          <p className="text-xs text-gray-600 mt-1">{doctor.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorSelector;