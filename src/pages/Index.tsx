import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Chatbot from '@/components/Chatbot';
import WorkplaceAssistant from '@/components/modules/WorkplaceAssistant';
import SmartNavigation from '@/components/modules/SmartNavigation';
import CommunicationHub from '@/components/modules/CommunicationHub';
import FocusComfort from '@/components/modules/FocusComfort';
import BuddyAssist from '@/components/modules/BuddyAssist';
import SocialCircle from '@/components/modules/SocialCircle';
import ErgonomicCoach from '@/components/modules/ErgonomicCoach';
import CareerTracker from '@/components/modules/CareerTracker';
import FeedbackApp from '@/components/modules/FeedbackApp';
import Translator from '@/components/modules/Translator';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onModuleChange={setActiveModule} />;
      case 'workplace-assistant':
        return <WorkplaceAssistant onModuleChange={setActiveModule} />;
      case 'smart-navigation':
        return <SmartNavigation />;
      case 'communication-hub':
        return <CommunicationHub />;
      case 'focus-comfort':
        return <FocusComfort />;
      case 'ergonomic-coach':
        return <ErgonomicCoach />;
      case 'buddy-assist':
        return <BuddyAssist />;
      case 'career-tracker':
        return <CareerTracker />;
      case 'feedback-app':
        return <FeedbackApp />;
      case 'social-circle':
        return <SocialCircle />;
      case 'translator':
        return <Translator />;
      default:
        return <Dashboard onModuleChange={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <main className="flex-1 lg:ml-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-16 lg:pt-8">
            <div className="animate-fade-in">
              {renderActiveModule()}
            </div>
          </div>
        </div>
      </main>
      
      {/* Global Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;
