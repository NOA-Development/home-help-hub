import { useState } from 'react';
import { MapPin, Search, Navigation, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LeafletMapView from './LeafletMapView';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
}

const AddressInput = ({ onAddressSubmit }: AddressInputProps) => {
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onAddressSubmit(address);
    }
  };

  const handleCurrentLocation = () => {
    // Mock current location
    const mockLocation = { lat: 40.7128, lng: -74.006 };
    setSelectedLocation(mockLocation);
    onAddressSubmit('Current Location (40.7128, -74.006)');
  };

  const handleLocationSelect = (position: { lat: number; lng: number }) => {
    setSelectedLocation(position);
    setAddress(`Location: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
  };

  const handleMapConfirm = () => {
    if (selectedLocation) {
      onAddressSubmit(`Selected Location (${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)})`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Where do you need help?</h2>
            <p className="text-sm text-muted-foreground">Enter your address or select on map</p>
          </div>
          <Button
            type="button"
            variant={showMap ? "default" : "outline"}
            size="icon"
            onClick={() => setShowMap(!showMap)}
          >
            <Map className="w-5 h-5" />
          </Button>
        </div>

        {showMap && (
          <div className="mb-6 animate-fade-in">
            <div className="h-64 mb-4 rounded-xl overflow-hidden">
              <LeafletMapView
                interactive={true}
                userPosition={selectedLocation || undefined}
                onLocationSelect={handleLocationSelect}
                height="256px"
              />
            </div>
            {selectedLocation && (
              <Button
                onClick={handleMapConfirm}
                className="w-full h-12 text-base font-medium"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Confirm Location
              </Button>
            )}
          </div>
        )}

        {!showMap && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl border-border bg-secondary/50 focus:bg-card transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={!address.trim()}
            >
              <Search className="w-5 h-5 mr-2" />
              Find Specialists
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base"
              onClick={handleCurrentLocation}
            >
              <Navigation className="w-5 h-5 mr-2" />
              Use Current Location
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressInput;
