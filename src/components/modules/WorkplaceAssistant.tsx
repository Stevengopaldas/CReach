import React, { useState } from 'react';
import { Mic, Eye, Volume2, Contrast, AlertTriangle, Calendar, Plus, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  dueDate?: string;
}

const WorkplaceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  // Use global accessibility context
  const { settings, updateSetting } = useAccessibility();
  
  // Task management state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Review quarterly accessibility report', completed: false, priority: 'high' },
    { id: 2, text: 'Schedule meeting with ergonomic specialist', completed: true, priority: 'medium' },
    { id: 3, text: 'Complete accessibility training module', completed: false, priority: 'low' },
  ]);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    text: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    description: '',
    dueDate: ''
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      const task: Task = {
        id: Date.now(), // Simple ID generation
        text: newTask.text.trim(),
        completed: false,
        priority: newTask.priority,
        description: newTask.description.trim() || undefined,
        dueDate: newTask.dueDate || undefined
      };
      
      setTasks(prevTasks => [...prevTasks, task]);
      
      // Reset form
      setNewTask({
        text: '',
        priority: 'medium',
        description: '',
        dueDate: ''
      });
      
      // Close dialog
      setIsAddTaskOpen(false);
    }
  };

  const toggleTaskComplete = (taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Workplace Assistant</h2>
        <p className="text-muted-foreground text-lg">Your personalized accessibility companion</p>
        {settings.highContrast && (
          <div className="mt-4 p-3 bg-primary text-primary-foreground rounded-lg font-medium">
            🔆 High Contrast Mode Active - Enhanced visibility enabled throughout the application
          </div>
        )}
        {settings.magnifier && (
          <div className="mt-4 p-3 bg-secondary text-secondary-foreground rounded-lg font-medium">
            🔍 Magnifier Mode Active - Content zoomed for better visibility
          </div>
        )}
        {settings.highContrast && settings.magnifier && (
          <div className="mt-4 p-3 bg-tertiary text-tertiary-foreground rounded-lg font-medium">
            ⚡ Enhanced Accessibility Mode - Both high contrast and magnification active
          </div>
        )}
      </div>

      {/* Voice Command */}
      <Card className="p-6 card-soft">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Voice Commands</h3>
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-focus' 
                : 'btn-primary'
            }`}
            onClick={() => setIsListening(!isListening)}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          >
            <Mic className="h-8 w-8" />
          </Button>
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Listening... Say your command' : 'Tap to speak'}
          </p>
        </div>
      </Card>

      {/* Accessibility Toggles */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Global Accessibility Tools</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These settings apply throughout the entire application and are automatically saved.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <span className="font-medium">Screen Reader</span>
            </div>
            <Switch 
              checked={settings.screenReader} 
              onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              aria-label="Toggle screen reader support"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-secondary-accent" />
              <span className="font-medium">Sign Language</span>
            </div>
            <Switch 
              checked={settings.signLanguage} 
              onCheckedChange={(checked) => updateSetting('signLanguage', checked)}
              aria-label="Toggle sign language overlay"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border-2 border-secondary/20">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-tertiary" />
              <div className="flex flex-col">
                <span className="font-medium">Digital Magnifier</span>
                <span className="text-xs text-muted-foreground">Zoom content for low-vision users</span>
              </div>
            </div>
            <Switch 
              checked={settings.magnifier} 
              onCheckedChange={(checked) => updateSetting('magnifier', checked)}
              aria-label="Toggle magnifier mode for better content visibility"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border-2 border-primary/20">
            <div className="flex items-center space-x-3">
              <Contrast className="h-5 w-5 text-warning" />
              <div className="flex flex-col">
                <span className="font-medium">High Contrast Mode</span>
                <span className="text-xs text-muted-foreground">Enhanced visibility app-wide</span>
              </div>
            </div>
            <Switch 
              checked={settings.highContrast} 
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              aria-label="Toggle high contrast mode throughout the application"
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Assist */}
        <Card className="p-6 card-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">Emergency Assistance</h3>
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full animate-bounce-soft"
            aria-label="Emergency assistance button"
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            Need Help Now
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Connects you to workplace support immediately
          </p>
        </Card>

        {/* Task Planner */}
        <Card className="p-6 card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">Task Planner</h3>
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Task Title *</Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title..."
                      value={newTask.text}
                      onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Add task description (optional)..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask} disabled={!newTask.text.trim()}>
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="flex-shrink-0"
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                </button>
                <div className="flex-1 min-w-0">
                  <span className={`block truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.text}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {task.completed && <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Captions */}
      <Card className="p-6 card-soft">
        <h3 className="text-xl font-semibold text-foreground mb-4">Live Meeting Captions</h3>
        <div className="bg-accent/30 rounded-lg p-4 min-h-32">
          <div className="text-sm text-muted-foreground mb-2">🔴 LIVE</div>
          <div className="space-y-2">
            <p className="text-foreground">"Thank you everyone for joining today's accessibility review meeting..."</p>
            <p className="text-foreground">"We'll be discussing the quarterly improvements to our workplace tools."</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkplaceAssistant;