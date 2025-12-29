import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Star, Clock, X, ChevronUp } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import { Button } from '@/components/ui/button';
import GoogleMapView from './GoogleMapView';

interface TrackingViewProps {
  specialist: Specialist;
  onCancel: () => void;
}

const TrackingView = ({ specialist, onCancel }: TrackingViewProps) => {
  const [eta, setEta] = useState(specialist.eta);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Countdown ETA
    const interval = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : prev));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMapView 
          showSpecialist={true}
          specialistPosition={{ lat: 40.72, lng: -74.01 }}
          userPosition={{ lat: 40.7128, lng: -74.006 }}
        />
        
        {/* Cancel button */}
        <Button
          variant="map"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* ETA Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-card rounded-xl shadow-card border border-border px-4 py-3 animate-scale-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Arriving in</p>
                <p className="text-lg font-bold text-foreground">{eta} min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div 
        className={`bg-card rounded-t-3xl shadow-xl border-t border-border transition-all duration-300 ${
          expanded ? 'h-[60%]' : 'h-auto'
        }`}
      >
        {/* Handle */}
        <button 
          className="w-full flex justify-center pt-3 pb-2"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="w-10 h-1 rounded-full bg-border" />
        </button>

        <div className="px-6 pb-6">
          {/* Specialist info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{specialist.name}</h3>
              <p className="text-primary font-medium">{specialist.profession}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-medium text-foreground">{specialist.rating}</span>
                <span className="text-sm text-muted-foreground">({specialist.reviewCount} reviews)</span>
              </div>
            </div>
            <ChevronUp className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="mb-6 animate-fade-in">
              <p className="text-muted-foreground text-sm mb-4">{specialist.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-lg font-bold text-foreground">{specialist.experience} years</p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-lg font-bold text-foreground">{specialist.price}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <Button variant="call" size="xl" className="flex-1">
              <Phone className="w-5 h-5 mr-2" />
              Call
            </Button>
            <Button variant="message" size="xl" className="flex-1">
              <MessageCircle className="w-5 h-5 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
