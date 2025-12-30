import { Star, Clock, Briefcase, MapPin } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SpecialistCardProps {
  specialist: Specialist;
  onSelect: (specialist: Specialist) => void;
}

const SpecialistCard = ({ specialist, onSelect }: SpecialistCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src={specialist.avatar}
              alt={specialist.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{specialist.name}</h3>
                <p className="text-sm text-primary font-medium">{specialist.profession}</p>
              </div>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold text-foreground whitespace-nowrap"
              >
                {specialist.price}
              </motion.span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1"
              >
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-medium text-foreground">{specialist.rating}</span>
                <span className="text-muted-foreground">({specialist.reviewCount})</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <Briefcase className="w-4 h-4" />
                <span>{specialist.experience}y exp</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-3 line-clamp-2"
        >
          {specialist.description}
        </motion.p>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mt-4 pt-4 border-t border-border"
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{specialist.distance} km</span>
            </div>
            <div className="flex items-center gap-1 text-success font-medium">
              <Clock className="w-4 h-4" />
              <span>{specialist.eta} min</span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm" onClick={() => onSelect(specialist)}>
              Select
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpecialistCard;
