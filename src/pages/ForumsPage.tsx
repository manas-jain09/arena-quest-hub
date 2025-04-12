
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Forum {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export const ForumsPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const { data, error } = await supabase
          .from('forums')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setForums(data || []);
      } catch (error) {
        console.error('Error fetching forums:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forums. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-arena-red" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-arena-darkGray mb-8">ArenaForums</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <Link to={`/forums/${forum.id}`} key={forum.id}>
            <Card className="arena-card h-full hover:border-arena-red transition-colors duration-200 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl text-arena-darkGray">{forum.title}</CardTitle>
                <CardDescription>{forum.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <span className="text-sm text-arena-darkGray">
                    {new Date(forum.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ForumsPage;
