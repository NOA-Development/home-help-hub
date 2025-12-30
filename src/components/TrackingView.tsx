import { useState, useEffect, useMemo, useRef } from 'react';
import { Phone, MessageCircle, Star, Clock, X, MapPin, Navigation, Briefcase, Award, TrendingUp } from 'lucide-react';
import { Specialist } from '@/types/specialist';
import { Button } from '@/components/ui/button';
import LeafletMapView from './LeafletMapView';
import CallDialog from './CallDialog';
import MessageDialog from './MessageDialog';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface TrackingViewProps {
  specialist: Specialist;
  onCancel: () => void;
}

// Constants for ETA calculation
const METERS_PER_DEGREE = 111000; // Approximate meters per degree of latitude
const SPEED_METERS_PER_MINUTE = 50; // Slow walking/driving speed
const ETA_UPDATE_INTERVAL_MS = 1000; // Update every second

const TrackingView = ({ specialist, onCancel }: TrackingViewProps) => {
  const [eta, setEta] = useState(specialist.eta);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [specialistPosition, setSpecialistPosition] = useState({ 
    lat: 40.72, 
    lng: -74.01 
  });
  const [distance, setDistance] = useState(specialist.distance);
  
  const userPosition = useMemo(() => ({ lat: 40.7128, lng: -74.006 }), []);
  const cardRef = useRef<HTMLDivElement>(null);
  const etaRef = useRef<HTMLDivElement>(null);

  // Calculate distance between two points (simplified)
  const calculateDistance = (pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }) => {
    const latDiff = pos2.lat - pos1.lat;
    const lngDiff = pos2.lng - pos1.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  };

  useEffect(() => {
    // Animate card entrance on desktop
    if (cardRef.current && window.innerWidth >= 768) {
      gsap.fromTo(
        cardRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Synchronize ETA with distance
    const interval = setInterval(() => {
      setSpecialistPosition((prev) => {
        const dist = calculateDistance(prev, userPosition);
        
        // Update ETA based on distance (rough calculation)
        const distanceInMeters = dist * METERS_PER_DEGREE;
        const calculatedEta = Math.max(1, Math.ceil(distanceInMeters / SPEED_METERS_PER_MINUTE));
        const calculatedDistance = (distanceInMeters / 1000).toFixed(1);
        
        // Animate ETA change
        if (etaRef.current && calculatedEta !== eta) {
          gsap.fromTo(
            etaRef.current,
            { scale: 1.1, opacity: 0.7 },
            { scale: 1, opacity: 1, duration: 0.3 }
          );
        }
        
        setEta(calculatedEta);
        setDistance(parseFloat(calculatedDistance));
        
        // Update specialist position (move slowly towards user)
        const newLat = prev.lat + (userPosition.lat - prev.lat) * 0.008;
        const newLng = prev.lng + (userPosition.lng - prev.lng) * 0.008;
        return { lat: newLat, lng: newLng };
      });
    }, ETA_UPDATE_INTERVAL_MS);
    
    return () => clearInterval(interval);
  }, [userPosition, eta]);

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Mobile Layout (unchanged) */}
      <div className="md:hidden flex flex-col h-full">
        {/* Map */}
        <div className="flex-1 relative">
          <LeafletMapView 
            showSpecialist={true}
            specialistPosition={specialistPosition}
            userPosition={userPosition}
            height="100%"
          />
          
          {/* Cancel button */}
          <Button
            variant="map"
            size="icon"
            className="absolute top-4 right-4 z-[1000]"
            onClick={onCancel}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* ETA Badge */}
          <div className="absolute bottom-4 right-4 z-[1000]">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-card rounded-xl shadow-card border border-border px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Arriving in</p>
                  <p className="text-lg font-bold text-foreground" ref={etaRef}>{eta} min</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="bg-card rounded-t-3xl shadow-xl border-t border-border"
        >
          {/* Handle */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          <div className="px-6 pb-6">
            {/* Specialist info */}
            <div className="flex items-center gap-4 mb-6">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
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
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <Button 
                variant="call" 
                size="xl" 
                className="flex-1"
                onClick={() => setShowCallDialog(true)}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call
              </Button>
              <Button 
                variant="message" 
                size="xl" 
                className="flex-1"
                onClick={() => setShowMessageDialog(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout (new split-screen design) */}
      <div className="hidden md:flex h-full">
        {/* Left Side - Map (60%) */}
        <div className="flex-[6] relative">
          <LeafletMapView 
            showSpecialist={true}
            specialistPosition={specialistPosition}
            userPosition={userPosition}
            height="100%"
          />
          
          {/* Cancel button - Top left on desktop */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="absolute top-6 left-6 z-[1000]"
          >
            <Button
              variant="map"
              size="icon"
              className="w-12 h-12 shadow-2xl"
              onClick={onCancel}
            >
              <X className="w-6 h-6" />
            </Button>
          </motion.div>

          {/* Live tracking indicator */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000]"
          >
            <div className="bg-card rounded-full shadow-2xl border border-border px-6 py-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping" />
              </div>
              <span className="font-semibold text-foreground">Live Tracking</span>
            </div>
          </motion.div>

          {/* Distance indicator - Bottom left */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 left-6 z-[1000]"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Distance</p>
                  <p className="text-2xl font-bold text-foreground">{distance} km</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Specialist Info (40%) */}
        <div className="flex-[4] bg-card border-l border-border overflow-y-auto" ref={cardRef}>
          <div className="p-8">
            {/* Header with ETA */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-1">On The Way</h2>
                  <p className="text-muted-foreground">Your specialist is arriving soon</p>
                </div>
              </div>
              
              {/* ETA Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 border border-success/20"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center"
                  >
                    <Clock className="w-8 h-8 text-success" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Arrival</p>
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={eta}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-bold text-success"
                        ref={etaRef}
                      >
                        {eta}
                      </motion.span>
                      <span className="text-2xl font-semibold text-muted-foreground">min</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Specialist Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-card to-secondary/30 rounded-3xl p-6 mb-6 border border-border shadow-xl"
            >
              <div className="flex items-start gap-6 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <img
                    src={specialist.avatar}
                    alt={specialist.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-success border-4 border-card flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{specialist.name}</h3>
                  <p className="text-primary font-semibold text-lg mb-3">{specialist.profession}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 bg-accent/10 rounded-full px-3 py-1.5">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-bold text-foreground">{specialist.rating}</span>
                      <span className="text-xs text-muted-foreground">({specialist.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">{specialist.experience} years exp</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-2 inline-flex">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-lg font-bold text-primary">{specialist.price}</span>
                    <span className="text-sm text-muted-foreground">/ hour</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card/50 rounded-2xl p-4 mb-4">
                <p className="text-muted-foreground leading-relaxed">{specialist.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <p className="text-xs text-muted-foreground font-medium mb-1">Experience</p>
                  <p className="text-2xl font-bold text-foreground">{specialist.experience} years</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <p className="text-xs text-muted-foreground font-medium mb-1">Reviews</p>
                  <p className="text-2xl font-bold text-foreground">{specialist.reviewCount}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="call" 
                  size="xl" 
                  className="w-full h-16 text-lg font-semibold shadow-lg"
                  onClick={() => setShowCallDialog(true)}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Call Now
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="message" 
                  size="xl" 
                  className="w-full h-16 text-lg font-semibold shadow-lg"
                  onClick={() => setShowMessageDialog(true)}
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Message
                </Button>
              </motion.div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-secondary/30 rounded-2xl"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>Tracking in real-time • {distance} km away</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call Dialog */}
      <CallDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        specialist={specialist}
      />

      {/* Message Dialog */}
      <MessageDialog
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
        specialist={specialist}
      />
    </div>
  );
};

export default TrackingView;
