import { useState, useEffect, useRef } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertCircle, User, GraduationCap, MapPin, Link2, Lock } from 'lucide-react';

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
  hackerrank_url: string;
  gfg_url: string;
}

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function UserSettingsDialog({ open, onOpenChange, userId }: UserSettingsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userEmail, setUserEmail] = useState<string>('');
  
  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      real_name: '',
      cgpa: 0,
      bio: '',
      college_name: '',
      location: '',
      linkedin_url: '',
      github_url: '',
      leetcode_url: '',
      hackerrank_url: '',
      gfg_url: ''
    }
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  // Fetch existing profile data on open
  useEffect(() => {
    if (open && userId) {
      fetchProfileData();
      fetchUserEmail();
    }
  }, [open, userId]);

  // Fetch user email for password update
  const fetchUserEmail = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user email:', error);
        return;
      }

      if (data) {
        setUserEmail(data.email);
        console.log('Fetched user email:', data.email);
      }
    } catch (error) {
      console.error('Unexpected error fetching email:', error);
    }
  };

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
        profileForm.reset({
          real_name: data.real_name || '',
          cgpa: data.cgpa || 0,
          bio: data.bio || '',
          college_name: data.college_name || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          leetcode_url: data.leetcode_url || '',
          hackerrank_url: data.hackerrank_url || '',
          gfg_url: data.gfg_url || ''
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      // Prepare profile data
      const profileData = {
        id: userId,
        real_name: values.real_name,
        cgpa: values.cgpa,
        bio: values.bio,
        college_name: values.college_name,
        location: values.location,
        linkedin_url: values.linkedin_url,
        github_url: values.github_url,
        leetcode_url: values.leetcode_url,
        hackerrank_url: values.hackerrank_url,
        gfg_url: values.gfg_url,
        updated_at: new Date().toISOString()
      };
      
      // Insert or update profile
      let result;
      if (!existingProfile) {
        result = await supabase.from('profiles').insert([profileData]);
      } else {
        result = await supabase.from('profiles').update(profileData).eq('id', userId);
      }
      
      if (result.error) {
        console.error('Error updating profile:', result.error);
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

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      setIsLoading(true);
      
      // Validate that new password and confirm password match
      if (values.new_password !== values.confirm_password) {
        toast.error('New password and confirmation do not match');
        return;
      }

      if (!userEmail) {
        toast.error('Unable to update password: User email not found');
        return;
      }

      // First validate current password by attempting to sign in
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: values.current_password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        // For direct password update in users table when auth fails
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('password')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error checking user password:', userError);
          toast.error('Failed to verify current password');
          return;
        }
        
        if (userData.password !== values.current_password) {
          toast.error('Current password is incorrect');
          return;
        }
        
        // Update password in users table
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            password: values.new_password,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating password:', updateError);
          toast.error('Failed to update password');
          return;
        }
        
        toast.success('Password updated successfully');
        passwordForm.reset();
        setActiveTab("profile");
        return;
      }

      // If auth sign in worked, update password through auth API
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.new_password
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        toast.error('Failed to update password: ' + updateError.message);
        return;
      }
      
      // Also update in users table to keep in sync
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ 
          password: values.new_password,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (userUpdateError) {
        console.error('Error updating user password:', userUpdateError);
      }
      
      toast.success('Password updated successfully');
      passwordForm.reset();
      setActiveTab("profile");
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl text-center font-semibold text-arena-darkGray">
            User Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 size={16} />
              <span>Social Links</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-grow overflow-y-auto pr-4 h-[400px]">
            <TabsContent value="profile" className="space-y-4 animate-fade-in">
              <Form {...profileForm}>
                <form id="profile-settings-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 pr-2">
                  <div className="bg-arena-lightGray/50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User size={18} className="text-arena-red" />
                      Personal Information
                    </h3>
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="real_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself" 
                            className="border-gray-300 focus:border-arena-red min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-arena-lightGray/50 rounded-lg p-4 mb-4 mt-6">
                    <h3 className="font-medium flex items-center gap-2">
                      <GraduationCap size={18} className="text-arena-red" />
                      Education
                    </h3>
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="college_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">College Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your college" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="cgpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center gap-1">
                            CGPA
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertCircle size={14} className="text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[200px] text-xs">Enter your Cumulative Grade Point Average on a scale of 0-10.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Your CGPA" 
                              step="0.01" 
                              min="0" 
                              max="10" 
                              className="border-gray-300 focus:border-arena-red"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center gap-2">
                            <MapPin size={14} className="text-gray-500" />
                            Location
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="City, Country" 
                              className="border-gray-300 focus:border-arena-red"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="links" className="space-y-4 animate-fade-in">
              <Form {...profileForm}>
                <form id="links-settings-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 pr-2">
                  <div className="bg-arena-lightGray/50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Link2 size={18} className="text-arena-red" />
                      Social Media Links
                    </h3>
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                          </svg>
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://linkedin.com/in/your-profile" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://github.com/your-username" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="leetcode_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                          </svg>
                          LeetCode
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://leetcode.com/your-username" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="hackerrank_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M477.5 128C463 103.05 285.13 0 256.16 0S49.25 102.79 34.84 128s-14.49 230.8 0 256 192.38 128 221.32 128S463 409.08 477.49 384s14.51-231 .01-256zM316.13 414.22c-4 0-40.91-35.77-38-38.69.87-.87 6.26-1.48 17.55-1.83 0-26.23.59-68.59.94-86.32 0-2-.44-3.43-.44-5.85h-79.93c0 7.1-.46 36.2 1.37 72.88.23 4.54-1.58 6-5.74 5.94-10.13 0-20.27-.11-30.41-.08-4.1 0-5.87-1.53-5.74-6.11.92-33.44 3-84-.15-212.67v-3.17c-9.67-.35-16.38-1-17.26-1.84-2.92-2.92 34.54-38.69 38.49-38.69s41.17 35.78 38.27 38.69c-.87.87-7.9 1.49-16.77 1.84v3.16c-2.42 25.75-2 79.59-2.63 105.39h80.26c0-4.55.39-34.74-1.2-83.64-.1-3.39.95-5.17 4.21-5.2 11.07-.08 22.15-.13 33.23-.06 3.46 0 4.57 1.72 4.5 5.38C333 354.64 336 341.29 336 373.69c8.87.35 16.82 1 17.69 1.84 2.88 2.91-33.62 38.69-37.58 38.69z"/>
                          </svg>
                          HackerRank
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://hackerrank.com/your-username" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="gfg_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.45 14.315c-.143.28-.334.532-.566.745a3.299 3.299 0 0 1-1.12.697c-.579.232-1.213.353-1.856.353-1.024 0-2.024-.245-2.911-.723v2.486c.85.357 1.748.537 2.652.527 1.064 0 2.094-.234 3.039-.691a6.387 6.387 0 0 0 2.396-1.943 6.236 6.236 0 0 0 1.335-2.646 8.796 8.796 0 0 0 .274-3.003c-.094-.977-.344-1.929-.739-2.818-.348-.84-.847-1.605-1.468-2.262-.629-.679-1.36-1.252-2.162-1.694a9.5 9.5 0 0 0-2.558-1.053 11.99 11.99 0 0 0-2.723-.355 9.236 9.236 0 0 0-1.845.186 8.98 8.98 0 0 0-1.784.547 15.328 15.328 0 0 0-1.888 1.038l-.44.28c-.204.135-.411.266-.622.389a4.32 4.32 0 0 1-1.268.5c-.494.112-.998.17-1.503.174-.267 0-.537-.023-.8-.07-.267-.05-.525-.133-.774-.246a1.674 1.674 0 0 1-.643-.533 1.741 1.741 0 0 1-.306-.919 1.8 1.8 0 0 1 .997-1.798 2.384 2.384 0 0 1 1.391-.236c.254.027.505.085.746.17.228.085.447.193.654.322l2.194-3.84a6.08 6.08 0 0 0-1.726-.577 9.603 9.603 0 0 0-1.935-.164 7.086 7.086 0 0 0-2.333.371 5.307 5.307 0 0 0-1.862 1.093 5.01 5.01 0 0 0-1.23 1.734 5.589 5.589 0 0 0-.431 2.222c0 .775.132 1.543.39 2.271.24.637.605 1.219 1.068 1.712.502.514 1.103.922 1.767 1.201a6.235 6.235 0 0 0 2.396.435 8.86 8.86 0 0 0 2.973-.53c.283-.102.562-.22.834-.353l.464-.239c.153-.084.307-.17.464-.254a4.732 4.732 0 0 1 4.264-.258 1.91 1.91 0 0 1 .985 1.898 1.96 1.96 0 0 1-.937 1.863 3.08 3.08 0 0 1-1.36.39c-.441.034-.885.003-1.32-.093a3.487 3.487 0 0 1-1.159-.452l-2.211 3.777c.867.41 1.786.69 2.729.828.914.13 1.844.13 2.758 0 .89-.127 1.759-.403 2.57-.815a5.578 5.578 0 0 0 1.928-1.597c.52-.693.88-1.489 1.053-2.333.153-.732.163-1.484.029-2.22l-.025-.095z"/>
                          </svg>
                          GeeksforGeeks
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://auth.geeksforgeeks.org/user/your-username" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4 animate-fade-in">
              <Form {...passwordForm}>
                <form id="password-settings-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 pr-2">
                  <div className="bg-arena-lightGray/50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Lock size={18} className="text-arena-red" />
                      Password Update
                    </h3>
                  </div>
                  
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter current password" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter new password" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Confirm new password" 
                            className="border-gray-300 focus:border-arena-red"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>
          </ScrollArea>

          <div className="mt-6 border-t pt-4 px-1">
            <DialogFooter className="flex flex-row items-center justify-between w-full gap-2 flex-wrap sm:flex-nowrap">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gray-300 hover:bg-gray-100"
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                form={activeTab === "account" ? "password-settings-form" : activeTab === "links" ? "links-settings-form" : "profile-settings-form"}
                className="bg-arena-red hover:bg-arena-darkRed transition-colors"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </DialogFooter>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
