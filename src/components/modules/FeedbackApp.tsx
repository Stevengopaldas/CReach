import React, { useState } from 'react';
import { MessageSquare, Mic, MicOff, ThumbsUp, Send, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeedbackApp = () => {
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [anonymousMode, setAnonymousMode] = useState(true);

  const feedbackIdeas = [
    { id: 1, text: "Add more accessible parking spaces near main entrance", votes: 24, status: "under_review" },
    { id: 2, text: "Install height-adjustable desks in meeting rooms", votes: 18, status: "implemented" },
    { id: 3, text: "Provide noise-cancelling headphones for focus areas", votes: 15, status: "pending" },
    { id: 4, text: "Improve lighting in the break room", votes: 12, status: "under_review" }
  ];

  const accommodationRequests = [
    { id: 1, type: "Desk Setup", description: "Ergonomic chair with lumbar support", status: "approved", date: "2024-01-15" },
    { id: 2, type: "Software", description: "Screen reader software installation", status: "in_progress", date: "2024-01-20" },
    { id: 3, type: "Schedule", description: "Flexible working hours accommodation", status: "approved", date: "2024-01-10" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'implemented':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress':
      case 'under_review':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'implemented':
        return 'bg-success text-success-foreground';
      case 'in_progress':
      case 'under_review':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feedback & Accommodation</h1>
          <p className="text-muted-foreground">Share your thoughts and request workplace accommodations</p>
        </div>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          <TrendingUp className="w-4 h-4 mr-1" />
          +23% engagement this month
        </Badge>
      </div>

      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feedback">Submit Feedback</TabsTrigger>
          <TabsTrigger value="ideas">Idea Wall</TabsTrigger>
          <TabsTrigger value="accommodations">My Requests</TabsTrigger>
        </TabsList>

        {/* Submit Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Feedback Form */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Share Your Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Anonymous submission</span>
                  <Switch 
                    checked={anonymousMode} 
                    onCheckedChange={setAnonymousMode}
                    aria-label="Toggle anonymous mode"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {['general', 'accessibility', 'workplace', 'suggestion'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-2 text-xs rounded capitalize transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent hover:bg-accent/80'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your feedback, suggestions, or concerns..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="min-h-[120px] resize-none"
                    aria-label="Feedback text"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceRecording(!voiceRecording)}
                        className={voiceRecording ? 'bg-destructive text-destructive-foreground' : ''}
                        aria-label={voiceRecording ? 'Stop voice recording' : 'Start voice recording'}
                      >
                        {voiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        Voice to Text
                      </Button>
                      {voiceRecording && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                          <span className="text-xs text-muted-foreground">Recording...</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{feedbackText.length}/500</span>
                  </div>
                </div>

                <Button className="w-full" disabled={!feedbackText.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Quick Accommodation Request */}
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Request Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-warning/10 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm text-warning mb-1">Need immediate assistance?</h4>
                  <p className="text-xs text-muted-foreground">Use the escalation button for urgent accommodation needs.</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Quick Request Categories</h4>
                  
                  {['Workspace Setup', 'Assistive Technology', 'Schedule Flexibility', 'Meeting Accommodation'].map((category) => (
                    <button
                      key={category}
                      className="w-full p-3 text-left border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="font-medium text-sm">{category}</span>
                      <p className="text-xs text-muted-foreground mt-1">Click to start request</p>
                    </button>
                  ))}
                </div>

                <Button variant="destructive" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Urgent Escalation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ideas Wall Tab */}
        <TabsContent value="ideas" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-success" />
                Community Ideas & Upvotes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackIdeas.map((idea) => (
                <div key={idea.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="text-center">
                    <Button variant="outline" size="sm" className="flex flex-col p-2 h-auto">
                      <ThumbsUp className="w-4 h-4 mb-1" />
                      <span className="text-xs">{idea.votes}</span>
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{idea.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusIcon(idea.status)}
                      <Badge variant="secondary" className={getStatusColor(idea.status)}>
                        {idea.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Requests Tab */}
        <TabsContent value="accommodations" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Accommodation Requests Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accommodationRequests.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{request.type}</h4>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge variant="secondary" className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Submitted: {request.date}</span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackApp;