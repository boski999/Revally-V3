'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ConnectGMB({ className }) {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      toast.success('Disconnected from Google My Business');
    } else {
      setIsConnected(true);
      toast.success('Connected to Google My Business!');
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        {isConnected ? (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        ) : (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Connected
          </Badge>
        )}
      </div>
      
      <Button
        onClick={handleConnect}
        className={isConnected 
          ? "w-full bg-red-500 hover:bg-red-600 text-white" 
          : "w-full bg-blue-500 hover:bg-blue-600 text-white"
        }
      >
        {isConnected ? 'Disconnect GMB' : 'Connect Google My Business'}
      </Button>
    </div>
  );
}