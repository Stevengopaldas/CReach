import React, { useState } from 'react';
import { User, Settings, Sun, Moon, Bell, Calendar, TrendingUp, Users, Award, MessageCircle, BarChart3, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

interface DashboardProps {
  onModuleChange: (module: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onModuleChange }) => {
  const { theme, setTheme } = useTheme();
  const [user] = useState({
    name: "Sarah Johnson",
    role: "Senior Developer",
    avatar: "",
    loginTime: "9:30 AM"
  });

  const quickStats = [
    { label: "Tasks Completed", value: "12", change: "+15%", icon: BarChart3, color: "text-success" },
    { label: "Accessibility Score", value: "94%", change: "+2%", icon: Award, color: "text-primary" },
    { label: "Team Interactions", value: "8", change: "+3", icon: Users, color: "text-secondary" },
    { label: "Focus Time", value: "5.2h", change: "+0.8h", icon: Activity, color: "text-tertiary" }
  ];

  const upcomingEvents = [
    { title: "Accessibility Training", time: "10:00 AM", type: "training", urgent: false },
    { title: "Team Stand-up", time: "11:30 AM", type: "meeting", urgent: false },
    { title: "Ergonomic Assessment", time: "2:00 PM", type: "health", urgent: true },
    { title: "Feedback Session", time: "4:00 PM", type: "review", urgent: false }
  ];

  const newsItems = [
    { 
      title: "New Accessibility Guidelines Released", 
      summary: "WCAG 3.0 draft introduces enhanced cognitive accessibility standards",
      time: "2 hours ago",
      category: "Industry News"
    },
    { 
      title: "Company Wins Inclusive Workplace Award", 
      summary: "CReach implementation leads to industry recognition for accessibility excellence",
      time: "1 day ago",
      category: "Company News"
    },
    { 
      title: "AI-Powered Accessibility Tools Launch", 
      summary: "New machine learning features now available in workplace assistant",
      time: "3 days ago",
      category: "Product Update"
    }
  ];

  const moduleQuickAccess = [
    { id: 'workplace-assistant', name: 'Workplace Assistant', icon: '🏢', description: 'Voice commands & accessibility' },
    { id: 'smart-navigation', name: 'Smart Navigation', icon: '🗺️', description: 'Indoor maps & wayfinding' },
    { id: 'communication-hub', name: 'Communication Hub', icon: '💬', description: 'Live transcripts & translation' },
    { id: 'focus-comfort', name: 'Focus & Comfort', icon: '🧘', description: 'Wellness & sensory control' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}! 👋</h1>
          <p className="text-muted-foreground">You logged in at {user.loginTime} today</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            />
            <Moon className="w-4 h-4" />
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-soft">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Access Modules */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {moduleQuickAccess.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => onModuleChange(module.id)}
                    className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors animate-fade-in"
                  >
                    <div className="text-2xl mb-2">{module.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{module.name}</h3>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News & Updates */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-secondary" />
                Industry News & Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {newsItems.map((news, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{news.title}</h4>
                    <Badge variant="outline" className="text-xs">{news.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{news.summary}</p>
                  <p className="text-xs text-muted-foreground">{news.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Today's Schedule */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-tertiary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  event.urgent ? 'border-l-destructive bg-destructive/10' : 
                  event.type === 'meeting' ? 'border-l-primary bg-primary/10' :
                  event.type === 'training' ? 'border-l-secondary bg-secondary/10' :
                  'border-l-success bg-success/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    {event.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily Wellness Check */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                Wellness Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-success rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-1">85%</h3>
                <p className="text-sm opacity-90">Overall Wellness Score</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stress Level</span>
                  <span className="text-success">Low</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Focus Time</span>
                  <span className="text-primary">5.2 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Break Frequency</span>
                  <span className="text-warning">Needs Improvement</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => onModuleChange('focus-comfort')}
              >
                Start Wellness Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;