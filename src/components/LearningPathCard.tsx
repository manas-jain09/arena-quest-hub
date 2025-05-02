
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    easy: { color: "arena-badge-easy", text: "Easy", bgGradient: "from-green-50 to-green-100" },
    medium: { color: "arena-badge-medium", text: "Medium", bgGradient: "from-yellow-50 to-yellow-100" },
    hard: { color: "arena-badge-hard", text: "Hard", bgGradient: "from-red-50 to-red-100" },
    theory: { color: "arena-badge-theory", text: "Theory", bgGradient: "from-blue-50 to-blue-100" }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="arena-card cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white"
        onClick={onClick}
      >
        <CardHeader className={`bg-gradient-to-br ${difficultyMap[difficulty].bgGradient} border-b`}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <Badge className={`${difficultyMap[difficulty].color} transform transition-transform duration-300 hover:scale-105`}>
              {difficultyMap[difficulty].text}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-gray-700">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-5">
          <div className="flex justify-between text-sm text-arena-darkGray">
            <div className="flex items-center">
              <span className="bg-gray-100 rounded-full p-1 px-2 mr-2 font-medium">{topicsCount}</span>
              <span>Topics</span>
            </div>
            <div className="flex items-center">
              <span className="bg-gray-100 rounded-full p-1 px-2 mr-2 font-medium">{questionsCount}</span>
              <span>Questions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
