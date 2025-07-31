import React, { useState } from 'react';
import { Calendar, MessageCircle, Heart, Users, Clock, Star, Send, HelpCircle, UserPlus, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FindBuddyModal from './FindBuddyModal';
import EmotionalCheckinModal from './EmotionalCheckinModal';
import CalendarModal from './CalendarModal';
import AIChatbotModal from './AIChatbotModal';
import BuddyRegistrationModal from './BuddyRegistrationModal';

const BuddyAssist: React.FC = () => {
  const [activeTab, setActiveTab] = useState('peer-support');
  const [showFindBuddyModal, setShowFindBuddyModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'view' | 'schedule'>('view');
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showBuddyRegistrationModal, setShowBuddyRegistrationModal] = useState(false);

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
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="peer-support" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Peer Support</span>
            <span className="sm:hidden">Support</span>
          </TabsTrigger>
          <TabsTrigger value="volunteer-help" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Volunteer Help</span>
            <span className="sm:hidden">Help</span>
          </TabsTrigger>
        </TabsList>

        {/* Peer Support Tab Content */}
        <TabsContent value="peer-support" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Peer Support & Mentorship</h2>
            <p className="text-muted-foreground">Find mentors, buddies, and emotional support</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Find a Buddy Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Find a Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Get matched with mentors and peers based on your needs</p>
                <Button 
                  className="w-full btn-primary"
                  onClick={() => setShowFindBuddyModal(true)}
                >
                  Start Matching
                </Button>
              </CardContent>
            </Card>

            {/* Be a Buddy Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200 border-2 border-dashed border-secondary/30 hover:border-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-secondary" />
                  Be a Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Share your expertise and help colleagues in their accessibility journey</p>
                <Button 
                  variant="outline" 
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => setShowBuddyRegistrationModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Become a Buddy
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
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New buddy match available</p>
                    <p className="text-xs text-muted-foreground">Sarah Chen - Visual Accessibility Expert</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upcoming meeting reminder</p>
                    <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM with Marcus Johnson</p>
                  </div>
                  <Badge variant="outline">Tomorrow</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteer Help Tab Content */}
        <TabsContent value="volunteer-help" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Volunteer Help Booking</h2>
            <p className="text-muted-foreground">Request assistance from our volunteer community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Request Help Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Request Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Submit a request for assistance from volunteers</p>
                <Button className="w-full btn-primary">
                  Create Request
                </Button>
              </CardContent>
            </Card>

            {/* Volunteer Dashboard Card */}
            <Card className="card-soft hover:shadow-soft transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-secondary" />
                  Volunteer Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View and respond to help requests</p>
                <Button variant="outline" className="w-full">
                  Open Dashboard
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
                <Button variant="outline" className="w-full">
                  View Status
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Help Categories */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Quick Help Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">Elevator Help</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-sm">Moving Items</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-tertiary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-tertiary" />
                  </div>
                  <span className="text-sm">Guidance</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-sm">Other Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Chatbot Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="w-14 h-14 rounded-full bg-gradient-primary shadow-soft hover:shadow-focus transition-all duration-300"
          aria-label="Open AI Assistant"
          onClick={() => setShowChatbotModal(true)}
        >
          <HeadphonesIcon className="h-6 w-6 text-white" />
        </Button>
      </div>

      <FindBuddyModal 
        isOpen={showFindBuddyModal} 
        onClose={() => setShowFindBuddyModal(false)} 
      />

      <EmotionalCheckinModal 
        isOpen={showCheckinModal} 
        onClose={() => setShowCheckinModal(false)} 
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
    </div>
  );
};

export default BuddyAssist;