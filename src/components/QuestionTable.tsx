import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Check, ExternalLink, Star, Filter, X, BookText, Code, 
  ChevronDown, ChevronRight, CheckCircle, XCircle, FolderOpen 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

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

  // Check if this learning path is a theory learning path
  const isTheoryPath = learningPathTitle.toLowerCase().includes('theory') || 
                      initialTopics.some(topic => 
                        topic.questions.some(question => question.difficulty === 'theory'));

  const getPRN = async () => {
    try {
      const { data, error } = await supabase
        .from('auth')
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
        // Generate a new UUID for the id field
        const { data, error } = await supabase
          .from('user_progress')
          .insert({ 
            id: crypto.randomUUID(),
            user_id: userId, 
            question_id: questionId, 
            is_completed: newCompletedState,
            is_marked_for_revision: false
          });
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
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
        // Generate a new UUID for the id field
        const { data, error } = await supabase
          .from('user_progress')
          .insert({ 
            id: crypto.randomUUID(),
            user_id: userId, 
            question_id: questionId, 
            is_completed: false,
            is_marked_for_revision: newRevisionState
          });
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
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

  const handlePracticeClick = async (practiceLink: string) => {
    window.open(practiceLink, '_blank');
  };

  const totalQuestions = topics.reduce((acc, topic) => acc + topic.questions.length, 0);
  const completedQuestions = topics.reduce((acc, topic) => 
    acc + topic.questions.filter(q => q.is_completed).length, 0);
  const completionPercentage = totalQuestions > 0 
    ? Math.round((completedQuestions / totalQuestions) * 100) 
    : 0;

  const showPracticeColumn = !isTheoryPath;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-arena-lightGray to-white border-b border-arena-gray flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FolderOpen className="text-arena-red" size={20} />
          <h2 className="text-xl font-semibold text-arena-darkGray">{learningPathTitle}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-arena-darkGray">
            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-arena-red to-arena-darkRed" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="font-medium">{completedQuestions}/{totalQuestions} ({completionPercentage}%)</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 bg-white" 
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={14} />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilter && (
        <div className="p-4 bg-white border-b border-arena-gray flex flex-wrap gap-2 animate-fade-in">
          <Button 
            variant={filterStatus === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? "bg-arena-red hover:bg-arena-darkRed" : ""}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === 'solved' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('solved')}
            className={filterStatus === 'solved' ? "bg-arena-red hover:bg-arena-darkRed" : ""}
          >
            <CheckCircle size={14} className="mr-1" />
            Solved
          </Button>
          <Button 
            variant={filterStatus === 'unsolved' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('unsolved')}
            className={filterStatus === 'unsolved' ? "bg-arena-red hover:bg-arena-darkRed" : ""}
          >
            <XCircle size={14} className="mr-1" />
            Unsolved
          </Button>
          <Button 
            variant={filterStatus === 'revision' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus('revision')}
            className={filterStatus === 'revision' ? "bg-arena-red hover:bg-arena-darkRed" : ""}
          >
            <Star size={14} className="mr-1" />
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

      {/* Content */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[70px] text-center">Done</TableHead>
              <TableHead>Title</TableHead>
              {showPracticeColumn && (
                <TableHead className="w-[110px]">Practice</TableHead>
              )}
              <TableHead className="w-[110px]">Article</TableHead>
              <TableHead className="w-[110px]">Difficulty</TableHead>
              <TableHead className="w-[110px] text-center">Revision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map(topic => (
              <React.Fragment key={topic.id}>
                <TableRow 
                  className="bg-arena-lightGray cursor-pointer hover:bg-arena-gray border-t"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <TableCell colSpan={showPracticeColumn ? 6 : 5} className="py-3">
                    <div className="flex items-center">
                      {expandedTopics[topic.id] ? 
                        <ChevronDown size={18} className="text-arena-red mr-2" /> : 
                        <ChevronRight size={18} className="text-arena-darkGray mr-2" />}
                      <span className="font-medium text-gray-800">{topic.name}</span>
                      <span className="ml-3 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {filterQuestions(topic.questions).length} questions
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                
                {expandedTopics[topic.id] && filterQuestions(topic.questions).map(question => (
                  <TableRow 
                    key={question.id} 
                    className={`border-t border-gray-100 hover:bg-gray-50 ${
                      question.is_completed ? 'bg-green-50/50' : ''
                    }`}
                  >
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox 
                          checked={question.is_completed} 
                          onCheckedChange={() => toggleCompleted(topic.id, question.id)}
                          className={question.is_completed ? "border-green-500 data-[state=checked]:bg-green-500" : ""}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{question.title}</TableCell>
                    {showPracticeColumn && (
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePracticeClick(question.practice_link);
                          }}
                          className="text-arena-red hover:text-white hover:bg-arena-red inline-flex items-center gap-1 border-arena-red/30"
                        >
                          <Code size={14} />
                          Practice
                        </Button>
                      </TableCell>
                    )}
                    <TableCell>
                      <Link 
                        to={`/articles/${question.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-arena-blue hover:text-white hover:bg-arena-blue inline-flex items-center gap-1 border-arena-blue/30"
                        >
                          <BookText size={14} />
                          Article
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getDifficultyClass(question.difficulty)} px-2.5 py-1`}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant={question.is_marked_for_revision ? "default" : "outline"} 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRevision(topic.id, question.id);
                        }}
                        className={`w-8 h-8 p-0 rounded-full ${
                          question.is_marked_for_revision 
                            ? "bg-yellow-400 hover:bg-yellow-500" 
                            : "hover:border-yellow-400 hover:text-yellow-500"
                        }`}
                      >
                        <Star size={14} className={question.is_marked_for_revision ? "text-white fill-white" : ""} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Empty state when filtered list is empty */}
                {expandedTopics[topic.id] && filterQuestions(topic.questions).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={showPracticeColumn ? 6 : 5} className="text-center py-6 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-gray-100 rounded-full p-3">
                          <Filter size={18} className="text-gray-400" />
                        </div>
                        <p>No questions match the current filter</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            
            {/* Empty state when no topics */}
            {topics.length === 0 && (
              <TableRow>
                <TableCell colSpan={showPracticeColumn ? 6 : 5} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 rounded-full p-4">
                      <FolderOpen size={24} className="text-gray-400" />
                    </div>
                    <p className="text-lg">No topics available in this learning path</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
