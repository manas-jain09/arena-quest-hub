
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
  prn: string;
}

interface AuthCardProps {
  onSuccess: (user: User) => void;
}

export const AuthCard = ({ onSuccess }: AuthCardProps) => {
  const [prn, setPrn] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Login logic
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('prn', prn)
        .eq('password', password)
        .single();
      
      if (error) {
        throw new Error('Invalid PRN or password');
      }
      
      if (data) {
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        onSuccess(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-arena-red">ArenaHQ</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prn">PRN</Label>
            <Input 
              id="prn" 
              placeholder="Enter your PRN" 
              value={prn}
              onChange={(e) => setPrn(e.target.value)}
              className="arena-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="arena-input"
            />
          </div>
          <Button type="submit" className="w-full arena-btn" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
