
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        // Clear invalid data
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  // Ensure assigned learning paths are properly loaded
  useEffect(() => {
    const refreshUserData = async () => {
      if (!user || !user.id) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error refreshing user data:', error);
          return;
        }
        
        if (data) {
          // Update user data in state and localStorage
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          console.log('User data refreshed:', updatedUser);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    };
    
    if (user) {
      refreshUserData();
    }
  }, [user?.id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

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
            className="text-center"
          >
            <div className="w-full max-w-md mx-auto mt-10">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-arena-red mb-4">Astra</h1>

                <p className="text-sm text-gray-500">
                  Please contact your administrator to receive your personalized login link.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Toaster />
    </motion.div>
  );
};

export default Index;
