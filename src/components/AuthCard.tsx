import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuthCardProps {
  onSuccess: (user: User) => void;
}

export const AuthCard = ({ onSuccess }: AuthCardProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    prn: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'login' | 'signup') => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.from('users').select('*').eq('email', loginData.email).eq('password', loginData.password).single();

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      onSuccess(data as User);
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Insert user data with generated ID
      const userId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          username: signupData.username,
          email: signupData.email,
          prn: signupData.prn,
          password: signupData.password,
        });

      if (insertError) {
        console.error('Signup error:', insertError);
        toast({
          title: "Signup Failed",
          description: insertError.message || "Failed to create account",
          variant: "destructive",
        });
        return;
      }

      // Fetch the created user data
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !userData) {
        console.error('Error fetching user data:', fetchError);
        toast({
          title: "Error",
          description: "Account created but failed to fetch user data",
          variant: "destructive",
        });
        return;
      }

      onSuccess(userData as User);
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Create Account'}</CardTitle>
        <CardDescription>Enter your credentials to {isLogin ? 'access your account' : 'create an account'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isLogin ? "login" : "signup"} className="w-full">
          <TabsList>
            <TabsTrigger value="login" onClick={() => setIsLogin(true)}>Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange(e, 'login')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange(e, 'login')}
                    required
                  />
                </div>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={signupData.username}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="prn">PRN</Label>
                  <Input
                    id="prn"
                    name="prn"
                    type="text"
                    placeholder="Enter your PRN"
                    value={signupData.prn}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={(e) => handleInputChange(e, 'signup')}
                    required
                  />
                </div>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
