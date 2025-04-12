
import { useState, useEffect } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
  prn: string;
  password?: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);

    // Store PRN and password in local storage for use with Yodha profile
    if (userData.prn && userData.password) {
      localStorage.setItem('user_prn', userData.prn);
      localStorage.setItem('user_password', userData.password);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_prn');
    localStorage.removeItem('user_password');
  };

  useEffect(() => {
    // Check if we have credentials in local storage
    const storedPrn = localStorage.getItem('user_prn');
    const storedPassword = localStorage.getItem('user_password');
    
    // If we have credentials, attempt to auto-login
    if (storedPrn && storedPassword && !user) {
      const tryAutoLogin = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('prn', storedPrn)
            .eq('password', storedPassword)
            .single();
          
          if (!error && data) {
            setUser(data);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      };
      
      tryAutoLogin();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <>
          <Navbar onLogout={handleLogout} />
          <HomePage userId={user.id} />
        </>
      ) : (
        <div className="container mx-auto px-4">
          <AuthCard onSuccess={handleLogin} />
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Index;
