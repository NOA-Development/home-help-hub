import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMiAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjcgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiIGZpbGw9IiM2MzY2ZjEiLz48L3N2Zz4=',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMiAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjcgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiIGZpbGw9IiM2MzY2ZjEiLz48L3N2Zz4=',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZWxsaXBzZSBjeD0iMjAuNSIgY3k9IjM3IiByeD0iMTUiIHJ5PSI0IiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=',
});

interface LeafletMapViewProps {
  showSpecialist?: boolean;
  specialistPosition?: { lat: number; lng: number };
  userPosition?: { lat: number; lng: number };
  onLocationSelect?: (position: { lat: number; lng: number }) => void;
  interactive?: boolean;
  height?: string;
}

// Custom user marker icon
const createUserIcon = () => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="position: absolute; inset: 0; width: 48px; height: 48px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// Custom specialist marker icon
const createSpecialistIcon = () => {
  return L.divIcon({
    html: `
      <div style="animation: bounce 2s ease-in-out infinite;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: #6366f1; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.4); display: flex; align-items: center; justify-content: center; border: 3px solid white;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to handle map updates
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Component to handle animated specialist marker
const AnimatedSpecialistMarker = ({ 
  position, 
  targetPosition 
}: { 
  position: { lat: number; lng: number }; 
  targetPosition: { lat: number; lng: number };
}) => {
  const [currentPos, setCurrentPos] = useState(position);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPos((prev) => {
        const latDiff = targetPosition.lat - prev.lat;
        const lngDiff = targetPosition.lng - prev.lng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        // Stop when close enough
        if (distance < 0.0001) {
          return prev;
        }
        
        // Move slowly towards target (0.8% per update)
        return {
          lat: prev.lat + latDiff * 0.008,
          lng: prev.lng + lngDiff * 0.008,
        };
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [targetPosition]);

  return <Marker position={[currentPos.lat, currentPos.lng]} icon={createSpecialistIcon()} />;
};

const LeafletMapView = ({ 
  showSpecialist = false, 
  specialistPosition,
  userPosition,
  onLocationSelect,
  interactive = false,
  height = '100%'
}: LeafletMapViewProps) => {
  const defaultCenter = { lat: 40.7128, lng: -74.006 }; // New York
  const userPos = userPosition || defaultCenter;
  const specialistPos = specialistPosition || { lat: userPos.lat + 0.01, lng: userPos.lng + 0.01 };

  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (interactive && onLocationSelect) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height, minHeight: '300px' }}>
      <MapContainer
        center={[userPos.lat, userPos.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={interactive}
        dragging={interactive}
        ref={mapRef}
        whenCreated={(map) => {
          if (interactive) {
            map.on('click', handleMapClick);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={[userPos.lat, userPos.lng]} zoom={14} />
        
        {/* User marker */}
        <Marker position={[userPos.lat, userPos.lng]} icon={createUserIcon()} />
        
        {/* Specialist marker with animation */}
        {showSpecialist && (
          <AnimatedSpecialistMarker 
            position={specialistPos} 
            targetPosition={userPos}
          />
        )}
      </MapContainer>
      
      {interactive && (
        <div className="absolute top-4 left-4 z-[1000] bg-card rounded-xl shadow-card border border-border px-4 py-2">
          <p className="text-xs text-muted-foreground">Click on map to select location</p>
        </div>
      )}
    </div>
  );
};

export default LeafletMapView;
