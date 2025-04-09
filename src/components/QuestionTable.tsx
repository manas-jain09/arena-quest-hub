
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, Link, Star, Filter, X } from 'lucide-react';

export interface Question {
  id: string;
  title: string;
  practiceLink: string;
  solutionLink: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  isMarkedForRevision: boolean;
}

interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

interface QuestionTableProps {
  topics: Topic[];
  learningPathTitle: string;
}

export const QuestionTable = ({ topics, learningPathTitle }: QuestionTableProps) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'solved' | 'unsolved' | 'revision'>('all');
  const [showFilter, setShowFilter] = useState(false);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const toggleCompleted = (topicId: string, questionId: string) => {
    // In a real app, this would update the state and persist to a database
    console.log(`Toggle completed for question ${questionId} in topic ${topicId}`);
  };

  const toggleRevision = (topicId: string, questionId: string) => {
    // In a real app, this would update the state and persist to a database
    console.log(`Toggle revision for question ${questionId} in topic ${topicId}`);
  };

  const filterQuestions = (questions: Question[]) => {
    switch (filterStatus) {
      case 'solved':
        return questions.filter(q => q.isCompleted);
      case 'unsolved':
        return questions.filter(q => !q.isCompleted);
      case 'revision':
        return questions.filter(q => q.isMarkedForRevision);
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
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-arena-lightGray border-b border-arena-gray flex justify-between items-center">
        <h2 className="text-xl font-semibold text-arena-darkGray">{learningPathTitle}</h2>
        <div className="flex items-center space-x-2">
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
              <th className="arena-table-header">Question Title</th>
              <th className="arena-table-header">Practice</th>
              <th className="arena-table-header">Solution</th>
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
                  <tr key={question.id} className="border-b border-arena-gray hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <Checkbox 
                        checked={question.isCompleted} 
                        onCheckedChange={() => toggleCompleted(topic.id, question.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{question.title}</td>
                    <td className="px-4 py-3">
                      <a 
                        href={question.practiceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-arena-red hover:underline inline-flex items-center gap-1"
                      >
                        <Link size={14} />
                        Practice
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a 
                        href={question.solutionLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-arena-red hover:underline inline-flex items-center gap-1"
                      >
                        <Link size={14} />
                        Solution
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getDifficultyClass(question.difficulty)}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button 
                        variant={question.isMarkedForRevision ? "default" : "outline"} 
                        size="sm"
                        onClick={() => toggleRevision(topic.id, question.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Star size={14} className={question.isMarkedForRevision ? "text-yellow-400 fill-yellow-400" : ""} />
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
