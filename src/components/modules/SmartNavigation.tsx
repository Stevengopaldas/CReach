import React, { useState } from 'react';
import { MapPin, Volume2, QrCode, Coffee, Car, Utensils, MapIcon, Navigation, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const SmartNavigation: React.FC = () => {
  const [voiceGuided, setVoiceGuided] = useState(false);
  const [showingQRScanner, setShowingQRScanner] = useState(false);

  const mapLocations = [
    { id: 1, name: 'Conference Room A', type: 'meeting', accessible: true, floor: 2 },
    { id: 2, name: 'Elevator Bank', type: 'elevator', accessible: true, floor: 1 },
    { id: 3, name: 'Accessible Restroom', type: 'restroom', accessible: true, floor: 1 },
    { id: 4, name: 'Main Cafeteria', type: 'cafeteria', accessible: true, floor: 1 },
    { id: 5, name: 'Parking Deck A', type: 'parking', accessible: true, floor: 0 },
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'meeting': return MapPin;
      case 'elevator': return Car;
      case 'restroom': return MapIcon;
      case 'cafeteria': return Utensils;
      case 'parking': return Car;
      default: return MapPin;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Smart Navigation</h2>
        <p className="text-muted-foreground text-lg">Navigate your workplace with confidence</p>
      </div>

      {/* Indoor Map */}
      <Card className="p-6 card-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">Interactive Floor Map</h3>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Voice Guided</span>
            <Switch 
              checked={voiceGuided} 
              onCheckedChange={setVoiceGuided}
              aria-label="Toggle voice guided navigation"
            />
          </div>
        </div>
        
        {/* Simplified Map Visualization */}
        <div className="bg-accent/20 rounded-lg p-6 min-h-96 relative overflow-hidden">
          <div className="absolute inset-4 border-2 border-dashed border-border rounded-lg">
            {/* Map Grid */}
            <div className="grid grid-cols-4 gap-4 h-full p-4">
              {mapLocations.map((location, index) => {
                const Icon = getLocationIcon(location.type);
                return (
                  <div 
                    key={location.id}
                    className={`
                      relative p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${location.accessible 
                        ? 'bg-success/20 hover:bg-success/30 border-2 border-success/50' 
                        : 'bg-muted/20 hover:bg-muted/30 border-2 border-muted/50'
                      }
                    `}
                    style={{
                      gridColumn: (index % 2) + 1,
                      gridRow: Math.floor(index / 2) + 1
                    }}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${
                      location.accessible ? 'text-success' : 'text-muted-foreground'
                    }`} />
                    <div className="text-center">
                      <div className="text-xs font-medium text-foreground">{location.name}</div>
                      <div className="text-xs text-muted-foreground">Floor {location.floor}</div>
                      {location.accessible && (
                        <Users className="h-3 w-3 text-success mx-auto mt-1" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Current Location Indicator */}
          <div className="absolute bottom-6 left-6 bg-primary text-primary-foreground p-2 rounded-full shadow-soft">
            <Navigation className="h-4 w-4" />
          </div>
          
          {/* Route Line */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <path 
              d="M 50 350 Q 200 300 350 250"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray="8 4"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {voiceGuided && "🔊 Voice guidance: 'Head straight for 20 meters, then turn right at the elevator.'"}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Room Information</h3>
          
          {!showingQRScanner ? (
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                onClick={() => setShowingQRScanner(true)}
                className="btn-secondary"
              >
                <QrCode className="h-6 w-6 mr-2" />
                Scan Room QR Code
              </Button>
              <p className="text-sm text-muted-foreground">
                Point your camera at any room's QR code for instant information
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Scanner Simulation */}
              <div className="bg-accent/30 rounded-lg p-6 text-center">
                <QrCode className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">Scanning...</p>
              </div>
              
              {/* Room Info Popup */}
              <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Conference Room A</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="text-foreground">12 people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equipment:</span>
                    <span className="text-foreground">Projector, Audio Loop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accessibility:</span>
                    <span className="text-success">✓ Wheelchair accessible</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => setShowingQRScanner(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Access */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              aria-label="Navigate to nearest accessible restroom"
            >
              <MapIcon className="h-6 w-6 text-primary" />
              <span className="text-xs">Accessible Restroom</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              aria-label="Navigate to cafeteria"
            >
              <Utensils className="h-6 w-6 text-secondary-accent" />
              <span className="text-xs">Cafeteria</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              aria-label="Navigate to elevators"
            >
              <Car className="h-6 w-6 text-tertiary" />
              <span className="text-xs">Elevators</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              aria-label="Navigate to accessible parking"
            >
              <Car className="h-6 w-6 text-warning" />
              <span className="text-xs">Accessible Parking</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartNavigation;