
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
}

interface QuestionData {
  id: string;
  title: string;
  difficulty: string;
}

export function ArticleView() {
  const { questionId } = useParams();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleAndQuestion = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching article for question ID:', questionId);
        
        if (!questionId) {
          console.error('No question ID provided');
          toast.error('No question ID provided');
          return;
        }

        // First, fetch the article using question_id
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('question_id', questionId)
          .maybeSingle();
        
        if (articleError) {
          console.error('Error fetching article:', articleError);
          toast.error('Failed to load article');
          return;
        }

        console.log('Article data:', articleData);

        if (!articleData) {
          console.log('No article found for question ID:', questionId);
          setArticle(null);
          setQuestion(null);
          return;
        }

        // Set the article data
        setArticle(articleData);

        // Now fetch the question details
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('id, title, difficulty')
          .eq('id', questionId)
          .maybeSingle();

        if (questionError) {
          console.error('Error fetching question:', questionError);
          // Don't show error for question, as article is the main content
        } else {
          console.log('Question data:', questionData);
          setQuestion(questionData);
        }

      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (questionId) {
      fetchArticleAndQuestion();
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
              {question?.difficulty && (
                <Badge className={`px-3 py-1 text-xs font-medium ${getDifficultyClass(question.difficulty)}`}>
                  {question.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {question?.title || 'Article'}
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
          <p className="text-sm text-gray-400 mt-2">Question ID: {questionId}</p>
        </motion.div>
      )}
    </div>
  );
}
