import { useState, useEffect } from 'react';
import { AppState, Specialist } from '@/types/specialist';
import { mockSpecialists } from '@/data/mockSpecialists';
import Header from '@/components/Header';
import AddressInput from '@/components/AddressInput';
import SearchingAnimation from '@/components/SearchingAnimation';
import SpecialistList from '@/components/SpecialistList';
import TrackingView from '@/components/TrackingView';
import LeafletMapView from '@/components/LeafletMapView';
import { motion } from 'framer-motion';

const Index = () => {
  const [state, setState] = useState<AppState>('address');
  const [address, setAddress] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  const handleAddressSubmit = (submittedAddress: string) => {
    setAddress(submittedAddress);
    setState('searching');
  };

  useEffect(() => {
    if (state === 'searching') {
      const timer = setTimeout(() => {
        setState('specialists');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleSelectSpecialist = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setState('tracking');
  };

  const handleBack = () => {
    if (state === 'tracking') {
      setState('specialists');
      setSelectedSpecialist(null);
    } else if (state === 'specialists') {
      setState('address');
      setAddress('');
    } else if (state === 'searching') {
      setState('address');
      setAddress('');
    }
  };

  const handleCancelTracking = () => {
    setState('specialists');
    setSelectedSpecialist(null);
  };

  if (state === 'tracking' && selectedSpecialist) {
    return <TrackingView specialist={selectedSpecialist} onCancel={handleCancelTracking} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header state={state} address={address} onBack={handleBack} />
      
      <main className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Map background for non-address states */}
        {state !== 'address' && (
          <div className="mb-6 h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-card animate-fade-in max-w-4xl mx-auto">
            <LeafletMapView showSpecialist={false} height="100%" />
          </div>
        )}

        {/* Address input state */}
        {state === 'address' && (
          <div className="pt-8 md:pt-16 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Home Services,<br />
                <span className="text-primary">On Demand</span>
              </h1>
              <p className="text-muted-foreground max-w-sm mx-auto text-base md:text-lg">
                Find trusted specialists for plumbing, electrical, cleaning, gardening, and more.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AddressInput onAddressSubmit={handleAddressSubmit} />
            </motion.div>
            
            {/* Service categories preview */}
            <div className="mt-12 grid grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                { icon: '🔧', label: 'Plumbing' },
                { icon: '⚡', label: 'Electrical' },
                { icon: '🪟', label: 'Cleaning' },
                { icon: '🌿', label: 'Garden' },
              ].map((service, index) => (
                <motion.div
                  key={service.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-card transition-all cursor-pointer"
                >
                  <span className="text-2xl">{service.icon}</span>
                  <span className="text-xs text-muted-foreground font-medium">{service.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Searching state */}
        {state === 'searching' && (
          <div className="max-w-2xl mx-auto">
            <SearchingAnimation />
          </div>
        )}

        {/* Specialists list state */}
        {state === 'specialists' && (
          <div className="max-w-4xl mx-auto">
            <SpecialistList 
              specialists={mockSpecialists} 
              onSelectSpecialist={handleSelectSpecialist} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
