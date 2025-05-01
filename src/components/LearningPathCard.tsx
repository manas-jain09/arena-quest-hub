
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LearningPathCardProps {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  topicsCount: number;
  questionsCount: number;
  onClick: () => void;
}

export const LearningPathCard = ({
  title,
  description,
  difficulty,
  topicsCount,
  questionsCount,
  onClick
}: LearningPathCardProps) => {
  const difficultyMap = {
    easy: { color: "arena-badge-easy", text: "Easy" },
    medium: { color: "arena-badge-medium", text: "Medium" },
    hard: { color: "arena-badge-hard", text: "Hard" },
    theory: { color: "arena-badge-theory", text: "Theory" }
  };

  const getBgColor = () => {
    switch(difficulty) {
      case "easy": return "bg-green-50 border-b border-green-100";
      case "medium": return "bg-yellow-50 border-b border-yellow-100";
      case "hard": return "bg-red-50 border-b border-red-100";
      case "theory": return "bg-blue-50 border-b border-blue-100";
      default: return "bg-gray-50 border-b";
    }
  };

  return (
    <Card 
      className="arena-card cursor-pointer hover:scale-102 transition-all duration-200 hover:shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100 overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className={getBgColor()}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={difficultyMap[difficulty].color}>
            {difficultyMap[difficulty].text}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-sm text-arena-darkGray">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-arena-red" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Topics: <span className="font-medium">{topicsCount}</span></span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-arena-red" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Questions: <span className="font-medium">{questionsCount}</span></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
