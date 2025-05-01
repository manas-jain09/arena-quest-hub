
import { useState, useEffect } from 'react';
import { LearningPathCard } from '@/components/LearningPathCard';
import { QuestionTable } from '@/components/QuestionTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useTopicsWithQuestions } from '@/hooks/useTopicsWithQuestions';

interface HomePageProps {
  userId: string;
}

export const HomePage = ({ userId }: HomePageProps) => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    isLoading: isLoadingPaths, 
    learningPaths, 
    filteredPaths 
  } = useLearningPaths(userId, toast);
  
  const {
    isLoading: isLoadingTopics,
    topicsWithQuestions
  } = useTopicsWithQuestions(selectedPathId, userId, toast);
  
  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
  };
  
  const selectedPath = learningPaths.find(path => path.id === selectedPathId);
  const isLoading = isLoadingPaths || isLoadingTopics;

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-arena-red" />
            <p className="mt-4 text-arena-darkGray">Loading your learning journey...</p>
          </div>
        </div>
      ) : !selectedPathId ? (
        <>
          <h1 className="text-4xl font-bold text-arena-darkGray mb-2 text-center">Learning Paths</h1>
          <p className="text-arena-darkGray mb-8 text-center max-w-2xl mx-auto">Select a learning path to begin your journey and explore the questions</p>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-arena-lightRed/10 to-arena-red/5 rounded-xl -z-10 blur-xl"></div>
            
            {filteredPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredPaths.map(path => (
                  <LearningPathCard
                    key={path.id}
                    title={path.title}
                    description={path.description}
                    difficulty={path.difficulty}
                    topicsCount={path.topicsCount || 0}
                    questionsCount={path.questionsCount || 0}
                    onClick={() => handlePathSelect(path.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
                <h2 className="text-xl text-arena-darkGray mb-2">No learning paths assigned yet</h2>
                <p className="text-arena-gray">Please contact your administrator to get learning paths assigned to your account.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => setSelectedPathId(null)}
              className="mr-4 bg-white hover:bg-arena-lightGray text-arena-darkGray px-4 py-2 rounded-md text-sm flex items-center transition-colors shadow-sm border border-gray-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Learning Paths
            </button>
            <h1 className="text-2xl font-bold text-arena-darkGray">{selectedPath?.title}</h1>
          </div>
          
          <QuestionTable 
            topics={topicsWithQuestions} 
            learningPathTitle={selectedPath?.title || ''}
            userId={userId}
          />
        </div>
      )}
    </div>
  );
};
