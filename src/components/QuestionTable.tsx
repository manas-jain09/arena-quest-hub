import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question, Topic } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuestionTableProps {
  topics: Topic[];
  userId: string;
}

export const QuestionTable = ({ topics, userId }: QuestionTableProps) => {
  const [userProgress, setUserProgress] = useState<{ [questionId: string]: { is_completed: boolean; is_marked_for_revision: boolean } }>({});
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching user progress:', error);
          toast({
            title: "Error",
            description: "Failed to fetch user progress",
            variant: "destructive",
          });
          return;
        }

        // Transform the data into a more usable format
        const progressMap: { [questionId: string]: { is_completed: boolean; is_marked_for_revision: boolean } } = {};
        data.forEach(item => {
          progressMap[item.question_id] = {
            is_completed: item.is_completed,
            is_marked_for_revision: item.is_marked_for_revision,
          };
        });
        setUserProgress(progressMap);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    fetchUserProgress();
  }, [userId]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopicId(prevId => (prevId === topicId ? null : topicId));
  };

  const isTopicExpanded = (topicId: string) => expandedTopicId === topicId;

  const handleStatusChange = async (questionId: string, isCompleted: boolean, isMarkedForRevision: boolean) => {
    try {
      // Generate unique ID for the progress record
      const progressId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('user_progress')
        .insert({
          id: progressId,
          user_id: userId,
          question_id: questionId,
          is_completed: isCompleted,
          is_marked_for_revision: isMarkedForRevision,
        });

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
      } else {
        // Update local state
        setUserProgress(prev => ({
          ...prev,
          [questionId]: { is_completed: isCompleted, is_marked_for_revision: isMarkedForRevision }
        }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRevisionChange = async (questionId: string, isMarkedForRevision: boolean) => {
    const currentProgress = userProgress[questionId];
    const isCompleted = currentProgress?.is_completed || false;

    try {
      // Generate unique ID for the progress record
      const progressId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('user_progress')
        .insert({
          id: progressId,
          user_id: userId,
          question_id: questionId,
          is_completed: isCompleted,
          is_marked_for_revision: isMarkedForRevision,
        });

      if (error) {
        console.error('Error updating revision status:', error);
        toast({
          title: "Error",
          description: "Failed to update revision status",
          variant: "destructive",
        });
      } else {
        // Update local state
        setUserProgress(prev => ({
          ...prev,
          [questionId]: { is_completed: isCompleted, is_marked_for_revision: isMarkedForRevision }
        }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Questions by Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <React.Fragment key={topic.id}>
                <TableRow
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell colSpan={3}>
                    <Button variant="ghost" size="sm">
                      {isTopicExpanded(topic.id) ? 'Hide Questions' : 'Show Questions'}
                    </Button>
                  </TableCell>
                </TableRow>
                {isTopicExpanded(topic.id) &&
                  topic.questions?.map((question) => {
                    const progress = userProgress[question.id] || { is_completed: false, is_marked_for_revision: false };
                    return (
                      <TableRow key={question.id}>
                        <TableCell></TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={progress.is_completed}
                            onCheckedChange={(checked) => {
                              handleStatusChange(question.id, !!checked, progress.is_marked_for_revision);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={progress.is_marked_for_revision}
                            onCheckedChange={(checked) => {
                              handleRevisionChange(question.id, !!checked);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
