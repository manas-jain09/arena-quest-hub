
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProblemDescription } from '@/components/ProblemDescription';
import { CodeEditor } from '@/components/CodeEditor';
import { TestResults } from '@/components/TestResults';
import { useCodingProblem } from '@/hooks/useCodingProblem';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TestResult {
  input: string;
  expected: string;
  actual?: string;
  status: 'passed' | 'failed' | 'error' | 'pending';
  executionTime?: number;
}

export function CodingEnvironment() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const { problem, examples, testCases, templates, isLoading } = useCodingProblem(problemId || '');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async (code: string, language: string) => {
    setIsRunning(true);
    
    // Simulate test execution (in a real implementation, you'd send this to a code execution service)
    const mockResults: TestResult[] = testCases.map((testCase, index) => ({
      input: testCase.input,
      expected: testCase.expected_output,
      actual: testCase.expected_output, // Mock: assume all tests pass
      status: Math.random() > 0.2 ? 'passed' : 'failed', // Mock: 80% pass rate
      executionTime: Math.floor(Math.random() * 100) + 10
    }));

    // Simulate execution delay
    setTimeout(() => {
      setTestResults(mockResults);
      setIsRunning(false);
      
      const passedCount = mockResults.filter(r => r.status === 'passed').length;
      toast({
        title: "Code Executed",
        description: `${passedCount}/${mockResults.length} test cases passed`,
        variant: passedCount === mockResults.length ? "default" : "destructive"
      });
    }, 2000);
  };

  const handleSubmitCode = async (code: string, language: string) => {
    if (!problem) return;

    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to submit code",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('user_submissions')
        .insert({
          user_id: userId,
          problem_id: problem.id,
          language,
          code,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Code Submitted",
        description: "Your solution has been submitted for evaluation",
      });

      // In a real implementation, you would also trigger code execution here
      // For now, we'll just run the code to show test results
      handleRunCode(code, language);

    } catch (error: any) {
      console.error('Error submitting code:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Problem not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-lg font-semibold">{problem.title}</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Left Panel - Problem Description */}
          <div className="space-y-4">
            <ProblemDescription problem={problem} examples={examples} />
            <TestResults results={testResults} isRunning={isRunning} />
          </div>

          {/* Right Panel - Code Editor */}
          <div>
            <CodeEditor 
              templates={templates}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
