
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Send, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CodeMirror from '@/components/CodeMirror';
import TestResultsPanel from '@/components/TestResultsPanel';

const LANGUAGES = [
  { id: 'c', name: 'C', language_id: 50 },
  { id: 'cpp', name: 'C++', language_id: 54 },
  { id: 'java', name: 'Java', language_id: 62 },
  { id: 'python', name: 'Python', language_id: 71 }
];

const API_SUBMISSION_URL = "https://judge0.arenahq-mitwpu.in/submissions";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Example {
  id: string;
  input: string;
  output: string;
  explanation: string;
}

interface Constraint {
  id: string;
  description: string;
}

interface LanguageTemplate {
  id: string;
  name: string;
  template: string;
}

interface TestCase {
  id: string;
  input: string;
  expected: string;
  visible: boolean;
  points: number;
}

interface SubmissionResult {
  testCaseId: string;
  passed: boolean;
  expected: string;
  output: string;
  input: string;
  points: number;
}

const CodeEditor = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [examples, setExamples] = useState<Example[]>([]);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [languageTemplates, setLanguageTemplates] = useState<LanguageTemplate[]>([]);
  
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SubmissionResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Track if the question is completed
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompletedChecked, setIsCompletedChecked] = useState(false);

  // Load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  // Fetch question data
  useEffect(() => {
    if (!questionId) return;
    
    const fetchQuestionData = async () => {
      try {
        // Fetch question details
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .single();
        
        if (questionError) throw questionError;
        setQuestion(questionData);
        
        // Fetch examples
        const { data: examplesData, error: examplesError } = await supabase
          .from('examples')
          .select('*')
          .eq('question_id', questionId);
        
        if (examplesError) throw examplesError;
        setExamples(examplesData || []);
        
        // Fetch constraints
        const { data: constraintsData, error: constraintsError } = await supabase
          .from('constraints')
          .select('*')
          .eq('question_id', questionId);
        
        if (constraintsError) throw constraintsError;
        setConstraints(constraintsData || []);
        
        // Fetch language templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('language_templates')
          .select('*')
          .eq('question_id', questionId);
        
        if (templatesError) throw templatesError;
        setLanguageTemplates(templatesData || []);
        
        // Fetch test cases
        const { data: testCasesData, error: testCasesError } = await supabase
          .from('test_cases')
          .select('*')
          .eq('question_id', questionId);
        
        if (testCasesError) throw testCasesError;
        setTestCases(testCasesData || []);
        
        // Calculate max possible score
        const totalPoints = testCasesData?.reduce((sum, tc) => sum + (tc.points || 0), 0) || 0;
        setMaxScore(totalPoints);
        
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load question data: ${error.message}`,
          variant: "destructive",
        });
      }
    };
    
    fetchQuestionData();
  }, [questionId, toast]);

  // Check if the question is already completed
  useEffect(() => {
    if (!userId || !questionId || isCompletedChecked) return;
    
    const checkCompletion = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('is_completed')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setIsCompleted(data.is_completed);
        }
        
        setIsCompletedChecked(true);
      } catch (error: any) {
        console.error("Error checking completion status:", error);
      }
    };
    
    checkCompletion();
  }, [userId, questionId, isCompletedChecked]);

  // Load saved code for this question
  useEffect(() => {
    if (!userId || !questionId || !selectedLanguage) return;
    
    const loadSavedCode = async () => {
      try {
        const { data, error } = await supabase
          .from('user_code')
          .select('code')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .eq('language', selectedLanguage)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.code) {
          setCode(data.code);
        } else {
          // Set the template code for the selected language
          const template = languageTemplates.find(t => t.name.toLowerCase() === selectedLanguage);
          if (template) {
            setCode(template.template);
          }
        }
      } catch (error: any) {
        console.error("Error loading saved code:", error);
      }
    };
    
    loadSavedCode();
  }, [userId, questionId, selectedLanguage, languageTemplates]);

  // Set template code when language changes
  useEffect(() => {
    const template = languageTemplates.find(t => t.name.toLowerCase() === selectedLanguage);
    if (template) {
      setCode(template.template);
    }
  }, [selectedLanguage, languageTemplates]);

  // Save code periodically
  useEffect(() => {
    if (!userId || !questionId || !code || !selectedLanguage) return;
    
    const saveTimer = setTimeout(async () => {
      try {
        // Check if a record already exists
        const { data: existingData, error: checkError } = await supabase
          .from('user_code')
          .select('id')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .eq('language', selectedLanguage)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('user_code')
            .update({ code, updated_at: new Date() })
            .eq('id', existingData.id);
          
          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('user_code')
            .insert([{ 
              user_id: userId, 
              question_id: questionId, 
              language: selectedLanguage, 
              code 
            }]);
          
          if (insertError) throw insertError;
        }
      } catch (error: any) {
        console.error("Error saving code:", error);
      }
    }, 5000); // Save every 5 seconds
    
    return () => clearTimeout(saveTimer);
  }, [userId, questionId, code, selectedLanguage]);

  const handleRun = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before running",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    setShowResults(true);
    
    try {
      // Get visible test cases only
      const visibleTestCases = testCases.filter(tc => tc.visible);
      
      if (visibleTestCases.length === 0) {
        toast({
          title: "Error",
          description: "No visible test cases found",
          variant: "destructive",
        });
        return;
      }
      
      // Create results for each test case
      const results: SubmissionResult[] = [];
      let totalScore = 0;
      
      for (const testCase of visibleTestCases) {
        // Get language ID
        const language = LANGUAGES.find(l => l.id === selectedLanguage);
        if (!language) {
          throw new Error(`Language ${selectedLanguage} not supported`);
        }
        
        // Create submission
        const response = await fetch(API_SUBMISSION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: code,
            language_id: language.language_id,
            stdin: testCase.input,
            expected_output: testCase.expected,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Submission failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        const token = data.token;
        
        // Poll for results
        let submissionStatus = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const statusResponse = await fetch(`${API_SUBMISSION_URL}/${token}`);
          if (!statusResponse.ok) {
            throw new Error(`Status check failed: ${statusResponse.statusText}`);
          }
          
          submissionStatus = await statusResponse.json();
          
          if (submissionStatus.status.id > 2) { // Status > 2 means finished
            break;
          }
          
          attempts++;
        }
        
        if (!submissionStatus || submissionStatus.status.id <= 2) {
          throw new Error("Execution timed out");
        }
        
        const testPassed = submissionStatus.status.id === 3; // Status 3 = Accepted
        const testOutput = submissionStatus.stdout || "";
        
        results.push({
          testCaseId: testCase.id,
          passed: testPassed,
          expected: testCase.expected,
          output: testOutput.trim(),
          input: testCase.input,
          points: testPassed ? testCase.points : 0
        });
        
        if (testPassed) {
          totalScore += testCase.points;
        }
      }
      
      setResults(results);
      setTotalScore(totalScore);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Execution failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setShowResults(true);
    
    try {
      // Run all test cases (visible and hidden)
      const results: SubmissionResult[] = [];
      let totalScore = 0;
      
      for (const testCase of testCases) {
        // Get language ID
        const language = LANGUAGES.find(l => l.id === selectedLanguage);
        if (!language) {
          throw new Error(`Language ${selectedLanguage} not supported`);
        }
        
        // Create submission
        const response = await fetch(API_SUBMISSION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: code,
            language_id: language.language_id,
            stdin: testCase.input,
            expected_output: testCase.expected,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Submission failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        const token = data.token;
        
        // Poll for results
        let submissionStatus = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const statusResponse = await fetch(`${API_SUBMISSION_URL}/${token}`);
          if (!statusResponse.ok) {
            throw new Error(`Status check failed: ${statusResponse.statusText}`);
          }
          
          submissionStatus = await statusResponse.json();
          
          if (submissionStatus.status.id > 2) { // Status > 2 means finished
            break;
          }
          
          attempts++;
        }
        
        if (!submissionStatus || submissionStatus.status.id <= 2) {
          throw new Error("Execution timed out");
        }
        
        const testPassed = submissionStatus.status.id === 3; // Status 3 = Accepted
        const testOutput = submissionStatus.stdout || "";
        
        results.push({
          testCaseId: testCase.id,
          passed: testPassed,
          expected: testCase.expected,
          output: testOutput.trim(),
          input: testCase.input,
          points: testPassed ? testCase.points : 0
        });
        
        if (testPassed) {
          totalScore += testCase.points;
        }
      }
      
      setResults(results);
      setTotalScore(totalScore);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      setIsSuccess(allPassed && totalScore === maxScore);
      
      // If the user got full score, mark the question as completed
      if (userId && questionId && totalScore === maxScore) {
        // Update user_progress
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', questionId)
          .maybeSingle();
        
        if (existingProgress) {
          // Update existing progress
          await supabase
            .from('user_progress')
            .update({ is_completed: true })
            .eq('id', existingProgress.id);
        } else {
          // Create new progress
          await supabase
            .from('user_progress')
            .insert([{ 
              user_id: userId, 
              question_id: questionId, 
              is_completed: true,
              is_marked_for_revision: false
            }]);
        }
        
        setIsCompleted(true);
        
        toast({
          title: "Congratulations!",
          description: "You have successfully completed this question!",
        });
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Submission failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'arena-badge-easy';
      case 'medium':
        return 'arena-badge-medium';
      case 'hard':
        return 'arena-badge-hard';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{question?.title || 'Loading...'}</h1>
                {question && (
                  <Badge className={getDifficultyClass(question.difficulty)}>
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </Badge>
                )}
                {isCompleted && (
                  <Badge className="bg-green-500">Completed</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(1)}
              className="flex items-center"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left panel - Question description */}
        <div className="w-1/2 bg-white p-6 overflow-y-auto border-r border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="text-gray-700">
              {question?.description || 'Loading...'}
            </div>
          </div>

          {examples.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Examples</h2>
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <div key={example.id} className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-500 mb-2">Input:</p>
                    <pre className="bg-gray-100 p-2 rounded mb-2 text-sm">{example.input}</pre>
                    
                    <p className="text-sm font-medium text-gray-500 mb-2">Output:</p>
                    <pre className="bg-gray-100 p-2 rounded mb-2 text-sm">{example.output}</pre>
                    
                    {example.explanation && (
                      <>
                        <p className="text-sm font-medium text-gray-500 mb-2">Explanation:</p>
                        <p className="text-sm">{example.explanation}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {constraints.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Constraints</h2>
              <ul className="list-disc pl-6 space-y-1">
                {constraints.map(constraint => (
                  <li key={constraint.id} className="text-gray-700">{constraint.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right panel - Code editor and test results */}
        <div className="w-1/2 flex flex-col">
          {/* Code editor header */}
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-2">Code Editor</span>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="flex items-center"
              >
                {isRunning ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              onChange={setCode}
              language={selectedLanguage}
            />
          </div>

          {/* Results dialog */}
          <Dialog open={showResults && !isRunning && !isSubmitting} onOpenChange={setShowResults}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {isSuccess ? (
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                  )}
                  Test Results
                </DialogTitle>
                <DialogDescription>
                  {isSuccess 
                    ? "Congratulations! All tests passed." 
                    : `You scored ${totalScore} out of ${maxScore} points.`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-[60vh] overflow-y-auto">
                <TestResultsPanel results={results} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
