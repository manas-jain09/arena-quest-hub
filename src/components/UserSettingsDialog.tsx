
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

interface UserProfile {
  id: string;
  real_name: string;
  cgpa: string;
  bio: string;
  college_name: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  leetcode_url: string;
  hackerrank_url: string;
  gfg_url: string;
}

export const UserSettingsDialog = ({ open, onOpenChange, userId }: UserSettingsDialogProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: userId,
    real_name: '',
    cgpa: '',
    bio: '',
    college_name: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    leetcode_url: '',
    hackerrank_url: '',
    gfg_url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      fetchProfile();
    }
  }, [open, userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id || userId,
          real_name: data.real_name || '',
          cgpa: data.cgpa || '',
          bio: data.bio || '',
          college_name: data.college_name || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          leetcode_url: data.leetcode_url || '',
          hackerrank_url: data.hackerrank_url || '',
          gfg_url: data.gfg_url || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const profileData = {
        id: userId,
        real_name: profile.real_name,
        cgpa: profile.cgpa,
        bio: profile.bio,
        college_name: profile.college_name,
        location: profile.location,
        linkedin_url: profile.linkedin_url,
        github_url: profile.github_url,
        leetcode_url: profile.leetcode_url,
        hackerrank_url: profile.hackerrank_url,
        gfg_url: profile.gfg_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error", 
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>User Settings</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="real_name">Full Name</Label>
                  <Input
                    id="real_name"
                    value={profile.real_name}
                    onChange={(e) => handleInputChange('real_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    value={profile.cgpa}
                    onChange={(e) => handleInputChange('cgpa', e.target.value)}
                    placeholder="Enter your CGPA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college_name">College Name</Label>
                  <Input
                    id="college_name"
                    value={profile.college_name}
                    onChange={(e) => handleInputChange('college_name', e.target.value)}
                    placeholder="Enter your college name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={profile.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={profile.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leetcode_url">LeetCode URL</Label>
                    <Input
                      id="leetcode_url"
                      value={profile.leetcode_url}
                      onChange={(e) => handleInputChange('leetcode_url', e.target.value)}
                      placeholder="https://leetcode.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hackerrank_url">HackerRank URL</Label>
                    <Input
                      id="hackerrank_url"
                      value={profile.hackerrank_url}
                      onChange={(e) => handleInputChange('hackerrank_url', e.target.value)}
                      placeholder="https://hackerrank.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gfg_url">GeeksforGeeks URL</Label>
                    <Input
                      id="gfg_url"
                      value={profile.gfg_url}
                      onChange={(e) => handleInputChange('gfg_url', e.target.value)}
                      placeholder="https://auth.geeksforgeeks.org/user/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-3 p-6 border-t bg-background flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
