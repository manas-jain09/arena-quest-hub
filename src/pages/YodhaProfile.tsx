
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserCircle2, MapPin, School, Award, Calendar, ExternalLink, Pencil, Save, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface UserProfile {
  name?: string;
  college?: string;
  location?: string;
  cgpa?: number;
  linkedin?: string;
}

interface LearningPath {
  id: string;
  title: string;
  progress: number;
}

interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

interface ActivityDay {
  date: string;
  count: number;
}

const YodhaProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { toast } = useToast();

  // Function to extract PRN and password from URL
  const getCredentialsFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      prn: urlParams.get('prn'),
      password: urlParams.get('password')
    };
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { prn, password } = getCredentialsFromURL();
      
      if (!prn) {
        toast({
          title: 'Error',
          description: 'PRN is required to view profile',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Check if user can edit (both prn and password are provided)
      setCanEdit(Boolean(prn && password));

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('prn', prn)
          .single();

        if (userError) throw userError;

        // Verify password if in edit mode
        if (password && userData.password !== password) {
          setCanEdit(false);
          toast({
            title: 'Error',
            description: 'Invalid credentials',
            variant: 'destructive'
          });
        }

        const profileData: UserProfile = {
          name: userData.name,
          college: userData.college,
          location: userData.location,
          cgpa: userData.cgpa,
          linkedin: userData.linkedin
        };

        setProfile(profileData);
        setEditedProfile(profileData);
        
        // Fetch learning paths progress
        const { data: pathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select('*');

        if (pathsError) throw pathsError;

        // Generate mock data for topics
        const mockTopics: Topic[] = [
          { id: '1', name: 'Arrays', completed: true },
          { id: '2', name: 'Strings', completed: true },
          { id: '3', name: 'Dynamic Programming', completed: false },
          { id: '4', name: 'Graphs', completed: false },
          { id: '5', name: 'Trees', completed: true },
        ];
        setTopics(mockTopics);

        // Generate last 52 weeks of activity data (mock data)
        const today = new Date();
        const activityDays: ActivityDay[] = [];
        for (let i = 364; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          activityDays.push({
            date: dateStr,
            count: Math.floor(Math.random() * 5) // Random activity count (0-4)
          });
        }
        setActivityData(activityDays);

        const progressPromises = pathsData.map(async (path) => {
          const { data: topics } = await supabase
            .from('topics')
            .select('id')
            .eq('learning_path_id', path.id);

          const topicIds = topics?.map(t => t.id) || [];

          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userData.id)
            .in('question_id', topicIds);

          const totalTopics = topicIds.length || 1; // Avoid division by zero
          const completedTopics = progress?.length || 0;
          const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

          return {
            id: path.id,
            title: path.title,
            progress: completionPercentage
          };
        });

        const pathsWithProgress = await Promise.all(progressPromises);
        setLearningPaths(pathsWithProgress);

      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to load profile: ${error.message}`,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const { prn } = getCredentialsFromURL();
      
      if (!prn) {
        toast({
          title: 'Error',
          description: 'PRN is required to update profile',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: editedProfile.name,
          college: editedProfile.college,
          location: editedProfile.location,
          cgpa: editedProfile.cgpa,
          linkedin: editedProfile.linkedin
        })
        .eq('prn', prn);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    // This is a placeholder function as we don't have actual auth
    window.close();
  };

  const renderHeatmap = () => {
    // Group activity by month for the last 52 weeks
    const months: Record<string, ActivityDay[]> = {};
    
    activityData.forEach(day => {
      const monthYear = day.date.substring(0, 7); // YYYY-MM format
      if (!months[monthYear]) {
        months[monthYear] = [];
      }
      months[monthYear].push(day);
    });

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Calendar size={18} />
          Activity Heatmap
        </h3>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1" style={{ minWidth: '750px' }}>
            {Object.entries(months).map(([monthYear, days], monthIndex) => (
              <div key={monthYear} className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-1 px-1">
                  {new Date(monthYear + '-01').toLocaleDateString(undefined, { month: 'short' })}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {days.map((day, i) => (
                    <div
                      key={day.date}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: day.count === 0 
                          ? '#ebedf0' 
                          : day.count === 1 
                            ? '#c6e48b' 
                            : day.count === 2 
                              ? '#7bc96f' 
                              : day.count === 3 
                                ? '#239a3b' 
                                : '#196127'
                      }}
                      title={`${day.date}: ${day.count} activities`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTopics = () => {
    const completedTopics = topics.filter(topic => topic.completed);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <CheckCircle size={18} />
          Completed Topics ({completedTopics.length}/{topics.length})
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {topics.map(topic => (
            <div 
              key={topic.id}
              className={`px-3 py-1 text-sm rounded-full ${
                topic.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {topic.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCircularProgress = (progress: number, title: string, size = 100) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <circle
              stroke="#e6e6e6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              stroke="#8b5cf6"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#333"
              fontSize="16px"
              fontWeight="bold"
            >
              {progress}%
            </text>
          </svg>
        </div>
        <span className="mt-2 text-sm text-center font-medium">{title}</span>
      </div>
    );
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-arena-red rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading profile...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Panel - User Information */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-6 w-6" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input 
                      value={editedProfile.name || ''} 
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">College</label>
                    <Input 
                      value={editedProfile.college || ''} 
                      onChange={(e) => setEditedProfile({...editedProfile, college: e.target.value})}
                      placeholder="Enter your college"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input 
                      value={editedProfile.location || ''} 
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">CGPA</label>
                    <Input 
                      type="number"
                      value={editedProfile.cgpa || ''} 
                      onChange={(e) => setEditedProfile({...editedProfile, cgpa: parseFloat(e.target.value)})}
                      placeholder="Enter your CGPA"
                      step="0.01"
                      min="0"
                      max="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                    <Input 
                      value={editedProfile.linkedin || ''} 
                      onChange={(e) => setEditedProfile({...editedProfile, linkedin: e.target.value})}
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button onClick={handleSaveProfile} className="flex items-center gap-1">
                      <Save size={16} />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="font-medium flex items-center gap-1">
                      <UserCircle2 size={16} className="text-muted-foreground" />
                      {profile.name || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">College</span>
                    <span className="font-medium flex items-center gap-1">
                      <School size={16} className="text-muted-foreground" />
                      {profile.college || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium flex items-center gap-1">
                      <MapPin size={16} className="text-muted-foreground" />
                      {profile.location || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">CGPA</span>
                    <span className="font-medium flex items-center gap-1">
                      <Award size={16} className="text-muted-foreground" />
                      {profile.cgpa || 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">LinkedIn</span>
                    <span className="font-medium">
                      {profile.linkedin ? (
                        <a 
                          href={profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-arena-red hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={16} />
                          View Profile
                        </a>
                      ) : 'Not provided'}
                    </span>
                  </div>
                  
                  {canEdit && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-4 flex items-center justify-center gap-1"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel - Progress and Activity */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Circular Progress Indicators */}
              <div className="flex flex-wrap justify-center gap-8 mb-6">
                {learningPaths.length > 0 ? (
                  learningPaths.map(path => (
                    <div key={path.id}>
                      {renderCircularProgress(path.progress, path.title)}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No learning paths found</p>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Activity Heatmap */}
              {renderHeatmap()}
              
              <Separator className="my-6" />
              
              {/* Topics Completed */}
              {renderTopics()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-arena-darkGray mb-6 flex items-center gap-2">
          <UserCircle2 size={32} /> Yodha Profile
        </h1>
        {renderProfileContent()}
      </div>
    </div>
  );
};

export default YodhaProfile;
