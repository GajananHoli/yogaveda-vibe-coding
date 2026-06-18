import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Lazy initialize Gemini client to dodge crash on missing API key
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Successfully initialized Gemini client.");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY is unset or default. Running with local expert simulated engine.");
  }

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", keyConfigured: !!ai });
  });

  // AI Yoga Recommendation Engine
  app.post("/api/gemini/recommend", async (req, res) => {
    const { age, gender, weight, healthCondition, fitnessGoal } = req.body;

    if (!age || !gender || !fitnessGoal) {
      return res.status(400).json({ error: "Missing required parameters (age, gender, fitnessGoal)" });
    }

    const healthCondString = healthCondition ? healthCondition : "None";

    // If Gemini is configured and active, query it using Schema Type safety
    if (ai) {
      try {
        const prompt = `You are a legendary ancient Yogacharya combined with a leading modern clinical physiotherapist and endocrinologist. 
Generate a custom, science-grounded Yoga & Yogasan plan for:
Age: ${age}, Gender: ${gender}, Weight: ${weight || "Moderate"}kg, Chronic Health Condition: ${healthCondString}, Fitness/Wellness Goal: ${fitnessGoal}.

Structure your response strictly in the following JSON format conforming to this typescript layout:
{
  "dailyPlan": "Short motivational layout of morning/evening routine splits",
  "recommendedAsanas": [
    {
      "asanaId": "Id similar to the pose, e.g. surya-namaskar, bhujangasana, tadasana, trikonasana, vrikshasana, dhanurasana, padmasana, vajrasana",
      "name": "English name of the recommended posture",
      "sanskritName": "Sanskrit name in English letters, e.g. Bhujangasana",
      "reason": "Clear clinical/therapeutic justification why this posture directly alleviates their condition or fits their goal."
    }
  ],
  "duration": "Total recommended minutes of physical play and meditation per session",
  "weeklySchedule": [
    {
      "day": "Day 1",
      "focus": "Focus name, e.g., Breath awareness and spine opening",
      "routine": "List of 3-4 poses to link together"
    }
  ]
}

Ensure you recommend at least 3-4 asanas with premium clinical reasons. Focus the narrative on anatomical safety, breath coordinates (e.g., synchronize inhale/exhale) and precision holds.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                dailyPlan: { type: Type.STRING },
                duration: { type: Type.STRING },
                recommendedAsanas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      asanaId: { type: Type.STRING },
                      name: { type: Type.STRING },
                      sanskritName: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ["asanaId", "name", "sanskritName", "reason"],
                  },
                },
                weeklySchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      routine: { type: Type.STRING },
                    },
                    required: ["day", "focus", "routine"],
                  },
                },
              },
              required: ["dailyPlan", "recommendedAsanas", "duration", "weeklySchedule"],
            },
          },
        });

        const textOutput = response.text;
        if (!textOutput) {
          throw new Error("Empty text returned from Gemini API.");
        }
        const parsedPlan = JSON.parse(textOutput);
        return res.json({ ...parsedPlan, source: "Gemini AI" });
      } catch (err: any) {
        console.error("Gemini API Recommendation failed, falling back to simulated engine:", err);
        // Fall back gracefully rather than crashing
      }
    }

    // --- Simulated High-Quality Local Wellness Engine ---
    // If Gemini is unconfigured or fails, generate tailored professional routines
    const simulatedAsanasMap: Record<string, Array<{asanaId: string, name: string, sanskritName: string, reason: string}>> = {
      "Diabetes": [
        { asanaId: "trikonasana", name: "Triangle Pose", sanskritName: "Trikonasana", reason: "Gently massages visceral glands and pancreas, boosting insulin secretion sensitivity." },
        { asanaId: "bhujangasana", name: "Cobra Pose", sanskritName: "Bhujangasana", reason: "Stimulates deep abdominal circulation and decreases resting stress levels." },
        { asanaId: "vajrasana", name: "Thunderbolt Pose", sanskritName: "Vajrasana", reason: "Increases splanchnic arterial perfusion immediately after eating." }
      ],
      "PCOS": [
        { asanaId: "dhanurasana", name: "Bow Pose", sanskritName: "Dhanurasana", reason: "Decompresses ovaries, releasing blood stagnation and regulating reproductive pathways." },
        { asanaId: "bhujangasana", name: "Cobra Pose", sanskritName: "Bhujangasana", reason: "Increases pelvic ventilation and balances neuroendocrine axes." },
        { asanaId: "padmasana", name: "Lotus Pose", sanskritName: "Padmasana", reason: "Calms the amygdala, decreasing resting dynamic androgen synthesis under stress." }
      ],
      "Thyroid": [
        { asanaId: "bhujangasana", name: "Cobra Pose", sanskritName: "Bhujangasana", reason: "Compresses/de-compresses thyroid receptors via strong neck expansion." },
        { asanaId: "dhanurasana", name: "Bow Pose", sanskritName: "Dhanurasana", reason: "Opens dynamic throat alignments, stimulating blood circulation around the windpipe." },
        { asanaId: "surya-namaskar", name: "Sun Salutation", sanskritName: "Surya Namaskar", reason: "Tones the metabolism, supporting steady energy levels and cellular active levels." }
      ],
      "Obesity": [
        { asanaId: "surya-namaskar", name: "Sun Salutation", sanskritName: "Surya Namaskar", reason: "Serves as an dynamic metabolic booster, encouraging calorie burns." },
        { asanaId: "trikonasana", name: "Triangle Pose", sanskritName: "Trikonasana", reason: "Engages side-torso abdominal obliques and increases full body stamina." },
        { asanaId: "dhanurasana", name: "Bow Pose", sanskritName: "Dhanurasana", reason: "Stretches hip flexors and tones deep visceral core muscles to improve vitality." }
      ],
      "Anxiety": [
        { asanaId: "padmasana", name: "Lotus Pose", sanskritName: "Padmasana", reason: "Promotes deep alpha brainwaves, centering focus and easing cardiac agitation." },
        { asanaId: "tadasana", name: "Mountain Pose", sanskritName: "Tadasana", reason: "Induces strong postural balance, building safety foundations and quiet breaths." },
        { asanaId: "vrikshasana", name: "Tree Pose", sanskritName: "Vrikshasana", reason: "Enforces neuromuscular focus, shutting out intrusive thought patterns completely." }
      ],
      "Hypertension": [
        { asanaId: "tadasana", name: "Mountain Pose", sanskritName: "Tadasana", reason: "Helps re-calibrate baseline vascular values by stabilizing deep diaphragmatic breaths." },
        { asanaId: "vrikshasana", name: "Tree Pose", sanskritName: "Vrikshasana", reason: "Calms systemic cardiovascular resistance through gentle, non-strenuous balances." },
        { asanaId: "vajrasana", name: "Thunderbolt Pose", sanskritName: "Vajrasana", reason: "Stimulates deep parasympathetic rest, steadily lowering the pulse rate." }
      ],
      "Back Pain": [
        { asanaId: "bhujangasana", name: "Cobra Pose", sanskritName: "Bhujangasana", reason: "Tones extensors, decompressing lower lumbar intervertebral disc spacing." },
        { asanaId: "tadasana", name: "Mountain Pose", sanskritName: "Tadasana", reason: "Restores normal anatomical spinal alignments, adjusting slight hip tilts." },
        { asanaId: "vajrasana", name: "Thunderbolt Pose", sanskritName: "Vajrasana", reason: "Stretches leg nerves, relieving sciatica spasms or tightness down calves." }
      ]
    };

    // Fallback selection based on fitnessGoal if condition is None
    const defaultAsanas = [
      { asanaId: "surya-namaskar", name: "Sun Salutation", sanskritName: "Surya Namaskar", reason: "A comprehensive sequence designed to boost cardiovascular stamina and full-body posture." },
      { asanaId: "tadasana", name: "Mountain Pose", sanskritName: "Tadasana", reason: "Builds a perfect baseline physical posture, relaxing structural vertebrae." },
      { asanaId: "vrikshasana", name: "Tree Pose", sanskritName: "Vrikshasana", reason: "Improves balance confidence metrics and targets ankle joint stabilizers." }
    ];

    const selectedAsanas = simulatedAsanasMap[healthCondition] || defaultAsanas;

    const simulatedPlan = {
      dailyPlan: `Welcome! Since you seek to solve ${fitnessGoal}${healthCondition !== "None" ? ` with a focus on managing ${healthCondition}` : ""}, we recommend practicing these holding sequences. This safe, beginner-friendly schedule prioritizes slow spinal movements, parasympathetic breathing codes, and careful core integration.`,
      recommendedAsanas: selectedAsanas,
      duration: "15 to 25 minutes of mindful practice",
      weeklySchedule: [
        { day: "Day 1", focus: "Spine Awakening & Breath Synchronization", routine: "Tadasana (5 mins) -> gentle deep breathing -> Bhujangasana hold (2 mins)" },
        { day: "Day 2", focus: "Metabolic and Joint Mobilization", routine: "Surya Namaskar slowly (3 rounds) -> rest in Vajrasana (3 mins)" },
        { day: "Day 3", focus: "Core Balance & Neural Centering", routine: "Vrikshasana balance holds (2 mins each leg) -> Shavasana (5 mins)" },
        { day: "Day 4", focus: "Restorative Hip Openers & Deep Lung Stretches", routine: "Trikonasana (3 mins) -> Vajrasana sitting (5 mins)" },
        { day: "Day 5", focus: "Lower Spinal Extensors and Core Stability", routine: "Bhujangasana lifts (3 rounds) -> Gentle leg stretches in Tadasana" },
        { day: "Day 6", focus: "Integrated Vitality Flow", routine: "Combined Suryas (4 rounds) -> Balasana rest" },
        { day: "Day 7", focus: "Mindful Meditation & Integration", routine: "Padmasana or comfortable cross sitting with pranayama (10 mins)" }
      ],
      source: "Sutra Simulated Engine (Attach your API Key in secrets panel to unlock true Gemini generation!)"
    };

    res.json(simulatedPlan);
  });

  // AI Yoga Coach Chat
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No user message provided" });
    }

    if (ai) {
      try {
        const systemInstruction = `You are Acharya YogaVeda, an elite master yogi and clinical orthopedic specialist with deep reverence for traditional roots but an absolute ground in scientific, anatomical, and research-backed therapeutic yoga.
Keep your answers brief, warm, supportive, and safe.
Avoid recommending complex maneuvers to users reporting severe injuries. Always list precautions when people ask about postures.
If they ask for translation, explain that they can toggle English, Hindi, Marathi, or Gujarati live in the navbar!`;

        // Map client history to correct gemini format
        const formattedContents = [];
        if (history && Array.isArray(history)) {
          for (const item of history) {
            formattedContents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }
        // Append user's current message
        formattedContents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });

        return res.json({ text: response.text, source: "Gemini AI" });
      } catch (err: any) {
        console.error("Gemini Chat failed, falling back to simulated response:", err);
      }
    }

    // High quality simulated expert responses
    let fallbackText = `Pranam! Thank you for seeking guidance. To enjoy absolute personalized recommendations, please consider adding a real GEMINI_API_KEY to the AI Studio Secrets menu.

On your question: Yoga practice is primarily a bridge of alignment (Sutra). Keep your movements linked with a measured breath (e.g., inhale to expand, exhale to fold). If you have any ongoing discomfort in the knees or back, always keep your joints gently bent and sit with support. Let me know what specific posture you would like to master today!`;

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("pain") || lowerMsg.includes("hurt") || lowerMsg.includes("injury")) {
      fallbackText = `Pranam. Safety (Ahimsa) is the primary rule of YogaVeda. If you are experiencing any spinal pain or joint injury, please do NOT hold heavy backbends. Focus on gentle restorative postures like Balasana (Child's pose) and sit in Vajrasana to align the spine naturally. Always synchronize with soft exhalations to ease nervous strain.`;
    } else if (lowerMsg.includes("beginner") || lowerMsg.includes("start")) {
      fallbackText = `Welcome to your YogaVeda journey! For beginners, I recommend focusing on Tadasana (Mountain Pose) to perfect your stature, and Vrikshasana (Tree Pose) to train your brain to achieve deep neuromuscular concentration. Keep your durations short (1-2 minutes) and build consistency first.`;
    } else if (lowerMsg.includes("weight") || lowerMsg.includes("calories")) {
      fallbackText = `To support natural weight management and calorie burn, practicing 6-12 rounds of Surya Namaskar (Sun Salutation) in the early morning acts as a wonderful metabolic booster. It stretches all 12 major muscular paths and stimulates digestive fire (Agni). Use deep, intentional exhalations on all forward bends of the flow.`;
    }

    res.json({ text: fallbackText, source: "Sutra Simulated Engine" });
  });

  // --- Vite & Middleware static setups ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static assets in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YogaVeda server online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
