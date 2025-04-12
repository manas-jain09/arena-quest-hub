
// Custom types for the Yodha/Profile feature
export interface UserProfile {
  id: string;
  prn: string;
  username: string;
  name?: string;
  college?: string;
  location?: string;
  cgpa?: number;
  linkedin?: string;
  email?: string;
}

export interface LearningPathProgress {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  completedQuestions: number;
  totalQuestions: number;
  percentage: number;
}

export interface CompletedTopic {
  id: string;
  name: string;
  learningPathId: string;
  learningPathTitle?: string;
}

export interface ActivityData {
  date: string;
  count: number;
}
