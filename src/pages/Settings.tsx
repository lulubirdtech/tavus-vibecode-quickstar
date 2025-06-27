import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Monitor,
  Save,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Lock,
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    newAnalysis: true,
    criticalFindings: true,
    reportUpdates: false,
    voiceAlerts: true
  });
  const [aiSettings, setAiSettings] = useState({
    defaultModel: 'general-practitioner',
    sensitivity: 'standard',
    apiProvider: 'gemini'
  });
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    zoomLevel: 'fit',
    preset: 'standard'
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
    deviceTrust: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'ai', name: 'AI Settings', icon: Database },
    { id: 'display', name: 'Display', icon: Monitor },
  ];

  const roles = ['Patient', 'Nurse', 'Doctor', 'Admin'];
  
  const aiModels = [
    { id: 'general-practitioner', name: 'General Practitioner Agent (Default)', description: 'Handles all diagnosis & treatment' },
    { id: 'general-imaging', name: 'General Medical Imaging v2.1', description: 'Multi-purpose medical imaging' },
    { id: 'cardiac-ct', name: 'Cardiac CT Specialist v2.5', description: 'Specialized for cardiac imaging' },
    { id: 'chest-xray', name: 'Chest X-Ray Specialist v1.8', description: 'Optimized for chest radiographs' },
    { id: 'brain-mri', name: 'Brain MRI Analyzer v3.0', description: 'Advanced brain imaging analysis' }
  ];

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityToggle = (key: string) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveApiKey = (provider: string, key: string) => {
    if (key.trim()) {
      localStorage.setItem(`${provider}_api_key`, key.trim());
      // Set this provider as the active AI provider
      localStorage.setItem('ai_provider', provider);
      // Update the current state to reflect the change
      setAiSettings(prev => ({ ...prev, apiProvider: provider }));
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} API key saved successfully!`);
    }
  };

  const handleProviderChange = (provider: string) => {
    setAiSettings(prev => ({ ...prev, apiProvider: provider }));
    // Save the provider preference to localStorage
    localStorage.setItem('ai_provider', provider);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and system configuration.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-64 backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-medical-primary to-medical-secondary text-white shadow-green-glow'
                    : 'text-gray-700 hover:bg-white/50 hover:text-medical-primary border border-transparent hover:border-white/30'
                }`}
              >
                <tab.icon className={`mr-3 h-4 w-4 ${
                  activeTab === tab.id ? 'text-white' : 'text-medical-primary'
                }`} />
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical p-6"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Dr. Sarah Johnson"
                    className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="sarah.johnson@hospital.com"
                    className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800">
                    {roles.map(role => (
                      <option key={role} value={role.toLowerCase()} className="text-gray-800">{role}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800">
                    <option className="text-gray-800">Community Health</option>
                    <option className="text-gray-800">Radiology</option>
                    <option className="text-gray-800">Cardiology</option>
                    <option className="text-gray-800">Emergency Medicine</option>
                  </select>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-3 px-6 rounded-xl font-medium hover:shadow-green-glow transform hover:scale-[1.02] transition-all duration-200 flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">New Analysis Results</h3>
                      <p className="text-sm text-gray-600">Get notified when AI analysis is completed</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.newAnalysis}
                      onChange={() => handleNotificationToggle('newAnalysis')}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium text-gray-800 flex items-center">
                        Critical Findings
                        {notifications.voiceAlerts ? (
                          <Volume2 className="h-4 w-4 ml-2 text-medical-primary" />
                        ) : (
                          <VolumeX className="h-4 w-4 ml-2 text-gray-400" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">Immediate alerts for urgent findings with voice alerts</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.criticalFindings}
                      onChange={() => handleNotificationToggle('criticalFindings')}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <div>
                    <h3 className="font-medium text-gray-800">Report Updates</h3>
                    <p className="text-sm text-gray-600">Notifications when reports are reviewed or finalized</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.reportUpdates}
                      onChange={() => handleNotificationToggle('reportUpdates')}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <div>
                    <h3 className="font-medium text-gray-800">Voice Alerts</h3>
                    <p className="text-sm text-gray-600">Enable text-to-speech for medication reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.voiceAlerts}
                      onChange={() => handleNotificationToggle('voiceAlerts')}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Security Settings</h2>
              
              {/* Password Change */}
              <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-medical-primary" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800 pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medical-primary hover:text-medical-secondary"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800 pr-12"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medical-primary hover:text-medical-secondary"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-2 px-4 rounded-xl font-medium hover:shadow-green-glow transition-all duration-200">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800 flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-medical-primary" />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={securitySettings.twoFactorEnabled}
                      onChange={() => handleSecurityToggle('twoFactorEnabled')}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                  </label>
                </div>
                {securitySettings.twoFactorEnabled && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">Two-factor authentication is enabled</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Session Management */}
              <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                <h3 className="font-medium text-gray-800 mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-medical-primary" />
                  Session Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select 
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                    >
                      <option value="15" className="text-gray-800">15 minutes</option>
                      <option value="30" className="text-gray-800">30 minutes</option>
                      <option value="60" className="text-gray-800">1 hour</option>
                      <option value="120" className="text-gray-800">2 hours</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Login Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securitySettings.loginNotifications}
                        onChange={() => handleSecurityToggle('loginNotifications')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Trusted Devices</h4>
                      <p className="text-sm text-gray-600">Remember this device for 30 days</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={securitySettings.deviceTrust}
                        onChange={() => handleSecurityToggle('deviceTrust')}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-medical-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-medical-primary peer-checked:to-medical-secondary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Alert */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-1">Security Recommendations</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly review your account activity</li>
                      <li>• Keep your contact information updated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">AI Configuration</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <h3 className="font-medium text-gray-800 mb-3">Default AI Model</h3>
                  <div className="space-y-3">
                    {aiModels.map((model) => (
                      <label key={model.id} className="flex items-start cursor-pointer">
                        <input 
                          type="radio" 
                          name="aiModel" 
                          value={model.id}
                          checked={aiSettings.defaultModel === model.id}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
                          className="mt-1 mr-3 text-medical-primary focus:ring-medical-primary" 
                        />
                        <div>
                          <div className="text-sm text-gray-800 font-medium">{model.name}</div>
                          <div className="text-xs text-gray-600">{model.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <h3 className="font-medium text-gray-800 mb-3">Analysis Sensitivity</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'high', name: 'High', desc: 'Detect more findings' },
                      { id: 'standard', name: 'Standard', desc: 'Balanced approach' },
                      { id: 'conservative', name: 'Conservative', desc: 'Fewer findings' }
                    ].map((level) => (
                      <div key={level.id} className="flex items-center">
                        <input 
                          type="radio" 
                          name="sensitivity" 
                          id={level.id}
                          checked={aiSettings.sensitivity === level.id}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, sensitivity: e.target.value }))}
                          className="mr-2 text-medical-primary focus:ring-medical-primary" 
                        />
                        <label htmlFor={level.id} className="text-sm text-gray-800">
                          {level.name} <span className="text-gray-600">({level.desc})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <h3 className="font-medium text-gray-800 mb-3">API Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tavus API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="Enter your Tavus API key"
                          defaultValue={localStorage.getItem('tavus_api_key') || ''}
                          className="w-full p-3 pr-24 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              localStorage.setItem('tavus_api_key', e.target.value.trim());
                              alert('Tavus API key saved successfully!');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-medical-primary hover:text-medical-secondary"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                            if (input?.value.trim()) {
                              localStorage.setItem('tavus_api_key', input.value.trim());
                              alert('Tavus API key saved successfully!');
                            }
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-medical-primary text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        API key for Tavus avatar conversations
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Provider
                      </label>
                      <select 
                        value={aiSettings.apiProvider}
                        onChange={(e) => handleProviderChange(e.target.value)}
                        className="w-full p-3 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                      >
                        <option value="gemini" className="text-gray-800">Gemini API</option>
                        <option value="openai" className="text-gray-800">OpenAI API</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {aiSettings.apiProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          placeholder={`Enter your ${aiSettings.apiProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key`}
                          defaultValue={localStorage.getItem(`${aiSettings.apiProvider}_api_key`) || ''}
                          className="w-full p-3 pr-24 bg-white/70 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-primary/30 focus:border-medical-primary transition-colors text-gray-800"
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              saveApiKey(aiSettings.apiProvider, e.target.value);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-medical-primary hover:text-medical-secondary"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                            if (input?.value.trim()) {
                              saveApiKey(aiSettings.apiProvider, input.value);
                            }
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-medical-primary text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        API key will be stored securely and used for real AI analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Display Preferences</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <h3 className="font-medium text-gray-800 mb-3">Theme</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'light', name: 'Light Theme' },
                      { id: 'dark', name: 'Dark Theme' },
                      { id: 'system', name: 'System Default' }
                    ].map((theme) => (
                      <div key={theme.id} className="flex items-center">
                        <input 
                          type="radio" 
                          name="theme" 
                          id={theme.id}
                          checked={displaySettings.theme === theme.id}
                          onChange={(e) => setDisplaySettings(prev => ({ ...prev, theme: e.target.value }))}
                          className="mr-2 text-medical-primary focus:ring-medical-primary" 
                        />
                        <label htmlFor={theme.id} className="text-sm text-gray-800">{theme.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-white/50 rounded-xl border-2 border-white/30">
                  <h3 className="font-medium text-gray-800 mb-3">Image Viewer Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Default Zoom Level</label>
                      <select 
                        value={displaySettings.zoomLevel}
                        onChange={(e) => setDisplaySettings(prev => ({ ...prev, zoomLevel: e.target.value }))}
                        className="p-2 bg-white/70 border-2 border-white/30 rounded-lg text-sm text-gray-800"
                      >
                        <option value="fit" className="text-gray-800">Fit to Window</option>
                        <option value="100" className="text-gray-800">100%</option>
                        <option value="150" className="text-gray-800">150%</option>
                        <option value="200" className="text-gray-800">200%</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Window/Level Presets</label>
                      <select 
                        value={displaySettings.preset}
                        onChange={(e) => setDisplaySettings(prev => ({ ...prev, preset: e.target.value }))}
                        className="p-2 bg-white/70 border-2 border-white/30 rounded-lg text-sm text-gray-800"
                      >
                        <option value="standard" className="text-gray-800">Standard</option>
                        <option value="chest" className="text-gray-800">Chest</option>
                        <option value="abdomen" className="text-gray-800">Abdomen</option>
                        <option value="brain" className="text-gray-800">Brain</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;