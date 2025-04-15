import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, ExternalLink, Star, Filter, X, BookText, Code } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { generateToken } from '@/utils/jwt';

export interface Question {
  id: string;
  title: string;
  solution_link: string;
  practice_link: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  is_completed: boolean;
  is_marked_for_revision: boolean;
}

interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

interface QuestionTableProps {
  topics: Topic[];
  learningPathTitle: string;
  userId: string;
}

export const QuestionTable = ({ topics: initialTopics, learningPathTitle, userId }: QuestionTableProps) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'solved' | 'unsolved' | 'revision'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const { toast } = useToast();

  const getPRN = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('prn')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data?.prn || null;
    } catch (error: any) {
      console.error('Error fetching PRN:', error.message);
      return null;
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleCompleted = async (topicId: string, questionId: string) => {
    try {
      const currentTopic = topics.find(t => t.id === topicId);
      const currentQuestion = currentTopic?.questions.find(q => q.id === questionId);
      
      if (!currentQuestion) return;
      
      const newCompletedState = !currentQuestion.is_completed;
      
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();
      
      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({ is_completed: newCompletedState })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert([{ 
            user_id: userId, 
            question_id: questionId, 
            is_completed: newCompletedState,
            is_marked_for_revision: false
          }]);
      }
      
      setTopics(currentTopics => 
        currentTopics.map(topic => {
          if (topic.id === topicId) {
            return {
              ...topic,
              questions: topic.questions.map(question => {
                if (question.id === questionId) {
                  toast({
                    title: newCompletedState ? "Question marked as completed" : "Question marked as incomplete",
                    description: `${question.title}`,
                    duration: 2000,
                  });
                  return { ...question, is_completed: newCompletedState };
                }
                return question;
              })
            };
          }
          return topic;
        })
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update progress: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const toggleRevision = async (topicId: string, questionId: string) => {
    try {
      const currentTopic = topics.find(t => t.id === topicId);
      const currentQuestion = currentTopic?.questions.find(q => q.id === questionId);
      
      if (!currentQuestion) return;
      
      const newRevisionState = !currentQuestion.is_marked_for_revision;
      
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle();
      
      if (existingProgress) {
        await supabase
          .from('user_progress')
          .update({ is_marked_for_revision: newRevisionState })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('user_progress')
          .insert([{ 
            user_id: userId, 
            question_id: questionId, 
            is_completed: false,
            is_marked_for_revision: newRevisionState
          }]);
      }
      
      setTopics(currentTopics => 
        currentTopics.map(topic => {
          if (topic.id === topicId) {
            return {
              ...topic,
              questions: topic.questions.map(question => {
                if (question.id === questionId) {
                  toast({
                    title: newRevisionState ? "Added to revision" : "Removed from revision",
                    description: `${question.title}`,
                    duration: 2000,
                  });
                  return { ...question, is_marked_for_revision: newRevisionState };
                }
                return question;
              })
            };
          }
          return topic;
        })
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update revision status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filterQuestions = (questions: Question[]) => {
    switch (filterStatus) {
      case 'solved':
        return questions.filter(q => q.is_completed);
      case 'unsolved':
        return questions.filter(q => !q.is_completed);
      case 'revision':
        return questions.filter(q => q.is_marked_for_revision);
      default:
        return questions;
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'arena-badge-easy';
      case 'medium':
        return 'arena-badge-medium';
      case 'hard':
        return 'arena-badge-hard';
      case 'theory':
        return 'arena-badge-theory';
      default:
        return '';
    }
  };

  const handlePracticeClick = async (questionId: string, practiceLink: string) => {
    try {
      const token = generateToken({
        userId,
        questionId
      });

      const baseUrl = 'https://practicequestion.arenahq-mitwpu.in';
      const url = `${baseUrl}?token=${token}`;
      
      window.open(url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to generate practice link: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const totalQuestions = topics.reduce((acc, topic) => acc + topic.questions.length, 0);
  const completedQuestions = topics.reduce((acc, topic) => 
    acc + topic.questions.filter(q => q.is_completed).length, 0);
  const completionPercentage = totalQuestions > 0 
    ? Math.round((completedQuestions / totalQuestions) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-arena-lightGray border-b border-arena-gray flex justify-between items-center">
        <h2 className="text-xl font-semibold text-arena-darkGray">{learningPathTitle}</h2>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-arena-darkGray">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-arena-red" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span>{completedQuestions}/{totalQuestions} ({completionPercentage}%)</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5" 
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={14} />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {showFilter && (
        <div className="p-4 bg-white border-b border-arena-gray flex flex-wrap gap-2">
          <Button 
            variant={filterStatus === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === 'solved' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('solved')}
          >
            Solved
          </Button>
          <Button 
            variant={filterStatus === 'unsolved' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('unsolved')}
          >
            Unsolved
          </Button>
          <Button 
            variant={filterStatus === 'revision' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('revision')}
          >
            Marked for Revision
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto"
            onClick={() => setShowFilter(false)}
          >
            <X size={14} />
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-arena-gray">
              <th className="arena-table-header">Mark Done</th>
              <th className="arena-table-header">Title</th>
              <th className="arena-table-header">Practice</th>
              <th className="arena-table-header">Article</th>
              <th className="arena-table-header">Difficulty</th>
              <th className="arena-table-header">Mark for Revision</th>
            </tr>
          </thead>
          <tbody>
            {topics.map(topic => (
              <React.Fragment key={topic.id}>
                <tr className="bg-arena-lightGray cursor-pointer hover:bg-arena-gray" onClick={() => toggleTopic(topic.id)}>
                  <td colSpan={6} className="px-4 py-3 font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{expandedTopics[topic.id] ? '▼' : '▶'}</span>
                      {topic.name} ({filterQuestions(topic.questions).length} questions)
                    </div>
                  </td>
                </tr>
                {expandedTopics[topic.id] && filterQuestions(topic.questions).map(question => (
                  <tr key={question.id} className={`border-b border-arena-gray hover:bg-gray-50 ${question.is_completed ? 'bg-green-50' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <Checkbox 
                        checked={question.is_completed} 
                        onCheckedChange={() => toggleCompleted(topic.id, question.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{question.title}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePracticeClick(question.id, question.practice_link);
                        }}
                        className="text-arena-red hover:underline inline-flex items-center gap-1 p-0 h-auto"
                      >
                        <Code size={14} />
                        Practice
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={question.solution_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-arena-red hover:underline inline-flex items-center gap-1"
                      >
                        <BookText size={14} />
                        Article
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getDifficultyClass(question.difficulty)}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button 
                        variant={question.is_marked_for_revision ? "default" : "outline"} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRevision(topic.id, question.id);
                        }}
                        className="w-8 h-8 p-0"
                      >
                        <Star size={14} className={question.is_marked_for_revision ? "text-yellow-400 fill-yellow-400" : ""} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
