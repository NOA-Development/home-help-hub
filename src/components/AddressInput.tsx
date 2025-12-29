import { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
}

const AddressInput = ({ onAddressSubmit }: AddressInputProps) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onAddressSubmit(address);
    }
  };

  const handleCurrentLocation = () => {
    onAddressSubmit('123 Current Street, Your City');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Where do you need help?</h2>
            <p className="text-sm text-muted-foreground">Enter your address to find specialists nearby</p>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default AddressInput;
