import { useState } from 'react';
import { ArrowUpDown, Star, Clock, Briefcase } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import SpecialistCard from './SpecialistCard';
import { Button } from '@/components/ui/button';

interface SpecialistListProps {
  specialists: Specialist[];
  onSelectSpecialist: (specialist: Specialist) => void;
}

type SortOption = 'rating' | 'eta' | 'experience' | 'price';

const SpecialistList = ({ specialists, onSelectSpecialist }: SpecialistListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const sortedSpecialists = [...specialists].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'eta':
        return a.eta - b.eta;
      case 'experience':
        return b.experience - a.experience;
      case 'price':
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      default:
        return 0;
    }
  });

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'rating', label: 'Rating', icon: <Star className="w-4 h-4" /> },
    { value: 'eta', label: 'Fastest', icon: <Clock className="w-4 h-4" /> },
    { value: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Available Specialists</h2>
          <p className="text-sm text-muted-foreground">{specialists.length} found near you</p>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Sort options */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? 'default' : 'secondary'}
            size="sm"
            className="flex-shrink-0 gap-1.5"
            onClick={() => setSortBy(option.value)}
          >
            {option.icon}
            {option.label}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {sortedSpecialists.map((specialist, index) => (
          <div key={specialist.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <SpecialistCard specialist={specialist} onSelect={onSelectSpecialist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialistList;
