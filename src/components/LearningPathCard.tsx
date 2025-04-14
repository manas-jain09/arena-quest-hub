
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
      case "easy": return "bg-green-50 border-b";
      case "medium": return "bg-yellow-50 border-b";
      case "hard": return "bg-red-50 border-b";
      case "theory": return "bg-blue-50 border-b";
      default: return "bg-gray-50 border-b";
    }
  };

  return (
    <Card className="arena-card cursor-pointer" onClick={onClick}>
      <CardHeader className={getBgColor()}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={difficultyMap[difficulty].color}>
            {difficultyMap[difficulty].text}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between text-sm text-arena-darkGray">
          <div>Topics: <span className="font-medium">{topicsCount}</span></div>
          <div>Questions: <span className="font-medium">{questionsCount}</span></div>
        </div>
      </CardContent>
    </Card>
  );
};
