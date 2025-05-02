
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  topicsCount?: number;
  questionsCount?: number;
}

export interface Question {
  id: string;
  title: string;
  solution_link: string;
  practice_link: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  is_completed: boolean;
  is_marked_for_revision: boolean;
}

export interface Topic {
  id: string;
  name: string;
  learning_path_id: string;
  questions: Question[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  prn: string;
}
