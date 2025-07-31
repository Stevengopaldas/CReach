import React, { useState } from 'react';
import { Send, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: () => void;
}

interface HelpRequestData {
  help_type: 'elevator_assistance' | 'moving_equipment' | 'guidance' | 'other';
  location: string;
  description: string;
  required_time: string;
}

const RequestHelpModal: React.FC<RequestHelpModalProps> = ({ isOpen, onClose, onRequestSubmitted }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HelpRequestData>({
    help_type: 'elevator_assistance',
    location: '',
    description: '',
    required_time: ''
  });

  const helpTypes = [
    { value: 'elevator_assistance', label: 'Elevator Assistance', description: 'Help with using elevators safely' },
    { value: 'moving_equipment', label: 'Moving Equipment', description: 'Assistance with moving or carrying items' },
    { value: 'guidance', label: 'Guidance to Location', description: 'Help finding meeting rooms, facilities, etc.' },
    { value: 'other', label: 'Other Assistance', description: 'Any other type of help needed' }
  ];

  const handleInputChange = (field: keyof HelpRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location.trim() || !formData.description.trim() || !formData.required_time) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      // Generate mock requester ID for demo purposes
      const mockRequesterId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      const requestData = {
        requester_id: mockRequesterId,
        help_type: formData.help_type,
        location: formData.location,
        description: formData.description,
        required_time: formData.required_time,
        status: 'pending'
      };

      console.log('Submitting help request:', requestData);

      // Save to Supabase volunteer_requests table
      const { data, error } = await supabase
        .from('volunteer_requests')
        .insert([requestData])
        .select();

      if (error) {
        console.error('Detailed request error:', error);
        throw error;
      }

      console.log('Help request submitted successfully:', data);

      // Reset form
      setFormData({
        help_type: 'elevator_assistance',
        location: '',
        description: '',
        required_time: ''
      });

      onClose();
      
      // Show success message
      alert('✅ Help request submitted successfully! You\'ll be notified when a volunteer accepts your request.');

      // Trigger refresh
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }

    } catch (error) {
      console.error('Error submitting help request:', error);
      
      // Handle Supabase errors properly
      let errorMessage = 'Failed to submit help request';
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage += `: ${String(error.message)}`;
        } else if ('error' in error) {
          errorMessage += `: ${String(error.error)}`;
        }
      }
      
      alert(`${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const selectedHelpType = helpTypes.find(type => type.value === formData.help_type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Request Volunteer Help
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Help Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="help-type">Type of Assistance Needed *</Label>
            <Select value={formData.help_type} onValueChange={(value) => handleInputChange('help_type', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type of help needed" />
              </SelectTrigger>
              <SelectContent>
                {helpTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHelpType && (
              <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{selectedHelpType.description}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Building A, Floor 3, Desk 15 or Meeting Room B-205"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please be as specific as possible to help volunteers find you
            </p>
          </div>

          {/* Required Time */}
          <div className="space-y-2">
            <Label htmlFor="required-time">When do you need help? *</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="required-time"
                type="datetime-local"
                value={formData.required_time}
                onChange={(e) => handleInputChange('required_time', e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe what you need help with, any specific requirements, or additional context..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              The more details you provide, the better volunteers can assist you
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>

        {/* Help Information */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">What happens next?</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Your request will be visible to available volunteers</li>
                  <li>• You'll be notified when someone accepts your request</li>
                  <li>• You can track the status in "My Requests"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default RequestHelpModal; 