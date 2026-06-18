import { useState, useRef, FormEvent } from "react";
import { Sparkles, Send, Brain, User, AlertTriangle, FileText, Download, Check, RefreshCw } from "lucide-react";

interface AiCoachProps {
  t: Record<string, string>;
}

interface RecommendedAsana {
  asanaId: string;
  name: string;
  sanskritName: string;
  reason: string;
}

interface WeeklyPlanItem {
  day: string;
  focus: string;
  routine: string;
}

interface RecommendationResponse {
  dailyPlan: string;
  recommendedAsanas: RecommendedAsana[];
  duration: string;
  weeklySchedule: WeeklyPlanItem[];
  source?: string;
}

interface ChatMessage {
  role: "user" | "coach";
  text: string;
  time: string;
  source?: string;
}

export default function AiCoach({ t }: AiCoachProps) {
  // --- AI Recommendation states ---
  const [age, setAge] = useState<string>("28");
  const [gender, setGender] = useState<string>("Female");
  const [weight, setWeight] = useState<string>("62");
  const [healthCondition, setHealthCondition] = useState<string>("None");
  const [fitnessGoal, setFitnessGoal] = useState<string>("Flexibility Training");
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<RecommendationResponse | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // --- AI Chat states ---
  const [chatInput, setChatInput] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "coach",
      text: "Pranam! I am Acharya YogaVeda, your AI guide. You can ask me questions about posture alignments, modifying poses to avoid back or joint strain, or optimizing your daily breathing cycles.",
      time: "10:00 AM",
      source: "System baseline",
    },
  ]);

  const handleFetchRecommendation = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingPlan(true);
    setGeneratedPlan(null);

    try {
      const response = await fetch("/api/gemini/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          gender,
          weight,
          healthCondition,
          fitnessGoal,
        }),
      });
      const data = await response.json();
      setGeneratedPlan(data);
    } catch (err) {
      console.error("Failed to generate custom yoga plan:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setLoadingChat(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message immediately
    const updatedMessages = [
      ...chatMessages,
      { role: "user" as const, text: userMsg, time: timeStr },
    ];
    setChatMessages(updatedMessages);

    try {
      // Map prior 5 messages to simplified history structure
      const history = updatedMessages.slice(-5).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: history,
        }),
      });
      const data = await response.json();

      setChatMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: data.source,
        },
      ]);
    } catch (err) {
      console.error("AI Coach failed to respond:", err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedPlan) return;
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    // Create a beautiful, printable document layout in a secondary window/iframe or trigger standard browser print!
    // Triggering print is the best way to get a real PDF
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const posesHtml = generatedPlan.recommendedAsanas
      .map(
        (p) => `
      <div style="margin-bottom: 20px; border-left: 4px solid #FF7A00; padding-left: 15px;">
        <h3 style="margin: 0; font-family: serif; color: #1e293b;">${p.name} (${p.sanskritName})</h3>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">${p.reason}</p>
      </div>
    `
      )
      .join("");

    const scheduleHtml = generatedPlan.weeklySchedule
      .map(
        (s) => `
      <tr>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; background: #fffcf8; color: #FF7A00;">${s.day}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${s.focus}</td>
        <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px; color: #334155;">${s.routine}</td>
      </tr>
    `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>YogaVeda_Custom_Plan</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #334155; line-height: 1.6; }
            h1 { font-family: Georgia, Garamond, serif; border-bottom: 2px solid #FF7A00; padding-bottom: 10px; color: #1e293b; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; color: #64748b; }
            .quote { background: #fafaf9; border-left: 4px solid #FF7A00; padding: 15px; font-style: italic; margin-bottom: 30px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #FF7A00; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>YogaVeda Custom Sadhana Schedule</h1>
          <div class="header-info">
            <div>
              <strong>Practitioner Profile:</strong> Age: ${age} | Gender: ${gender} | Target Condition: ${healthCondition}
            </div>
            <div>
              <strong>Focus Goal:</strong> ${fitnessGoal} | <strong>Recommended session time:</strong> ${generatedPlan.duration}
            </div>
          </div>

          <div class="quote">
            "${generatedPlan.dailyPlan}"
          </div>

          <h2>1. Recommended Holds & Postural Remedies</h2>
          <div>${posesHtml}</div>

          <h2>2. Your Weekly Sadhana Roadmap</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Day</th>
                <th style="width: 35%;">Therapeutic Focus</th>
                <th style="width: 50%;">Flow Sequence</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleHtml}
            </tbody>
          </table>

          <div class="footer">
            YogaVeda Platform. Generated dynamically via ${generatedPlan.source || "Sutra Engine"}. Practice safely.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section id="ai-coach-section" className="py-20 bg-[#FFFAF5] dark:bg-slate-950 border-b border-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-neutral-100">
            {t.aiCoachTitle || "Interactive AI Recommendation & Coach"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.aiCoachSub || "Harness clinical intelligence and traditional yogic scripts to craft custom schedules and secure real-time adjustments."}
          </p>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 items-start">
          
          {/* LEFT: AI Recommendation Tool Form & Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100/30 dark:border-slate-800/80 text-left">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-serif border-b pb-4 mb-5">
                <Brain className="h-5 w-5 text-[#FF7A00]" /> {t.aiCoachTitle || "AI Yoga Recommendation Tool"}
              </h3>

              <form onSubmit={handleFetchRecommendation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-binary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">Health Condition</label>
                    <select
                      value={healthCondition}
                      onChange={(e) => setHealthCondition(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-[#FF7A00]"
                    >
                      <option value="None">No ongoing conditions</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="PCOS">PCOS</option>
                      <option value="Thyroid">Thyroid issues</option>
                      <option value="Obesity">Obesity</option>
                      <option value="Anxiety">Anxiety / High Stress</option>
                      <option value="Hypertension">Hypertension (High BP)</option>
                      <option value="Back Pain">Back Pain / Spine ache</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">Fitness Goals</label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    <option>Flexibility Training</option>
                    <option>Weight Loss</option>
                    <option>Stress & Anxiety relief</option>
                    <option>General physical posture alignment</option>
                    <option>Deep spiritual breathing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loadingPlan}
                  className="w-full mt-2 py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {loadingPlan ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Gathering clinical data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Personalized weekly Sadhana Plan
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Plan Output Display */}
            {generatedPlan && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100/30 dark:border-slate-800 text-left space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">PERSONALIZED ROUTINE</h4>
                    <p className="text-xl font-bold font-serif text-slate-800 dark:text-white">Your Custom YogaVeda Blueprint</p>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Plan Ready
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" /> PDF Guides
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-orange-50/50 p-4 rounded-xl text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-4 border-[#FF7A00]">
                  "{generatedPlan.dailyPlan}"
                </div>

                {/* hold pose recommendations */}
                <div>
                  <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Yoga Poses</h5>
                  <div className="space-y-2.5">
                    {generatedPlan.recommendedAsanas.map((p, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl text-xs leading-relaxed border-l-2 border-emerald-500">
                        <strong className="text-slate-800 dark:text-slate-100 text-sm">{p.name} ({p.sanskritName})</strong>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{p.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* weekly schedule */}
                <div>
                  <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Schedule Roadmap</h5>
                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-850">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FF7A00] text-white">
                        <tr>
                          <th className="p-3">Day</th>
                          <th className="p-3">Core Focus</th>
                          <th className="p-3">Recommended sequence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {generatedPlan.weeklySchedule.map((s, idx) => (
                          <tr key={idx} className="bg-white dark:bg-slate-900 hover:bg-slate-50/40">
                            <td className="p-3 font-semibold text-[#FF7A00]">{s.day}</td>
                            <td className="p-3 font-semibold">{s.focus}</td>
                            <td className="p-3 text-slate-500 dark:text-slate-400">{s.routine}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-[10px] text-right font-mono text-slate-400 uppercase block">
                  Generated via {generatedPlan.source || "Sutra Engine"}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: AI Yoga Coach Chat Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-orange-100/30 dark:border-slate-800/80 text-left h-[500px] sm:h-[600px] flex flex-col justify-between">
              
              {/* Header */}
              <div className="border-b pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] font-black font-serif">
                    🕉️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Acharya YogaVeda</h3>
                    <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE COACH
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Vedic Clinical Expert
                </span>
              </div>

              {/* Chat messages box */}
              <div className="flex-1 overflow-y-auto py-5 space-y-4 px-1" id="chat-messages-container">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        msg.role === "user"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-orange-50 text-[#FF7A00] border-orange-100"
                      }`}
                    >
                      {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : "ॐ"}
                    </div>
                    <div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#FF7A00] text-white"
                            : "bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border dark:border-slate-750"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-slate-400 font-mono">{msg.time}</span>
                        {msg.source && (
                          <span className="text-[8px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-400 uppercase font-mono">
                            {msg.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loadingChat && (
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-[#FF7A00] border border-orange-200 flex items-center justify-center text-xs font-bold animate-spin-slow">
                      ॐ
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl text-xs text-slate-400 italic">
                      Acharya is channeling adjustments advice...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="border-t pt-4 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about neck pain, modifying backbends, breathing etc..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl text-xs dark:text-white focus:outline-none"
                  disabled={loadingChat}
                />
                <button
                  type="submit"
                  disabled={loadingChat || !chatInput.trim()}
                  className="px-3 py-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white rounded-xl shadow-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
