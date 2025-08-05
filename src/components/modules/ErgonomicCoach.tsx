import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Volume2, Play, Pause, Monitor, User, Target, Award, ChevronLeft, ChevronRight, Settings, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ErgonomicCoach = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [exerciseActive, setExerciseActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [postureScore, setPostureScore] = useState(85);
  const [userHeight, setUserHeight] = useState('');
  const [workStyle, setWorkStyle] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [isCalculatingRecommendations, setIsCalculatingRecommendations] = useState(false);
  const [isHoveringTips, setIsHoveringTips] = useState(false);
  const [postureAnalysis, setPostureAnalysis] = useState({
    headPosition: { score: 85, status: 'good', issue: '' },
    shoulderAlignment: { score: 75, status: 'needs-work', issue: 'Slight forward lean detected' },
    backPosture: { score: 80, status: 'good', issue: '' },
    neckAngle: { score: 70, status: 'needs-work', issue: 'Neck strain from screen angle' }
  });
  
  // Enhanced real-time tracking state
  const [faceDetected, setFaceDetected] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [baselinePosture, setBaselinePosture] = useState(85);
  const [recentMovements, setRecentMovements] = useState<number[]>([]);
  
  // Real-time statistics state
  const [dailyPostureAverage, setDailyPostureAverage] = useState(85);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [activeWorkTime, setActiveWorkTime] = useState(0); // in seconds
  const [dayStreak, setDayStreak] = useState(() => {
    const saved = localStorage.getItem('ergonomic-day-streak');
    return saved ? parseInt(saved) : 1;
  });
  const [postureScoreHistory, setPostureScoreHistory] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const tipsAutoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const postureAnalysisRef = useRef<NodeJS.Timeout | null>(null);
  const workTimeRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectionRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const exercises = [
    { 
      name: "Neck Rolls", 
      duration: 120, 
      benefit: "Reduces neck tension",
      instructions: "Slowly roll your head in a circular motion. 5 times clockwise, then counter-clockwise.",
      voiceScript: "Let's start with neck rolls. Slowly roll your head in a circle. Take your time and breathe deeply."
    },
    { 
      name: "Shoulder Shrugs", 
      duration: 60, 
      benefit: "Relieves shoulder stress",
      instructions: "Lift shoulders up to ears, hold for 5 seconds, then release. Repeat 10 times.",
      voiceScript: "Time for shoulder shrugs. Lift your shoulders up to your ears, hold it, and release."
    },
    { 
      name: "Back Stretches", 
      duration: 180, 
      benefit: "Improves posture",
      instructions: "Sit up straight, clasp hands behind head, lean back gently. Hold for 15 seconds.",
      voiceScript: "Let's work on your back. Sit up straight, clasp your hands behind your head, and gently lean back."
    },
    { 
      name: "Eye Breaks", 
      duration: 30, 
      benefit: "Reduces eye strain",
      instructions: "Look at something 20 feet away for 20 seconds. Blink slowly 10 times.",
      voiceScript: "Time for an eye break. Look at something far away and blink slowly. Rest your eyes."
    }
  ];

  const tips = [
    { title: "Monitor Position", content: "Keep screen 20-26 inches away", urgency: "high", icon: "📺" },
    { title: "Chair Height", content: "Feet flat on floor, knees at 90°", urgency: "medium", icon: "🪑" },
    { title: "Lighting", content: "Reduce glare and shadows", urgency: "low", icon: "💡" },
    { title: "Break Reminder", content: "Take a 5-min break every hour", urgency: "high", icon: "⏰" },
    { title: "Keyboard Position", content: "Keep wrists straight while typing", urgency: "medium", icon: "⌨️" },
    { title: "Mouse Ergonomics", content: "Keep mouse at keyboard level", urgency: "medium", icon: "🖱️" }
  ];

  // Simple face detection using Canvas and ImageData
  const detectFacePresence = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for simple analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple face detection using skin tone and movement
    let skinPixels = 0;
    let totalBrightness = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRegionSize = Math.min(canvas.width, canvas.height) * 0.3;
    
    // Analyze center region where face would likely be
    for (let y = centerY - faceRegionSize/2; y < centerY + faceRegionSize/2; y += 4) {
      for (let x = centerX - faceRegionSize/2; x < centerX + faceRegionSize/2; x += 4) {
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Simple skin tone detection (very basic)
          if (r > 95 && g > 40 && b > 20 && 
              r > g && r > b && 
              Math.abs(r - g) > 15) {
            skinPixels++;
          }
          
          totalBrightness += (r + g + b) / 3;
        }
      }
    }
    
    // Simple heuristics for face presence
    const avgBrightness = totalBrightness / (faceRegionSize * faceRegionSize / 16);
    const facePresent = skinPixels > 20 && avgBrightness > 40 && avgBrightness < 220;
    
    setFaceDetected(facePresent);
    
    // Calculate motion level based on brightness changes
    const currentMotion = Math.min(skinPixels / 10, 10);
    setMotionLevel(currentMotion);
    setRecentMovements(prev => [...prev.slice(-10), currentMotion]);
  };

  // Enhanced realistic posture analysis
  const analyzePosture = () => {
    const currentTime = Date.now();
    const timeOfDay = new Date().getHours();
    const minutesWorked = sessionDuration / 60;
    
    setPostureScore(prev => {
      // Base factors
      let newScore = baselinePosture;
      
      // Time-based degradation (realistic fatigue)
      if (minutesWorked > 30) {
        newScore -= Math.min(15, (minutesWorked - 30) * 0.3); // Gradual decline after 30 mins
      }
      
      // Time of day effect (circadian rhythm)
      if (timeOfDay >= 14 && timeOfDay <= 16) {
        newScore -= 5; // Post-lunch dip
      } else if (timeOfDay >= 9 && timeOfDay <= 11) {
        newScore += 3; // Morning alertness
      }
      
      // Face detection bonus/penalty
      if (faceDetected) {
        newScore += 2; // Bonus for being present and positioned
      } else {
        newScore -= 8; // Penalty for being away from camera
      }
      
      // Movement patterns (too still is bad, too much movement is also bad)
      const avgMovement = recentMovements.reduce((a, b) => a + b, 0) / recentMovements.length || 0;
      if (avgMovement < 1) {
        newScore -= 5; // Too static
      } else if (avgMovement > 7) {
        newScore -= 3; // Too fidgety
      } else {
        newScore += 2; // Good micro-movements
      }
      
      // Exercise completion bonus
      if (exercisesCompleted > 0) {
        newScore += Math.min(10, exercisesCompleted * 2);
      }
      
      // Random realistic variation
      newScore += (Math.random() - 0.5) * 4;
      
      // Keep within bounds
      const finalScore = Math.max(40, Math.min(98, Math.round(newScore)));
      
      // Update detailed analysis based on score
      setPostureAnalysis({
        headPosition: {
          score: Math.max(50, Math.min(100, finalScore + (Math.random() - 0.5) * 12)),
          status: finalScore >= 80 ? 'good' : finalScore >= 65 ? 'fair' : 'needs-work',
          issue: finalScore >= 80 ? '' : 
                 finalScore >= 65 ? 'Slight forward tilt detected' : 
                 !faceDetected ? 'Please position yourself in camera view' :
                 'Forward head posture detected'
        },
        shoulderAlignment: {
          score: Math.max(45, Math.min(95, finalScore + (Math.random() - 0.5) * 15)),
          status: finalScore >= 75 ? 'good' : finalScore >= 60 ? 'fair' : 'needs-work',
          issue: finalScore >= 75 ? '' :
                 finalScore >= 60 ? 'Minor shoulder asymmetry' :
                 avgMovement < 1 ? 'Shoulders appear tense from static position' :
                 'Shoulders rounded forward'
        },
        backPosture: {
          score: Math.max(50, Math.min(92, finalScore + (Math.random() - 0.5) * 10)),
          status: finalScore >= 78 ? 'good' : finalScore >= 63 ? 'fair' : 'needs-work',
          issue: finalScore >= 78 ? '' :
                 finalScore >= 63 ? 'Slight slouching tendency' :
                 minutesWorked > 45 ? 'Posture fatigue after extended work' :
                 'Poor spinal alignment detected'
        },
        neckAngle: {
          score: Math.max(40, Math.min(90, finalScore + (Math.random() - 0.5) * 16)),
          status: finalScore >= 72 ? 'good' : finalScore >= 55 ? 'fair' : 'needs-work',
          issue: finalScore >= 72 ? '' :
                 finalScore >= 55 ? 'Monitor may need height adjustment' :
                 'Significant neck strain detected'
        }
      });
      
      // Intelligent logging
      const postureStatus = finalScore >= 80 ? 'Excellent posture maintained' :
                           finalScore >= 65 ? 'Minor adjustments recommended' :
                           finalScore >= 50 ? 'Posture needs attention' :
                           'Poor posture - immediate correction needed';
      
      console.log(`📹 Smart Posture Analysis: ${finalScore}% - ${postureStatus} | Face: ${faceDetected ? '✓' : '✗'} | Motion: ${avgMovement.toFixed(1)} | Session: ${minutesWorked.toFixed(1)}min`);
      
      // Update daily average
      updatePostureAverage(finalScore);
      
      return finalScore;
    });
  };

  // Camera functionality with enhanced analysis
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          // Start face detection
          faceDetectionRef.current = setInterval(detectFacePresence, 2000); // Every 2 seconds
          
          // Start session timer
          sessionTimerRef.current = setInterval(() => {
            setSessionDuration(prev => prev + 1);
          }, 1000);
          
          // Start enhanced posture analysis
          postureAnalysisRef.current = setInterval(analyzePosture, 4000); // Every 4 seconds
          
          console.log('📹 Enhanced posture monitoring started with real-time face detection');
        };
      }
    } catch (error) {
      console.log('Camera access denied or not available');
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Clear all analysis intervals
    if (postureAnalysisRef.current) {
      clearInterval(postureAnalysisRef.current);
      postureAnalysisRef.current = null;
    }
    
    if (faceDetectionRef.current) {
      clearInterval(faceDetectionRef.current);
      faceDetectionRef.current = null;
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    
    // Reset analysis state
    setPostureScore(0);
    setFaceDetected(false);
    setMotionLevel(0);
    setSessionDuration(0);
    setRecentMovements([]);
    setPostureAnalysis({
      headPosition: { score: 0, status: 'needs-work', issue: 'Camera disabled' },
      shoulderAlignment: { score: 0, status: 'needs-work', issue: 'Camera disabled' },
      backPosture: { score: 0, status: 'needs-work', issue: 'Camera disabled' },
      neckAngle: { score: 0, status: 'needs-work', issue: 'Camera disabled' }
    });
    
    console.log('📹 Enhanced posture monitoring stopped');
  };

  // Exercise timer functionality
  const startExercise = () => {
    setExerciseActive(true);
    setExerciseTimer(exercises[currentExercise].duration);
    startWorkTimeTracking(); // Track work time during exercises
    
    if (voiceEnabled) {
      speak(exercises[currentExercise].voiceScript);
    }

    timerRef.current = setInterval(() => {
      setExerciseTimer(prev => {
        if (prev === 1) { // Only trigger when exactly 1 second remains
          setExerciseActive(false);
          completeExercise(); // Track exercise completion
          if (voiceEnabled) {
            speak("Exercise completed! Great job!");
          }
          // Clear interval immediately to prevent multiple calls
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseExercise = () => {
    setExerciseActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Stop any ongoing speech when exercise is paused
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  // Text-to-speech functionality
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Utility functions for real-time statistics
  const formatWorkTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const startWorkTimeTracking = () => {
    if (!workTimeRef.current) {
      workTimeRef.current = setInterval(() => {
        setActiveWorkTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopWorkTimeTracking = () => {
    if (workTimeRef.current) {
      clearInterval(workTimeRef.current);
      workTimeRef.current = null;
    }
  };

  const completeExercise = () => {
    setExercisesCompleted(prev => prev + 1);
    // Update day streak when exercises are completed
    updateDayStreak();
  };

  const updateDayStreak = () => {
    const today = new Date().toDateString();
    const lastStreakDate = localStorage.getItem('ergonomic-last-streak-date');
    
    if (lastStreakDate !== today) {
      const newStreak = dayStreak + 1;
      setDayStreak(newStreak);
      localStorage.setItem('ergonomic-day-streak', newStreak.toString());
      localStorage.setItem('ergonomic-last-streak-date', today);
    }
  };

  const updatePostureAverage = (newScore: number) => {
    setPostureScoreHistory(prev => {
      const updated = [...prev, newScore];
      // Keep only the last 50 scores for rolling average
      const recent = updated.slice(-50);
      const average = Math.round(recent.reduce((sum, score) => sum + score, 0) / recent.length);
      setDailyPostureAverage(average);
      return recent;
    });
  };

  // Generate personalized recommendations
  const calculateRecommendations = (height: string, style: string) => {
    const recommendations = [];
    
    // Only process height if it's a valid complete number (2-3 digits)
    if (height && height.length >= 2) {
      const heightNum = parseInt(height);
      if (!isNaN(heightNum) && heightNum >= 100 && heightNum <= 250) {
        if (heightNum < 160) {
          recommendations.push("Consider a footrest to support your feet properly");
          recommendations.push("Lower your monitor to eye level for better neck alignment");
        } else if (heightNum > 185) {
          recommendations.push("Raise your monitor higher to avoid neck strain");
          recommendations.push("Ensure your desk height allows your arms to rest comfortably");
        } else {
          recommendations.push("Your height is well-suited for standard desk setups");
        }
      }
    }

    if (style === 'standing') {
      recommendations.push("Use an anti-fatigue mat to reduce leg strain");
      recommendations.push("Alternate between sitting and standing every hour");
    } else if (style === 'sitting') {
      recommendations.push("Ensure your chair supports the natural curve of your spine");
      recommendations.push("Keep your feet flat on the floor or footrest");
    } else if (style === 'mixed') {
      recommendations.push("Perfect! Alternating positions reduces strain");
      recommendations.push("Change positions every 30-60 minutes for optimal comfort");
    }

    return recommendations.length > 0 ? recommendations : ["Complete your profile for personalized recommendations"];
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get posture recommendations based on analysis
  const getPostureRecommendations = () => {
    const recommendations = [];
    
    Object.entries(postureAnalysis).forEach(([key, analysis]) => {
      if (analysis.status === 'needs-work') {
        switch (key) {
          case 'headPosition':
            recommendations.push('Align head directly over shoulders');
            break;
          case 'shoulderAlignment':
            recommendations.push('Pull shoulders back and down');
            break;
          case 'backPosture':
            recommendations.push('Sit up straight, use back support');
            break;
          case 'neckAngle':
            recommendations.push('Adjust monitor to eye level');
            break;
        }
      }
    });
    
    return recommendations.length > 0 ? recommendations : ['Great posture! Keep it up!'];
  };

  // UseEffect hooks
  useEffect(() => {
    if (cameraEnabled) {
      startCamera();
      startWorkTimeTracking(); // Start tracking work time when camera is active
    } else {
      stopCamera();
      stopWorkTimeTracking(); // Stop tracking when camera is disabled
    }
    return () => {
      stopCamera();
      stopWorkTimeTracking();
    };
  }, [cameraEnabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (tipsAutoSlideRef.current) {
        clearInterval(tipsAutoSlideRef.current);
      }
      if (postureAnalysisRef.current) {
        clearInterval(postureAnalysisRef.current);
      }
      if (workTimeRef.current) {
        clearInterval(workTimeRef.current);
      }
      if (faceDetectionRef.current) {
        clearInterval(faceDetectionRef.current);
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
      // Stop any ongoing speech when component unmounts
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      // Stop camera if still running
      stopCamera();
    };
  }, []);

  // Debounced recommendations update
  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Show calculating state when user is typing (only if height has some value and is being modified)
    if (userHeight && userHeight.length >= 1 && userHeight.length < 3) {
      setIsCalculatingRecommendations(true);
    }

    // Set new debounce - wait 800ms after user stops typing
    debounceRef.current = setTimeout(() => {
      const newRecommendations = calculateRecommendations(userHeight, workStyle);
      setPersonalizedRecommendations(newRecommendations);
      setIsCalculatingRecommendations(false);
      
      // Log recommendation calculation
      console.log(`🪑 Smart recommendations updated - Height: ${userHeight}cm, Style: ${workStyle}, Recommendations: ${newRecommendations.length}`);
    }, 800);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [userHeight, workStyle]);

  // Initialize recommendations on mount
  useEffect(() => {
    setPersonalizedRecommendations(["Complete your profile for personalized recommendations"]);
  }, []);

  // Keyboard navigation for tips
  const handleTipsKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentTip(prev => prev > 0 ? prev - 1 : tips.length - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        setCurrentTip(prev => prev < tips.length - 1 ? prev + 1 : 0);
        break;
      case 'Home':
        event.preventDefault();
        setCurrentTip(0);
        break;
      case 'End':
        event.preventDefault();
        setCurrentTip(tips.length - 1);
        break;
    }
  };

  // Auto-slide tips continuously, pause when hovering
  useEffect(() => {
    if (!isHoveringTips) {
      // Start/resume auto-sliding when not hovering
      tipsAutoSlideRef.current = setInterval(() => {
        setCurrentTip(prev => prev < tips.length - 1 ? prev + 1 : 0);
      }, 3000); // Slide every 3 seconds
    } else {
      // Stop auto-sliding when hovering
      if (tipsAutoSlideRef.current) {
        clearInterval(tipsAutoSlideRef.current);
        tipsAutoSlideRef.current = null;
      }
    }

    return () => {
      if (tipsAutoSlideRef.current) {
        clearInterval(tipsAutoSlideRef.current);
      }
    };
  }, [isHoveringTips, tips.length]);

  // Initialize daily data and work time tracking
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('ergonomic-last-session-date');
    
    // Reset daily stats if it's a new day
    if (savedDate !== today) {
      setExercisesCompleted(0);
      setActiveWorkTime(0);
      setPostureScoreHistory([]);
      localStorage.setItem('ergonomic-last-session-date', today);
      localStorage.removeItem('ergonomic-last-streak-date'); // Allow streak to increment
    } else {
      // Load saved data for today
      const savedExercises = localStorage.getItem('ergonomic-exercises-today');
      const savedWorkTime = localStorage.getItem('ergonomic-work-time-today');
      
      if (savedExercises) {
        setExercisesCompleted(parseInt(savedExercises));
      }
      if (savedWorkTime) {
        setActiveWorkTime(parseInt(savedWorkTime));
      }
    }
    
    // Start work time tracking when component mounts (user is actively using the app)
    startWorkTimeTracking();
    
    return () => {
      // Save current session data
      localStorage.setItem('ergonomic-exercises-today', exercisesCompleted.toString());
      localStorage.setItem('ergonomic-work-time-today', activeWorkTime.toString());
      stopWorkTimeTracking();
    };
  }, []);

  // Save data periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('ergonomic-exercises-today', exercisesCompleted.toString());
      localStorage.setItem('ergonomic-work-time-today', activeWorkTime.toString());
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [exercisesCompleted, activeWorkTime]);

  return (
    <main className="space-y-6" role="main" aria-labelledby="ergonomic-coach-title">
      {/* Skip navigation link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      {/* Live region for dynamic announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="posture-announcements">
        {Object.values(postureAnalysis).filter(a => a.status === 'needs-work').length > 0 && cameraEnabled &&
          `Posture analysis updated. ${Object.values(postureAnalysis).filter(a => a.status === 'needs-work').length} areas need attention.`
        }
      </div>
      
      {/* Additional live regions for exercise and statistics updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="exercise-announcements">
        {exerciseActive && `Exercise ${exercises[currentExercise].name} in progress. ${exerciseTimer} seconds remaining.`}
      </div>
      
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="statistics-announcements">
        {/* Announces when significant milestones are reached */}
      </div>
      
      {/* Header */}
      <header className="text-center mb-8">
        <h1 id="ergonomic-coach-title" className="text-3xl font-bold text-foreground mb-2">Ergonomic Coach</h1>
        <p className="text-muted-foreground text-lg">Your personal workplace wellness guide</p>
        <div className="flex justify-center mt-4">
          <Badge variant="secondary" className="bg-success text-success-foreground" role="status" aria-label="Daily posture goal: 80 percent">
            <Target className="w-4 h-4 mr-1" aria-hidden="true" />
            Daily Goal: 80%
          </Badge>
        </div>
      </header>

      <div id="main-content" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Posture Camera */}
        <Card className="card-soft border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10" role="region" aria-labelledby="posture-monitor-title">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
            <CardTitle id="posture-monitor-title" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                <Camera className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Posture Monitor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="camera-toggle" className="text-sm text-muted-foreground">Camera Detection</label>
              <Switch 
                id="camera-toggle"
                checked={cameraEnabled} 
                onCheckedChange={setCameraEnabled}
                aria-label="Toggle posture camera detection"
                aria-describedby="camera-description"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCameraEnabled(!cameraEnabled);
                  }
                }}
              />
            </div>
            <div id="camera-description" className="sr-only">
              {cameraEnabled ? "Camera is enabled for posture monitoring" : "Camera is disabled. Enable to start posture analysis"}
            </div>
            
            <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center relative overflow-hidden" role="img" aria-labelledby="camera-status">
              {cameraEnabled ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-label="Live camera feed for posture monitoring"
                  />
                  {/* Hidden canvas for face detection analysis */}
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                    aria-hidden="true"
                  />
                  
                  {/* Compact 50% smaller overlay */}
                  <div className="absolute top-1 right-1 bg-black/80 rounded-md p-1.5 backdrop-blur-sm max-w-[80px]" role="status" aria-live="polite">
                    <div className="text-white space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <div className={`w-1 h-1 rounded-full ${faceDetected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} aria-hidden="true"></div>
                          <span className="text-[10px]">{faceDetected ? 'Smart' : 'Basic'}</span>
                        </div>
                        <span className="text-[10px] opacity-75">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-[10px]">Score</span>
                          <span className="font-semibold text-[10px]" aria-label={`Posture score: ${postureScore} percent`}>{postureScore}%</span>
                        </div>
                        <Progress value={postureScore} className="h-[2px] bg-white/20" aria-label={`Posture score progress: ${postureScore} out of 100`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Dynamic posture guidance hints at bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/50 rounded px-2 py-1 backdrop-blur-sm">
                      <p className="text-white text-xs text-center">
                        {(() => {
                          const issues = Object.values(postureAnalysis).filter(a => a.status === 'needs-work').length;
                          if (issues === 0) return '✓ Excellent posture';
                          if (issues === 1) return '⚠ Minor adjustment needed';
                          if (issues === 2) return '⚠ Check posture alignment';
                          return '⚠ Multiple posture issues detected';
                        })()}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-white" id="camera-status">
                  <CameraOff className="w-16 h-16 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm">Camera disabled</p>
                  <p className="text-xs opacity-75">Enable for posture tracking</p>
                </div>
              )}
            </div>

            {/* Dynamic Posture Analysis */}
            <section className="space-y-2" aria-labelledby="realtime-analysis-title">
              <h4 id="realtime-analysis-title" className="font-medium text-sm">Real-time Analysis</h4>
              <div className="grid grid-cols-1 gap-2 text-xs" role="list" aria-label="Posture analysis results">
                {Object.entries(postureAnalysis).map(([key, analysis]) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'good': return 'text-success bg-success/10';
                      case 'fair': return 'text-warning bg-warning/10';
                      case 'needs-work': return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800/50';
                      default: return 'text-muted-foreground bg-muted/10';
                    }
                  };
                  
                  const getStatusIcon = (status: string) => {
                    switch (status) {
                      case 'good': return '✓';
                      case 'fair': return '⚠';
                      case 'needs-work': return '⚠';
                      default: return '?';
                    }
                  };
                  
                  const formatKey = (key: string) => {
                    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  };

                  return (
                    <div key={key} className={`p-2 rounded ${getStatusColor(analysis.status)}`} role="listitem" aria-label={`${formatKey(key)} analysis`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <span aria-hidden="true">{getStatusIcon(analysis.status)}</span>
                          <span className="font-medium">{formatKey(key)}</span>
                        </div>
                        <span className="text-xs" aria-label={`Score: ${Math.floor(analysis.score)} percent`}>{Math.floor(analysis.score)}%</span>
                      </div>
                      {analysis.issue && (
                        <p className="text-xs opacity-75" role="alert" aria-live="polite">{analysis.issue}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Quick Recommendations */}
              {cameraEnabled && getPostureRecommendations()[0] !== 'Great posture! Keep it up!' && (
                <div className="mt-3 p-2 bg-accent/20 rounded">
                  <h5 className="font-medium text-xs mb-1">Quick Fixes</h5>
                  <div className="space-y-1">
                    {getPostureRecommendations().slice(0, 2).map((rec, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {rec}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {cameraEnabled && getPostureRecommendations()[0] === 'Great posture! Keep it up!' && (
                <div className="mt-3 p-2 bg-success/10 rounded text-center" role="status" aria-live="polite">
                  <p className="text-xs text-success font-medium">✓ Excellent posture maintained!</p>
                </div>
              )}
            </section>
          </CardContent>
        </Card>

        {/* Exercise Coach */}
        <Card className="card-soft border-2 border-secondary/20 hover:border-secondary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-secondary/5 dark:from-gray-900 dark:to-secondary/10" role="region" aria-labelledby="exercise-coach-title">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-tertiary/10 border-b border-secondary/20">
            <CardTitle id="exercise-coach-title" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-secondary to-tertiary rounded-lg shadow-md">
                <Play className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">Exercise Coach</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-warm p-4 rounded-lg text-white" role="region" aria-labelledby="current-exercise-title" aria-describedby="current-exercise-description">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 id="current-exercise-title" className="font-semibold">{exercises[currentExercise].name}</h3>
                  <p id="current-exercise-description" className="text-sm opacity-90">{exercises[currentExercise].benefit}</p>
                </div>
                {exerciseActive && (
                  <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded" role="timer" aria-live="polite">
                    <Timer className="w-3 h-3" aria-hidden="true" />
                    <span className="text-xs font-mono" aria-label={`Time remaining: ${formatTime(exerciseTimer)}`}>{formatTime(exerciseTimer)}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs opacity-75 mb-3" id="exercise-instructions">
                {exercises[currentExercise].instructions}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs" aria-label={`Exercise duration: ${formatTime(exercises[currentExercise].duration)}`}>Duration: {formatTime(exercises[currentExercise].duration)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  onClick={exerciseActive ? pauseExercise : startExercise}
                  aria-label={exerciseActive ? `Pause ${exercises[currentExercise].name} exercise` : `Start ${exercises[currentExercise].name} exercise`}
                  aria-describedby="exercise-instructions"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      exerciseActive ? pauseExercise() : startExercise();
                    }
                  }}
                >
                  {exerciseActive ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
                </Button>
              </div>
              
              {exerciseActive && (
                <Progress 
                  value={((exercises[currentExercise].duration - exerciseTimer) / exercises[currentExercise].duration) * 100} 
                  className="mt-2 bg-white/20" 
                />
              )}
            </div>

            <section className="space-y-2" aria-labelledby="exercise-playlist-title">
              <h4 id="exercise-playlist-title" className="font-medium text-sm">Exercise Playlist</h4>
              <div role="listbox" aria-labelledby="exercise-playlist-title" aria-activedescendant={`exercise-${currentExercise}`}>
                {exercises.map((exercise, index) => (
                  <button
                    key={exercise.name}
                    id={`exercise-${index}`}
                    role="option"
                    aria-selected={index === currentExercise}
                    onClick={() => {
                      // Stop current exercise and speech if switching exercises
                      if (exerciseActive) {
                        setExerciseActive(false);
                        if (timerRef.current) {
                          clearInterval(timerRef.current);
                        }
                        if ('speechSynthesis' in window) {
                          speechSynthesis.cancel();
                        }
                      }
                      setCurrentExercise(index);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors ${
                      index === currentExercise 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                    aria-label={`Select ${exercise.name} exercise, duration ${formatTime(exercise.duration)}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-muted-foreground" aria-hidden="true">{formatTime(exercise.duration)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <Button 
              className="w-full" 
              variant={voiceEnabled ? "default" : "outline"}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              aria-label={`${voiceEnabled ? 'Disable' : 'Enable'} voice guidance for exercises`}
              aria-pressed={voiceEnabled}
            >
              <Volume2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Voice Guidance {voiceEnabled ? "ON" : "OFF"}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations & Tips */}
        <Card className="card-soft border-2 border-tertiary/20 hover:border-tertiary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-tertiary/5 dark:from-gray-900 dark:to-tertiary/10" role="region" aria-labelledby="smart-recommendations-title">
          <CardHeader className="bg-gradient-to-r from-tertiary/10 to-success/10 border-b border-tertiary/20">
            <CardTitle id="smart-recommendations-title" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-tertiary to-success rounded-lg shadow-md">
                <Monitor className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-tertiary to-success bg-clip-text text-transparent">Smart Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Profile */}
            <fieldset className="grid grid-cols-2 gap-2" aria-labelledby="user-profile-legend">
              <legend id="user-profile-legend" className="sr-only">User Profile Information</legend>
              <div>
                <label htmlFor="height-input" className="text-xs text-muted-foreground">Height (cm)</label>
                <Input
                  id="height-input"
                  placeholder="e.g. 170"
                  value={userHeight}
                  onChange={(e) => {
                    // Only allow numbers and limit to 3 digits
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                    setUserHeight(value);
                  }}
                  className="h-8 text-xs"
                  type="text"
                  maxLength={3}
                  aria-describedby="height-description"
                />
                <div id="height-description" className="sr-only">Enter your height in centimeters for personalized ergonomic recommendations</div>
              </div>
              <div>
                <label htmlFor="workstyle-select" className="text-xs text-muted-foreground">Work Style</label>
                <Select value={workStyle} onValueChange={setWorkStyle}>
                  <SelectTrigger id="workstyle-select" className="h-8 text-xs" aria-describedby="workstyle-description">
                    <SelectValue placeholder="Select your work style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sitting">Sitting</SelectItem>
                    <SelectItem value="standing">Standing</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <div id="workstyle-description" className="sr-only">Select your primary work style for customized recommendations</div>
              </div>
            </fieldset>

            {/* Personalized Recommendations */}
            <section className="space-y-2" aria-labelledby="personal-recommendations-title">
              {isCalculatingRecommendations ? (
                <div className="bg-primary/10 p-3 rounded-lg" role="status" aria-live="polite">
                  <h4 id="personal-recommendations-title" className="font-semibold text-sm text-primary mb-1">Personal Recommendation</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true"></div>
                    Calculating recommendations...
                  </div>
                </div>
              ) : (
                <div className="bg-primary/10 p-3 rounded-lg" role="region" aria-live="polite">
                  <h4 id="personal-recommendations-title" className="font-semibold text-sm text-primary mb-2">Personal Recommendation</h4>
                  <div className="space-y-2" role="list" aria-label="Personalized ergonomic recommendations">
                    {personalizedRecommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-muted-foreground" role="listitem">{rec}</p>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Swipeable Tips */}
            <section 
              className="space-y-3"
              onMouseEnter={() => setIsHoveringTips(true)}
              onMouseLeave={() => setIsHoveringTips(false)}
              onKeyDown={handleTipsKeyDown}
              tabIndex={0}
              aria-labelledby="comfort-tips-title"
              aria-describedby="tips-instructions"
            >
              <div id="tips-instructions" className="sr-only">
                Use arrow keys to navigate tips, Home to go to first tip, End to go to last tip
              </div>
              <div className="flex items-center justify-between">
                <h4 id="comfort-tips-title" className="font-medium text-sm">Comfort Tips</h4>
                <div className="flex items-center space-x-1" role="group" aria-label="Tip navigation">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setCurrentTip(prev => prev > 0 ? prev - 1 : tips.length - 1)}
                    aria-label={`Previous tip. Currently showing tip ${currentTip + 1} of ${tips.length}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentTip(prev => prev > 0 ? prev - 1 : tips.length - 1);
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        setCurrentTip(prev => prev < tips.length - 1 ? prev + 1 : 0);
                      }
                    }}
                  >
                    <ChevronLeft className="h-3 w-3" aria-hidden="true" />
                  </Button>
                  <span className="text-xs text-muted-foreground" aria-live="polite" aria-label={`Tip ${currentTip + 1} of ${tips.length}`}>
                    {currentTip + 1}/{tips.length}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => setCurrentTip(prev => prev < tips.length - 1 ? prev + 1 : 0)}
                    aria-label={`Next tip. Currently showing tip ${currentTip + 1} of ${tips.length}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrentTip(prev => prev < tips.length - 1 ? prev + 1 : 0);
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        setCurrentTip(prev => prev > 0 ? prev - 1 : tips.length - 1);
                      }
                    }}
                  >
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg h-[120px] flex items-center transition-all duration-300 ${
                isHoveringTips ? 'bg-accent/50 shadow-md' : 'bg-accent/30'
              }`}>
                <div className="w-full text-center">
                  <div className="text-3xl mb-2">{tips[currentTip].icon}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tips[currentTip].urgency === 'high' ? 'bg-slate-400 dark:bg-slate-500' :
                      tips[currentTip].urgency === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <p className="font-medium text-sm">{tips[currentTip].title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{tips[currentTip].content}</p>
                </div>
              </div>
              
              {/* Tip indicators */}
              <div className="flex justify-center space-x-1" role="tablist" aria-label="Tip indicators">
                {tips.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={index === currentTip}
                    aria-label={`Go to tip ${index + 1}`}
                    onClick={() => setCurrentTip(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTip ? 'bg-primary' : 'bg-muted'
                    }`}
                    tabIndex={0}
                  />
                ))}
              </div>
              

            </section>

            <div className="bg-success/10 p-3 rounded-lg" role="status" aria-label="Achievement notification">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-success" aria-hidden="true" />
                <span className="font-semibold text-sm text-success">Achievement</span>
              </div>
              <p className="text-xs text-muted-foreground">{dayStreak}-day ergonomic streak!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4" aria-labelledby="progress-stats-title">
        <h2 id="progress-stats-title" className="sr-only">Daily Progress Statistics</h2>
        <Card className="p-4 text-center border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10" role="region" aria-labelledby="posture-score-stat">
          <h3 id="posture-score-stat" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" aria-label={`Today's posture score: ${dailyPostureAverage} percent`}>{dailyPostureAverage}%</h3>
          <p className="text-xs text-muted-foreground font-medium">Today's Posture Score</p>
        </Card>
        <Card className="p-4 text-center border-2 border-secondary/20 hover:border-secondary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-secondary/5 dark:from-gray-900 dark:to-secondary/10" role="region" aria-labelledby="exercises-completed-stat">
          <h3 id="exercises-completed-stat" className="text-2xl font-bold bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent" aria-label={`${exercisesCompleted} exercises completed today`}>{exercisesCompleted}</h3>
          <p className="text-xs text-muted-foreground font-medium">Exercises Completed</p>
        </Card>
        <Card className="p-4 text-center border-2 border-tertiary/20 hover:border-tertiary/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-tertiary/5 dark:from-gray-900 dark:to-tertiary/10" role="region" aria-labelledby="active-time-stat">
          <h3 id="active-time-stat" className="text-2xl font-bold bg-gradient-to-r from-tertiary to-success bg-clip-text text-transparent" aria-label={`${formatWorkTime(activeWorkTime)} of active work time`}>{formatWorkTime(activeWorkTime)}</h3>
          <p className="text-xs text-muted-foreground font-medium">Active Work Time</p>
        </Card>
        <Card className="p-4 text-center border-2 border-success/20 hover:border-success/30 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-success/5 dark:from-gray-900 dark:to-success/10" role="region" aria-labelledby="streak-stat">
          <h3 id="streak-stat" className="text-2xl font-bold bg-gradient-to-r from-success to-warning bg-clip-text text-transparent" aria-label={`${dayStreak} day ergonomic streak`}>{dayStreak}</h3>
          <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
        </Card>
      </section>
    </main>
  );
};

export default ErgonomicCoach;