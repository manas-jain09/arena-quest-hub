
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle } from 'lucide-react';

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
  const navigate = useNavigate();
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

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Minimalist navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center">
            <img src="/Astra.png" alt="Astra Logo" className="h-10 w-10" />
            <h1 className={`font-bold text-xl md:text-2xl ml-2 ${isScrolled ? 'text-arena-darkGray' : 'text-arena-darkGray'}`}>Astra</h1>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleLoginClick} className="bg-arena-red hover:bg-arena-darkRed">
              Login
            </Button>
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
                className="h-24 w-24 mb-8 mx-auto"
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-arena-darkGray leading-tight mb-6">
                Master <span className="text-arena-red">Data Structures</span> & <span className="text-arena-red">Algorithms</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto">
                Elevate your coding skills through structured learning paths, interactive challenges, and personalized feedback.
              </p>
              <Button onClick={handleLoginClick} className="bg-arena-red hover:bg-arena-darkRed text-white px-8 py-6 text-lg">
                Get Started <ChevronRight size={20} className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-arena-darkGray mb-4">Why Choose Astra?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help you master algorithms and data structures efficiently.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Structured Learning Paths",
                description: "Follow clear, progressive learning paths tailored to different skill levels and goals.",
              },
              {
                title: "Interactive Problem Solving",
                description: "Apply concepts through hands-on challenges with real-time feedback and hints.",
              },
              {
                title: "Performance Tracking",
                description: "Monitor your progress and identify areas for improvement with detailed analytics.",
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <div className="flex items-center mb-4 text-arena-red">
                  <CheckCircle size={24} />
                  <h3 className="text-xl font-semibold ml-2">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-arena-darkGray mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Astra has helped students and professionals ace technical interviews.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Astra helped me understand complex algorithms in a way textbooks never could. I aced my technical interviews!",
                author: "Sarah K., Software Engineer"
              },
              {
                quote: "The structured approach and practice problems made all the difference in my interview prep. Highly recommended!",
                author: "Michael T., CS Graduate"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                <p className="font-medium text-arena-darkGray">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24 bg-arena-red text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Master Algorithms?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who've improved their technical skills with Astra.
            </p>
            <Button onClick={handleLoginClick} className="bg-white text-arena-red hover:bg-gray-100 px-8 py-6 text-lg">
              Start Learning Today
            </Button>
          </motion.div>
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
