import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Loader, AlertCircle } from 'lucide-react';
import { tavusService } from '../services/tavusService';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  icon: string;
  tavus_replica_id: string;
  tavus_persona_id: string;
  is_premium: boolean;
}

interface TavusAvatarProps {
  doctor: Doctor;
  symptoms?: string;
  onConversationStart?: (conversationId: string) => void;
  onConversationEnd?: () => void;
  className?: string;
}

const TavusAvatar: React.FC<TavusAvatarProps> = ({
  doctor,
  symptoms,
  onConversationStart,
  onConversationEnd,
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const startConversation = async () => {
    if (!tavusService.isConfigured()) {
      setError('Tavus API key not configured. Please check your settings.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const conversation = await tavusService.startConsultation(
        doctor.tavus_replica_id,
        doctor.tavus_persona_id
      );

      setConversationId(conversation.conversation_id);
      setIsConnected(true);
      setSessionDuration(0);
      
      if (onConversationStart) {
        onConversationStart(conversation.conversation_id);
      }

      // Initialize video stream if available
      if (conversation.video_url && videoRef.current) {
        videoRef.current.src = conversation.video_url;
      }
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      setError(error.message || 'Failed to start conversation');
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    if (!conversationId) return;

    setIsConnecting(true);
    try {
      await tavusService.endConsultation(conversationId);
      setIsConnected(false);
      setConversationId(null);
      setSessionDuration(0);
      
      if (onConversationEnd) {
        onConversationEnd();
      }
    } catch (error: any) {
      console.error('Failed to end conversation:', error);
      setError(error.message || 'Failed to end conversation');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`backdrop-blur-md bg-glass-white rounded-2xl border-2 border-medical-primary/20 shadow-medical ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{doctor.icon}</div>
            <div>
              <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
              <p className="text-sm text-medical-primary">{doctor.specialty}</p>
            </div>
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-mono">{formatTime(sessionDuration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="relative aspect-video bg-gray-900 rounded-b-2xl overflow-hidden">
        {!isConnected && !isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-gradient-to-br from-medical-primary to-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{doctor.icon}</span>
              </div>
              <h4 className="text-lg font-medium mb-2">{doctor.name}</h4>
              <p className="text-sm opacity-75 mb-4">{doctor.description}</p>
              
              {symptoms && (
                <div className="bg-black/30 rounded-lg p-3 mb-4 text-left max-w-sm">
                  <p className="text-xs opacity-75 mb-1">Your symptoms:</p>
                  <p className="text-sm">{symptoms.substring(0, 100)}...</p>
                </div>
              )}
              
              <button
                onClick={startConversation}
                disabled={isConnecting}
                className="bg-gradient-to-r from-medical-primary to-medical-secondary text-white px-6 py-2 rounded-lg font-medium hover:shadow-green-glow transition-all duration-200 flex items-center mx-auto"
              >
                {isConnecting ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Phone className="h-4 w-4 mr-2" />
                )}
                {isConnecting ? 'Connecting...' : 'Start Consultation'}
              </button>
            </div>
          </div>
        )}

        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Connecting to {doctor.name}...</p>
              <p className="text-sm opacity-75">Please wait while we establish the connection</p>
            </div>
          </div>
        )}

        {isConnected && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              style={{ display: isVideoEnabled ? 'block' : 'none' }}
            />
            
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <VideoOff className="h-12 w-12 mx-auto mb-2" />
                  <p>Video disabled</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                } text-white`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                } text-white`}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
              
              <button
                onClick={endConversation}
                disabled={isConnecting}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavusAvatar;