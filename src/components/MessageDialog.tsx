import { useState, useEffect, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Specialist } from '@/types/specialist';

// Constants
const MIN_TYPING_DELAY_MS = 1500;
const MAX_TYPING_DELAY_MS = 3000;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'specialist';
  timestamp: Date;
}

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist;
}

const MessageDialog = ({ open, onOpenChange, specialist }: MessageDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-reply mock messages
  const autoReplies = [
    "I'm on my way! Should be there in a few minutes.",
    "Thanks for your patience. I have all the tools ready.",
    "I've handled similar issues before. This should be straightforward!",
    "Feel free to ask if you have any questions.",
  ];

  useEffect(() => {
    if (open && messages.length === 0) {
      // Initial greeting from specialist
      setTimeout(() => {
        addSpecialistMessage("Hi! I'm heading to your location now. I'll be there shortly!");
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addSpecialistMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'specialist',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate specialist typing and response
    setIsTyping(true);
    setTimeout(() => {
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      addSpecialistMessage(randomReply);
    }, MIN_TYPING_DELAY_MS + Math.random() * (MAX_TYPING_DELAY_MS - MIN_TYPING_DELAY_MS));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <DialogTitle className="text-lg">{specialist.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{specialist.profession}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-secondary rounded-2xl px-4 py-3 max-w-[75%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
