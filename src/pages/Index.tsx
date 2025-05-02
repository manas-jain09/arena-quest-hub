
import { useState, useEffect } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

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
