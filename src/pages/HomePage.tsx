import { useState, useEffect } from 'react';
import { LearningPathCard } from '@/components/LearningPathCard';
import { QuestionTable } from '@/components/QuestionTable';
import { supabase } from '@/integrations/supabase/client';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  questions_count: number;
}

interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  practice_link: string;
  solution_link: string;
}

interface UserProgress {
  question_id: string;
  is_completed: boolean;
  is_marked_for_revision: boolean;
}

interface HomePageProps {
  userId: string;
}

// Define a sorting order for difficulties
const difficultyOrder = {
  'easy': 1,
  'medium': 2,
  'hard': 3,
  'theory': 4
};

export const HomePage = ({ userId }: HomePageProps) => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  // Fetch learning paths
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        const { data, error } = await supabase
          .from('learning_paths')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Sort learning paths by difficulty level
          const sortedPaths = [...data].sort((a, b) => {
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          });
          
          setLearningPaths(sortedPaths);
        }
      } catch (error) {
        console.error('Error fetching learning paths:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningPaths();
  }, []);
  
  // Fetch questions for selected learning path
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedPath) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('learning_path_id', selectedPath.id);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            // Sort questions by ID
            const sortedQuestions = [...data].sort((a, b) => {
              return a.id.localeCompare(b.id);
            });
            
            setQuestions(sortedQuestions);
          }
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchQuestions();
  }, [selectedPath]);
  
  // Fetch user progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const progressMap: Record<string, UserProgress> = {};
          data.forEach(item => {
            progressMap[item.question_id] = {
              question_id: item.question_id,
              is_completed: item.is_completed,
              is_marked_for_revision: item.is_marked_for_revision
            };
          });
          setUserProgress(progressMap);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };
    
    fetchUserProgress();
  }, [userId]);
  
  const handlePathSelect = (path: LearningPath) => {
    setSelectedPath(path);
  };
  
  const handleToggleCompleted = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.is_completed || false;
    const newStatus = !currentStatus;
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          question_id: questionId,
          is_completed: newStatus,
          is_marked_for_revision: userProgress[questionId]?.is_marked_for_revision || false
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          question_id: questionId,
          is_completed: newStatus,
          is_marked_for_revision: prev[questionId]?.is_marked_for_revision || false
        }
      }));
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };
  
  const handleToggleRevision = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.is_marked_for_revision || false;
    const newStatus = !currentStatus;
    
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          question_id: questionId,
          is_completed: userProgress[questionId]?.is_completed || false,
          is_marked_for_revision: newStatus
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          question_id: questionId,
          is_completed: prev[questionId]?.is_completed || false,
          is_marked_for_revision: newStatus
        }
      }));
    } catch (error) {
      console.error('Error updating revision status:', error);
    }
  };
  
  const handleResetLearningPath = () => {
    setSelectedPath(null);
  };

  // Show loading state
  if (loading && learningPaths.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare questions with user progress for the QuestionTable
  const questionsWithProgress = questions.map(question => ({
    ...question,
    is_completed: userProgress[question.id]?.is_completed || false,
    is_marked_for_revision: userProgress[question.id]?.is_marked_for_revision || false
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedPath ? (
        <div>
          <button 
            onClick={handleResetLearningPath}
            className="mb-4 text-arena-red flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Learning Paths
          </button>
          <h2 className="text-2xl font-bold mb-2">{selectedPath.title}</h2>
          <p className="text-arena-darkGray mb-6">{selectedPath.description}</p>
          
          <QuestionTable
            questions={questionsWithProgress}
            userProgress={userProgress}
            onToggleCompleted={handleToggleCompleted}
            onToggleRevision={handleToggleRevision}
          />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-3">Learning Paths</h1>
          <p className="text-arena-darkGray mb-8">
            Select a learning path to get started with your journey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                title={path.title}
                description={path.description}
                difficulty={path.difficulty}
                questionsCount={path.questions_count}
                onClick={() => handlePathSelect(path)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
