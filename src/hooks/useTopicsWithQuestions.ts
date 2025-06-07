
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Topic } from '@/types';
import { toast } from '@/hooks/use-toast';

// Helper function to normalize difficulty string to expected type
const normalizeDifficulty = (difficulty: string | null): 'easy' | 'medium' | 'hard' | 'theory' => {
  if (!difficulty) return 'easy';
  const lower = difficulty.toLowerCase();
  if (lower === 'theory' || lower === 'easy' || lower === 'medium' || lower === 'hard') {
    return lower as 'easy' | 'medium' | 'hard' | 'theory';
  }
  return 'easy';
};

export function useTopicsWithQuestions(selectedPathId: string | null, userId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<Topic[]>([]);

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
                difficulty: normalizeDifficulty(question.difficulty),
                is_completed: userProgress?.is_completed || false,
                is_marked_for_revision: userProgress?.is_marked_for_revision || false
              };
            }) || [];
            
            return {
              id: topic.id,
              name: topic.name || '',
              learning_path_id: topic.learning_path_id || '',
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
  }, [selectedPathId, userId]);

  return { isLoading, topicsWithQuestions };
}
