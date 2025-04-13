
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Forum {
  id: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
}

const ForumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [forum, setForum] = useState<Forum | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForumDetail = async () => {
      try {
        const { data, error } = await supabase
          .from('forums')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setForum(data);
      } catch (error) {
        console.error('Error fetching forum details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forum details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForumDetail();
    }
  }, [id, toast]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <Navbar onLogout={handleLogout} />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-arena-red" />
        </div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div>
        <Navbar onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-arena-darkGray">Forum not found</h2>
            <button 
              onClick={() => navigate('/forums')}
              className="mt-4 bg-arena-red hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Back to Forums
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/forums')}
          className="flex items-center text-arena-darkGray hover:text-arena-red mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Forums
        </button>
        
        <Card className="arena-card mb-6">
          <CardHeader className="bg-blue-50 border-b">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{forum.title}</CardTitle>
              <Badge>Discussion</Badge>
            </div>
            <CardDescription>{forum.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              {forum.content ? (
                <div dangerouslySetInnerHTML={{ __html: forum.content }} />
              ) : (
                <p className="text-arena-darkGray">No content available for this forum topic.</p>
              )}
            </div>
            <div className="mt-6 text-sm text-arena-darkGray border-t pt-4">
              <div>Posted on: <span className="font-medium">{new Date(forum.created_at).toLocaleDateString()}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumDetailPage;
