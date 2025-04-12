
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCircle2 } from 'lucide-react';

interface UserProfile {
  name?: string;
  college?: string;
  location?: string;
  cgpa?: number;
  linkedin?: string;
}

const YodhaProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({});
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
      const { prn } = getCredentialsFromURL();
      
      if (!prn) {
        toast({
          title: 'Error',
          description: 'PRN is required to view profile',
          variant: 'destructive'
        });
        return;
      }

      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('prn', prn)
          .single();

        if (userError) throw userError;

        const profileData: UserProfile = {
          name: userData.name,
          college: userData.college,
          location: userData.location,
          cgpa: userData.cgpa,
          linkedin: userData.linkedin
        };

        setProfile(profileData);
        
        // Fetch learning paths progress
        const { data: pathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select('*');

        if (pathsError) throw pathsError;

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

          const totalTopics = topicIds.length;
          const completedTopics = progress?.length || 0;
          const completionPercentage = (completedTopics / totalTopics) * 100;

          return {
            ...path,
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
      }
    };

    fetchUserProfile();
  }, []);

  const renderProfile = () => {
    const { prn, password } = getCredentialsFromURL();
    const canEdit = prn && password;

    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-arena-darkGray flex items-center gap-2">
            <UserCircle2 size={32} /> Yodha Profile
          </h1>
          {canEdit && (
            <Button 
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(!isEditing);
              }}
              variant="outline"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="grid md:grid-cols-2 gap-4">
            <Input 
              placeholder="Name" 
              value={editedProfile.name || ''} 
              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
            />
            <Input 
              placeholder="College" 
              value={editedProfile.college || ''} 
              onChange={(e) => setEditedProfile({...editedProfile, college: e.target.value})}
            />
            <Input 
              placeholder="Location" 
              value={editedProfile.location || ''} 
              onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
            />
            <Input 
              placeholder="CGPA" 
              type="number" 
              value={editedProfile.cgpa || ''} 
              onChange={(e) => setEditedProfile({...editedProfile, cgpa: Number(e.target.value)})}
            />
            <Input 
              placeholder="LinkedIn Profile URL" 
              value={editedProfile.linkedin || ''} 
              onChange={(e) => setEditedProfile({...editedProfile, linkedin: e.target.value})}
            />
            <Button onClick={() => {/* Save logic */}}>Save Profile</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile.name || 'Not provided'}</p>
                <p><strong>College:</strong> {profile.college || 'Not provided'}</p>
                <p><strong>Location:</strong> {profile.location || 'Not provided'}</p>
                <p><strong>CGPA:</strong> {profile.cgpa || 'Not provided'}</p>
                <p><strong>LinkedIn:</strong> {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-arena-red hover:underline">View Profile</a> : 'Not provided'}</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Learning Path Progress</h2>
              {learningPaths.map((path) => (
                <div key={path.id} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{path.title}</span>
                    <span>{Math.round(path.progress || 0)}%</span>
                  </div>
                  <Progress value={path.progress || 0} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return renderProfile();
};

export default YodhaProfile;
