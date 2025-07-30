import React, { useState } from 'react';
import { Trophy, Target, BookOpen, MessageCircle, Calendar, Star, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CareerTracker = () => {
  const [selectedGoal, setSelectedGoal] = useState(0);

  const goals = [
    { title: "Frontend Development", progress: 75, target: "Senior Developer", timeframe: "6 months" },
    { title: "Leadership Skills", progress: 60, target: "Team Lead", timeframe: "1 year" },
    { title: "Accessibility Expertise", progress: 90, target: "A11y Champion", timeframe: "3 months" }
  ];

  const skills = [
    { name: "React Development", level: 85, certification: "Meta Certified", recent: true },
    { name: "TypeScript", level: 70, certification: "Microsoft Certified", recent: false },
    { name: "Web Accessibility", level: 95, certification: "IAAP WAS", recent: true },
    { name: "Team Leadership", level: 60, certification: "In Progress", recent: false },
    { name: "UI/UX Design", level: 50, certification: "Google UX", recent: false }
  ];

  const feedback = [
    { 
      from: "Manager", 
      type: "Performance Review", 
      date: "2024-01-20",
      rating: 4.5,
      comment: "Exceptional work on accessibility improvements. Shows great leadership potential."
    },
    { 
      from: "Peer", 
      type: "360 Feedback", 
      date: "2024-01-15",
      rating: 4.8,
      comment: "Always willing to help others and shares knowledge effectively."
    },
    { 
      from: "Team Lead", 
      type: "Project Review", 
      date: "2024-01-10",
      rating: 4.2,
      comment: "Delivered project ahead of schedule with excellent quality."
    }
  ];

  const recognition = [
    { title: "Accessibility Champion", date: "2024-01-15", type: "award", description: "Led company-wide accessibility initiative" },
    { title: "Team Player of the Month", date: "2023-12-20", type: "recognition", description: "Outstanding collaboration and support" },
    { title: "Innovation Award", date: "2023-11-10", type: "award", description: "Developed new assistive technology tools" }
  ];

  const upcomingMeetings = [
    { title: "Quarterly Check-in", with: "Sarah Johnson (Manager)", date: "2024-01-25", time: "2:00 PM" },
    { title: "Career Development Discussion", with: "HR Team", date: "2024-01-28", time: "10:00 AM" },
    { title: "Mentorship Session", with: "Alex Chen (Senior Dev)", date: "2024-01-30", time: "3:30 PM" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Career Growth Tracker</h1>
          <p className="text-muted-foreground">Your personalized journey to professional success</p>
        </div>
        <Badge variant="secondary" className="bg-success text-success-foreground">
          <TrendingUp className="w-4 h-4 mr-1" />
          On track for promotion
        </Badge>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal, index) => (
          <Card key={goal.title} className={`cursor-pointer transition-all ${selectedGoal === index ? 'ring-2 ring-primary shadow-soft' : 'hover:shadow-card'}`} onClick={() => setSelectedGoal(index)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{goal.title}</h3>
                <Target className="w-4 h-4 text-primary" />
              </div>
              <Progress value={goal.progress} className="mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.progress}% complete</span>
                <span>{goal.timeframe}</span>
              </div>
              <p className="text-xs text-primary font-medium mt-1">Target: {goal.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills & Badges</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
          <TabsTrigger value="meetings">Check-ins</TabsTrigger>
        </TabsList>

        {/* Skills & Badges */}
        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Skill Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {skill.recent && <Badge variant="secondary" className="text-xs bg-success text-success-foreground">New</Badge>}
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                    </div>
                    <Progress value={skill.level} />
                    <p className="text-xs text-muted-foreground">Certification: {skill.certification}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-warning" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">A11y Expert</h4>
                    <p className="text-xs opacity-90">Level 3 Achieved</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-warm rounded-lg text-white">
                    <Star className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Code Quality</h4>
                    <p className="text-xs opacity-90">5-Star Rating</p>
                  </div>
                  <div className="text-center p-4 bg-tertiary/20 border border-tertiary rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-tertiary" />
                    <h4 className="font-semibold text-sm text-tertiary">Mentor</h4>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                    <div className="w-8 h-8 mx-auto mb-2 bg-muted-foreground/20 rounded" />
                    <h4 className="font-semibold text-sm text-muted-foreground">Next Badge</h4>
                    <p className="text-xs text-muted-foreground">Team Lead</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Performance Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedback.map((item, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{item.from}</span>
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{item.comment}"</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recognition */}
        <TabsContent value="recognition" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-success" />
                Recognition & Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recognition.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-success/10 to-transparent rounded-lg">
                  <div className="p-2 bg-success/20 rounded-full">
                    {item.type === 'award' ? <Trophy className="w-5 h-5 text-success" /> : <Star className="w-5 h-5 text-success" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check-ins */}
        <TabsContent value="meetings" className="space-y-6">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-tertiary" />
                Upcoming Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground">{meeting.with}</p>
                    <p className="text-xs text-muted-foreground">{meeting.date} at {meeting.time}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Meeting
                  </Button>
                </div>
              ))}
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-sm text-primary mb-2">Manager Check-in Notes</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Continue focusing on accessibility leadership</p>
                  <p>• Consider mentoring junior developers</p>
                  <p>• Explore senior developer role opportunities</p>
                  <p>• Schedule training for management skills</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerTracker;