export interface AssessmentResult {
  assessment_id: number;
  student_id: number;
  module: 'A' | 'B' | 'C';
  proficiency_level: string;
  ai_score: number;
  final_score?: number;
  requires_human_review: boolean;
  features: {
    terminology_accuracy: number;
    response_coherence: number;
    error_rate: number;
    tone_score: number;
    vocabulary_coverage: number;
    fluency_score: number;
  };
  feedback: string;
  interventions: string[];
  created_at: string;
}

export interface CareerReadinessResponse {
  student_id: number;
  student_name: string;
  career_readiness_score: number;
  module_a_score: number | null;
  module_b_score: number | null;
  module_c_score: number | null;
  proficiency_summary: Record<string, string>;
}

export interface Intervention {
  id: number;
  module: string;
  type: string;
  description: string;
  priority: string;
  weak_areas: string;
  completed: boolean;
  created_at: string;
}

export interface ModuleBriefing {
  briefing_id: string;
  title: string;
  description: string;
  audio_url?: string;
  transcript: string;
  expected_keywords: string[];
  expected_sequence: string[];
}

export interface ReviewQueueItem {
  assessment_id: number;
  student_name: string;
  student_code: string;
  module: string;
  ai_score: number;
  proficiency_level: string;
  input_text: string | null;
  created_at: string;
}
