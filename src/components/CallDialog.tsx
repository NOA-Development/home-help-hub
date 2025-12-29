import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Specialist } from '@/types/specialist';

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist;
}

const CallDialog = ({ open, onOpenChange, specialist }: CallDialogProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');

  useEffect(() => {
    if (open) {
      setCallDuration(0);
      setCallStatus('connecting');
      
      // Simulate connection delay
      const connectTimer = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

      return () => clearTimeout(connectTimer);
    }
  }, [open]);

  useEffect(() => {
    if (open && callStatus === 'connected') {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [open, callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onOpenChange(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
        <div className="relative bg-gradient-to-br from-primary to-primary-glow p-8 text-primary-foreground">
          {/* Background animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-32 -right-32 animate-pulse" />
            <div className="absolute w-48 h-48 bg-white/10 rounded-full -bottom-24 -left-24 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative z-10 text-center">
            {/* Avatar */}
            <div className="mx-auto mb-6 animate-scale-in">
              <div className="relative inline-block">
                <img
                  src={specialist.avatar}
                  alt={specialist.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
                />
                {callStatus === 'connected' && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-1">
                      <div className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-10 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Name and status */}
            <h3 className="text-2xl font-bold mb-2">{specialist.name}</h3>
            <p className="text-white/80 mb-4">{specialist.profession}</p>
            
            {/* Call status */}
            <div className="text-lg font-semibold mb-8">
              {callStatus === 'connecting' ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <span>{formatDuration(callDuration)}</span>
              )}
            </div>

            {/* Call controls */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon-lg"
                className="rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Button
                variant={isSpeakerOn ? "default" : "secondary"}
                size="icon-lg"
                className="rounded-full"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>
            </div>

            {/* End call button */}
            <Button
              variant="destructive"
              size="icon-xl"
              className="rounded-full shadow-xl"
              onClick={handleEndCall}
            >
              <PhoneOff className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
