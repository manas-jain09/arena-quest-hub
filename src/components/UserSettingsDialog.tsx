import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

interface UserSettingsDialogProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export const UserSettingsDialog = ({ user, onUserUpdate }: UserSettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    realName: '',
    cgpa: '',
    bio: '',
    collegeName: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    leetcodeUrl: '',
    hackerrankUrl: '',
    gfgUrl: '',
    department: user.department || '',
    course: user.course || '',
    gradYear: user.grad_year ? String(user.grad_year) : '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        if (profileData) {
          setFormData(prev => ({
            ...prev,
            realName: profileData.real_name || '',
            cgpa: profileData.cgpa || '',
            bio: profileData.bio || '',
            collegeName: profileData.college_name || '',
            location: profileData.location || '',
            linkedinUrl: profileData.linkedin_url || '',
            githubUrl: profileData.github_url || '',
            leetcodeUrl: profileData.leetcode_url || '',
            hackerrankUrl: profileData.hackerrank_url || '',
            gfgUrl: profileData.gfg_url || '',
          }));
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchProfileData();
  }, [user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert cgpa to string for database storage
      const cgpaString = String(formData.cgpa);
      
      const profileData = {
        id: user.id,
        real_name: formData.realName,
        cgpa: cgpaString,
        bio: formData.bio,
        college_name: formData.collegeName,
        location: formData.location,
        linkedin_url: formData.linkedinUrl,
        github_url: formData.githubUrl,
        leetcode_url: formData.leetcodeUrl,
        hackerrank_url: formData.hackerrankUrl,
        gfg_url: formData.gfgUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      // Update main user data
      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .update({
          username: formData.username,
          email: formData.email,
          department: formData.department,
          course: formData.course,
          grad_year: Number(formData.gradYear),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (userError) {
        console.error('Error updating user:', userError);
        toast({
          title: "Error",
          description: "Failed to update user information",
          variant: "destructive",
        });
        return;
      }

      onUserUpdate(updatedUser as User);
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="realName" className="text-right">
              Real Name
            </Label>
            <Input
              type="text"
              id="realName"
              name="realName"
              value={formData.realName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cgpa" className="text-right">
              CGPA
            </Label>
            <Input
              type="text"
              id="cgpa"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collegeName" className="text-right">
              College Name
            </Label>
            <Input
              type="text"
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedinUrl" className="text-right">
              LinkedIn URL
            </Label>
            <Input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="githubUrl" className="text-right">
              GitHub URL
            </Label>
            <Input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leetcodeUrl" className="text-right">
              LeetCode URL
            </Label>
            <Input
              type="url"
              id="leetcodeUrl"
              name="leetcodeUrl"
              value={formData.leetcodeUrl}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hackerrankUrl" className="text-right">
              HackerRank URL
            </Label>
            <Input
              type="url"
              id="hackerrankUrl"
              name="hackerrankUrl"
              value={formData.hackerrankUrl}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gfgUrl" className="text-right">
              GFG URL
            </Label>
            <Input
              type="url"
              id="gfgUrl"
              name="gfgUrl"
              value={formData.gfgUrl}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course
            </Label>
            <Input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gradYear" className="text-right">
              Graduation Year
            </Label>
            <Input
              type="number"
              id="gradYear"
              name="gradYear"
              value={formData.gradYear}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
