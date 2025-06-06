
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";

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
  // Debug information
  console.log(`Rendering card: ${title}, difficulty: ${difficulty}, topicsCount: ${topicsCount}, questionsCount: ${questionsCount}`);
  
  const difficultyMap = {
    easy: { color: "bg-green-100 text-green-800 border-green-200", text: "Easy", bgGradient: "from-green-50 to-green-100" },
    medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Medium", bgGradient: "from-yellow-50 to-yellow-100" },
    hard: { color: "bg-red-100 text-red-800 border-red-200", text: "Hard", bgGradient: "from-red-50 to-red-100" },
    theory: { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Theory", bgGradient: "from-blue-50 to-blue-100" }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full"
    >
      <Card 
        className={`cursor-pointer h-full border-2 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white`}
        onClick={onClick}
      >
        <CardHeader className={`bg-gradient-to-br ${difficultyMap[difficulty].bgGradient} border-b`}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
            <Badge className={`${difficultyMap[difficulty].color} font-medium px-3 py-1 border`}>
              {difficultyMap[difficulty].text}
            </Badge>
          </div>
          <CardDescription className="mt-2 text-gray-700">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-5">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-arena-red" />
              <span className="bg-gray-100 rounded-full px-2.5 py-1 font-medium">{topicsCount}</span>
              <span>Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-arena-red" />
              <span className="bg-gray-100 rounded-full px-2.5 py-1 font-medium">{questionsCount}</span>
              <span>Questions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
