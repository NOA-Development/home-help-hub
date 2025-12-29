import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Navigation, Key } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface GoogleMapViewProps {
  showSpecialist?: boolean;
  specialistPosition?: { lat: number; lng: number };
  userPosition?: { lat: number; lng: number };
  onApiKeySubmit?: (key: string) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px',
  borderRadius: '1rem',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const GoogleMapView = ({ 
  showSpecialist = false, 
  specialistPosition,
  userPosition,
  onApiKeySubmit 
}: GoogleMapViewProps) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('google_maps_api_key') || '');
  const [inputKey, setInputKey] = useState('');
  const [animatedPosition, setAnimatedPosition] = useState(specialistPosition || { lat: 40.71, lng: -74.01 });

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const userPos = userPosition || defaultCenter;

  useEffect(() => {
    if (showSpecialist && specialistPosition) {
      const interval = setInterval(() => {
        setAnimatedPosition((prev) => ({
          lat: prev.lat + (userPos.lat - prev.lat) * 0.02,
          lng: prev.lng + (userPos.lng - prev.lng) * 0.02,
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showSpecialist, specialistPosition, userPos]);

  const handleApiKeySubmit = () => {
    if (inputKey.trim()) {
      localStorage.setItem('google_maps_api_key', inputKey.trim());
      setApiKey(inputKey.trim());
      onApiKeySubmit?.(inputKey.trim());
    }
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  // No API key - show input
  if (!apiKey) {
    return (
      <div className="relative w-full h-full min-h-[300px] gradient-map rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="bg-card p-6 rounded-xl shadow-card border border-border max-w-sm w-full mx-4">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Google Maps API Key</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Google Maps API key to enable the map. Get one from the{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="AIza..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
            <Button onClick={handleApiKeySubmit} className="w-full">
              Save API Key
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading or error state
  if (loadError) {
    return (
      <div className="relative w-full h-full min-h-[300px] gradient-map rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="bg-card p-6 rounded-xl shadow-card border border-border text-center">
          <p className="text-destructive mb-2">Failed to load Google Maps</p>
          <p className="text-sm text-muted-foreground mb-4">Please check your API key</p>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('google_maps_api_key');
              setApiKey('');
            }}
          >
            Enter New Key
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="relative w-full h-full min-h-[300px] gradient-map rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPos}
        zoom={14}
        options={mapOptions}
      >
        {/* User marker */}
        <Marker
          position={userPos}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="#10b981" stroke="#ffffff" stroke-width="4"/>
                <circle cx="24" cy="24" r="8" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(48, 48),
            anchor: new google.maps.Point(24, 24),
          }}
        />

        {/* Specialist marker */}
        {showSpecialist && (
          <Marker
            position={animatedPosition}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="#6366f1" stroke="#ffffff" stroke-width="3"/>
                  <path d="M20 12 L20 20 L26 26" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapView;
