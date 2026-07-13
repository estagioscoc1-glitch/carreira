export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  phone?: string;
  city?: string;
  objective?: string;
  skills?: string;
  courses?: string;
  experience?: string;
  languages?: string;
  avatarUrl?: string;
  openaiApiKey?: string; // Optional user-provided OpenAI API Key
  preferredProvider?: "gemini" | "openai"; // Selected default provider
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
  provider?: "gemini" | "openai"; // Chat-specific provider
}

export interface KBDocument {
  id: string;
  name: string;
  size: string;
  text: string;
  uploadedAt: string;
}


export interface ResumeData {
  summary?: string;
  objective: string;
  experience: string;
  courses: string;
  skills: string;
  languages: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  context: string;
  userAnswer?: string;
  evaluation?: {
    score: number;
    feedback: string;
    idealAnswer: string;
  };
}

export interface InterviewSession {
  id: string;
  area: string;
  role: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  completed: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  category: "Primeiro Emprego" | "Entrevistas" | "Currículos" | "LinkedIn" | "Carreira";
  description: string;
  content: string; // The full text of the material
  readingTime: string;
  gradient: string; // Tailwind gradient classes for beautiful premium book covers
}
