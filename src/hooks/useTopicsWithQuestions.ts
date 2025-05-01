
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Toast } from '@/hooks/use-toast';

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
  practice_link: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  is_completed: boolean;
  is_marked_for_revision: boolean;
}

export const useTopicsWithQuestions = (
  pathId: string | null, 
  userId: string, 
  toast: Toast
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<Topic[]>([]);

  useEffect(() => {
    if (!pathId) {
      setTopicsWithQuestions([]);
      return;
    }
    
    const fetchTopicsAndQuestions = async () => {
      setIsLoading(true);
      try {
        const { data: topics, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .eq('learning_path_id', pathId);
        
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
              .select('id, title, solution_link, practice_link, difficulty')
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
  }, [pathId, userId, toast]);

  return {
    isLoading,
    topicsWithQuestions
  };
};
