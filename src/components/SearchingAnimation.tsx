import { useEffect, useState } from 'react';
import { Search, Wrench, Zap, Droplets, Flower2 } from 'lucide-react';

const SearchingAnimation = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const icons = [Wrench, Zap, Droplets, Flower2];

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative mb-8">
        {/* Outer pulse rings */}
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/20 animate-pulse-ring" />
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        
        {/* Center icon container */}
        <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow">
          <Search className="w-10 h-10 text-primary-foreground animate-bounce-slow" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        Finding specialists{dots}
      </h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Searching for the best professionals near you
      </p>

      {/* Floating service icons */}
      <div className="flex gap-4 mt-8">
        {icons.map((Icon, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center animate-bounce-slow"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchingAnimation;
