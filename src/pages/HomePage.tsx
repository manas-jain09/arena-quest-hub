
import { useState, useEffect } from 'react';
import { LearningPathCard } from '@/components/LearningPathCard';
import { QuestionTable } from '@/components/QuestionTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useTopicsWithQuestions } from '@/hooks/useTopicsWithQuestions';

interface HomePageProps {
  userId: string;
}

export const HomePage = ({ userId }: HomePageProps) => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const { isLoading: isPathsLoading, filteredPaths } = useLearningPaths(userId);
  const { isLoading: isTopicsLoading, topicsWithQuestions } = useTopicsWithQuestions(selectedPathId, userId);
  const { toast } = useToast();
  
  const isLoading = isPathsLoading || (selectedPathId && isTopicsLoading);
  
  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
  };
  
  const selectedPath = filteredPaths.find(path => path.id === selectedPathId);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Debug information
  useEffect(() => {
    console.log('UserId:', userId);
    console.log('Filtered Paths:', filteredPaths);
  }, [userId, filteredPaths]);

  return (
    <div className="container mx-auto px-4 py-8 bg-pattern-dots">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-arena-darkGray animate-pulse-slow">Loading your learning experience...</p>
        </div>
      ) : !selectedPathId ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-arena-darkGray mb-6 relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-arena-red to-arena-darkRed text-transparent bg-clip-text">Learning Paths</span>
            <div className="h-1 w-20 bg-arena-red rounded-full mt-2"></div>
          </motion.h1>
          {filteredPaths.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredPaths.map(path => (
                <motion.div key={path.id} variants={item}>
                  <LearningPathCard
                    title={path.title}
                    description={path.description}
                    difficulty={path.difficulty}
                    topicsCount={path.topicsCount || 0}
                    questionsCount={path.questionsCount || 0}
                    onClick={() => handlePathSelect(path.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl text-arena-darkGray mb-2 font-bold">No learning paths assigned yet</h2>
              <p className="text-arena-gray mb-4">Please contact your administrator to get learning paths assigned to your account.</p>
              <div className="inline-block bg-arena-lightGray p-3 rounded-lg">
                <svg className="w-16 h-16 text-arena-gray mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex items-center">
            <motion.button 
              onClick={() => setSelectedPathId(null)}
              className="mr-4 bg-arena-lightGray hover:bg-arena-gray text-arena-darkGray px-4 py-2 rounded-md text-sm flex items-center shadow-sm hover:shadow transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Learning Paths
            </motion.button>
            <h1 className="text-2xl font-bold text-arena-darkGray">
              <span className="bg-gradient-to-r from-arena-darkGray to-arena-darkGray/70 text-transparent bg-clip-text">
                {selectedPath?.title}
              </span>
            </h1>
          </div>
          
          <QuestionTable 
            topics={topicsWithQuestions} 
            learningPathTitle={selectedPath?.title || ''}
            userId={userId}
          />
        </motion.div>
      )}
    </div>
  );
};
