import React from 'react';
import { useGlobalAccessibility } from '@/hooks/use-accessibility';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Demo component showing how any component can access and use
 * global accessibility settings throughout the application
 */
const AccessibilityDemo: React.FC = () => {
  const { 
    isHighContrast, 
    isScreenReader, 
    toggleHighContrast, 
    settings 
  } = useGlobalAccessibility();

  return (
    <Card className="p-4 m-4">
      <h3 className="text-lg font-semibold mb-3">
        Accessibility Integration Demo
      </h3>
      
      <div className="space-y-2 text-sm">
        <p>This component demonstrates global accessibility integration:</p>
        
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>High Contrast: {isHighContrast ? '✅ Active' : '❌ Inactive'}</li>
          <li>Screen Reader: {isScreenReader ? '✅ Active' : '❌ Inactive'}</li>
          <li>Settings persist across page refreshes</li>
          <li>All components automatically receive styling updates</li>
        </ul>
        
        <div className="mt-4">
          <Button 
            size="sm" 
            onClick={toggleHighContrast}
            className={isHighContrast ? 'ring-2 ring-primary' : ''}
          >
            Toggle High Contrast (Demo)
          </Button>
        </div>
        
        {isHighContrast && (
          <div className="mt-3 p-3 bg-primary text-primary-foreground rounded">
            🔆 High contrast styling is now active across all components!
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccessibilityDemo; 