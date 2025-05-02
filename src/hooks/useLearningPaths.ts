
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningPath } from '@/types';
import { toast } from '@/hooks/use-toast';

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

export function useLearningPaths(userId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<LearningPath[]>([]);
  const [assignedPaths, setAssignedPaths] = useState<string[]>([]);

  // Fetch user's assigned learning paths
  useEffect(() => {
    const fetchUserAssignedPaths = async () => {
      try {
        console.log('Fetching assigned paths for user:', userId);
        const { data, error } = await supabase
          .from('users')
          .select('assigned_learning_paths')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching assigned paths:', error);
          toast({
            title: "Error",
            description: `Failed to load assigned paths: ${error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        if (data && data.assigned_learning_paths && Array.isArray(data.assigned_learning_paths)) {
          console.log('Assigned paths found:', data.assigned_learning_paths);
          setAssignedPaths(data.assigned_learning_paths);
        } else {
          console.log('No assigned paths found or invalid format for user:', userId);
          console.log('Data received:', data);
          // Initialize as empty array if undefined or not an array
          setAssignedPaths([]);
        }
      } catch (error: any) {
        console.error('Error in fetchUserAssignedPaths:', error.message);
        setAssignedPaths([]);
      }
    };
    
    if (userId) {
      fetchUserAssignedPaths();
    } else {
      console.log('No userId provided to useLearningPaths');
    }
  }, [userId]);
  
  // Fetch all learning paths
  useEffect(() => {
    const fetchLearningPaths = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching all learning paths');
        const { data, error } = await supabase
          .from('learning_paths')
          .select('*')
          .order('sr', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log('Raw learning paths data:', data);
          
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
          
          console.log('All learning paths with counts:', sortedPaths);
          setLearningPaths(sortedPaths);
        }
      } catch (error: any) {
        console.error('Error fetching learning paths:', error);
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
  }, []);
  
  // Filter learning paths based on user's assigned paths
  useEffect(() => {
    console.log('Filtering paths with assignedPaths:', assignedPaths);
    console.log('Available learningPaths:', learningPaths);
    
    if (learningPaths.length === 0) {
      console.log('No learning paths available to filter');
      setFilteredPaths([]);
      return;
    }
    
    if (!assignedPaths || assignedPaths.length === 0) {
      // If no assigned paths, show all paths as fallback
      console.log('No assigned paths, showing all paths');
      setFilteredPaths(learningPaths);
      return;
    }
    
    // Filter paths to only show those assigned to the user
    const filtered = learningPaths.filter(path => 
      assignedPaths.includes(path.id)
    );
    
    console.log('Filtered paths based on assignments:', filtered);
    
    if (filtered.length === 0) {
      console.log('No matching paths found after filtering, showing all paths as fallback');
      setFilteredPaths(learningPaths);
    } else {
      setFilteredPaths(filtered);
    }
  }, [learningPaths, assignedPaths]);

  return { isLoading, filteredPaths, learningPaths, assignedPaths };
}
