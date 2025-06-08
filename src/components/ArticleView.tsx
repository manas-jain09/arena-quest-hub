import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

  const getDifficultyClass = (difficulty?: string) => {
    if (!difficulty) return '';
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'theory':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return '';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-arena-red"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : article ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              {article.question?.difficulty && (
                <Badge className={`px-3 py-1 text-xs font-medium ${getDifficultyClass(article.question.difficulty)}`}>
                  {article.question.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {article.question?.title || 'Article'}
            </h1>
            <div className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(article.updated_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="p-8">
            <div 
              className="prose prose-slate max-w-none forum-content" 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <h2 className="text-xl text-gray-700 mb-4">Article not found</h2>
          <p className="text-gray-500">The article you're looking for could not be found.</p>
        </motion.div>
      )}
    </div>
  );
}
