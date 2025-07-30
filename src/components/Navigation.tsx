import React, { useState } from 'react';
import { Menu, X, Home, Users, MessageCircle, Heart, Briefcase, MapPin, Star, MessageSquare, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeModule, onModuleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'primary' },
    { id: 'workplace-assistant', name: 'Workplace Assistant', icon: Briefcase, color: 'primary' },
    { id: 'smart-navigation', name: 'Smart Navigation', icon: MapPin, color: 'secondary' },
    { id: 'communication-hub', name: 'Communication Hub', icon: MessageCircle, color: 'tertiary' },
    { id: 'focus-comfort', name: 'Focus & Comfort', icon: Heart, color: 'success' },
    { id: 'ergonomic-coach', name: 'Ergonomic Coach', icon: Users, color: 'warning' },
    { id: 'buddy-assist', name: 'Buddy Assist', icon: HelpCircle, color: 'primary' },
    { id: 'career-tracker', name: 'Career Tracker', icon: Star, color: 'secondary' },
    { id: 'feedback-app', name: 'Feedback App', icon: MessageSquare, color: 'tertiary' },
    { id: 'social-circle', name: 'Social Circle', icon: Users, color: 'success' },
    { id: 'translator', name: 'Translator', icon: Globe, color: 'warning' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card shadow-card"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-soft lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CReach</h1>
              <p className="text-sm text-muted-foreground">Accessibility Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => {
                  onModuleChange(module.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-soft' 
                    : 'hover:bg-accent text-foreground hover:text-accent-foreground'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                }`} />
                <span className="font-medium truncate">{module.name}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;