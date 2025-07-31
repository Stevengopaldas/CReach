import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, RefreshCw, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { VolunteerRequest } from '@/lib/supabase';

interface MyRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyRequestsModal: React.FC<MyRequestsModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<VolunteerRequest[]>([]);

  // Load user's volunteer requests
  const loadMyRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch volunteer requests from Supabase
      const { data: requestsData, error } = await supabase
        .from('volunteer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching volunteer requests:', error);
        return;
      }

      setRequests(requestsData || []);
      
    } catch (error) {
      console.error('Error loading volunteer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel a pending request
  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) {
        console.error('Error cancelling request:', error);
        alert('Failed to cancel request. Please try again.');
        return;
      }

      alert('Request cancelled successfully.');
      loadMyRequests(); // Refresh the list
      
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request. Please try again.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMyRequests();
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'accepted': return 'bg-primary/20 text-primary border-primary/30';
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'accepted': return <User className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getHelpTypeLabel = (helpType: string) => {
    switch (helpType) {
      case 'elevator_assistance': return 'Elevator Assistance';
      case 'moving_equipment': return 'Moving Equipment';
      case 'guidance': return 'Guidance to Location';
      case 'other': return 'Other Assistance';
      default: return helpType;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activeRequests = requests.filter(r => r.status === 'accepted');
  const completedRequests = requests.filter(r => ['completed', 'cancelled'].includes(r.status));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              My Volunteer Requests
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadMyRequests}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Active ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              History ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading your requests...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No pending requests</p>
                <p className="text-sm text-muted-foreground">Submit a new request to get help from volunteers</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-warning">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{getHelpTypeLabel(request.help_type)}</CardTitle>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateTime(request.required_time)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this request?')) {
                            cancelRequest(request.id);
                          }
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{request.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatTimeSince(request.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Requests */}
          <TabsContent value="active" className="space-y-4 max-h-96 overflow-y-auto">
            {activeRequests.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No active requests</p>
                <p className="text-sm text-muted-foreground">Requests accepted by volunteers will appear here</p>
              </div>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{getHelpTypeLabel(request.help_type)}</CardTitle>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateTime(request.required_time)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{request.description}</p>
                    {request.volunteer_id && (
                      <div className="bg-primary/10 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-primary">Volunteer Assigned</p>
                        <p className="text-xs text-muted-foreground">A volunteer has accepted your request</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatTimeSince(request.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4 max-h-96 overflow-y-auto">
            {completedRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No completed requests</p>
                <p className="text-sm text-muted-foreground">Your completed and cancelled requests will appear here</p>
              </div>
            ) : (
              completedRequests.map((request) => (
                <Card key={request.id} className={`border-l-4 ${request.status === 'completed' ? 'border-l-success' : 'border-l-destructive'}`}>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{getHelpTypeLabel(request.help_type)}</CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(request.required_time)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{request.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatTimeSince(request.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MyRequestsModal; 