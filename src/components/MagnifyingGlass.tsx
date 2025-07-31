import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalAccessibility } from '@/hooks/use-accessibility';

interface MagnifyingGlassProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
  magnificationLevel?: number;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  isActive = false,
  onToggle,
  magnificationLevel = 2,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const glassRef = useRef<HTMLDivElement>(null);
  const { isMagnifier } = useGlobalAccessibility();

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => onToggle?.(!isActive)}
        className="fixed top-4 right-4 z-50 rounded-full p-3"
        size="sm"
        variant="outline"
        aria-label="Toggle magnifying glass overlay"
      >
        {isActive ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>

      {/* Magnifying Glass Overlay */}
      {isVisible && (
        <div
          ref={glassRef}
          className="fixed pointer-events-none z-40 rounded-full border-4 border-primary shadow-lg overflow-hidden"
          style={{
            left: position.x - 75,
            top: position.y - 75,
            width: '150px',
            height: '150px',
            background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="white" stroke="black" stroke-width="2"/><text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="12" fill="black">Magnified</text></svg>')`,
            backgroundSize: 'cover',
            transform: `scale(${magnificationLevel})`,
            transformOrigin: 'center',
          }}
        >
          <div 
            className="w-full h-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
            style={{
              transform: `scale(${1 / magnificationLevel})`,
            }}
          >
            <div className="text-xs text-center">
              <Search className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-primary font-medium">
                {magnificationLevel}x Zoom
              </p>
              {isMagnifier && (
                <p className="text-xs text-muted-foreground mt-1">
                  Global zoom active
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isActive && (
        <div className="fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
          <div className="flex items-start space-x-2">
            <Search className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Magnifying Glass Active</p>
              <p className="text-xs opacity-90">
                Move mouse to magnify content. Click the X to close.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MagnifyingGlass; 