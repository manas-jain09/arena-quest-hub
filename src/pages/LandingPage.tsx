
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { 
  ChevronRight, 
  Code, 
  Layout, 
  Star, 
  BookOpen, 
  Trophy,
  Check
} from 'lucide-react';

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
  
  const features = [
    {
      icon: <Layout size={24} className="text-arena-red" />,
      title: "Interactive Learning Paths",
      description: "Follow curated learning paths designed by experts to master DSA concepts step by step."
    },
    {
      icon: <Code size={24} className="text-arena-red" />,
      title: "Coding Practice",
      description: "Tackle various coding problems, from easy to hard, with immediate feedback."
    },
    {
      icon: <BookOpen size={24} className="text-arena-red" />,
      title: "Rich Learning Resources",
      description: "Access comprehensive tutorials, articles, and videos explaining complex concepts."
    },
    {
      icon: <Trophy size={24} className="text-arena-red" />,
      title: "Compete & Grow",
      description: "Participate in coding contests and track your progress with personalized analytics."
    }
  ];
  
  const testimonials = [
    {
      text: "Astra helped me ace my technical interviews and land my dream job at a top tech company.",
      author: "Priya S.",
      role: "Software Engineer"
    },
    {
      text: "The structured approach to learning DSA concepts was exactly what I needed. Highly recommended!",
      author: "Rahul M.",
      role: "Computer Science Student"
    },
    {
      text: "The interactive challenges and immediate feedback helped me improve my problem-solving skills drastically.",
      author: "Anjali K.",
      role: "Full Stack Developer"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center">
            <img src="/Astra.png" alt="Astra Logo" className="h-10 w-10" />
            <h1 className={`font-bold text-xl md:text-2xl ml-2 ${isScrolled ? 'text-arena-darkGray' : 'text-white'}`}>Astra</h1>
          </div>
          <div className="space-x-2 md:space-x-4">
            <Link to="/login">
              <Button variant="outline" className={`border-2 ${isScrolled ? 'border-arena-red text-arena-darkGray' : 'border-white text-white'}`}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-arena-red hover:bg-arena-darkRed">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-arena-darkGray to-black pt-16">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.div 
              className="md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Master <span className="text-arena-red">Data Structures</span> & <span className="text-arena-red">Algorithms</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                Elevate your coding skills through structured learning paths, interactive challenges, and personalized feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-arena-red hover:bg-arena-darkRed text-white px-8 py-6 text-lg">
                  Get Started <ChevronRight size={20} className="ml-2" />
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="/placeholder.svg" 
                alt="Coding Illustration" 
                className="w-full max-w-md mx-auto drop-shadow-2xl rounded-lg"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-arena-darkGray mb-4">
              Why Choose <span className="text-arena-red">Astra</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to help you master Data Structures and Algorithms through effective learning methods and practical experience.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                variants={itemVariants}
              >
                <div className="bg-arena-lightRed/10 p-3 rounded-full inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-arena-darkGray mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Learning paths section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-arena-darkGray mb-6">
                Structured <span className="text-arena-red">Learning Paths</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our carefully curated learning paths guide you from fundamentals to advanced concepts, ensuring you build a solid foundation.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Arrays & Strings",
                  "Linked Lists",
                  "Trees & Graphs",
                  "Dynamic Programming",
                  "Advanced Algorithms"
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Check size={20} className="text-arena-red mr-2" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              
              <Button className="bg-arena-red hover:bg-arena-darkRed">
                Explore Learning Paths
              </Button>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Star className="text-yellow-500 mr-2" />
                  Popular Learning Path
                </h3>
                <div className="border-b pb-4 mb-4">
                  <h4 className="font-medium text-lg">Data Structures Fundamentals</h4>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      12 Lessons
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Code size={16} className="mr-1" />
                      24 Exercises
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Trophy size={16} className="mr-1" />
                      4 Challenges
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-4">
                  {[
                    "Introduction to Arrays",
                    "String Manipulation",
                    "Multi-dimensional Arrays",
                    "Time & Space Complexity",
                    "Searching Algorithms"
                  ].map((lesson, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 text-sm">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${idx < 3 ? 'bg-arena-lightRed/20 text-arena-red' : 'bg-gray-100 text-gray-400'}`}>
                        {idx < 3 ? <Check size={14} /> : (idx + 1)}
                      </div>
                      {lesson}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full border-arena-red text-arena-red hover:bg-arena-red hover:text-white">
                  Continue Learning
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-arena-darkGray mb-4">
              What Our <span className="text-arena-red">Students</span> Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who have transformed their coding skills with Astra.
            </p>
          </motion.div>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                  <div className="p-4">
                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm">
                      <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            fill="#F59E0B"
                            color="#F59E0B"
                            className="mr-1"
                          />
                        ))}
                      </div>
                      <p className="text-lg text-gray-700 italic mb-6">"{testimonial.text}"</p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-arena-red/10 rounded-full flex items-center justify-center text-arena-red font-bold">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold">{testimonial.author}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-gradient-to-br from-arena-darkGray to-black py-16 relative">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-arena-red">Coding Journey</span>?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join Astra today and transform your approach to learning Data Structures and Algorithms. Your future in tech starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-arena-red hover:bg-arena-darkRed text-white px-8 py-6 text-lg">
                Create Free Account
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-arena-darkGray text-white py-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <img src="/Astra.png" alt="Astra Logo" className="h-10 w-10" />
              <h1 className="font-bold text-xl ml-2">Astra</h1>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a href="#" className="hover:text-arena-red transition-colors">Home</a>
              <a href="#" className="hover:text-arena-red transition-colors">Features</a>
              <a href="#" className="hover:text-arena-red transition-colors">Learning Paths</a>
              <a href="#" className="hover:text-arena-red transition-colors">About Us</a>
              <a href="#" className="hover:text-arena-red transition-colors">Contact</a>
            </div>
            
            <div className="mt-6 md:mt-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Astra. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
