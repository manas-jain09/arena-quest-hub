
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface ForumContent {
  id: string;
  forum_id: string;
  youtube_video_url: string;
  content_html: string;
}

interface Forum {
  id: string;
  title: string;
  description: string;
}

export const ForumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [forum, setForum] = useState<Forum | null>(null);
  const [content, setContent] = useState<ForumContent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchForumDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch forum details
        const { data: forumData, error: forumError } = await supabase
          .from('forums')
          .select('*')
          .eq('id', id)
          .single();

        if (forumError) throw forumError;
        
        // Fetch forum content
        const { data: contentData, error: contentError } = await supabase
          .from('forum_content')
          .select('*')
          .eq('forum_id', id)
          .single();

        if (contentError) throw contentError;

        setForum(forumData);
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching forum details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forum. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForumDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-arena-red" />
      </div>
    );
  }

  if (!forum || !content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-arena-darkGray mb-4">Forum not found</h2>
          <Button onClick={() => navigate('/forums')} variant="outline" className="arena-btn-outline">
            Back to Forums
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        onClick={() => navigate('/forums')} 
        variant="ghost"
        className="mb-6 p-0 hover:bg-transparent"
      >
        <ArrowLeft className="h-5 w-5 mr-2 text-arena-red" />
        <span className="text-arena-red">Back to Forums</span>
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-arena-darkGray mb-2">{forum.title}</h1>
        <p className="text-arena-darkGray mb-6">{forum.description}</p>
        
        <Separator className="mb-8" />
        
        <div className="mb-8 aspect-video">
          <iframe
            src={content.youtube_video_url}
            title={forum.title}
            className="w-full h-full rounded-lg shadow-md"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content_html }}></div>
      </div>
    </div>
  );
};

export default ForumDetailPage;
