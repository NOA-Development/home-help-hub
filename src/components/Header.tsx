import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppState } from '@/types/specialist';

interface HeaderProps {
  state: AppState;
  address?: string;
  onBack: () => void;
}

const Header = ({ state, address, onBack }: HeaderProps) => {
  const showBack = state !== 'address';

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg text-foreground">HomeHelp</h1>
            {address && state !== 'address' && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{address}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
