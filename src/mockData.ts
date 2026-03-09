import { AssessmentResult, CareerReadinessResponse, Intervention, ModuleBriefing, ReviewQueueItem } from './types';

export const mockDashboardData = {
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

export const mockReviewQueueData: ReviewQueueItem[] = [
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

export const mockModuleAData = {
    high: {
        assessment_id: 101,
        student_id: 1,
        module: 'A' as const,
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
    } as AssessmentResult,
    medium: {
        assessment_id: 101,
        student_id: 1,
        module: 'A' as const,
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
    } as AssessmentResult,
    low: {
        assessment_id: 101,
        student_id: 1,
        module: 'A' as const,
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
    } as AssessmentResult
};

export const mockModuleBData = {
    scenario: {
        session_id: "demo-session-123",
        scenario_description: "**CRITICAL LOGISTICS INCIDENT [AI GENERATED SCENARIO]:**\n\n**Client Profile:** Kratos Industrial Automation (Tier-1 VIP)\n**Status:** Urgent Alert Code 4 - Supply Chain Disruption\n**Incident Details:** A critical shipment of high-precision microcontrollers (Waybill #88A-921X) is currently detained at the port of entry due to a Class-B customs documentation discrepancy. The delay is projected at 48-72 hours.\n**Objective:** Role-play as the Logistics Crisis Manager. You must de-escalate the client, address their concerns using appropriate terminology, and offer a concrete resolution in line with unit 8 Customer Service SOPs.",
        customer_complaint: "[SYSTEM WARNING: INCOMING URGENT CLIENT MESSAGE]\n\n\"Where is my shipment?! I received an automated alert stating the microcontrollers are held up, but I was guaranteed delivery at our assembly plant by 08:00 AM today. We have fifty technicians standing by, and this bottleneck is costing us $20,000 an hour in stalled manufacturing downtime. This is completely unacceptable! I need an explanation and I need those parts released immediately!\""
    },
    aiReplies: {
        cautious: "*(AI Sentiment Metrics: Frustration dropping, cautiously receptive...)*\n\n\"Alright, I appreciate the apology and the proactive offer to expedite an alternative shipment. However, time is our primary metric here. Can you guarantee the expedited routing will bypass the current customs hold? I need a concrete timeline on when those replacement parts will hit our loading dock, and confirmation that the additional freight charges will be absorbed by your compliance team.\"",
        agitated: "*(AI Sentiment Metrics: High agitation, lack of resolution detected...)*\n\n\"I don't need apologies right now, I need action! Saying 'sorry' doesn't restart my assembly line. What exact steps are you taking with the customs brokers to resolve the documentation mismatch? Can we route a partial shipment via air freight? I need concrete solutions based on your standard operating procedures, not platitudes!\"",
        technical: "*(AI Sentiment Metrics: Analyzing technical explanation...)*\n\n\"So it's a documentation error on your end? This is exactly why we insisted on the premium expedited service contract! If the commercial invoice doesn't match the packing list, your compliance team should have flagged this before it left origin. How quickly can your customs clearance agents file the amended paperwork? Every minute counts.\"",
        deflective: "*(AI Sentiment Metrics: Escalating frustration, deflection detected...)*\n\n\"Your response tells me nothing about how we fix this! You are not addressing the core issue. My management is breathing down my neck because our entire JIT (Just-In-Time) inventory flow is compromised! Please, I need to speak with someone who can authorize an emergency air-freight replacement or clear the customs logjam immediately. Do you even have a contingency plan?\""
    },
    results: {
        high: {
            assessment_id: 102,
            student_id: 1,
            module: 'B' as const,
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
            feedback: "### LOGI-PRO AI EVALUATION [C1 LEVEL]\n\n**Assessment:** Outstanding professional tone.\n\nYou correctly identified the SOP, led with empathy/apologies, and provided a concrete, expedited resolution. This interaction represents the gold standard for maintaining tier-1 client relationships during a logistics escalation.",
            interventions: [],
            created_at: new Date().toISOString()
        } as AssessmentResult,
        medium: {
            assessment_id: 102,
            student_id: 1,
            module: 'B' as const,
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
            feedback: "### LOGI-PRO AI EVALUATION [B1 LEVEL]\n\n**Assessment:** Adequate terminology, poor tone resolution.\n\nThe communication lacked the proactive professional tone required by Unit 8 SOPs for VIP clients. While you addressed the delay, failing to offer an immediate, expedited resolution effectively escalated the crisis instead of de-escalating it.",
            interventions: ["Tone improvement: Review Customer Service Escalation guidelines."],
            created_at: new Date().toISOString()
        } as AssessmentResult,
        low: {
            assessment_id: 102,
            student_id: 1,
            module: 'B' as const,
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
            feedback: "### LOGI-PRO AI EVALUATION [A2 LEVEL]\n\n**Assessment:** Highly unprofessional & ineffective response.\n\nDeflecting blame entirely to customs without offering any empathy or immediate alternative logistics solution violates all core customer service SOPs. This response endangers the client relationship.",
            interventions: ["Tone improvement: Review Customer Service Escalation guidelines.", "Grammar & Phasing: Professional Apologies"],
            created_at: new Date().toISOString()
        } as AssessmentResult
    }
};

export const mockModuleCData = {
    briefing: {
        briefing_id: "wh_sop_01",
        title: "Logistics Flow: Manufacturing to Transport",
        description: "Standard operating procedures for supply chain flow and digital manifests.",
        transcript: "To streamline our new product line, we must strictly follow the supply chain flow. Step one is the immediate procurement of high-grade raw materials from our tier-1 suppliers to avoid bottlenecks. Step two involves routing these materials directly to the primary manufacturing plant. Step three, after quality control, is the final preparation for distribution to our regional hubs.",
        expected_keywords: ["procurement", "raw materials", "manufacturing", "quality control", "distribution", "regional hubs"],
        expected_sequence: ["procurement", "routing", "distribution"]
    },
    results: {
        high: {
            assessment_id: 103,
            student_id: 1,
            module: 'C' as const,
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
        } as AssessmentResult,
        medium: {
            assessment_id: 103,
            student_id: 1,
            module: 'C' as const,
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
        } as AssessmentResult,
        low: {
            assessment_id: 103,
            student_id: 1,
            module: 'C' as const,
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
        } as AssessmentResult
    }
};
