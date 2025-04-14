
import { useState, useEffect } from 'react';
import { LearningPathCard } from '@/components/LearningPathCard';
import { QuestionTable } from '@/components/QuestionTable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  topicsCount?: number;
  questionsCount?: number;
}

interface Topic {
  id: string;
  name: string;
  learning_path_id: string;
  questions: Question[];
}

interface Question {
  id: string;
  title: string;
  solution_link: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  is_completed: boolean;
  is_marked_for_revision: boolean;
}

interface HomePageProps {
  userId: string;
}

// Helper function to get difficulty sort order
const getDifficultyOrder = (difficulty: string): number => {
  switch (difficulty) {
    case 'theory': return 1;
    case 'easy': return 2;
    case 'medium': return 3;
    case 'hard': return 4;
    default: return 5;
  }
};

export const HomePage = ({ userId }: HomePageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<Topic[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const { data, error } = await supabase
          .from('learning_paths')
          .select('*')
          .order('sr', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const pathsWithCount = await Promise.all(
            data.map(async (path) => {
              const { count: topicsCount, error: topicsError } = await supabase
                .from('topics')
                .select('*', { count: 'exact', head: true })
                .eq('learning_path_id', path.id);
              
              const { data: topics, error: questionsError } = await supabase
                .from('topics')
                .select('id')
                .eq('learning_path_id', path.id);
              
              if (topicsError || questionsError) {
                console.error('Error fetching counts', topicsError || questionsError);
                return {
                  ...path,
                  topicsCount: 0,
                  questionsCount: 0
                };
              }
              
              const topicIds = topics?.map(t => t.id) || [];
              
              const { count: questionsCount } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true })
                .in('topic_id', topicIds);
              
              return {
                ...path,
                topicsCount: topicsCount || 0,
                questionsCount: questionsCount || 0
              };
            })
          );
          
          // Sort paths by difficulty
          const sortedPaths = pathsWithCount.sort((a, b) => {
            return getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty);
          });
          
          setLearningPaths(sortedPaths);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load learning paths: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLearningPaths();
  }, [toast]);
  
  useEffect(() => {
    if (!selectedPathId) return;
    
    const fetchTopicsAndQuestions = async () => {
      setIsLoading(true);
      try {
        const { data: topics, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .eq('learning_path_id', selectedPathId);
        
        if (topicsError) {
          throw topicsError;
        }
        
        if (!topics) {
          throw new Error('No topics found');
        }
        
        const topicsWithQuestions = await Promise.all(
          topics.map(async (topic) => {
            const { data: questions, error: questionsError } = await supabase
              .from('questions')
              .select('*')
              .eq('topic_id', topic.id)
              .order('id', { ascending: true }); // Sort questions by ID
            
            if (questionsError) {
              throw questionsError;
            }
            
            const { data: progress, error: progressError } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', userId)
              .in('question_id', questions?.map(q => q.id) || []);
            
            if (progressError) {
              throw progressError;
            }
            
            const questionsWithProgress = questions?.map(question => {
              const userProgress = progress?.find(p => p.question_id === question.id);
              return {
                ...question,
                is_completed: userProgress?.is_completed || false,
                is_marked_for_revision: userProgress?.is_marked_for_revision || false
              };
            }) || [];
            
            return {
              ...topic,
              questions: questionsWithProgress
            };
          })
        );
        
        setTopicsWithQuestions(topicsWithQuestions);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load topics and questions: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopicsAndQuestions();
  }, [selectedPathId, userId, toast]);
  
  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
  };
  
  const selectedPath = learningPaths.find(path => path.id === selectedPathId);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arena-red"></div>
        </div>
      ) : !selectedPathId ? (
        <>
          <h1 className="text-3xl font-bold text-arena-darkGray mb-6">Learning Paths</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map(path => (
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
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => setSelectedPathId(null)}
              className="mr-4 bg-arena-lightGray hover:bg-arena-gray text-arena-darkGray px-3 py-1.5 rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </>
      )}
    </div>
  );
};
