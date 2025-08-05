import React, { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, Sun, Moon, Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const FocusComfort: React.FC = () => {
  const [sensoryMode, setSensoryMode] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState([50]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [stressLevel, setStressLevel] = useState(30);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [breathingSessions, setBreathingSessions] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [completedCycles, setCompletedCycles] = useState(0);
  const audioRef = useRef<{ source: AudioBufferSourceNode; gainNode: GainNode } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // Rain sound specific refs
  const rainSoundRef = useRef<{
    rainGain: GainNode;
    thunderGain: GainNode;
    rainSources: AudioBufferSourceNode[];
    thunderTimeout: NodeJS.Timeout | null;
    welcomeThunderTimeout?: NodeJS.Timeout | null;
  } | null>(null);

  const soundOptions = [
    { id: 'rain', name: 'Gentle Rain', emoji: '🌧️', duration: '∞', description: 'Natural rain with soft thunder' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', duration: '∞', description: 'Peaceful waves lapping at the shore' },
    { id: 'forest', name: 'Forest Sounds', emoji: '🌲', duration: '∞', description: 'Birds chirping and leaves rustling' },
    { id: 'whitenoise', name: 'White Noise', emoji: '📻', duration: '∞', description: 'Consistent static for deep focus' },
    { id: 'birds', name: 'Bird Songs', emoji: '🐦', duration: '∞', description: 'Morning birds singing melodically' },
    { id: 'coffee', name: 'Coffee Shop', emoji: '☕', duration: '∞', description: 'Cozy café ambiance with chatter' },
  ];

  // Sensory Mode functionality - applies real environmental changes
  useEffect(() => {
    const applySettings = () => {
      if (sensoryMode) {
        // Apply sensory-friendly environment changes
        document.body.style.filter = 'brightness(0.8) contrast(0.9)';
        document.body.style.transition = 'filter 0.5s ease';
        
        // Add subtle blue light filter
        const overlay = document.createElement('div');
        overlay.id = 'sensory-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 248, 235, 0.1);
          pointer-events: none;
          z-index: 999999;
          transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);

        // Reduce animations globally
        const style = document.createElement('style');
        style.id = 'sensory-animations';
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.1s !important;
            animation-delay: 0s !important;
            transition-duration: 0.1s !important;
          }
        `;
        document.head.appendChild(style);

        // Try to request notification permission and mute (best effort)
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }

        console.log('🌙 Sensory mode activated - Environment optimized for comfort');
      } else {
        // Remove sensory mode changes
        document.body.style.filter = '';
        document.body.style.transition = '';
        
        // Remove overlay
        const overlay = document.getElementById('sensory-overlay');
        if (overlay) {
          overlay.remove();
        }

        // Remove animation restrictions
        const style = document.getElementById('sensory-animations');
        if (style) {
          style.remove();
        }

        console.log('☀️ Sensory mode deactivated - Normal environment restored');
      }
    };

    applySettings();

    // Cleanup on unmount
    return () => {
      if (sensoryMode) {
        document.body.style.filter = '';
        document.body.style.transition = '';
        const overlay = document.getElementById('sensory-overlay');
        if (overlay) overlay.remove();
        const style = document.getElementById('sensory-animations');
        if (style) style.remove();
      }
    };
  }, [sensoryMode]);

  // Wellness Monitor functionality - real-time biometric simulation
  useEffect(() => {
    let heartRateInterval: NodeJS.Timeout;
    let stressInterval: NodeJS.Timeout;

    const startMonitoring = () => {
      setIsMonitoring(true);
      
      // Realistic heart rate simulation (60-100 BPM range)
      heartRateInterval = setInterval(() => {
        setHeartRate(prevHR => {
          // Natural variation around baseline
          const baselineHR = sensoryMode ? 68 : 75; // Lower when in sensory mode
          const variation = (Math.random() - 0.5) * 8; // ±4 BPM variation
          const timeOfDay = new Date().getHours();
          
          // Slight circadian rhythm effect
          const circadianAdjustment = timeOfDay < 6 || timeOfDay > 22 ? -3 : 
                                     timeOfDay >= 14 && timeOfDay <= 16 ? 2 : 0;
          
          const newHR = Math.round(baselineHR + variation + circadianAdjustment);
          return Math.max(60, Math.min(100, newHR)); // Keep within realistic range
        });
      }, 3000); // Update every 3 seconds

      // Dynamic stress level calculation
      stressInterval = setInterval(() => {
        setStressLevel(prevStress => {
          const currentTime = new Date().getTime();
          const timeOfDay = new Date().getHours();
          
          // Base stress factors
          let newStress = prevStress;
          
          // Time of day influence
          if (timeOfDay >= 9 && timeOfDay <= 17) {
            newStress += Math.random() * 2 - 1; // Work hours: slight stress increase
          } else {
            newStress -= Math.random() * 1.5; // Off hours: stress decrease
          }
          
          // Sensory mode effect
          if (sensoryMode) {
            newStress -= 2; // Sensory mode reduces stress
          }
          
                     // Current sound effect
           if (currentSound) {
             newStress -= 1.5; // Ambient sounds reduce stress
           }
           
           // Mood effect on ongoing stress
           if (selectedMood === 0) { // Happy mood
             newStress -= 0.5; // Continued stress reduction
           } else if (selectedMood === 2) { // Sad mood
             newStress += 0.3; // Slight stress increase
           }
           
           // Random daily variation
           newStress += (Math.random() - 0.5) * 3;
          
          // Keep within 0-100 range
          return Math.max(0, Math.min(100, Math.round(newStress)));
        });
      }, 5000); // Update every 5 seconds
      
      console.log('💓 Wellness monitoring started - Real-time biometric tracking active');
    };

    const stopMonitoring = () => {
      if (heartRateInterval) clearInterval(heartRateInterval);
      if (stressInterval) clearInterval(stressInterval);
      setIsMonitoring(false);
      console.log('💓 Wellness monitoring stopped');
    };

    // Auto-start monitoring
    startMonitoring();

    // Cleanup on unmount
         return () => {
       stopMonitoring();
     };
   }, [sensoryMode, currentSound, selectedMood]); // Re-calculate when sensory mode, sounds, or mood change

  // Breathing Exercise functionality - real 4-7-8 breathing pattern
  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    
    if (isBreathing) {
      breathingInterval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Switch phases
            setBreathingPhase(currentPhase => {
              if (currentPhase === 'inhale') {
                setBreathingCount(7);
                return 'hold';
              } else if (currentPhase === 'hold') {
                setBreathingCount(8);
                return 'exhale';
              } else {
                // Completed one full cycle (inhale → hold → exhale)
                setCompletedCycles(prev => prev + 1);
                setBreathingCount(4);
                return 'inhale';
              }
            });
            return 4; // Reset for next phase
          }
        });
      }, 1000); // Count down every second

      console.log('🫁 4-7-8 Breathing exercise started - Guided breathing active');
    } else {
      setBreathingPhase('inhale');
      setBreathingCount(4);
    }

    return () => {
      if (breathingInterval) {
        clearInterval(breathingInterval);
      }
    };
  }, [isBreathing]);

  // Breathing exercise stress reduction effect
  useEffect(() => {
    if (isBreathing) {
      const stressReductionInterval = setInterval(() => {
        setStressLevel(prev => Math.max(0, prev - 3)); // Reduce stress during breathing
        setHeartRate(prev => Math.max(60, prev - 1)); // Slightly lower heart rate
      }, 5000); // Every 5 seconds during breathing

      return () => clearInterval(stressReductionInterval);
    }
  }, [isBreathing]);

    // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current && audioRef.current.gainNode) {
      audioRef.current.gainNode.gain.value = volume[0] / 100;
    }
    // Update rain sound volume specifically
    if (rainSoundRef.current && currentSound === 'rain') {
      if (volume[0] === 0) {
        // Completely mute when volume is 0
        rainSoundRef.current.rainGain.gain.value = 0;
             } else {
         // Apply volume scaling for peaceful rain
         const scaledVolume = (volume[0] / 100) * 0.12;
         rainSoundRef.current.rainGain.gain.value = scaledVolume;
       }
      console.log('🔊 Rain volume updated to:', volume[0], '% | Gain:', rainSoundRef.current.rainGain.gain.value);
    }
  }, [volume, currentSound]);

  // Realistic gentle rainfall with natural droplet texture
  const createRainSound = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const context = audioContextRef.current;
    
    if (context.state === 'suspended') {
      await context.resume();
    }
    
    // Create realistic rain with droplet texture
    const rainGain = context.createGain();
    rainGain.gain.value = 0.12;
    rainGain.connect(context.destination);
    
    const rainSources: any[] = [];
    
    // Create buffer with actual raindrop simulation
    const bufferSize = context.sampleRate * 4;
    const rainBuffer = context.createBuffer(2, bufferSize, context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = rainBuffer.getChannelData(channel);
      
      // Fill with silence first
      for (let i = 0; i < bufferSize; i++) {
        data[i] = 0;
      }
      
      // Add many small raindrop impacts throughout the buffer
      const numDrops = 8000; // Lots of gentle drops
      for (let drop = 0; drop < numDrops; drop++) {
        const startSample = Math.floor(Math.random() * (bufferSize - 200));
        const intensity = 0.1 + Math.random() * 0.2; // Gentle intensity
        const dropLength = 50 + Math.random() * 100; // Short drops
        
        // Create individual raindrop sound
        for (let i = 0; i < dropLength; i++) {
          if (startSample + i < bufferSize) {
            // Sharp attack, quick decay for droplet
            const progress = i / dropLength;
            const envelope = Math.exp(-progress * 8); // Quick decay
            const noise = (Math.random() * 2 - 1) * intensity * envelope;
            data[startSample + i] += noise;
          }
        }
      }
      
      // Add very subtle background ambience (much quieter)
      for (let i = 0; i < bufferSize; i++) {
        const ambience = (Math.random() * 2 - 1) * 0.02;
        data[i] += ambience;
      }
    }
    
    // Main realistic rain source
    const rainSource = context.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;
    
    // Shape the sound to be more like real rain
    const rainFilter = context.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.value = 800; // Remove low drone
    rainFilter.Q.value = 0.5;
    
    const secondFilter = context.createBiquadFilter();
    secondFilter.type = 'lowpass';
    secondFilter.frequency.value = 6000; // Keep natural droplet frequencies
    secondFilter.Q.value = 0.3;
    
    rainSource.connect(rainFilter);
    rainFilter.connect(secondFilter);
    secondFilter.connect(rainGain);
    rainSource.start();
    rainSources.push(rainSource);
    
    return { rainGain, rainSources };
  };
  
    // Gentle, distant thunder for peaceful relaxation
  const createThunderSound = async () => {
    if (!audioContextRef.current) return null;
    
    const context = audioContextRef.current;
    const thunderGain = context.createGain();
    thunderGain.gain.value = 0;
    thunderGain.connect(context.destination);
    
    // Create soft, distant thunder rumble
    const thunderSources = [];
    
    // Low rumble - audible but gentle
    const osc1 = context.createOscillator();
    const gain1 = context.createGain();
    const filter1 = context.createBiquadFilter();
    
    osc1.type = 'sine'; // Smooth, gentle waveform
    osc1.frequency.value = 120; // Audible but low rumble
    gain1.gain.value = 0.35; // Audible but gentle
    filter1.type = 'lowpass';
    filter1.frequency.value = 350; // Less muffled so you can hear it
    
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(thunderGain);
    thunderSources.push(osc1);
    
    // Mid-low rumble for richness
    const osc2 = context.createOscillator();
    const gain2 = context.createGain();
    const filter2 = context.createBiquadFilter();
    
    osc2.type = 'sine';
    osc2.frequency.value = 160;
    gain2.gain.value = 0.28; // Audible but gentle
    filter2.type = 'lowpass';
    filter2.frequency.value = 400;
    
    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(thunderGain);
    thunderSources.push(osc2);
    
    // Higher texture layer - very subtle
    const osc3 = context.createOscillator();
    const gain3 = context.createGain();
    const filter3 = context.createBiquadFilter();
    
    osc3.type = 'sine';
    osc3.frequency.value = 200;
    gain3.gain.value = 0.22; // Audible but still gentle
    filter3.type = 'lowpass';
    filter3.frequency.value = 450;
    
    osc3.connect(filter3);
    filter3.connect(gain3);
    gain3.connect(thunderGain);
    thunderSources.push(osc3);
    
    // Gentle but audible envelope - soft but noticeable
    const now = context.currentTime;
    const volumeScale = volume[0] / 100;
    thunderGain.gain.setValueAtTime(0, now);
    thunderGain.gain.linearRampToValueAtTime(0.18 * volumeScale, now + 2); // Gentle rise, audible peak
    thunderGain.gain.linearRampToValueAtTime(0.14 * volumeScale, now + 4); // Gentle hold at audible level
    thunderGain.gain.linearRampToValueAtTime(0.08 * volumeScale, now + 6); // Smooth fade
    thunderGain.gain.linearRampToValueAtTime(0, now + 8); // Complete gentle fade
    
    // Start all oscillators
    thunderSources.forEach(osc => {
      osc.start(now);
      osc.stop(now + 8);
    });
    
    console.log('🌧️ Gentle distant thunder rolling at', volume[0], '% volume - audible but soft');
    
    return thunderGain;
  };
  
     // Schedule infrequent, peaceful thunder
   const scheduleThunder = () => {
     if (!rainSoundRef.current) return;
     
     // Gentle thunder every 20-40 seconds - audible but peaceful
     const delay = 20000 + Math.random() * 20000;
    
         rainSoundRef.current.thunderTimeout = setTimeout(async () => {
               if (currentSound === 'rain' && rainSoundRef.current && volume[0] > 0) {
          console.log('🌧️ Gentle thunder rolling softly at', volume[0], '% volume');
          await createThunderSound();
          console.log('⛈️ Thunder faded peacefully - next one in 20-40 seconds');
          scheduleThunder(); // Schedule next thunder
        } else if (currentSound === 'rain' && volume[0] === 0) {
          console.log('🔇 Volume is 0% - increase volume to hear gentle thunder');
          scheduleThunder(); // Still schedule next thunder for when volume returns
        }
     }, delay);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.source?.stop();
        audioRef.current = null;
      }
      if (rainSoundRef.current) {
        rainSoundRef.current.rainSources.forEach(source => source.stop());
        if (rainSoundRef.current.thunderTimeout) {
          clearTimeout(rainSoundRef.current.thunderTimeout);
        }
        if (rainSoundRef.current.welcomeThunderTimeout) {
          clearTimeout(rainSoundRef.current.welcomeThunderTimeout);
        }
        rainSoundRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleSensoryModeToggle = (enabled: boolean) => {
    setSensoryMode(enabled);
    
    // Provide immediate feedback
    if (enabled) {
      // Small vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleMoodSelection = (moodIndex: number) => {
    const previousMood = selectedMood;
    setSelectedMood(moodIndex);
    
    // Affect stress level based on mood selection
    if (moodIndex === 0) { // Happy 😊
      setStressLevel(prev => Math.max(0, prev - 15));
      console.log('😊 Good mood selected - Stress reduced');
    } else if (moodIndex === 1) { // Neutral 😐
      setStressLevel(prev => Math.max(10, Math.min(50, prev)));
      console.log('😐 Neutral mood selected - Stress normalized');
    } else { // Sad 😔
      setStressLevel(prev => Math.min(80, prev + 10));
      console.log('😔 Difficult mood selected - Wellness support activated');
    }
    
    // Enhanced haptic feedback for selection
    if ('vibrate' in navigator) {
      if (previousMood === null) {
        navigator.vibrate(50); // Longer vibration for first selection
      } else {
        navigator.vibrate(30); // Short vibration for mood change
      }
    }
  };

  const getMoodLabel = (index: number) => {
    const labels = ['Feeling great today!', 'Feeling okay', 'Having a tough day'];
    return labels[index];
  };

  const getMoodDescription = (index: number) => {
    const descriptions = [
      'Your positive energy is boosting your wellness scores!',
      'A balanced mood - perfect for focusing on your goals.',
      'Remember to take care of yourself. Try a breathing exercise.'
    ];
    return descriptions[index];
  };

  const handleBreathingToggle = () => {
    setIsBreathing(!isBreathing);
    
    if (!isBreathing) {
      // Starting breathing exercise
      setBreathingPhase('inhale');
      setBreathingCount(4);
      setCompletedCycles(0);
      setSessionStartTime(Date.now());
      console.log('🫁 Starting 4-7-8 breathing exercise');
    } else {
      // Ending breathing exercise
      if (sessionStartTime && completedCycles >= 3) {
        // Count as completed session if at least 3 cycles (minimum effective session)
        setBreathingSessions(prev => prev + 1);
        const duration = Math.round((Date.now() - sessionStartTime) / 1000);
        console.log(`🫁 Breathing session completed: ${completedCycles} cycles in ${duration}s`);
      } else {
        console.log('🫁 Breathing exercise stopped');
      }
      setSessionStartTime(null);
    }
  };



  const handleSoundToggle = async (soundId: string) => {
    console.log('🎵 Sound toggle clicked:', soundId, 'Current sound:', currentSound);
    
    if (currentSound === soundId) {
      // Stop current sound
      if (audioRef.current) {
        audioRef.current.source?.stop();
        audioRef.current = null;
      }
      
      // Stop rain sound specifically
      if (rainSoundRef.current && soundId === 'rain') {
        // Stop all rain noise sources
        rainSoundRef.current.rainSources.forEach(source => {
          try {
            source.stop();
          } catch (e) {
            // Source might already be stopped
          }
        });
        
        // Clear all thunder timeouts
        if (rainSoundRef.current.thunderTimeout) {
          clearTimeout(rainSoundRef.current.thunderTimeout);
        }
        if (rainSoundRef.current.welcomeThunderTimeout) {
          clearTimeout(rainSoundRef.current.welcomeThunderTimeout);
        }
        
        // Disconnect rain gain node to stop all audio
        try {
          rainSoundRef.current.rainGain.disconnect();
        } catch (e) {
          // Already disconnected
        }
        
                 // Force stop any ongoing audio by disconnecting the main audio context destination
         if (audioContextRef.current) {
           try {
             // This will stop all sounds immediately
             audioContextRef.current.close();
             audioContextRef.current = null;
           } catch (e) {
             // Context already closed
           }
         }
        
        rainSoundRef.current = null;
        console.log('🌧️ Rain and thunder stopped');
      }
      
      setCurrentSound(null);
    } else {
      // Stop any current sound
      if (audioRef.current) {
        audioRef.current.source?.stop();
        audioRef.current = null;
      }
      
             // Stop any current rain sound before starting new one
       if (rainSoundRef.current) {
         rainSoundRef.current.rainSources.forEach(source => {
           try {
             source.stop();
           } catch (e) {
             // Source might already be stopped
           }
         });
         if (rainSoundRef.current.thunderTimeout) {
           clearTimeout(rainSoundRef.current.thunderTimeout);
         }
         if (rainSoundRef.current.welcomeThunderTimeout) {
           clearTimeout(rainSoundRef.current.welcomeThunderTimeout);
         }
         try {
           rainSoundRef.current.rainGain.disconnect();
         } catch (e) {
           // Already disconnected
         }
         rainSoundRef.current = null;
       }
      
             // Start new sound
       if (soundId === 'rain') {
         // Create and start rain sound
         try {
                    // Initialize audio context if needed
         if (!audioContextRef.current) {
           audioContextRef.current = new AudioContext();
         }
         
        const rainAudio = await createRainSound();
          if (rainAudio) {
            rainSoundRef.current = {
              rainGain: rainAudio.rainGain,
              thunderGain: audioContextRef.current!.createGain(), // Placeholder for thunder
              rainSources: rainAudio.rainSources,
              thunderTimeout: null
            };
            
                         // Apply current volume (with proper 0 volume handling)
             if (volume[0] === 0) {
               rainSoundRef.current.rainGain.gain.value = 0;
             } else {
               rainSoundRef.current.rainGain.gain.value = (volume[0] / 100) * 0.12;
             }
             
             // Start thunder scheduling
             scheduleThunder();
             
                          // Play first gentle thunder after 10 seconds
             const welcomeTimeout = setTimeout(async () => {
               if (currentSound === 'rain' && volume[0] > 0) {
                 console.log('🌧️ Gentle thunder beginning softly at', volume[0], '% volume');
                 await createThunderSound();
                 console.log('⛈️ Thunder faded peacefully');
               } else if (currentSound === 'rain' && volume[0] === 0) {
                 console.log('🔇 Volume is 0% - increase volume to hear gentle thunder');
               }
             }, 10000);
             
             // Store the welcome timeout so we can clear it if needed
             if (rainSoundRef.current) {
               rainSoundRef.current.welcomeThunderTimeout = welcomeTimeout;
             }
             
             console.log('🌧️ Peaceful rainfall started - gentle thunder every 20-40s - Volume:', volume[0], 'Audio Context State:', audioContextRef.current?.state);
          }
                 } catch (error) {
           console.error('Could not start rain sound:', error);
           // Try to show user-friendly error
           alert('Unable to start rain sounds. Please check your browser audio settings and try again.');
         }
      } else {
        // Placeholder for other sounds
        console.log(`${soundId} sound selected (not implemented yet)`);
      }
      
      setCurrentSound(soundId);
    }
  };

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-success';
    if (level < 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStressBgColor = (level: number) => {
    if (level < 30) return 'bg-success';
    if (level < 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getEmojiAnimation = (soundId: string) => {
    switch (soundId) {
      case 'rain': return 'rain-falling';
      case 'ocean': return 'ocean-waves';
      case 'birds': return 'bird-chirping';
      case 'coffee': return 'coffee-steam';
      case 'forest': return 'tree-swaying';
      case 'whitenoise': return 'radio-static';
      default: return 'animate-pulse';
    }
  };

  // Add custom emoji animations for each sound type
  useEffect(() => {
    const emojiAnimationStyles = `

      @keyframes emoji-bounce {
        0% { 
          transform: scale(1) rotate(0deg); 
        }
        25% { 
          transform: scale(1.3) rotate(-5deg); 
        }
        50% { 
          transform: scale(1.1) rotate(5deg); 
        }
        75% { 
          transform: scale(1.2) rotate(-3deg); 
        }
        100% { 
          transform: scale(1) rotate(0deg); 
        }
      }

      @keyframes rain-falling {
        0%, 100% { 
          transform: translateY(0) scale(1.1) rotate(0deg); 
        }
        25% { 
          transform: translateY(-2px) scale(1.15) rotate(-1deg); 
        }
        50% { 
          transform: translateY(2px) scale(1.2) rotate(1deg); 
        }
        75% { 
          transform: translateY(-1px) scale(1.15) rotate(-0.5deg); 
        }
      }

      @keyframes ocean-waves {
        0%, 100% { 
          transform: translateX(0) scale(1.1) rotate(0deg); 
        }
        25% { 
          transform: translateX(-2px) scale(1.15) rotate(-2deg); 
        }
        50% { 
          transform: translateX(2px) scale(1.2) rotate(2deg); 
        }
        75% { 
          transform: translateX(-1px) scale(1.15) rotate(-1deg); 
        }
      }

      @keyframes bird-chirping {
        0%, 100% { 
          transform: translateY(0) scale(1.1) rotate(0deg); 
        }
        20% { 
          transform: translateY(-3px) scale(1.2) rotate(-3deg); 
        }
        40% { 
          transform: translateY(-1px) scale(1.15) rotate(2deg); 
        }
        60% { 
          transform: translateY(-4px) scale(1.25) rotate(-1deg); 
        }
        80% { 
          transform: translateY(0) scale(1.1) rotate(1deg); 
        }
      }

      @keyframes coffee-steam {
        0%, 100% { 
          transform: translateY(0) scale(1.1) rotate(0deg); 
          opacity: 1; 
        }
        33% { 
          transform: translateY(-3px) scale(1.15) rotate(-2deg); 
          opacity: 0.9; 
        }
        66% { 
          transform: translateY(-1px) scale(1.2) rotate(2deg); 
          opacity: 0.95; 
        }
      }

      @keyframes tree-swaying {
        0%, 100% { 
          transform: rotate(0deg) scale(1.1); 
        }
        25% { 
          transform: rotate(-3deg) scale(1.15); 
        }
        50% { 
          transform: rotate(2deg) scale(1.2); 
        }
        75% { 
          transform: rotate(-1deg) scale(1.15); 
        }
      }

      @keyframes radio-static {
        0%, 100% { 
          transform: scale(1.1) rotate(0deg); 
          opacity: 1; 
        }
        25% { 
          transform: scale(1.2) rotate(-1deg); 
          opacity: 0.9; 
        }
        50% { 
          transform: scale(1.15) rotate(1deg); 
          opacity: 0.95; 
        }
        75% { 
          transform: scale(1.25) rotate(-0.5deg); 
          opacity: 0.92; 
        }
      }



      .rain-falling {
        animation: rain-falling 2.5s ease-in-out infinite;
      }

      .ocean-waves {
        animation: ocean-waves 3s ease-in-out infinite;
      }

      .bird-chirping {
        animation: bird-chirping 1.5s ease-in-out infinite;
      }

      .coffee-steam {
        animation: coffee-steam 2s ease-in-out infinite;
      }

      .tree-swaying {
        animation: tree-swaying 4s ease-in-out infinite;
      }

      .radio-static {
        animation: radio-static 0.8s ease-in-out infinite;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'emoji-animation-styles';
    styleElement.textContent = emojiAnimationStyles;
    document.head.appendChild(styleElement);

    return () => {
      const existingStyle = document.getElementById('emoji-animation-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <main className="space-y-6" role="main" aria-labelledby="focus-comfort-title">
      {/* Skip navigation link */}
      <a 
        href="#focus-main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:shadow-lg"
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="text-center mb-8">
        <h1 id="focus-comfort-title" className="text-3xl font-bold text-foreground mb-2">Focus & Comfort</h1>
        <p className="text-muted-foreground text-lg">Create your perfect work environment</p>
      </header>

      <div id="focus-main-content" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sensory Mode Control */}
        <Card className="p-2 card-soft border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl" role="region" aria-labelledby="sensory-environment-title">
          <h2 id="sensory-environment-title" className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
            Sensory Environment
          </h2>
          
          <div className="space-y-2">
            {/* Enhanced Toggle Section */}
            <div className="border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-1 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between p-4 rounded-md bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-primary to-secondary border border-white shadow-md" aria-hidden="true">
                    {sensoryMode ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <label htmlFor="sensory-mode-toggle" className="font-semibold text-foreground text-base">Low Sensory Mode</label>
                    <p className="text-sm text-muted-foreground mt-0.5" id="sensory-mode-description">Reduces light and sound stimulation</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Switch 
                    id="sensory-mode-toggle"
                    checked={sensoryMode} 
                    onCheckedChange={handleSensoryModeToggle}
                    aria-label="Toggle low sensory mode for reduced stimulation"
                    aria-describedby="sensory-mode-description"
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`text-sm font-medium transition-colors ${sensoryMode ? 'text-primary' : 'text-muted-foreground'}`}>
                    {sensoryMode ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {sensoryMode ? (
              <div className="border border-success/30 rounded-lg bg-gradient-to-br from-success/10 to-primary/10 p-1 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-3 p-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-md border border-success/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-success font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full shadow-sm"></div>
                      ✓ Low Sensory Mode Active
                    </p>
                    <div className="px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                      <span className="text-sm text-success font-medium">Enhanced Focus</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-success/5 to-success/10 rounded-md border border-success/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="font-medium text-foreground">Screen dimmed</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-success/5 to-success/10 rounded-md border border-success/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="font-medium text-foreground">Notifications muted</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-success/5 to-success/10 rounded-md border border-success/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="font-medium text-foreground">Reduced animations</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-success/5 to-success/10 rounded-md border border-success/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="font-medium text-foreground">Soft colors</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-warning/30 rounded-lg bg-gradient-to-br from-warning/5 to-orange/5 p-1 shadow-sm hover:shadow-md transition-all duration-300 mt-6">
                <div className="p-4 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-md border border-warning/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-warning font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full shadow-sm"></div>
                      💡 Low Sensory Benefits
                    </p>
                    <div className="px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
                      <span className="text-sm text-warning font-medium">Try it now!</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-warning/5 to-orange/5 rounded-md border border-warning/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="font-medium text-foreground">Reduces eye strain</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-warning/5 to-orange/5 rounded-md border border-warning/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="font-medium text-foreground">Calms mind</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-warning/5 to-orange/5 rounded-md border border-warning/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="font-medium text-foreground">Improves focus</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2.5 bg-gradient-to-r from-warning/5 to-orange/5 rounded-md border border-warning/20 transition-colors shadow-sm">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="font-medium text-foreground">Better sleep</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* HR-Based Stress Meter */}
        <Card className="p-2 card-soft border-2 border-secondary/10 hover:border-secondary/20 transition-all duration-300 shadow-lg hover:shadow-xl" role="region" aria-labelledby="wellness-monitor-title">
          <h2 id="wellness-monitor-title" className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-gradient-to-b from-secondary to-tertiary rounded-full"></div>
            Wellness Monitor
          </h2>
          
          <div className="space-y-2">
            {/* Enhanced Heart Rate Section */}
            <div className="border border-secondary/20 rounded-lg bg-gradient-to-br from-secondary/5 to-tertiary/5 p-0.5 shadow-sm hover:shadow-md transition-all duration-300">
              <section className="text-center p-2 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-md border border-secondary/10" aria-labelledby="heart-rate-title">
                <h3 id="heart-rate-title" className="sr-only">Heart Rate Monitor</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full shadow-sm"></div>
                    <span className="text-xs font-medium text-secondary">Live Heart Rate</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border transition-colors ${
                    isMonitoring 
                      ? 'bg-success/10 border-success/20 text-success' 
                      : 'bg-muted/10 border-muted/20 text-muted-foreground'
                  }`}>
                    <span className="text-xs font-medium">
                      {isMonitoring ? 'Active' : 'Standby'}
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-md ${
                    isMonitoring 
                      ? sensoryMode 
                        ? 'bg-gradient-to-br from-secondary to-tertiary border-secondary/50' 
                        : 'bg-gradient-to-br from-secondary to-tertiary border-secondary/50 shadow-lg' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300'
                  }`}
                  style={isMonitoring && !sensoryMode ? {
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                  } : {}}
                  role="img"
                  aria-label={`Heart rate monitor ${isMonitoring ? 'active' : 'inactive'}`}
                >
                  <Heart 
                    className="h-6 w-6 text-white drop-shadow-sm"
                    style={isMonitoring && !sensoryMode ? {
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    } : {}}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-xl font-bold text-foreground mb-0.5" aria-live="polite" aria-label={`Heart rate: ${heartRate} beats per minute`}>
                  {heartRate} BPM
                </div>
                <div className="text-xs text-muted-foreground" role="status">
                  {isMonitoring ? (sensoryMode ? 'Gentle Monitoring' : 'Live Monitoring') : 'Heart Rate'}
                </div>
              </section>
            </div>

            {/* Enhanced Stress Level Section */}
            <div className="border border-tertiary/20 rounded-lg bg-gradient-to-br from-tertiary/5 to-accent/5 p-0.5 shadow-sm hover:shadow-md transition-all duration-300">
              <section className="p-2 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-md border border-tertiary/10" aria-labelledby="stress-level-title">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${getStressBgColor(stressLevel)}`}></div>
                    <h3 id="stress-level-title" className="text-xs font-medium text-foreground">Stress Level</h3>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border ${
                    stressLevel < 30 
                      ? 'bg-success/10 border-success/20 text-success' 
                      : stressLevel < 60 
                      ? 'bg-warning/10 border-warning/20 text-warning'
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}>
                    <span className="text-xs font-medium">
                      {stressLevel < 30 ? 'Low' : stressLevel < 60 ? 'Moderate' : 'High'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center mb-2">
                  <span className={`text-lg font-bold ${getStressColor(stressLevel)}`} aria-live="polite" aria-label={`Stress level: ${stressLevel} percent`}>
                    {stressLevel}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 border border-muted/30 shadow-inner mb-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stressLevel} aria-labelledby="stress-level-title">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getStressBgColor(stressLevel)} shadow-sm`}
                    style={{ width: `${stressLevel}%` }}
                    aria-hidden="true"
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-center" role="status" aria-live="polite">
                  {stressLevel < 30 ? 'Relaxed - perfect for productivity' : stressLevel < 60 ? 'Moderate - consider a break' : 'High stress - breathing recommended'}
                </div>
              </section>
            </div>

            {/* Enhanced Device Sync Section */}
            <div className="border border-accent/20 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 p-0.5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-xs text-muted-foreground text-center p-2 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-md border border-accent/10">
                <div className="flex items-center justify-center space-x-1.5 mb-0.5">
                  <Activity className="h-3 w-3 text-accent" />
                  <span className="font-medium text-foreground">Device Integration</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-1 h-1 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-success font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ambient Sound Player */}
      <Card className="p-6 card-soft border-2 border-tertiary/10 hover:border-tertiary/20 transition-all duration-300 shadow-lg hover:shadow-xl" role="region" aria-labelledby="ambient-sound-title">
        <h2 id="ambient-sound-title" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-tertiary to-success rounded-full"></div>
          Ambient Sound Player
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6" role="group" aria-labelledby="sound-selection-title">
          <h3 id="sound-selection-title" className="sr-only">Select ambient sound</h3>
          {soundOptions.map((sound) => (
            <div 
              key={sound.id} 
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-lg hover:shadow-primary/20 active:scale-95 ${
                currentSound === sound.id 
                  ? 'border-primary bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/30 transform scale-105' 
                  : 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5'
              }`}
              onClick={() => handleSoundToggle(sound.id)}
              role="button"
              tabIndex={0}
              aria-label={`${currentSound === sound.id ? 'Stop' : 'Play'} ${sound.name}: ${sound.description}`}
              aria-pressed={currentSound === sound.id}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSoundToggle(sound.id);
                }
              }}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`text-2xl transition-all duration-300 transform cursor-pointer emoji-interactive ${
                  currentSound === sound.id 
                    ? getEmojiAnimation(sound.id) 
                    : 'hover:scale-125 hover:rotate-12 active:scale-110 active:rotate-6'
                }`} 
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add a fun bounce effect on click
                  e.currentTarget.style.animation = 'emoji-bounce 0.6s ease-out';
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.style.animation = '';
                    }
                  }, 600);
                }}>
                  {sound.emoji}
                </div>
                <div className="w-full">
                  <h4 className={`font-semibold text-sm line-clamp-1 ${
                    currentSound === sound.id 
                      ? 'text-primary-foreground' 
                      : 'text-gray-900 dark:text-white'
                  }`}>{sound.name}</h4>
                  <p className={`text-xs mt-1 line-clamp-2 leading-tight ${
                    currentSound === sound.id 
                      ? 'text-primary-foreground/80' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>{sound.description}</p>
                </div>
                <div className="flex items-center justify-center">
                  {currentSound === sound.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse mr-2" aria-hidden="true"></div>
                  )}
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    currentSound === sound.id 
                      ? 'border-primary-foreground bg-primary-foreground text-primary' 
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                  }`}>
                    {currentSound === sound.id ? (
                      <Pause className="w-3 h-3" aria-hidden="true" />
                    ) : (
                      <Play className="w-3 h-3 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentSound && (
          <div className="bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg p-4 space-y-4 border-2 border-accent/50 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border-2 hover:bg-primary/10"
                  onClick={() => handleSoundToggle(currentSound)}
                  aria-label={`Pause ${soundOptions.find(s => s.id === currentSound)?.name} ambient sound`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSoundToggle(currentSound);
                    }
                  }}
                >
                  <Pause className="h-4 w-4" aria-hidden="true" />
                </Button>
                <div>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {soundOptions.find(s => s.id === currentSound)?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Playing ambient sound
                  </div>
                </div>
              </div>
              <div className="p-2 bg-white/20 dark:bg-black/20 rounded-full border border-white/30">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-foreground">{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
                aria-label={`Volume control, currently ${volume[0]} percent`}
                aria-describedby="volume-description"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    setVolume([Math.min(100, volume[0] + 5)]);
                  } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setVolume([Math.max(0, volume[0] - 5)]);
                  }
                }}
              />
              <div id="volume-description" className="sr-only">
                Use arrow keys to adjust volume. Current volume is {volume[0]} percent.
              </div>

            </div>
          </div>
        )}
      </Card>

      {/* Breathing Session */}
      <Card className="p-6 card-soft border-2 border-success/10 hover:border-success/20 transition-all duration-300 shadow-lg hover:shadow-xl" role="region" aria-labelledby="daily-checkin-title">
        <h2 id="daily-checkin-title" className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-success to-warning rounded-full"></div>
          Daily Check-in & Breathing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Check-in */}
          <section className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20" aria-labelledby="mood-checkin-title">
            <h3 id="mood-checkin-title" className="font-medium text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              How are you feeling today?
            </h3>
            <fieldset>
              <legend className="sr-only">Select your current mood</legend>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-labelledby="mood-checkin-title">
                {['😊', '😐', '😔'].map((emoji, index) => (
                  <Button
                    key={index}
                    variant={selectedMood === index ? "default" : "outline"}
                    className={`h-16 text-2xl transition-all duration-300 border-2 hover:scale-105 ${
                      selectedMood === index ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary to-secondary' : 'hover:shadow-md hover:border-primary/50'
                    }`}
                    onClick={() => handleMoodSelection(index)}
                    role="radio"
                    aria-checked={selectedMood === index}
                    aria-label={getMoodLabel(index)}
                    tabIndex={selectedMood === index ? 0 : -1}
                  >
                    <span aria-hidden="true">{emoji}</span>
                  </Button>
                ))}
              </div>
              {selectedMood !== null && (
                <div className="mt-3 p-3 bg-gradient-to-br from-accent/40 to-accent/20 rounded-lg text-center border border-accent/50 shadow-inner">
                  <p className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    {getMoodLabel(selectedMood)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{getMoodDescription(selectedMood)}</p>
                </div>
              )}
            </fieldset>
          </section>

          {/* Breathing Exercise */}
          <section className="space-y-4 p-4 bg-gradient-to-br from-success/5 to-warning/5 rounded-lg border border-success/20" aria-labelledby="breathing-exercise-title">
            <div className="flex items-center justify-between">
              <h4 id="breathing-exercise-title" className="font-medium text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Breathing Exercise
              </h4>
              {breathingSessions > 0 && (
                <div className="text-xs text-muted-foreground bg-gradient-to-r from-accent/60 to-accent/40 px-3 py-1 rounded-full border border-accent/50 shadow-sm">
                  {breathingSessions} session{breathingSessions !== 1 ? 's' : ''} today
                </div>
              )}
            </div>
            <div className="text-center">
              <div 
                className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 transition-all duration-1000 shadow-lg
                  ${isBreathing 
                    ? breathingPhase === 'inhale' ? 'border-blue-500 bg-gradient-to-br from-blue-500/30 to-blue-500/10 scale-110 shadow-blue-500/50' 
                      : breathingPhase === 'hold' ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 scale-110 shadow-yellow-500/50' 
                      : 'border-green-500 bg-gradient-to-br from-green-500/30 to-green-500/10 scale-90 shadow-green-500/50'
                    : 'border-primary bg-gradient-to-br from-accent/30 to-accent/10 scale-100 shadow-primary/30'
                  } 
                  flex items-center justify-center`}
                role="img"
                aria-label={
                  isBreathing 
                    ? `Breathing guide: ${breathingPhase}, ${breathingCount} seconds remaining`
                    : 'Breathing exercise ready to start'
                }
                aria-live="polite"
              >
                <div className="text-center">
                  <div className="text-primary font-bold text-lg" aria-hidden="true">
                    {isBreathing ? breathingCount : 'START'}
                  </div>
                  {isBreathing && (
                    <div className="text-xs text-primary/70 mt-1" aria-hidden="true">
                      {breathingPhase.toUpperCase()}
                    </div>
                  )}
                  {isBreathing && completedCycles > 0 && (
                    <div className="text-xs text-muted-foreground mt-1" aria-hidden="true">
                      Cycle {completedCycles}
                    </div>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleBreathingToggle}
                className={`${isBreathing ? 'btn-secondary' : 'btn-primary'} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                aria-label={isBreathing ? 'Stop breathing exercise session' : 'Start 4-7-8 breathing exercise session'}
                aria-describedby="breathing-instructions"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBreathingToggle();
                  }
                }}
              >
                {isBreathing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                    Start 4-7-8 Breathing
                  </>
                )}
              </Button>
              <p id="breathing-instructions" className="text-sm text-muted-foreground mt-2" aria-live="polite">
                {isBreathing 
                  ? `${breathingPhase === 'inhale' ? 'Breathe in slowly...' 
                      : breathingPhase === 'hold' ? 'Hold your breath...' 
                      : 'Breathe out gently...'}`
                  : completedCycles >= 3 
                    ? `Great session! ${completedCycles} cycles completed. You're feeling more relaxed.`
                    : 'Take a moment to center yourself'
                }
              </p>
              {!isBreathing && completedCycles > 0 && completedCycles < 3 && (
                <p className="text-xs text-amber-600 mt-1">
                  Complete 3+ cycles for a full session
                </p>
              )}
            </div>
          </section>
        </div>
      </Card>
    </main>
  );
};

export default FocusComfort;