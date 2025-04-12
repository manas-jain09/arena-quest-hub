
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, LearningPathProgress, CompletedTopic, ActivityData } from '@/types/profile';

const Profile = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pathProgress, setPathProgress] = useState<LearningPathProgress[]>([]);
  const [completedTopics, setCompletedTopics] = useState<CompletedTopic[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract PRN and password from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prn = params.get('prn');
    const password = params.get('password');
    
    if (prn) {
      fetchUserProfile(prn);
      
      // If both PRN and password are provided, allow editing
      if (password) {
        validateUserCredentials(prn, password);
      }
    } else {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "PRN parameter is required",
        variant: "destructive",
      });
    }
  }, [location]);

  const validateUserCredentials = async (prn: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('prn', prn)
        .eq('password', password)
        .single();
      
      if (error || !data) {
        toast({
          title: "Authentication Error",
          description: "Invalid credentials provided",
          variant: "destructive",
        });
        return;
      }
      
      setIsEditMode(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to validate credentials: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fetchUserProfile = async (prn: string) => {
    setIsLoading(true);
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('prn', prn)
        .single();
      
      if (userError) throw userError;
      
      setProfile({
        id: userData.id,
        prn: userData.prn,
        username: userData.username,
        email: userData.email,
        // These fields might be null if not previously set
        name: userData.name || '',
        college: userData.college || '',
        location: userData.location || '',
        cgpa: userData.cgpa || 0,
        linkedin: userData.linkedin || '',
      });
      
      // Fetch learning paths and progress data
      await fetchLearningPathProgress(userData.id);
      
      // Fetch completed topics
      await fetchCompletedTopics(userData.id);
      
      // Fetch activity data for the streak heatmap
      await fetchActivityData(userData.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningPathProgress = async (userId: string) => {
    try {
      // Get all learning paths
      const { data: learningPaths, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*');
      
      if (pathsError) throw pathsError;
      
      // Process each learning path to calculate progress
      const progressData = await Promise.all(
        learningPaths.map(async (path) => {
          // Get topics for this learning path
          const { data: topics, error: topicsError } = await supabase
            .from('topics')
            .select('id')
            .eq('learning_path_id', path.id);
          
          if (topicsError) throw topicsError;
          
          let totalQuestions = 0;
          let completedQuestions = 0;
          
          // For each topic, get its questions and check completion status
          for (const topic of topics) {
            const { data: questions, error: questionsError } = await supabase
              .from('questions')
              .select('id')
              .eq('topic_id', topic.id);
            
            if (questionsError) throw questionsError;
            
            totalQuestions += questions.length;
            
            // Check how many questions are completed
            for (const question of questions) {
              const { data: progress, error: progressError } = await supabase
                .from('user_progress')
                .select('is_completed')
                .eq('user_id', userId)
                .eq('question_id', question.id)
                .single();
              
              if (!progressError && progress && progress.is_completed) {
                completedQuestions++;
              }
            }
          }
          
          const percentage = totalQuestions > 0 
            ? Math.round((completedQuestions / totalQuestions) * 100) 
            : 0;
          
          return {
            id: path.id,
            title: path.title,
            description: path.description,
            difficulty: path.difficulty,
            completedQuestions,
            totalQuestions,
            percentage
          };
        })
      );
      
      setPathProgress(progressData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load learning progress: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fetchCompletedTopics = async (userId: string) => {
    try {
      // Get all topics
      const { data: allTopics, error: topicsError } = await supabase
        .from('topics')
        .select('*, learning_paths(title)');
      
      if (topicsError) throw topicsError;
      
      const completed: CompletedTopic[] = [];
      
      // For each topic, check if all its questions are completed
      for (const topic of allTopics) {
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('id')
          .eq('topic_id', topic.id);
        
        if (questionsError) throw questionsError;
        
        if (questions.length === 0) continue;
        
        let allCompleted = true;
        
        // Check if all questions in this topic are completed
        for (const question of questions) {
          const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select('is_completed')
            .eq('user_id', userId)
            .eq('question_id', question.id)
            .single();
          
          if (progressError || !progress || !progress.is_completed) {
            allCompleted = false;
            break;
          }
        }
        
        if (allCompleted) {
          completed.push({
            id: topic.id,
            name: topic.name,
            learningPathId: topic.learning_path_id,
            learningPathTitle: topic.learning_paths.title
          });
        }
      }
      
      setCompletedTopics(completed);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load completed topics: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fetchActivityData = async (userId: string) => {
    try {
      // Get user progress with completion dates
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('updated_at, is_completed')
        .eq('user_id', userId)
        .eq('is_completed', true);
      
      if (progressError) throw progressError;
      
      // Group by date and count
      const activityByDate = progress.reduce((acc: Record<string, number>, item) => {
        const date = new Date(item.updated_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      // Convert to array format for the heatmap
      const activityArray = Object.entries(activityByDate).map(([date, count]) => ({
        date,
        count
      }));
      
      setActivityData(activityArray.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load activity data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: name === 'cgpa' ? parseFloat(value) || 0 : value
    });
  };

  const saveProfile = async () => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          college: profile.college,
          location: profile.location,
          cgpa: profile.cgpa,
          linkedin: profile.linkedin
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arena-red"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">User profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-arena-darkGray">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-500">Username</p>
                <p className="text-lg">{profile.username}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-500">PRN</p>
                <p className="text-lg">{profile.prn}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-500">Email</p>
                <p className="text-lg">{profile.email}</p>
              </div>
              
              {isEditMode ? (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-500">Full Name</label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profile.name || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-500">College</label>
                    <Input 
                      id="college" 
                      name="college" 
                      value={profile.college || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-500">Location</label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={profile.location || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cgpa" className="block text-sm font-medium text-gray-500">CGPA</label>
                    <Input 
                      id="cgpa" 
                      name="cgpa" 
                      type="number" 
                      min="0" 
                      max="10" 
                      step="0.1" 
                      value={profile.cgpa || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-500">LinkedIn Profile</label>
                    <Input 
                      id="linkedin" 
                      name="linkedin" 
                      value={profile.linkedin || ''} 
                      onChange={handleInputChange} 
                      className="mt-1"
                    />
                  </div>
                  
                  <Button onClick={saveProfile} className="w-full mt-4 bg-arena-red hover:bg-red-700">
                    Save Profile
                  </Button>
                </>
              ) : (
                <>
                  {profile.name && (
                    <div>
                      <p className="font-medium text-gray-500">Full Name</p>
                      <p className="text-lg">{profile.name}</p>
                    </div>
                  )}
                  
                  {profile.college && (
                    <div>
                      <p className="font-medium text-gray-500">College</p>
                      <p className="text-lg">{profile.college}</p>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div>
                      <p className="font-medium text-gray-500">Location</p>
                      <p className="text-lg">{profile.location}</p>
                    </div>
                  )}
                  
                  {profile.cgpa !== undefined && profile.cgpa > 0 && (
                    <div>
                      <p className="font-medium text-gray-500">CGPA</p>
                      <p className="text-lg">{profile.cgpa}</p>
                    </div>
                  )}
                  
                  {profile.linkedin && (
                    <div>
                      <p className="font-medium text-gray-500">LinkedIn</p>
                      <a 
                        href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.linkedin}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Learning Path Progress Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-arena-darkGray">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pathProgress.length > 0 ? (
                pathProgress.map(path => (
                  <div key={path.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-medium">{path.title}</h3>
                        <p className="text-sm text-gray-500">{path.completedQuestions} of {path.totalQuestions} questions completed</p>
                      </div>
                      <span className="text-lg font-bold">{path.percentage}%</span>
                    </div>
                    <Progress value={path.percentage} className="h-3" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No learning paths found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Heatmap */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-arena-darkGray">Activity Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="activity-heatmap">
            {activityData.length > 0 ? (
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 365 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (364 - index));
                  const dateString = date.toISOString().split('T')[0];
                  const activity = activityData.find(a => a.date === dateString);
                  const intensity = activity ? Math.min(activity.count, 4) : 0;
                  
                  return (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-sm heat-${intensity}`}
                      title={activity ? `${dateString}: ${activity.count} activities` : dateString}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">No activity data available</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Completed Topics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-arena-darkGray">Topics Mastered</CardTitle>
        </CardHeader>
        <CardContent>
          {completedTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTopics.map(topic => (
                <div key={topic.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-sm text-gray-500">{topic.learningPathTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No topics fully completed yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
