import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Calendar, Users, Star, ThumbsUp, Video, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const SocialCircle: React.FC = () => {
  const [newPost, setNewPost] = useState('');

  const forumPosts = [
    {
      id: 1,
      author: 'Alex Martinez',
      role: 'Mentor',
      content: 'Just wanted to share how much the new voice navigation feature has improved my daily workflow! 🎉',
      likes: 24,
      comments: 8,
      time: '2 hours ago',
      category: 'celebration'
    },
    {
      id: 2,
      author: 'Jamie Chen',
      role: 'Volunteer',
      content: 'Organizing a virtual coffee chat for people using screen readers - who\'s interested?',
      likes: 12,
      comments: 15,
      time: '4 hours ago',
      category: 'event'
    },
    {
      id: 3,
      author: 'Morgan Davis',
      role: 'Employee',
      content: 'Any tips for managing sensory overload during busy office days? Looking for practical strategies.',
      likes: 31,
      comments: 22,
      time: '1 day ago',
      category: 'question'
    }
  ];

  const chatCategories = [
    { id: 'visual', name: 'Visual Support', members: 47, active: true },
    { id: 'hearing', name: 'Hearing Community', members: 33, active: true },
    { id: 'mobility', name: 'Mobility Support', members: 28, active: false },
    { id: 'cognitive', name: 'Cognitive Support', members: 52, active: true },
    { id: 'chronic', name: 'Chronic Conditions', members: 19, active: false },
  ];

  const upcomingMeetups = [
    {
      id: 1,
      title: 'Monthly Accessibility Champions Meetup',
      date: 'Friday, Nov 15',
      time: '3:00 PM EST',
      format: 'Virtual',
      attendees: 23,
      host: 'Sarah Wilson'
    },
    {
      id: 2,
      title: 'Assistive Technology Show & Tell',
      date: 'Monday, Nov 18',
      time: '12:00 PM EST',
      format: 'Hybrid',
      attendees: 15,
      host: 'David Park'
    },
    {
      id: 3,
      title: 'Wellness Wednesday: Stress Management',
      date: 'Wednesday, Nov 20',
      time: '1:00 PM EST',
      format: 'Virtual',
      attendees: 31,
      host: 'Dr. Lisa Kumar'
    }
  ];

  const getReactionEmoji = (category: string) => {
    switch (category) {
      case 'celebration': return '🎉';
      case 'event': return '📅';
      case 'question': return '❓';
      default: return '💭';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Social Circle</h2>
        <p className="text-muted-foreground text-lg">Connect, share, and grow together</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forum Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Post */}
          <Card className="p-6 card-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share with the community</h3>
            
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share a win, ask a question, or start a conversation..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-24"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-xs">💡 Tip</Badge>
                  <Badge variant="outline" className="text-xs">❓ Question</Badge>
                  <Badge variant="outline" className="text-xs">🎉 Celebration</Badge>
                </div>
                
                <Button className="btn-primary">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="p-6 card-soft">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 bg-primary/20">
                    <span className="text-primary font-medium">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-foreground">{post.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.role === 'Mentor' && <Star className="h-3 w-3 mr-1" />}
                        {post.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                    
                    <p className="text-foreground mb-3">{post.content}</p>
                    
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      
                      <span className="text-lg">{getReactionEmoji(post.category)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chat Categories */}
          <Card className="p-6 card-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Community Chats</h3>
            
            <div className="space-y-3">
              {chatCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer">
                  <div>
                    <div className="font-medium text-foreground text-sm">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.members} members</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {category.active && (
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                    )}
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Profile Highlights */}
          <Card className="p-6 card-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Community Leaders</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Sarah Wilson', role: 'Senior Mentor', badge: 'accessibility-champion' },
                { name: 'Marcus Thompson', role: 'Volunteer Coordinator', badge: 'community-builder' },
                { name: 'Dr. Lisa Kumar', role: 'Wellness Expert', badge: 'wellness-guru' }
              ].map((leader, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/20 transition-colors">
                  <Avatar className="w-8 h-8 bg-secondary/20">
                    <span className="text-secondary-accent font-medium text-xs">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{leader.name}</div>
                    <div className="text-xs text-muted-foreground">{leader.role}</div>
                  </div>
                  
                  <Star className="h-4 w-4 text-warning" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Virtual Meetups */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Upcoming Virtual Meetups</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingMeetups.map((meetup) => (
            <div key={meetup.id} className="p-4 rounded-lg bg-accent/20 border border-border">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-foreground text-sm leading-tight">{meetup.title}</h4>
                <Badge variant="outline" className="text-xs ml-2">
                  {meetup.format === 'Virtual' ? <Video className="h-3 w-3 mr-1" /> : <Coffee className="h-3 w-3 mr-1" />}
                  {meetup.format}
                </Badge>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>{meetup.date} at {meetup.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>{meetup.attendees} attending • Hosted by {meetup.host}</span>
                </div>
              </div>
              
              <Button size="sm" className="w-full btn-secondary">
                Join Meetup
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SocialCircle;