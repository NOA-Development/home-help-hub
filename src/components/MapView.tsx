import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  showSpecialist?: boolean;
  specialistPosition?: { x: number; y: number };
  userPosition?: { x: number; y: number };
}

const MapView = ({ showSpecialist = false, specialistPosition, userPosition }: MapViewProps) => {
  const [animatedPosition, setAnimatedPosition] = useState(specialistPosition || { x: 30, y: 40 });

  useEffect(() => {
    if (showSpecialist && specialistPosition) {
      // Animate the specialist moving towards user
      const interval = setInterval(() => {
        setAnimatedPosition((prev) => ({
          x: prev.x + (70 - prev.x) * 0.02,
          y: prev.y + (60 - prev.y) * 0.02,
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showSpecialist, specialistPosition]);

  return (
    <div className="relative w-full h-full min-h-[300px] gradient-map rounded-2xl overflow-hidden">
      {/* Map grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 Q25,45 50,50 T100,50" stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
        <path d="M50,0 Q45,25 50,50 T50,100" stroke="hsl(var(--border))" strokeWidth="3" fill="none" />
        <path d="M20,20 Q35,35 70,30" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        <path d="M80,70 Q65,60 30,75" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
      </svg>

      {/* User location marker */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: `${userPosition?.x || 70}%`, top: `${userPosition?.y || 60}%` }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/20 animate-pulse-ring" />
          <div className="w-12 h-12 rounded-full bg-primary shadow-glow flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-medium bg-card px-2 py-1 rounded-full shadow-sm border border-border">You</span>
        </div>
      </div>

      {/* Specialist marker */}
      {showSpecialist && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-100"
          style={{ left: `${animatedPosition.x}%`, top: `${animatedPosition.y}%` }}
        >
          <div className="relative animate-bounce-slow">
            <div className="w-10 h-10 rounded-full bg-accent shadow-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-accent-foreground" />
            </div>
          </div>
        </div>
      )}

      {/* Route line when tracking */}
      {showSpecialist && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d={`M${animatedPosition.x},${animatedPosition.y} Q${(animatedPosition.x + 70) / 2},${animatedPosition.y - 10} 70,60`}
            stroke="hsl(var(--primary))" 
            strokeWidth="0.8" 
            strokeDasharray="2,2"
            fill="none"
            className="animate-fade-in"
          />
        </svg>
      )}
    </div>
  );
};

export default MapView;
