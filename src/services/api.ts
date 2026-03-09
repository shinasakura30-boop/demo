import { AssessmentResult, CareerReadinessResponse, Intervention, ModuleBriefing, ReviewQueueItem } from '../types';

// Mock sleep to simulate network latency, multiplied for fake loading simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms * 3));

export const dashboardService = {
  getDashboardData: async (): Promise<{
    career_readiness_score: number;
    module_scores: { A: number | null; B: number | null; C: number | null };
    interventions: string[];
  }> => {
    await delay(500);
    return {
      career_readiness_score: 81.8,
      module_scores: {
        A: 92.0,
        B: 65.0,
        C: 88.5,
      },
      interventions: [
        "Professional Communication & Empathy: The response lacked appropriate empathy for a VIP customer. Review the 'Customer Service Escalation' guidelines.",
      ],
    };
  },

  getReviewQueue: async (): Promise<ReviewQueueItem[]> => {
    await delay(300);
    return [
      {
        assessment_id: 102,
        student_name: "Alex Mercer (Demo Student)",
        student_code: "DEMO2026001",
        module: "B",
        ai_score: 65.0,
        proficiency_level: "B1",
        input_text: "Sorry, your shipment is delayed in customs for 48 hours. We couldn't help it. We will try to get it out as soon as possible. Maybe we can give you a discount later.",
        created_at: new Date().toISOString(),
      }
    ];
  },

  submitReview: async (assessmentId: number, data: { score: number; notes: string }): Promise<void> => {
    await delay(500);
    console.log(`Submitted review for Assessment ${assessmentId}: Score ${data.score}, Notes: ${data.notes}`);
  },
};

export const moduleAService = {
  submitAudio: async (formData: FormData): Promise<AssessmentResult> => {
    await delay(1500);
    // For audio demo, default to a high score response
    return getMockModuleAResult("emergency spill sector b first aid ambulance");
  },

  submitText: async (transcript: string, taskCompletionTime?: number): Promise<AssessmentResult> => {
    await delay(1000);
    return getMockModuleAResult(transcript);
  },
};

function getMockModuleAResult(input: string): AssessmentResult {
  const text = input.toLowerCase();

  // High Score Logic
  if (text.includes("sector b") && (text.includes("first aid") || text.includes("ambulance"))) {
    return {
      assessment_id: 101,
      student_id: 1,
      module: 'A',
      proficiency_level: 'B2',
      ai_score: 92.0,
      requires_human_review: false,
      features: {
        terminology_accuracy: 0.95,
        response_coherence: 0.90,
        error_rate: 0.05,
        tone_score: 0.98,
        vocabulary_coverage: 0.88,
        fluency_score: 0.90
      },
      feedback: "Excellent response. You provided all critical safety vocabulary (Sector B, spill, ambulance, first aid) and maintained a rapid Time-to-Response suitable for an emergency.",
      interventions: [],
      created_at: new Date().toISOString()
    };
  }

  // Medium Score Logic
  else if (text.includes("spill") || text.includes("hurt") || text.includes("help")) {
    return {
      assessment_id: 101,
      student_id: 1,
      module: 'A',
      proficiency_level: 'B1',
      ai_score: 68.0,
      requires_human_review: true,
      features: {
        terminology_accuracy: 0.50,
        response_coherence: 0.70,
        error_rate: 0.20,
        tone_score: 0.60,
        vocabulary_coverage: 0.55,
        fluency_score: 0.65
      },
      feedback: "Adequate response, but lacking precision. You communicated that there was an issue, but failed to provide the specific location (Sector B) or use proper terminology like 'first aid'.",
      interventions: ["Vocabulary Drill: Emergency & Safety Terminology"],
      created_at: new Date().toISOString()
    };
  }

  // Low Score Logic
  return {
    assessment_id: 101,
    student_id: 1,
    module: 'A',
    proficiency_level: 'A2',
    ai_score: 45.0,
    requires_human_review: true,
    features: {
      terminology_accuracy: 0.20,
      response_coherence: 0.40,
      error_rate: 0.40,
      tone_score: 0.30,
      vocabulary_coverage: 0.30,
      fluency_score: 0.40
    },
    feedback: "Poor response. The communication was marked by panic and lacked critical information. In a real scenario, emergency services would not know where to go or what to prepare for.",
    interventions: ["Speaking Practice: Calm Communication under Pressure", "Vocabulary Drill: Emergency & Safety Terminology"],
    created_at: new Date().toISOString()
  };
}

export const moduleBService = {
  startScenario: async (scenarioType: string = 'shipment_delay'): Promise<{ session_id: string; scenario_description: string; customer_complaint: string }> => {
    await delay(500);
    return {
      session_id: "demo-session-123",
      scenario_description: "Shipment Delay: A VIP client's critical shipment is delayed by 48 hours due to a customs hold. Review SOPs and respond professionally.",
      customer_complaint: "Where is my shipment?! I was told it would arrive today. This is completely unacceptable and will delay our entire manufacturing line!"
    };
  },

  respond: async (scenarioId: string, message: string): Promise<{ session_id: string; ai_reply: string; conversation_complete: boolean }> => {
    await delay(800);
    return {
      session_id: scenarioId,
      ai_reply: "A fast response is not enough. You need to provide a concrete resolution according to unit 8 SOPs before we lose our primary market window.",
      conversation_complete: true // End after 1 back-and-forth for demo brevity
    };
  },

  submit: async (scenarioId: string, fullResponseText: string): Promise<AssessmentResult> => {
    await delay(1200);
    const text = fullResponseText.toLowerCase();

    // High Score Logic
    if (text.includes("apologies") && text.includes("overnight") && text.includes("sop")) {
      return {
        assessment_id: 102,
        student_id: 1,
        module: 'B',
        proficiency_level: 'C1',
        ai_score: 95.0,
        requires_human_review: false,
        features: {
          terminology_accuracy: 0.95,
          response_coherence: 0.98,
          error_rate: 0.02,
          tone_score: 0.99,
          vocabulary_coverage: 0.90,
          fluency_score: 0.95
        },
        feedback: "Outstanding professional tone. You correctly identified the SOP, led with empathy/apologies, and provided a concrete, expedited resolution. This is the gold standard for customer escalation.",
        interventions: [],
        created_at: new Date().toISOString()
      };
    }

    // Medium Score Logic
    else if (text.includes("sorry") || text.includes("delay")) {
      return {
        assessment_id: 102,
        student_id: 1,
        module: 'B',
        proficiency_level: 'B1',
        ai_score: 65.0,
        requires_human_review: true,
        features: {
          terminology_accuracy: 0.60,
          response_coherence: 0.70,
          error_rate: 0.15,
          tone_score: 0.40,
          vocabulary_coverage: 0.65,
          fluency_score: 0.75
        },
        feedback: "The communication lacked professional tone and empathy per unit 8 SOP. While you addressed the 48-hour delay, failing to offer expedited resolution escalates the crisis.",
        interventions: ["Tone improvement: Review Customer Service Escalation guidelines."],
        created_at: new Date().toISOString()
      };
    }

    // Low Score Logic
    return {
      assessment_id: 102,
      student_id: 1,
      module: 'B',
      proficiency_level: 'A2',
      ai_score: 35.0,
      requires_human_review: true,
      features: {
        terminology_accuracy: 0.30,
        response_coherence: 0.50,
        error_rate: 0.40,
        tone_score: 0.15,
        vocabulary_coverage: 0.40,
        fluency_score: 0.50
      },
      feedback: "Highly unprofessional response. Deflecting blame entirely to customs without offering any empathy or solution violates all customer service SOPs.",
      interventions: ["Tone improvement: Review Customer Service Escalation guidelines.", "Grammar & Phasing: Professional Apologies"],
      created_at: new Date().toISOString()
    };
  },
};

export const moduleCService = {
  getBriefings: async (): Promise<ModuleBriefing[]> => {
    await delay(300);
    return [
      {
        briefing_id: "wh_sop_01",
        title: "Logistics Flow: Manufacturing to Transport",
        description: "Standard operating procedures for supply chain flow and digital manifests.",
        transcript: "To streamline our new product line, we must strictly follow the supply chain flow. Step one is the immediate procurement of high-grade raw materials from our tier-1 suppliers to avoid bottlenecks. Step two involves routing these materials directly to the primary manufacturing plant. Step three, after quality control, is the final preparation for distribution to our regional hubs.",
        expected_keywords: ["procurement", "raw materials", "manufacturing", "quality control", "distribution", "regional hubs"],
        expected_sequence: ["procurement", "routing", "distribution"]
      }
    ];
  },

  submit: async (briefingId: string, notes: string): Promise<AssessmentResult> => {
    await delay(1000);
    const text = notes.toLowerCase();

    // High Score Logic
    if (text.includes("procurement") && text.includes("distribution") && text.includes("hub")) {
      return {
        assessment_id: 103,
        student_id: 1,
        module: 'C',
        proficiency_level: 'C1',
        ai_score: 88.5,
        requires_human_review: false,
        features: {
          terminology_accuracy: 0.90,
          response_coherence: 0.95,
          error_rate: 0.02,
          tone_score: 0.85,
          vocabulary_coverage: 0.85,
          fluency_score: 0.90
        },
        feedback: "Very good comprehension. You successfully extracted all key procedures outlining the supply chain flow from raw material procurement to final regional distribution.",
        interventions: [],
        created_at: new Date().toISOString()
      };
    }

    // Medium Score Logic
    else if ((text.includes("raw material") || text.includes("manufacturing")) && text.includes("distribution")) {
      return {
        assessment_id: 103,
        student_id: 1,
        module: 'C',
        proficiency_level: 'B2',
        ai_score: 68.0,
        requires_human_review: true,
        features: {
          terminology_accuracy: 0.65,
          response_coherence: 0.70,
          error_rate: 0.10,
          tone_score: 0.80,
          vocabulary_coverage: 0.60,
          fluency_score: 0.75
        },
        feedback: "Average documentation. You missed critical terminology like 'procurement' and failed to specify the 'tier-1 suppliers' and 'regional hubs' milestones.",
        interventions: ["Procedure Documentation: Attention to Technical Details"],
        created_at: new Date().toISOString()
      };
    }

    // Low Score Logic
    return {
      assessment_id: 103,
      student_id: 1,
      module: 'C',
      proficiency_level: 'A2',
      ai_score: 42.0,
      requires_human_review: true,
      features: {
        terminology_accuracy: 0.20,
        response_coherence: 0.35,
        error_rate: 0.45,
        tone_score: 0.60,
        vocabulary_coverage: 0.25,
        fluency_score: 0.50
      },
      feedback: "Poor documentation. The procedure notes are far too brief and completely fail to outline the supply chain SOPs. Important details were omitted entirely.",
      interventions: ["Listening Comprehension: Extracting Key Supply Chain Concepts"],
      created_at: new Date().toISOString()
    };
  },
};
