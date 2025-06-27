import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import StartConsultation from './pages/StartConsultation';
import PhotoDiagnosis from './pages/PhotoDiagnosis';
import TreatmentPlans from './pages/TreatmentPlans';
import HealthEducation from './pages/HealthEducation';
import EmergencyGuide from './pages/EmergencyGuide';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-medical-light">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="consultation" element={<StartConsultation />} />
                <Route path="photo-diagnosis" element={<PhotoDiagnosis />} />
                <Route path="treatments" element={<TreatmentPlans />} />
                <Route path="education" element={<HealthEducation />} />
                <Route path="emergency" element={<EmergencyGuide />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;