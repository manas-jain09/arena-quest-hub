import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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

  const { data: problem, isLoading: isLoadingProblem } = useQuery({
    queryKey: ['problem', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, title, difficulty')
        .eq('id', questionId)
        .single();

      if (error) throw error;
      return data as ProblemDetails;
    }
  });

  const { data: examples = [], isLoading: isLoadingExamples } = useQuery({
    queryKey: ['examples', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('examples')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as Example[];
    },
    enabled: !!questionId
  });

  const { data: constraints = [], isLoading: isLoadingConstraints } = useQuery({
    queryKey: ['constraints', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('constraints')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as Constraint[];
    },
    enabled: !!questionId
  });

  const { data: testCases = [], isLoading: isLoadingTestCases } = useQuery({
    queryKey: ['testCases', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as TestCase[];
    },
    enabled: !!questionId
  });

  const { data: languageTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['languageTemplates', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('language_templates')
        .select('*')
        .eq('question_id', questionId);

      if (error) throw error;
      return data as LanguageTemplate[];
    },
    enabled: !!questionId
  });

  useEffect(() => {
    if (languageTemplates.length > 0) {
      const template = languageTemplates.find(t => t.name.toLowerCase() === language);
      if (template) {
        setCode(template.template);
      } else {
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
      const visibleTests = testCases.filter(tc => tc.visible);
      
      const mockResults = visibleTests.map(test => ({
        id: test.id,
        input: test.input,
        expected: test.expected,
        actual: test.expected,
        status: "passed",
        points: test.points
      }));
      
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
      const mockResults = testCases.map(test => ({
        id: test.id,
        input: test.visible ? test.input : "Hidden",
        expected: test.visible ? test.expected : "Hidden",
        actual: test.expected,
        status: Math.random() > 0.2 ? "passed" : "failed",
        points: test.points
      }));
      
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
    <div className="h-screen bg-white text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{problem?.title}</h1>
            <div className="flex gap-2 mt-1">
              <Badge 
                className={`${getDifficultyClass(problem?.difficulty)} text-xs font-medium px-2 py-0.5`}
              >
                {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRun} 
              disabled={isRunning}
              variant="outline"
              className="gap-2 bg-white hover:bg-gray-50 text-gray-700"
            >
              <PlayCircle size={18} />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <CheckCircle size={18} />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-1 bg-gray-50">
        <ResizablePanel defaultSize={40} minSize={30} className="bg-white">
          <div className="h-full overflow-auto">
            <Tabs defaultValue="description" className="p-6">
              <TabsList className="w-full bg-gray-100">
                <TabsTrigger 
                  value="description" 
                  className="flex-1 data-[state=active]:bg-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="examples" 
                  className="flex-1 data-[state=active]:bg-white"
                >
                  Examples
                </TabsTrigger>
                <TabsTrigger 
                  value="constraints" 
                  className="flex-1 data-[state=active]:bg-white"
                >
                  Constraints
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
                  <p className="text-gray-700">
                    {isLoadingProblem 
                      ? "Loading problem description..." 
                      : problem?.description || "Write a function to solve this problem based on the given examples and constraints."}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-6">
                {isLoadingExamples ? (
                  <p className="text-gray-600">Loading examples...</p>
                ) : examples.length > 0 ? (
                  <div className="space-y-6">
                    {examples.map((example, index) => (
                      <div key={example.id} className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Example {index + 1}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Input:</p>
                            <pre className="mt-2 p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800">{example.input}</pre>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Output:</p>
                            <pre className="mt-2 p-3 bg-gray-50 rounded-md text-sm font-mono text-gray-800">{example.output}</pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Explanation:</p>
                            <p className="mt-2 text-sm text-gray-600">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No examples available for this problem.</p>
                )}
              </TabsContent>
              
              <TabsContent value="constraints" className="mt-6">
                {isLoadingConstraints ? (
                  <p className="text-gray-600">Loading constraints...</p>
                ) : constraints.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Constraints:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {constraints.map(constraint => (
                        <li key={constraint.id}>{constraint.description}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600">No specific constraints for this problem.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
        
        <ResizableHandle className="bg-gray-200 w-1" />
        
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} className="bg-white">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-200">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 bg-white">
                  <CodeEditor code={code} onChange={setCode} language={language} />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="bg-gray-200 h-1" />
            
            <ResizablePanel defaultSize={30} className="bg-white">
              <div className="h-full overflow-auto p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Test Results</h3>
                
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map(result => (
                      <TestCaseResult 
                        key={result.id}
                        result={result}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
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
