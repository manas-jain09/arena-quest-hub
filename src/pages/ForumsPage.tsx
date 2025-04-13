
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Forum {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const ForumsPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleForumClick = (forumId: string) => {
    navigate(`/forums/${forumId}`);
  };

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

  // The difficulty levels are just for styling purposes since forums don't have difficulty
  const getDifficulty = (index: number) => {
    const levels = ["easy", "medium", "hard"];
    return levels[index % 3] as "easy" | "medium" | "hard";
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-arena-darkGray mb-8">ArenaForums</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forums.map((forum, index) => {
            const difficulty = getDifficulty(index);
            const difficultyMap = {
              easy: { color: "arena-badge-easy", text: "Basic" },
              medium: { color: "arena-badge-medium", text: "Intermediate" },
              hard: { color: "arena-badge-hard", text: "Advanced" }
            };
            
            return (
              <Card 
                key={forum.id}
                className="arena-card cursor-pointer" 
                onClick={() => handleForumClick(forum.id)}
              >
                <CardHeader className={difficulty === "easy" 
                  ? "bg-green-50 border-b" 
                  : difficulty === "medium" 
                    ? "bg-yellow-50 border-b" 
                    : "bg-red-50 border-b"}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{forum.title}</CardTitle>
                    <Badge className={difficultyMap[difficulty].color}>
                      {difficultyMap[difficulty].text}
                    </Badge>
                  </div>
                  <CardDescription>{forum.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between text-sm text-arena-darkGray">
                    <div>Topic: <span className="font-medium">{forum.title.split(' ')[0]}</span></div>
                    <div>Created: <span className="font-medium">{new Date(forum.created_at).toLocaleDateString()}</span></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForumsPage;
