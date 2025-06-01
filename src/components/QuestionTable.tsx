
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink, BookOpen, Code } from 'lucide-react';
import { Topic, Question } from '@/types';
import { useCodingProblems } from '@/hooks/useCodingProblems';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuestionTableProps {
  topicsWithQuestions: Topic[];
  userId: string;
}

export function QuestionTable({ topicsWithQuestions, userId }: QuestionTableProps) {
  const navigate = useNavigate();
  const { problems: codingProblems } = useCodingProblems();
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  const updateProgress = async (questionId: string, field: 'is_completed' | 'is_marked_for_revision', value: boolean) => {
    setUpdatingProgress(questionId);
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: userId,
            question_id: questionId,
            [field]: value,
          },
          { onConflict: 'user_id,question_id' }
        );

      if (error) throw error;

      toast({
        title: "Progress Updated",
        description: `Question ${field === 'is_completed' ? 'completion' : 'revision'} status updated`,
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: `Failed to update progress: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUpdatingProgress(null);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyMap = {
      easy: 'arena-badge-easy',
      medium: 'arena-badge-medium', 
      hard: 'arena-badge-hard',
      theory: 'arena-badge-theory'
    };
    
    return (
      <Badge className={`arena-badge ${difficultyMap[difficulty as keyof typeof difficultyMap] || 'arena-badge-theory'}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    );
  };

  const handlePracticeClick = (questionTitle: string) => {
    // Find matching coding problem by title
    const codingProblem = codingProblems.find(problem => 
      problem.title.toLowerCase().includes(questionTitle.toLowerCase()) ||
      questionTitle.toLowerCase().includes(problem.title.toLowerCase())
    );

    if (codingProblem) {
      navigate(`/coding/${codingProblem.id}`);
    } else {
      // If no coding problem found, use the first available problem
      if (codingProblems.length > 0) {
        navigate(`/coding/${codingProblems[0].id}`);
      } else {
        toast({
          title: "Coming Soon",
          description: "Coding environment is being prepared for this problem",
          variant: "default"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {topicsWithQuestions.map((topic) => (
        <Card key={topic.id} className="arena-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-arena-darkGray">
              {topic.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="arena-table-header text-left w-8">Done</th>
                    <th className="arena-table-header text-left w-8">Mark</th>
                    <th className="arena-table-header text-left">Question</th>
                    <th className="arena-table-header text-left w-24">Difficulty</th>
                    <th className="arena-table-header text-left w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topic.questions.map((question: Question) => (
                    <tr key={question.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox 
                          checked={question.is_completed}
                          onCheckedChange={(checked) => 
                            updateProgress(question.id, 'is_completed', checked as boolean)
                          }
                          disabled={updatingProgress === question.id}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Checkbox 
                          checked={question.is_marked_for_revision}
                          onCheckedChange={(checked) => 
                            updateProgress(question.id, 'is_marked_for_revision', checked as boolean)
                          }
                          disabled={updatingProgress === question.id}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-arena-darkGray">
                          {question.title}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getDifficultyBadge(question.difficulty)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {question.solution_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => navigate(`/articles/${question.id}`)}
                            >
                              <BookOpen className="h-3 w-3" />
                              Solution
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handlePracticeClick(question.title)}
                          >
                            <Code className="h-3 w-3" />
                            Practice
                          </Button>
                          {question.practice_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              asChild
                            >
                              <a 
                                href={question.practice_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Link
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
