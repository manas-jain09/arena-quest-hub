
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CodingProblem } from '@/types/coding';
import { toast } from '@/hooks/use-toast';

export function useCodingProblems() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data, error } = await supabase
          .from('coding_problems')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProblems(data || []);
      } catch (error: any) {
        console.error('Error fetching problems:', error);
        toast({
          title: "Error",
          description: `Failed to load problems: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return { problems, isLoading };
}
