
import { useState, useEffect } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';

interface User {
  id: string;
  username: string;
  email: string;
  prn: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Store userId in localStorage for use in Yodha link
    localStorage.setItem('userId', userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    // Clear userId from localStorage on logout
    localStorage.removeItem('userId');
  };

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
