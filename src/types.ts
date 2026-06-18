export interface Yogasana {
  id: string;
  name: string;
  sanskritName: string;
  englishName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  category: string;
  benefits: {
    physical: string[];
    mental: string[];
    medical: string[];
  };
  instructions: string[];
  breathing: {
    inhale: string;
    hold?: string;
    exhale: string;
  };
  commonMistakes: string[];
  precautions: string[];
  scientificEvidence: {
    summary: string;
    citations: string[];
  };
  relatedAsanas: string[];
  img: string;
  caloriesPerMin: number;
}

export interface HealthCondition {
  id: string;
  name: string;
  icon: string;
  recommendedAsanas: string[]; // references of Yogasana IDs
  benefits: string[];
  precautions: string[];
}

export interface Instructor {
  id: string;
  name: string;
  experience: string;
  specialization: string;
  rating: number;
  img: string;
}

export interface ResearchArticle {
  id: string;
  title: string;
  citation: string;
  summary: string;
  pubmedLink: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  img: string;
}

export interface Challenge {
  id: string;
  title: string;
  duration: string;
  description: string;
  tasks: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  img: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  time: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
