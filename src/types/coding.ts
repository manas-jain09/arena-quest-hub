
export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
}

export interface ProblemExample {
  id: string;
  problem_id: string;
  input: string;
  output: string;
  explanation?: string;
  example_number: number;
}

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  is_sample: boolean;
}

export interface LanguageTemplate {
  id: string;
  problem_id: string;
  language: 'c' | 'cpp' | 'python' | 'java';
  template_code: string;
}

export interface UserSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  language: string;
  code: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  execution_time?: number;
  memory_used?: number;
  submitted_at: string;
}
