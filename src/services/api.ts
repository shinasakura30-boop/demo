import { AssessmentResult, ModuleBriefing, ReviewQueueItem } from '../types';
import { mockDashboardData, mockReviewQueueData, mockModuleAData, mockModuleBData, mockModuleCData } from '../mockData';

// Mock sleep to simulate network latency, multiplied for fake loading simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms * 3));

export const dashboardService = {
  getDashboardData: async (): Promise<{
    career_readiness_score: number;
    module_scores: { A: number | null; B: number | null; C: number | null };
    interventions: string[];
  }> => {
    await delay(500);
    return mockDashboardData;
  },

  getReviewQueue: async (): Promise<ReviewQueueItem[]> => {
    await delay(300);
    return mockReviewQueueData;
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
    return mockModuleAData.high;
  }

  // Medium Score Logic
  else if (text.includes("spill") || text.includes("hurt") || text.includes("help")) {
    return mockModuleAData.medium;
  }

  // Low Score Logic
  return mockModuleAData.low;
}

export const moduleBService = {
  startScenario: async (scenarioType: string = 'shipment_delay'): Promise<{ session_id: string; scenario_description: string; customer_complaint: string }> => {
    await delay(500);
    return mockModuleBData.scenario;
  },

  respond: async (scenarioId: string, message: string): Promise<{ session_id: string; ai_reply: string; conversation_complete: boolean }> => {
    await delay(800);
    const text = message.toLowerCase();

    let reply = "";
    if (text.includes("apolog") || text.includes("sorry")) {
      if (text.includes("expedite") || text.includes("overnight") || text.includes("air") || text.includes("alternative")) {
        reply = mockModuleBData.aiReplies.cautious;
      } else {
        reply = mockModuleBData.aiReplies.agitated;
      }
    } else if (text.includes("customs") || text.includes("document")) {
      reply = mockModuleBData.aiReplies.technical;
    } else {
      reply = mockModuleBData.aiReplies.deflective;
    }

    return {
      session_id: scenarioId,
      ai_reply: reply,
      conversation_complete: false
    };
  },

  submit: async (scenarioId: string, fullResponseText: string): Promise<AssessmentResult> => {
    await delay(1200);
    const text = fullResponseText.toLowerCase();

    // High Score Logic
    if (text.includes("apologies") && text.includes("overnight") && text.includes("sop")) {
      return mockModuleBData.results.high;
    }

    // Medium Score Logic
    else if (text.includes("sorry") || text.includes("delay") || text.includes("customs")) {
      return mockModuleBData.results.medium;
    }

    // Low Score Logic
    return mockModuleBData.results.low;
  },
};

export const moduleCService = {
  getBriefings: async (): Promise<ModuleBriefing[]> => {
    await delay(300);
    return [mockModuleCData.briefing];
  },

  submit: async (briefingId: string, notes: string): Promise<AssessmentResult> => {
    await delay(1000);
    const text = notes.toLowerCase();

    // High Score Logic
    if (text.includes("procurement") && text.includes("distribution") && text.includes("hub")) {
      return mockModuleCData.results.high;
    }

    // Medium Score Logic
    else if ((text.includes("raw material") || text.includes("manufacturing")) && text.includes("distribution")) {
      return mockModuleCData.results.medium;
    }

    // Low Score Logic
    return mockModuleCData.results.low;
  },
};
