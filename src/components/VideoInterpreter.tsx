import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Move, 
  Settings, 
  Users,
  X,
  RotateCcw,
  Mic,
  MicOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VideoInterpreterProps {
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

interface InterpreterOption {
  id: string;
  name: string;
  language: string;
  specialty: string;
  available: boolean;
  videoUrl: string;
  avatar: string;
}

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
type Size = 'small' | 'medium' | 'large' | 'fullscreen';

const VideoInterpreter: React.FC<VideoInterpreterProps> = ({ isEnabled, onToggle }) => {
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [size, setSize] = useState<Size>('medium');
  const [selectedInterpreter, setSelectedInterpreter] = useState<string>('interpreter-1');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Available interpreters
  const interpreters: InterpreterOption[] = [
    {
      id: 'interpreter-1',
      name: 'Sarah Johnson',
      language: 'ASL (American Sign Language)',
      specialty: 'Business & Technical',
      available: true,
      videoUrl: '/api/interpreter/sarah-johnson/stream',
      avatar: '👩‍🦰'
    },
    {
      id: 'interpreter-2',
      name: 'Michael Chen',
      language: 'ASL (American Sign Language)',
      specialty: 'Medical & Healthcare',
      available: true,
      videoUrl: '/api/interpreter/michael-chen/stream',
      avatar: '👨‍🦱'
    },
    {
      id: 'interpreter-3',
      name: 'Lisa Williams',
      language: 'BSL (British Sign Language)',
      specialty: 'Legal & Compliance',
      available: false,
      videoUrl: '/api/interpreter/lisa-williams/stream',
      avatar: '👩‍🦳'
    },
    {
      id: 'interpreter-4',
      name: 'David Martinez',
      language: 'LSF (French Sign Language)',
      specialty: 'General Communication',
      available: true,
      videoUrl: '/api/interpreter/david-martinez/stream',
      avatar: '👨‍🦰'
    }
  ];

  const currentInterpreter = interpreters.find(i => i.id === selectedInterpreter);

  // Position styles
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
      transition: isDragging ? 'none' : 'all 0.3s ease',
    };

    const sizeMap = {
      small: { width: '200px', height: '150px' },
      medium: { width: '300px', height: '225px' },
      large: { width: '400px', height: '300px' },
      fullscreen: { width: '100vw', height: '100vh', top: 0, left: 0 }
    };

    const positionMap = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    };

    return {
      ...baseStyles,
      ...sizeMap[size],
      ...(size !== 'fullscreen' ? positionMap[position] : {})
    };
  };

  // Start video call
  const startVideoCall = async () => {
    setIsVideoActive(true);
    
    // Simulate connecting to interpreter
    if (videoRef.current) {
      try {
        // In a real implementation, this would connect to a video service
        videoRef.current.src = currentInterpreter?.videoUrl || '';
        await videoRef.current.play();
      } catch (error) {
        console.warn('Video playback failed:', error);
        // Fallback to showing a simulated interpreter
      }
    }
  };

  // Stop video call
  const stopVideoCall = () => {
    setIsVideoActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
  };

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (size === 'fullscreen') return;
    
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      containerRef.current.style.left = `${newX}px`;
      containerRef.current.style.top = `${newY}px`;
      containerRef.current.style.right = 'auto';
      containerRef.current.style.bottom = 'auto';
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Auto-enable video when sign language is enabled
  useEffect(() => {
    if (isEnabled && !isVideoActive) {
      setTimeout(() => startVideoCall(), 1000);
    } else if (!isEnabled && isVideoActive) {
      stopVideoCall();
    }
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Video Interpreter Window */}
      <div
        ref={containerRef}
        style={getPositionStyles()}
        className={`bg-background border-2 border-primary rounded-lg shadow-lg overflow-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Header */}
        <div
          className="bg-primary text-primary-foreground p-2 flex items-center justify-between cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Language Interpreter</span>
            {isVideoActive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">LIVE</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => onToggle?.(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Video Content */}
        {!isMinimized && (
          <div className="relative bg-gray-900 h-full">
            {isVideoActive ? (
              <>
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  autoPlay
                  playsInline
                />
                
                {/* Simulated Interpreter when no real video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">{currentInterpreter?.avatar}</div>
                    <h3 className="text-lg font-semibold">{currentInterpreter?.name}</h3>
                    <p className="text-sm opacity-80">{currentInterpreter?.language}</p>
                    <div className="mt-4 animate-pulse">
                      <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full inline-block">
                        Interpreting...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/50 rounded px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      onClick={stopVideoCall}
                    >
                      <VideoOff className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                      onClick={() => setSize(size === 'fullscreen' ? 'medium' : 'fullscreen')}
                    >
                      <Maximize2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Waiting to connect
              <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Connecting to Interpreter</h3>
                  <p className="text-sm opacity-80 mb-4">Please wait while we connect you to {currentInterpreter?.name}</p>
                  <Button
                    onClick={startVideoCall}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Interpreter Settings</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Interpreter Selection */}
              <div className="space-y-2">
                <Label>Select Interpreter</Label>
                <Select value={selectedInterpreter} onValueChange={setSelectedInterpreter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interpreters.map((interpreter) => (
                      <SelectItem 
                        key={interpreter.id} 
                        value={interpreter.id}
                        disabled={!interpreter.available}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{interpreter.avatar}</span>
                          <div>
                            <div className="font-medium">{interpreter.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {interpreter.language} • {interpreter.specialty}
                            </div>
                          </div>
                          {!interpreter.available && (
                            <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                              Offline
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label>Window Position</Label>
                <Select value={position} onValueChange={(value: Position) => setPosition(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label>Window Size</Label>
                <Select value={size} onValueChange={(value: Size) => setSize(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (200x150)</SelectItem>
                    <SelectItem value="medium">Medium (300x225)</SelectItem>
                    <SelectItem value="large">Large (400x300)</SelectItem>
                    <SelectItem value="fullscreen">Fullscreen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <Label>Volume</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Volume: {volume[0]}%
                </div>
              </div>

              {/* Auto-start */}
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-start">Auto-start video calls</Label>
                <Switch id="auto-start" defaultChecked />
              </div>

              {/* Priority Connection */}
              <div className="flex items-center justify-between">
                <Label htmlFor="priority">Priority connection</Label>
                <Switch id="priority" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSettingsOpen(false)}>
                Save Settings
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Quick Access Button when minimized */}
      {isMinimized && (
        <div className="fixed bottom-4 right-20 z-50">
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          >
            <Users className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  );
};

export default VideoInterpreter; 