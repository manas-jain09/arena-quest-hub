
import { useState, useEffect } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  // Try to load user from localStorage on component mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedUserId && savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        setUser(userData);
        console.log('User restored from localStorage:', userData);
      } catch (error) {
        console.error('Failed to parse saved user data', error);
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Store full user data in localStorage
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.username}!`,
    });
    
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    // Clear user data from localStorage on logout
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {user ? (
        <>
          <Navbar onLogout={handleLogout} />
          <HomePage userId={user.id} />
        </>
      ) : (
        <div className="container mx-auto px-4 pt-8 md:pt-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AuthCard onSuccess={handleLogin} />
          </motion.div>
        </div>
      )}
      <Toaster />
    </motion.div>
  );
};

export default Index;
