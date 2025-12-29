import { Star, Clock, Briefcase, MapPin } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import { Button } from '@/components/ui/button';

interface SpecialistCardProps {
  specialist: Specialist;
  onSelect: (specialist: Specialist) => void;
}

const SpecialistCard = ({ specialist, onSelect }: SpecialistCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden animate-scale-in">
      <div className="p-4">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{specialist.name}</h3>
                <p className="text-sm text-primary font-medium">{specialist.profession}</p>
              </div>
              <span className="text-lg font-bold text-foreground whitespace-nowrap">{specialist.price}</span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-medium text-foreground">{specialist.rating}</span>
                <span className="text-muted-foreground">({specialist.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{specialist.experience}y exp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{specialist.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
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
          <Button size="sm" onClick={() => onSelect(specialist)}>
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
