
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

interface ProfileFormValues {
  real_name: string;
  cgpa: number;
  bio: string;
  college_name: string;
  location: string;
  linkedin_url: string;
  github_url: string;
  leetcode_url: string;
}

export function UserSettingsDialog({ open, onOpenChange, userId }: UserSettingsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      real_name: '',
      cgpa: 0,
      bio: '',
      college_name: '',
      location: '',
      linkedin_url: '',
      github_url: '',
      leetcode_url: ''
    }
  });

  // Fetch existing profile data on open
  useEffect(() => {
    if (open && userId) {
      fetchProfileData();
    }
  }, [open, userId]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Reset form with existing data
        form.reset({
          real_name: data.real_name || '',
          cgpa: data.cgpa || 0,
          bio: data.bio || '',
          college_name: data.college_name || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          leetcode_url: data.leetcode_url || ''
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          real_name: values.real_name,
          cgpa: values.cgpa,
          bio: values.bio,
          college_name: values.college_name,
          location: values.location,
          linkedin_url: values.linkedin_url,
          github_url: values.github_url,
          leetcode_url: values.leetcode_url,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return;
      }
      
      toast.success('Profile updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="real_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cgpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CGPA</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your CGPA" 
                      step="0.01" 
                      min="0" 
                      max="10" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="college_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your college" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Your location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/your-username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leetcode_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeetCode URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://leetcode.com/your-username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
