import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Camera, 
  Pill, 
  BookOpen, 
  AlertTriangle, 
  CreditCard, 
  Settings,
  Stethoscope
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Start Consultation', href: '/consultation', icon: MessageSquare },
    { name: 'Photo Diagnosis', href: '/photo-diagnosis', icon: Camera },
    { name: 'Treatment Plans', href: '/treatments', icon: Pill },
    { name: 'Health Education', href: '/education', icon: BookOpen },
    { name: 'Emergency Guide', href: '/emergency', icon: AlertTriangle },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MedAssist</h1>
            <p className="text-xs text-gray-500">AI Health Platform</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;