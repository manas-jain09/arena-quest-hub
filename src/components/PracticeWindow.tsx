
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CodeEditor } from './CodeEditor';
import { TestCaseResult } from './TestCaseResult';

interface ProblemDetails {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
}

interface Example {
  id: number;
  question_id: number;
  input: string;
  output: string;
  explanation: string;
}

interface Constraint {
  id: number;
  question_id: number;
  description: string;
}

interface TestCase {
  id: number;
  question_id: number;
  input: string;
  expected: string;
  visible: boolean;
  points: number;
}

interface LanguageTemplate {
  id: number;
  question_id: number;
  name: string;
  template: string;
}

export const PracticeWindow = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [language, setLanguage] = useState<string>('cpp');
  const [code, setCode] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch problem details
  const { data: problem, isLoading: isLoadingProblem } = useQuery({
    queryKey: ['problem', questionId],
    queryFn: async () => {
      // Fetch problem details from the database
      const { data, error } = await supabase
        .from('questions')
        .select('id, title, difficulty')
        .eq('id', questionId)
        .single();

      if (error) throw error;
      return data as ProblemDetails;
    }
  });

  // Fetch examples
  const { data: examples = [], isLoading: isLoadingExamples } = useQuery({
    queryKey: ['examples', questionId],
    queryFn: async () => {
      // Fetch examples from the database
      const { data, error } = await supabase
        .from('examples')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as Example[];
    },
    enabled: !!questionId
  });

  // Fetch constraints
  const { data: constraints = [], isLoading: isLoadingConstraints } = useQuery({
    queryKey: ['constraints', questionId],
    queryFn: async () => {
      // Fetch constraints from the database
      const { data, error } = await supabase
        .from('constraints')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as Constraint[];
    },
    enabled: !!questionId
  });

  // Fetch test cases
  const { data: testCases = [], isLoading: isLoadingTestCases } = useQuery({
    queryKey: ['testCases', questionId],
    queryFn: async () => {
      // Fetch test cases from the database
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as TestCase[];
    },
    enabled: !!questionId
  });

  // Fetch language templates
  const { data: languageTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['languageTemplates', questionId],
    queryFn: async () => {
      // Fetch language templates from the database
      const { data, error } = await supabase
        .from('language_templates')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as LanguageTemplate[];
    },
    enabled: !!questionId
  });

  // Set initial template when languages are loaded or language changes
  useEffect(() => {
    if (languageTemplates.length > 0) {
      const template = languageTemplates.find(t => t.name.toLowerCase() === language);
      if (template) {
        setCode(template.template);
      } else {
        // Fallback to default template for the language
        setDefaultTemplate();
      }
    } else {
      setDefaultTemplate();
    }
  }, [language, languageTemplates]);

  const setDefaultTemplate = () => {
    switch (language) {
      case 'c':
        setCode(
`#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`);
        break;
      case 'cpp':
        setCode(
`#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`);
        break;
      case 'java':
        setCode(
`import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Your code here
        
    }
}`);
        break;
      case 'python':
        setCode(
`# Your code here

`);
        break;
      default:
        setCode('// Start coding here');
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before running.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      // Get only visible test cases
      const visibleTests = testCases.filter(tc => tc.visible);
      
      // Mock execution for now
      // In a real implementation, you would send the code to a backend for execution
      const mockResults = visibleTests.map(test => ({
        id: test.id,
        input: test.input,
        expected: test.expected,
        actual: test.expected, // Mocking correct output
        status: "passed",
        points: test.points
      }));
      
      // Simulate processing time
      setTimeout(() => {
        setResults(mockResults);
        setIsRunning(false);
        toast({
          title: "Run completed",
          description: "All test cases executed successfully."
        });
      }, 1500);
    } catch (error) {
      setIsRunning(false);
      toast({
        title: "Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setResults([]);

    try {
      // In a real implementation, you would send the code to a backend for execution against all test cases
      // Mock submission result for now
      const mockResults = testCases.map(test => ({
        id: test.id,
        input: test.visible ? test.input : "Hidden",
        expected: test.visible ? test.expected : "Hidden",
        actual: test.expected, // Mocking correct output
        status: Math.random() > 0.2 ? "passed" : "failed", // Some random failures for demo
        points: test.points
      }));
      
      // Simulate processing time
      setTimeout(() => {
        setResults(mockResults);
        setIsSubmitting(false);
        
        const passedTests = mockResults.filter(r => r.status === "passed").length;
        const totalTests = mockResults.length;
        const totalPoints = mockResults.reduce((sum, r) => r.status === "passed" ? sum + r.points : sum, 0);
        const maxPoints = testCases.reduce((sum, tc) => sum + tc.points, 0);
        
        toast({
          title: "Submission results",
          description: `Passed ${passedTests}/${totalTests} test cases. Score: ${totalPoints}/${maxPoints} points.`,
          variant: passedTests === totalTests ? "default" : "destructive"
        });
        
        // In a real implementation, you would save the submission to the database
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'hard':
        return 'bg-red-500 hover:bg-red-600';
      case 'theory':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  if (isLoadingProblem) {
    return <div className="flex items-center justify-center h-screen">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="flex items-center justify-center h-screen">Problem not found</div>;
  }

  return (
    <div className="h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="bg-[#252B3B] border-b border-[#2D3548] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{problem?.title}</h1>
            <div className="flex gap-2 mt-1">
              <Badge 
                className={`${getDifficultyClass(problem?.difficulty)} text-xs font-medium px-2 py-0.5`}
              >
                {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRun} 
              disabled={isRunning}
              variant="secondary"
              className="bg-[#2D3548] hover:bg-[#3A445D] text-white border-none gap-2"
            >
              <PlayCircle size={18} />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white border-none gap-2"
            >
              <CheckCircle size={18} />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Problem description panel */}
        <ResizablePanel defaultSize={40} minSize={30} className="bg-[#252B3B]">
          <div className="h-full overflow-auto">
            <Tabs defaultValue="description" className="p-4">
              <TabsList className="w-full bg-[#2D3548] text-white">
                <TabsTrigger 
                  value="description" 
                  className="flex-1 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="examples" 
                  className="flex-1 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Examples
                </TabsTrigger>
                <TabsTrigger 
                  value="constraints" 
                  className="flex-1 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white"
                >
                  Constraints
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4 text-gray-300">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-lg font-semibold mb-2 text-white">Problem Description</h2>
                  <p>
                    {isLoadingProblem 
                      ? "Loading problem description..." 
                      : problem?.description || "Write a function to solve this problem based on the given examples and constraints."}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-4">
                {isLoadingExamples ? (
                  <p className="text-gray-400">Loading examples...</p>
                ) : examples.length > 0 ? (
                  <div className="space-y-4">
                    {examples.map((example, index) => (
                      <div key={example.id} className="border border-[#2D3548] rounded-md p-4 bg-[#1A1F2C]">
                        <h3 className="font-medium text-white mb-2">Example {index + 1}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold text-sm text-gray-400">Input:</p>
                            <pre className="bg-[#252B3B] p-2 rounded mt-1 text-sm text-gray-300 font-mono">{example.input}</pre>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-400">Output:</p>
                            <pre className="bg-[#252B3B] p-2 rounded mt-1 text-sm text-gray-300 font-mono">{example.output}</pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-2">
                            <p className="font-semibold text-sm text-gray-400">Explanation:</p>
                            <p className="text-sm mt-1 text-gray-300">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No examples available for this problem.</p>
                )}
              </TabsContent>
              
              <TabsContent value="constraints" className="mt-4">
                {isLoadingConstraints ? (
                  <p className="text-gray-400">Loading constraints...</p>
                ) : constraints.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="font-medium text-white">Constraints:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      {constraints.map(constraint => (
                        <li key={constraint.id}>{constraint.description}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400">No specific constraints for this problem.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        
        <ResizableHandle className="bg-[#2D3548] w-1" />
        
        {/* Code editor and test cases panel */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            {/* Code editor section */}
            <ResizablePanel defaultSize={70} className="bg-[#1A1F2C]">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 bg-[#252B3B] border-b border-[#2D3548]">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px] bg-[#2D3548] border-[#4F46E5] text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#252B3B] border-[#2D3548]">
                      <SelectItem value="c" className="text-white hover:bg-[#2D3548]">C</SelectItem>
                      <SelectItem value="cpp" className="text-white hover:bg-[#2D3548]">C++</SelectItem>
                      <SelectItem value="java" className="text-white hover:bg-[#2D3548]">Java</SelectItem>
                      <SelectItem value="python" className="text-white hover:bg-[#2D3548]">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <CodeEditor code={code} onChange={setCode} language={language} />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="bg-[#2D3548] h-1" />
            
            {/* Test cases and output section */}
            <ResizablePanel defaultSize={30} className="bg-[#252B3B]">
              <div className="h-full overflow-auto p-4">
                <h3 className="font-medium text-white mb-3">Test Results</h3>
                
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map(result => (
                      <TestCaseResult 
                        key={result.id}
                        result={result}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-500" />
                    <p className="mt-2">Run your code to see the results here</p>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
