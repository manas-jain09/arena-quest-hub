
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Code } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Minimalist navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center">
            <img src="/Astra.png" alt="Astra Logo" className="h-10 w-10" />
            <h1 className={`font-bold text-xl md:text-2xl ml-2 ${isScrolled ? 'text-arena-darkGray' : 'text-arena-darkGray'}`}>Astra</h1>
          </div>
          <div>
            <Link to="/login">
              <Button className="bg-arena-red hover:bg-arena-darkRed">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white pt-16">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 relative z-10">
          <div className="flex flex-col items-center justify-center gap-8 md:gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="/Astra.png" 
                alt="Astra Logo" 
                className="h-24 w-24 mb-8"
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-arena-darkGray leading-tight mb-6">
                Master <span className="text-arena-red">Data Structures</span> & <span className="text-arena-red">Algorithms</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto">
                Elevate your coding skills through structured learning paths, interactive challenges, and personalized feedback.
              </p>
              <Link to="/login">
                <Button className="bg-arena-red hover:bg-arena-darkRed text-white px-8 py-6 text-lg">
                  Get Started <ChevronRight size={20} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/Astra.png" alt="Astra Logo" className="h-8 w-8" />
            <h1 className="font-bold text-lg ml-2 text-arena-darkGray">Astra</h1>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Astra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
