
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const AutoLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAutoLogin = async () => {
      const token = searchParams.get('token');

      if (!token) {
        toast({
          title: "Error",
          description: "Invalid login link",
          variant: "destructive",
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Validate the token
        const { data: tokenData, error: tokenError } = await supabase
          .from('auto_login_tokens')
          .select('user_id, expires_at, used')
          .eq('token', token)
          .single();

        if (tokenError || !tokenData) {
          toast({
            title: "Error",
            description: "Invalid or expired auto-login token",
            variant: "destructive",
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(tokenData.expires_at);
        
        if (now > expiresAt) {
          toast({
            title: "Error",
            description: "Auto-login token has expired",
            variant: "destructive",
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Check if token was already used
        if (tokenData.used) {
          toast({
            title: "Error",
            description: "Auto-login token has already been used",
            variant: "destructive",
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Mark token as used
        await supabase
          .from('auto_login_tokens')
          .update({ used: true })
          .eq('token', token);

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('auth')
          .select('*')
          .eq('id', tokenData.user_id)
          .single();

        if (userError || !userData) {
          toast({
            title: "Error",
            description: "User account not found",
            variant: "destructive",
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Store user data in localStorage for the app
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userData', JSON.stringify(userData));

        toast({
          title: "Success",
          description: `Welcome back, ${userData.username}!`,
        });

        // Redirect to home page
        setTimeout(() => navigate('/'), 1000);

      } catch (error) {
        console.error('Auto-login error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred during auto-login",
          variant: "destructive",
        });
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processAutoLogin();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mb-4"
          animate={{ rotate: isProcessing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
        >
          <div className="w-8 h-8 border-2 border-arena-red border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
        
        <p className="text-sm text-gray-600 font-medium">Crafting your experience</p>
      </motion.div>
    </div>
  );
};

export default AutoLogin;
