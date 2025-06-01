
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodingProblem, ProblemExample } from '@/types/coding';

interface ProblemDescriptionProps {
  problem: CodingProblem;
  examples: ProblemExample[];
}

export function ProblemDescription({ problem, examples }: ProblemDescriptionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{problem.title}</CardTitle>
          <Badge className={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {problem.description}
        </div>
        
        {examples.length > 0 && (
          <div className="space-y-4">
            {examples.map((example) => (
              <div key={example.id} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Example {example.example_number}:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Input: </span>
                    <code className="bg-gray-200 px-1 py-0.5 rounded">{example.input}</code>
                  </div>
                  <div>
                    <span className="font-medium">Output: </span>
                    <code className="bg-gray-200 px-1 py-0.5 rounded">{example.output}</code>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="font-medium">Explanation: </span>
                      <span>{example.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
