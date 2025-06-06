import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningPath } from '@/types';

export const useLearningPaths = (userId?: string) => {
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('learning_paths')
          .select(`
            *,
            topics:topics(count),
            questions:questions(count)
          `);

        if (error) {
          console.error('Error fetching learning paths:', error);
          setError('Failed to fetch learning paths');
          return;
        }

        // Transform the data to match our LearningPath type
        const transformedData = data?.map((path: any) => ({
          ...path,
          difficulty: path.difficulty as "easy" | "medium" | "hard" | "theory",
          topicsCount: path.topics?.[0]?.count || 0,
          questionsCount: path.questions?.[0]?.count || 0,
        })) || [];

        if (userId) {
          setFilteredPaths(transformedData);
        } else {
          setAllPaths(transformedData);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPaths();
  }, [userId]);

  return { allPaths, filteredPaths, isLoading, error };
};
