
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface User {
  username: string;
  email: string;
  prn: string;
  password: string;
}

// Sample user data for demo purposes
const DEMO_USERS: User[] = [
  {
    username: "demo_user",
    email: "demo@arenahq.com",
    prn: "PRN123456",
    password: "password123"
  }
];

interface AuthCardProps {
  onSuccess: (user: User) => void;
}

export const AuthCard = ({ onSuccess }: AuthCardProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [prn, setPrn] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const user = DEMO_USERS.find(u => u.prn === prn && u.password === password);
      if (user) {
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        onSuccess(user);
      } else {
        toast({
          title: "Error",
          description: "Invalid PRN or password",
          variant: "destructive",
        });
      }
    } else {
      // Register logic
      if (!username || !email || !prn || !password) {
        toast({
          title: "Error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }
      
      // For demo purposes, we'll just simulate a successful registration
      const newUser = { username, email, prn, password };
      toast({
        title: "Success",
        description: "Account created successfully! You can now log in.",
      });
      setIsLogin(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-arena-red">ArenaHQ</CardTitle>
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
          <Button type="submit" className="w-full arena-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-arena-red hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
        
        {isLogin && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 font-medium">Demo Credentials</p>
            <p className="text-xs text-gray-500">PRN: PRN123456</p>
            <p className="text-xs text-gray-500">Password: password123</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
