import { useState } from 'react';
import { ArrowUpDown, Star, Clock, Briefcase } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import SpecialistCard from './SpecialistCard';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-4 px-1"
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">Available Specialists</h2>
          <p className="text-sm text-muted-foreground">{specialists.length} found near you</p>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Sort options */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
      >
        {sortOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Button
              variant={sortBy === option.value ? 'default' : 'secondary'}
              size="sm"
              className="flex-shrink-0 gap-1.5"
              onClick={() => setSortBy(option.value)}
            >
              {option.icon}
              {option.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedSpecialists.map((specialist, index) => (
            <motion.div
              key={specialist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              layout
            >
              <SpecialistCard specialist={specialist} onSelect={onSelectSpecialist} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SpecialistList;
