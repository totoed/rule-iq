export interface Question {
  id: number;
  text: string;
  correctAnswer: boolean;
  userAnswer?: boolean | null;
  subject?: string;
  category?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  userId: string | null; // null for anonymous users
  date: string;
  score: number;
  totalQuestions: number;
  questions: Question[];
}

export interface StudyResource {
  id: string;
  subject: string;
  title: string;
  description: string;
  url: string;
  type: "book" | "video" | "article" | "course";
}

export type OAuthProvider = "google" | "microsoft";
