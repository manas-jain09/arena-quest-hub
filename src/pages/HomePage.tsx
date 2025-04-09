
import { useState } from 'react';
import { LearningPathCard } from '@/components/LearningPathCard';
import { QuestionTable } from '@/components/QuestionTable';
import { learningPaths, topicsAndQuestions } from '@/data/sampleData';

export const HomePage = () => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  
  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
  };
  
  const selectedPath = learningPaths.find(path => path.id === selectedPathId);

  return (
    <div className="container mx-auto px-4 py-8">
      {!selectedPathId ? (
        <>
          <h1 className="text-3xl font-bold text-arena-darkGray mb-6">Learning Paths</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map(path => (
              <LearningPathCard
                key={path.id}
                title={path.title}
                description={path.description}
                difficulty={path.difficulty}
                topicsCount={path.topicsCount}
                questionsCount={path.questionsCount}
                onClick={() => handlePathSelect(path.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => setSelectedPathId(null)}
              className="mr-4 bg-arena-lightGray hover:bg-arena-gray text-arena-darkGray px-3 py-1.5 rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Learning Paths
            </button>
            <h1 className="text-2xl font-bold text-arena-darkGray">{selectedPath?.title}</h1>
          </div>
          
          <QuestionTable 
            topics={topicsAndQuestions[selectedPathId as keyof typeof topicsAndQuestions]} 
            learningPathTitle={selectedPath?.title || ''}
          />
        </>
      )}
    </div>
  );
};
