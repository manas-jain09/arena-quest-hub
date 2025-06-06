
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningPath } from '@/types';

export const useLearningPaths = (userId?: string) => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First, get the user's assigned learning paths from auth table
        const { data: userData, error: userError } = await supabase
          .from('auth')
          .select('assigned_learning_paths')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setError('Failed to fetch user data');
          return;
        }

        const assignedLearningPaths = userData?.assigned_learning_paths || [];
        
        if (assignedLearningPaths.length === 0) {
          setLearningPaths([]);
          return;
        }

        // Fetch the learning paths details
        const { data: learningPathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select('*')
          .in('id', assignedLearningPaths);

        if (pathsError) {
          console.error('Error fetching learning paths:', pathsError);
          setError('Failed to fetch learning paths');
          return;
        }

        // Get topics count for each learning path
        const learningPathsWithCounts = await Promise.all(
          (learningPathsData || []).map(async (path) => {
            const { count: topicsCount } = await supabase
              .from('topics')
              .select('*', { count: 'exact', head: true })
              .eq('learning_path_id', path.id);

            const { count: questionsCount } = await supabase
              .from('questions')
              .select('*, topics!inner(*)', { count: 'exact', head: true })
              .eq('topics.learning_path_id', path.id);

            return {
              ...path,
              topicsCount: topicsCount || 0,
              questionsCount: questionsCount || 0,
            } as LearningPath;
          })
        );

        // Filter out any paths with invalid difficulty values and set default
        const validLearningPaths = learningPathsWithCounts.map(path => ({
          ...path,
          difficulty: (['easy', 'medium', 'hard', 'theory'].includes(path.difficulty)) 
            ? path.difficulty as 'easy' | 'medium' | 'hard' | 'theory'
            : 'medium' as const,
          title: path.title || '',
          description: path.description || '',
          sr: path.sr || '',
          created_at: path.created_at || '',
          updated_at: path.updated_at || ''
        }));

        setLearningPaths(validLearningPaths);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPaths();
  }, [userId]);

  return { learningPaths, isLoading, error };
};
