import React, { useState, useEffect } from 'react';
import { Calendar, MessageCircle, Heart, Users, Clock, Star, Send, HelpCircle, UserPlus, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FindBuddyModal from './FindBuddyModal';
import EmotionalCheckinModal from './EmotionalCheckinModal';
import CalendarModal from './CalendarModal';
import AIChatbotModal from './AIChatbotModal';
import RequestHelpModal from './RequestHelpModal';
import MyRequestsModal from './MyRequestsModal';
import { supabase } from '@/lib/supabase';
import BuddyRegistrationModal from './BuddyRegistrationModal';

interface BuddyRequest {
  id: string;
  requester_id: string;
  buddy_id: string;
  type: string;
  description: string;
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  created_at: string;
  buddy_name?: string;
}

const BuddyAssist: React.FC = () => {
  const [activeTab, setActiveTab] = useState('peer-support');
  const [showFindBuddyModal, setShowFindBuddyModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'view' | 'schedule'>('view');
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showBuddyRegistrationModal, setShowBuddyRegistrationModal] = useState(false);
  const [showRequestHelpModal, setShowRequestHelpModal] = useState(false);
  const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
  const [recentRequests, setRecentRequests] = useState<BuddyRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch recent buddy requests from database
  const fetchRecentRequests = async () => {
    try {
      setLoadingRequests(true);
      
      // Fetch buddy requests with buddy names
      const { data: requests, error } = await supabase
        .from('buddy_requests')
        .select(`
          id,
          requester_id,
          buddy_id,
          type,
          description,
          status,
          created_at,
          users!buddy_requests_buddy_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching buddy requests:', error);
        return;
      }

      // Transform data to include buddy names
      const requestsWithNames = requests?.map(request => ({
        ...request,
        buddy_name: (request.users as any)?.name || 'Unknown'
      })) || [];

      setRecentRequests(requestsWithNames);
      
    } catch (error) {
      console.error('Error fetching recent requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    fetchRecentRequests();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Buddy Assist</h1>
            <p className="text-muted-foreground text-lg">Connect, support, and grow together</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-sm text-muted-foreground">Active Buddies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">8</div>
            <div className="text-sm text-muted-foreground">Volunteers Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">12</div>
            <div className="text-sm text-muted-foreground">Requests Today</div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="peer-support" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Peer Support
          </TabsTrigger>
          <TabsTrigger value="volunteer-help" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Volunteer Help
          </TabsTrigger>
        </TabsList>

        {/* Peer Support Tab Content */}
        <TabsContent value="peer-support" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Peer Support System</h2>
            <p className="text-muted-foreground">Find mentors, share experiences, and grow together</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Find a Buddy Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Find a Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Connect with mentors and peers for guidance and support</p>
                <Button className="w-full" onClick={() => setShowFindBuddyModal(true)}>
                  Browse Buddies
                </Button>
              </CardContent>
            </Card>

            {/* Be a Buddy Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-secondary" />
                  Be a Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Join our buddy network and help others in their journey</p>
                <Button variant="outline" className="w-full" onClick={() => setShowBuddyRegistrationModal(true)}>
                  Register as Buddy
                </Button>
              </CardContent>
            </Card>

            {/* Emotional Check-in Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-success" />
                  Emotional Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Share how you're feeling today in a safe space</p>
                <Button variant="outline" className="w-full" onClick={() => setShowCheckinModal(true)}>
                  Take Survey
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Integration Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-tertiary" />
                  Scheduled Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View and manage your buddy meetings</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setCalendarMode('view'); setShowCalendarModal(true); }}>
                    View Calendar
                  </Button>
                  <Button className="flex-1" onClick={() => { setCalendarMode('schedule'); setShowCalendarModal(true); }}>
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activity
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchRecentRequests}
                  disabled={loadingRequests}
                >
                  {loadingRequests ? 'Loading...' : 'Refresh'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingRequests ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Loading recent requests...</p>
                  </div>
                ) : recentRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent buddy requests</p>
                    <p className="text-xs text-muted-foreground mt-1">Requests will appear here when you send buddy requests</p>
                  </div>
                ) : (
                  recentRequests.map((request) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'pending': return 'bg-warning/20';
                        case 'matched': return 'bg-success/20';
                        case 'completed': return 'bg-primary/20';
                        case 'cancelled': return 'bg-destructive/20';
                        default: return 'bg-accent/20';
                      }
                    };

                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case 'pending': return <Badge variant="secondary">Pending</Badge>;
                        case 'matched': return <Badge variant="default">Matched</Badge>;
                        case 'completed': return <Badge variant="outline">Completed</Badge>;
                        case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
                        default: return <Badge variant="secondary">{status}</Badge>;
                      }
                    };

                    const formatDate = (dateString: string) => {
                      const date = new Date(dateString);
                      const now = new Date();
                      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
                      
                      if (diffInHours < 1) return 'Just now';
                      if (diffInHours < 24) return `${diffInHours}h ago`;
                      const diffInDays = Math.floor(diffInHours / 24);
                      return `${diffInDays}d ago`;
                    };

                    return (
                      <div key={request.id} className={`flex items-center gap-3 p-3 rounded-lg ${getStatusColor(request.status)}`}>
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Buddy request sent to {request.buddy_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.description.length > 50 
                              ? `${request.description.substring(0, 50)}...` 
                              : request.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(request.created_at)}
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteer Help Tab Content */}
        <TabsContent value="volunteer-help" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Volunteer Help Booking</h2>
            <p className="text-muted-foreground">Request assistance from our dedicated volunteers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Request Help Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Request Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Submit a request for volunteer assistance</p>
                <Button className="w-full" onClick={() => setShowRequestHelpModal(true)}>
                  Create Request
                </Button>
              </CardContent>
            </Card>

            {/* My Requests Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-tertiary" />
                  My Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Track your submitted help requests</p>
                <Button variant="outline" className="w-full" onClick={() => setShowMyRequestsModal(true)}>
                  View Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating AI Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-primary hover:bg-gradient-primary/90"
          onClick={() => setShowChatbotModal(true)}
        >
          <HeadphonesIcon className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Modals */}
      <FindBuddyModal 
        isOpen={showFindBuddyModal} 
        onClose={() => setShowFindBuddyModal(false)} 
        onRequestSent={fetchRecentRequests}
      />

      <EmotionalCheckinModal 
        isOpen={showCheckinModal} 
        onClose={() => setShowCheckinModal(false)} 
        onCheckinComplete={fetchRecentRequests}
      />

      <CalendarModal 
        isOpen={showCalendarModal} 
        onClose={() => setShowCalendarModal(false)} 
        mode={calendarMode}
      />

      <AIChatbotModal 
        isOpen={showChatbotModal} 
        onClose={() => setShowChatbotModal(false)} 
      />

      <BuddyRegistrationModal 
        isOpen={showBuddyRegistrationModal} 
        onClose={() => setShowBuddyRegistrationModal(false)} 
      />

      <RequestHelpModal 
        isOpen={showRequestHelpModal} 
        onClose={() => setShowRequestHelpModal(false)} 
        onRequestSubmitted={fetchRecentRequests}
      />

      <MyRequestsModal 
        isOpen={showMyRequestsModal} 
        onClose={() => setShowMyRequestsModal(false)} 
      />
    </div>
  );
};

export default BuddyAssist; 