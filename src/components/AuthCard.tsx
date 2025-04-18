
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
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [prn, setPrn] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prn, password }),
        });
        
        const result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.message || 'Login failed');
        }
        
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        onSuccess(result.user); // Assuming backend returns basic user info

        
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
      } else {
        // Register logic
        if (!username || !email || !prn || !password) {
          throw new Error('All fields are required');
        }
        
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .or(`email.eq.${email},prn.eq.${prn},username.eq.${username}`)
          .maybeSingle();
        
        if (existingUser) {
          throw new Error('User with this email, PRN, or username already exists');
        }
        
        // Register the new user
        const { data, error } = await supabase
          .from('users')
          .insert([{ username, email, prn, password }])
          .select()
          .single();
        
        if (error) {
          throw new Error('Error creating account. Please try again.');
        }
        
        toast({
          title: "Success",
          description: "Account created successfully! You can now log in.",
        });
        setIsLogin(true);
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
        <CardTitle className="text-2xl font-bold text-arena-red">Astra</CardTitle>
        <CardDescription>
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="arena-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="arena-input"
                />
              </div>
            </>
          )}
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
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
{/*           <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-arena-red hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button> */}
        </div>
      </CardContent>
    </Card>
  );
};
