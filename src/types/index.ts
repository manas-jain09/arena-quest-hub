
export interface User {
  id: string;
  username?: string;
  email: string;
  prn?: string;
  name?: string;
  role?: string;
  department?: string;
  organization?: string;
  year?: string;
  division?: string;
  batch?: string;
  grad_year?: string;
  course?: string;
  assigned_learning_paths?: string[];
  created_at?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  sr: string;
  created_at: string;
  updated_at: string;
  topicsCount?: number;
  questionsCount?: number;
}

export interface Topic {
  id: string;
  name: string;
  learning_path_id: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'theory';
  topic_id: string;
  solution_link: string;
  practice_link: string;
  created_at: string;
  updated_at: string;
  is_completed?: boolean;
  is_marked_for_revision?: boolean;
}
