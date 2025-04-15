
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ArticleData {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  question?: {
    title: string;
    difficulty: string;
  };
}

export function ArticleView() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        
        // Fetch article with question details
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            question:question_id (
              title, 
              difficulty
            )
          `)
          .eq('question_id', questionId)
          .single();
        
        if (error) {
          console.error('Error fetching article:', error);
          toast.error('Failed to load article');
          return;
        }
        
        setArticle(data);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (questionId) {
      fetchArticle();
    }
  }, [questionId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getDifficultyClass = (difficulty?: string) => {
    if (!difficulty) return '';
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-arena-lightRed text-arena-darkRed';
      case 'theory':
        return 'bg-blue-100 text-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={handleGoBack} 
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arena-red"></div>
        </div>
      ) : article ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              {article.question?.difficulty && (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyClass(article.question.difficulty)}`}>
                  {article.question.difficulty}
                </span>
              )}
              <h1 className="text-2xl font-bold text-arena-darkGray">
                {article.question?.title || 'Article'}
              </h1>
            </div>
            
            <div 
              className="prose prose-slate max-w-none forum-content" 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl text-gray-700">Article not found</h2>
          <p className="mt-2 text-gray-500">The article you're looking for could not be found.</p>
        </div>
      )}
    </div>
  );
}
