
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminAuth = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple password check
    if (password === 'Tharvesh@2026') {
      localStorage.setItem('admin_authenticated', 'true');
      onAuthSuccess();
      toast({
        title: "Access Granted",
        description: "Welcome to admin panel!",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Admin Access</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </Button>
        </form>
        
        <p className="text-sm text-muted-foreground mt-4">
          Authorized personnel only
        </p>
      </Card>
    </div>
  );
};

export default AdminAuth;
