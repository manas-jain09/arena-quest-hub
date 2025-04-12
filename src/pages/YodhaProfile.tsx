
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserCircle2, MapPin, School, Calendar, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface UserProfile {
  name?: string;
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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to extract PRN from URL
  const getPRNFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('prn');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const prn = getPRNFromURL();
      
      if (!prn) {
        toast({
          title: 'Error',
          description: 'PRN is required to view profile',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('prn', prn)
          .single();

        if (userError) throw userError;

        const profileData: UserProfile = {
          name: userData.name
        };

        setProfile(profileData);
        
        // Generate mock data for topics
        const mockTopics: Topic[] = [
          { id: '1', name: 'Arrays', completed: true },
          { id: '2', name: 'Strings', completed: true },
          { id: '3', name: 'Dynamic Programming', completed: false },
          { id: '4', name: 'Graphs', completed: false },
          { id: '5', name: 'Trees', completed: true },
        ];
        setTopics(mockTopics);

        // Generate activity data for the last 6 months only
        const today = new Date();
        const activityDays: ActivityDay[] = [];
        for (let i = 180; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          activityDays.push({
            date: dateStr,
            count: Math.floor(Math.random() * 5) // Random activity count (0-4)
          });
        }
        setActivityData(activityDays);

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

  const renderHeatmap = () => {
    // Group activity by month for the last 6 months
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
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              {Object.keys(months).map(month => (
                <div key={month} className="text-xs text-muted-foreground">
                  {new Date(month + '-01').toLocaleDateString(undefined, { month: 'short' })}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {Object.entries(months).map(([monthYear, days]) => (
                <div key={monthYear} className="flex flex-col gap-1">
                  <div className="grid grid-cols-4 gap-1">
                    {days.map((day) => {
                      // Calculate the week and day of week
                      const date = new Date(day.date);
                      const dayOfWeek = date.getDay();
                      
                      return (
                        <div
                          key={day.date}
                          className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all"
                          style={{
                            backgroundColor: 
                              day.count === 0 ? '#ebedf0' :
                              day.count === 1 ? '#9be9a8' :
                              day.count === 2 ? '#40c463' :
                              day.count === 3 ? '#30a14e' : '#216e39',
                            gridColumn: Math.floor(days.indexOf(day) / 7) + 1,
                            gridRow: (dayOfWeek + 1)
                          }}
                          title={`${day.date}: ${day.count} activities`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#ebedf0]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#9be9a8]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#40c463]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#30a14e]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#216e39]"></div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
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
        {/* Left Panel - User Information (only name) */}
        <div className="md:col-span-1">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-6 w-6 text-arena-red" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium flex items-center gap-1 text-lg">
                    <UserCircle2 size={20} className="text-arena-red" />
                    {profile.name || 'Not provided'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel - Activity */}
        <div className="md:col-span-2">
          <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-arena-red">Activity & Progress</CardTitle>
            </CardHeader>
            <CardContent>
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
      <Navbar onLogout={() => window.close()} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-arena-darkGray mb-6 flex items-center gap-2">
          <UserCircle2 size={32} className="text-arena-red" /> Yodha Profile
        </h1>
        {renderProfileContent()}
      </div>
    </div>
  );
};

export default YodhaProfile;
