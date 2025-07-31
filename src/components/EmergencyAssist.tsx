import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Users, 
  Clock, 
  Shield,
  X,
  Send,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  department: string;
  available24h: boolean;
}

interface EmergencyAlert {
  id: string;
  type: 'medical' | 'security' | 'accessibility' | 'safety' | 'general';
  timestamp: Date;
  message: string;
  location?: string;
  status: 'sent' | 'acknowledged' | 'resolved';
}

interface EmergencyAssistProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyAssist: React.FC<EmergencyAssistProps> = ({ isOpen, onClose }) => {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [location, setLocation] = useState<string>('');
  const [alertSent, setAlertSent] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

  // Emergency contacts - in a real app, these would come from a database
  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Security Desk',
      role: 'Campus Security',
      phone: '+1-555-SECURITY',
      email: 'security@company.com',
      department: 'Security',
      available24h: true
    },
    {
      id: '2',
      name: 'HR Emergency Line',
      role: 'Human Resources',
      phone: '+1-555-HR-HELP',
      email: 'hr-emergency@company.com',
      department: 'HR',
      available24h: false
    },
    {
      id: '3',
      name: 'Medical Services',
      role: 'Occupational Health',
      phone: '+1-555-MEDICAL',
      email: 'medical@company.com',
      department: 'Health Services',
      available24h: true
    },
    {
      id: '4',
      name: 'Accessibility Coordinator',
      role: 'Accessibility Support',
      phone: '+1-555-ACCESS',
      email: 'accessibility@company.com',
      department: 'Accessibility',
      available24h: false
    },
    {
      id: '5',
      name: 'Facilities Emergency',
      role: 'Building Services',
      phone: '+1-555-FACILITY',
      email: 'facilities@company.com',
      department: 'Facilities',
      available24h: true
    }
  ];

  // Emergency types with predefined messages
  const emergencyTypes = [
    {
      value: 'medical',
      label: 'Medical Emergency',
      message: 'Medical assistance needed immediately.',
      priority: 'critical',
      icon: '🚨'
    },
    {
      value: 'security',
      label: 'Security Issue',
      message: 'Security assistance required.',
      priority: 'high',
      icon: '🔒'
    },
    {
      value: 'accessibility',
      label: 'Accessibility Barrier',
      message: 'Accessibility assistance needed.',
      priority: 'medium',
      icon: '♿'
    },
    {
      value: 'safety',
      label: 'Safety Concern',
      message: 'Safety issue requires attention.',
      priority: 'high',
      icon: '⚠️'
    },
    {
      value: 'general',
      label: 'General Emergency',
      message: 'Emergency assistance needed.',
      priority: 'medium',
      icon: '📞'
    }
  ];

  // Get user location
  useEffect(() => {
    if (includeLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.warn('Location access denied:', error);
          setLocation('Location access denied');
        }
      );
    }
  }, [includeLocation]);

  // Send emergency alert
  const sendEmergencyAlert = () => {
    const selectedType = emergencyTypes.find(type => type.value === emergencyType);
    
    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      type: emergencyType as EmergencyAlert['type'],
      timestamp: new Date(),
      message: customMessage || selectedType?.message || 'Emergency assistance needed',
      location: includeLocation ? location : undefined,
      status: 'sent'
    };

    // Simulate sending alert
    console.log('Emergency Alert Sent:', alert);
    
    // Show confirmation
    setAlertSent(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setAlertSent(false);
      onClose();
      // Reset form
      setEmergencyType('');
      setCustomMessage('');
      setSelectedContact(null);
    }, 3000);
  };

  // Quick emergency actions
  const quickActions = [
    {
      label: 'Call Security',
      action: () => {
        const securityContact = emergencyContacts.find(c => c.department === 'Security');
        if (securityContact) {
          window.open(`tel:${securityContact.phone}`, '_self');
        }
      },
      icon: Shield,
      color: 'bg-destructive'
    },
    {
      label: 'Call Medical',
      action: () => {
        const medicalContact = emergencyContacts.find(c => c.department === 'Health Services');
        if (medicalContact) {
          window.open(`tel:${medicalContact.phone}`, '_self');
        }
      },
      icon: Phone,
      color: 'bg-warning'
    },
    {
      label: 'Send Alert',
      action: () => {
        if (emergencyType) {
          sendEmergencyAlert();
        }
      },
      icon: Send,
      color: 'bg-primary'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <span>Emergency Assistance</span>
          </DialogTitle>
        </DialogHeader>

        {alertSent ? (
          // Alert confirmation screen
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h3 className="text-xl font-semibold text-success">Alert Sent Successfully!</h3>
            <p className="text-muted-foreground">
              Emergency services have been notified. Help is on the way.
            </p>
            <div className="p-4 bg-success/10 rounded-lg">
              <p className="text-sm text-success font-medium">
                Reference ID: EMG-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Keep this reference number for follow-up
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-20 flex flex-col items-center justify-center space-y-2`}
                  disabled={action.label === 'Send Alert' && !emergencyType}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>

            {/* Emergency Type Selection */}
            <div className="space-y-3">
              <Label htmlFor="emergency-type">Emergency Type *</Label>
              <Select value={emergencyType} onValueChange={setEmergencyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  {emergencyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Message */}
            <div className="space-y-3">
              <Label htmlFor="custom-message">Additional Details (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Describe your emergency situation..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Location Option */}
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <input
                type="checkbox"
                id="include-location"
                checked={includeLocation}
                onChange={(e) => setIncludeLocation(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="include-location" className="flex items-center space-x-2 cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>Include my location</span>
              </Label>
            </div>

            {location && includeLocation && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">Location: {location}</p>
              </div>
            )}

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Emergency Contacts</span>
              </h4>
              <div className="grid gap-3 max-h-40 overflow-y-auto">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{contact.name}</span>
                        {contact.available24h && (
                          <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                            24/7
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${contact.phone}`, '_self');
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(contact.phone);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Alert Button */}
            <div className="flex space-x-3">
              <Button
                onClick={sendEmergencyAlert}
                disabled={!emergencyType}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Emergency Alert
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>

            {/* Important Notice */}
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Important:</strong> For life-threatening emergencies, call 911 immediately. 
                This system is for workplace emergencies and assistance.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyAssist; 