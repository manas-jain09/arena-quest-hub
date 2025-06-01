
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CodingProblem, ProblemExample, TestCase, LanguageTemplate } from '@/types/coding';
import { toast } from '@/hooks/use-toast';

export function useCodingProblem(problemId: string) {
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [examples, setExamples] = useState<ProblemExample[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [templates, setTemplates] = useState<LanguageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblemData = async () => {
      setIsLoading(true);
      try {
        // Fetch problem
        const { data: problemData, error: problemError } = await supabase
          .from('coding_problems')
          .select('*')
          .eq('id', problemId)
          .single();

        if (problemError) throw problemError;
        setProblem(problemData);

        // Fetch examples
        const { data: examplesData, error: examplesError } = await supabase
          .from('problem_examples')
          .select('*')
          .eq('problem_id', problemId)
          .order('example_number');

        if (examplesError) throw examplesError;
        setExamples(examplesData || []);

        // Fetch sample test cases
        const { data: testCasesData, error: testCasesError } = await supabase
          .from('test_cases')
          .select('*')
          .eq('problem_id', problemId)
          .eq('is_sample', true);

        if (testCasesError) throw testCasesError;
        setTestCases(testCasesData || []);

        // Fetch language templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('language_templates')
          .select('*')
          .eq('problem_id', problemId);

        if (templatesError) throw templatesError;
        setTemplates(templatesData || []);

      } catch (error: any) {
        console.error('Error fetching problem data:', error);
        toast({
          title: "Error",
          description: `Failed to load problem: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId) {
      fetchProblemData();
    }
  }, [problemId]);

  return { problem, examples, testCases, templates, isLoading };
}
