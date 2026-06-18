import { useState, useEffect, useRef } from "react";
import { Yogasana, Badge } from "../types";
import { Calculator, Flame, Calendar, Bell, ChevronRight, CheckSquare, Award, Clock, Volume2, Play, Pause, RefreshCw } from "lucide-react";

interface InteractiveToolsProps {
  asanas: Yogasana[];
  badges: Badge[];
  updateBadges: (id: string) => void;
  t: Record<string, string>;
}

export default function InteractiveTools({
  asanas,
  badges,
  updateBadges,
  t,
}: InteractiveToolsProps) {
  const [activeSubTab, setActiveSubTab] = useState<"bmi" | "calories" | "tracker" | "timer">("bmi");

  // --- BMI states ---
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [bmiRecommendation, setBmiRecommendation] = useState<string>("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      setBmiResult(parseFloat(bmi.toFixed(1)));
      if (bmi < 18.5) {
        setBmiCategory("Underweight");
        setBmiRecommendation("Focus on nourishing and stabilizing hold alignments like Vajrasana, restful Tadasana, and Trikonasana to encourage muscle tone and blood flow.");
      } else if (bmi >= 18.5 && bmi < 25) {
        setBmiCategory("Normal Weight");
        setBmiRecommendation("Excellent equilibrium! Maintain your posture and agility through integrated morning rounds of Surya Namaskar and Vrikshasana balances.");
      } else if (bmi >= 25 && bmi < 30) {
        setBmiCategory("Overweight");
        setBmiRecommendation("Incorporate cardio-intensive metabolic paces like 6-12 rounds of Surya Namaskar, complemented by core deep holding stretches in Dhanurasana.");
      } else {
        setBmiCategory("Obese");
        setBmiRecommendation("Take a moderate, careful approach using props. We recommend slow postures like Vrikshasana supported by a wall, Tadasana, and slow seated twists.");
      }
      updateBadges("badge-1"); // Unlock "First Stretch"
    }
  };

  // --- Calorie Calculator states ---
  const [selectedCaloriePose, setSelectedCaloriePose] = useState<string>(asanas[0]?.id || "");
  const [calorieMinutes, setCalorieMinutes] = useState<number>(15);
  const [burnedCalories, setBurnedCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    const match = asanas.find((a) => a.id === selectedCaloriePose);
    if (match) {
      const burned = match.caloriesPerMin * calorieMinutes;
      setBurnedCalories(parseFloat(burned.toFixed(1)));
    }
  };

  // --- Habit Tracker states ---
  const defaultHabits = [
    { id: "water", label: "Drink warm water upon waking up", checked: false },
    { id: "morning-yoga", label: "Practice 15 minutes of Morning Yoga holds", checked: false },
    { id: "deep-breath", label: "Perform 10 rounds of Anulom Vilom Pranayama", checked: false },
    { id: "meditation", label: "Practice 10 minutes of silent meditation", checked: false },
    { id: "posture", label: "Consciously sit upright during work", checked: false },
  ];

  const [habits, setHabits] = useState(defaultHabits);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    // Load local storage if available
    const savedHabits = localStorage.getItem("yogaveda-habits");
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (err) {}
    }
    const savedStreak = localStorage.getItem("yogaveda-streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak) || 0);
    }
  }, []);

  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, checked: !h.checked } : h));
    setHabits(updated);
    localStorage.setItem("yogaveda-habits", JSON.stringify(updated));

    // Calculate percentage checked
    const totalChecked = updated.filter((h) => h.checked).length;
    if (totalChecked === updated.length) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("yogaveda-streak", newStreak.toString());
      if (newStreak >= 3) {
        updateBadges("badge-2"); // Unlock "Sadhana Streak 3"
      }
    }
  };

  const resetTracker = () => {
    const cleared = habits.map((h) => ({ ...h, checked: false }));
    setHabits(cleared);
    localStorage.setItem("yogaveda-habits", JSON.stringify(cleared));
  };

  // --- Meditation Timer states ---
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<"none" | "om" | "forest" | "ocean">("none");
  const [timerComplete, setTimerComplete] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeRemaining(timerMinutes * 60);
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [timerMinutes]);

  const toggleTimer = () => {
    if (timerRunning) {
      // Pause
      setTimerRunning(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    } else {
      // Play
      setTimerRunning(true);
      setTimerComplete(false);
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Completed
            setTimerRunning(false);
            setTimerComplete(true);
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            // Trigger completion alert/badge
            if (timerMinutes >= 15) {
              updateBadges("badge-3"); // Unlock "Mindfulness Master"
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimeRemaining(timerMinutes * 60);
    setTimerComplete(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section id="interactive-tools-section" className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-neutral-100">
            {t.trackerTitle || "Daily Yoga & Sadhana Tools"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.trackerSub || "Maintain consistency, compute personal fitness indices, and nurture inner peace gracefully."}
          </p>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Inner Navigation Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveSubTab("bmi")}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "bmi"
                ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/10"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50"
            }`}
          >
            <Calculator className="h-4.5 w-4.5" />
            <span>Sutra BMI Advisor</span>
          </button>

          <button
            onClick={() => setActiveSubTab("calories")}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "calories"
                ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/10"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50"
            }`}
          >
            <Flame className="h-4.5 w-4.5" />
            <span>Yoga Calorie Burner</span>
          </button>

          <button
            onClick={() => setActiveSubTab("tracker")}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "tracker"
                ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/10"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50"
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            <span>Daily Sadhana Tracker</span>
          </button>

          <button
            onClick={() => setActiveSubTab("timer")}
            className={`px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === "timer"
                ? "bg-[#FF7A00] text-white shadow-md shadow-orange-500/10"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50"
            }`}
          >
            <Clock className="h-4.5 w-4.5" />
            <span>Minimalist Meditation Timer</span>
          </button>
        </div>

        {/* Sub-tab Contents */}
        <div className="mt-8 bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-200/50 dark:border-slate-800 text-left">
          
          {/* 1. BMI Advisor Panel */}
          {activeSubTab === "bmi" && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-serif">
                  📊 Body Mass Index (BMI) Advisor
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yoga acknowledges that our physical envelope requires balanced, custom stretching based of body structures.
                </p>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                    Weight (Kilograms)
                  </label>
                  <input
                    type="range"
                    min="35"
                    max="140"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full accent-[#FF7A00]"
                  />
                  <div className="flex justify-between text-xs font-bold text-[#FF7A00] mt-1">
                    <span>35 kg</span>
                    <span className="bg-orange-50 px-2 py-0.5 rounded">{weight} kg</span>
                    <span>140 kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                    Height (Centimeters)
                  </label>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full accent-[#FF7A00]"
                  />
                  <div className="flex justify-between text-xs font-bold text-[#FF7A00] mt-1">
                    <span>120 cm</span>
                    <span className="bg-orange-50 px-2 py-0.5 rounded">{height} cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                <button
                  onClick={calculateBMI}
                  className="w-full py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Calculate BMI & Fetch Recommendations
                </button>
              </div>

              {/* BMI Output */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 flex flex-col justify-center h-full min-h-[300px]">
                {bmiResult ? (
                  <div className="space-y-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[#FF7A00] font-bold">
                      Calculated Index:
                    </p>
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl sm:text-6xl font-black font-serif text-slate-800 dark:text-white tracking-tight">
                        {bmiResult}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-[#FF7A00] font-bold rounded-full text-xs font-mono">
                        {bmiCategory}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((bmiResult - 10) / 30) * 100))}%`,
                        }}
                      />
                    </div>

                    <div className="bg-orange-50/50 dark:bg-slate-800 p-4 rounded-xl border border-orange-100/40 text-xs sm:text-sm leading-relaxed">
                      <h4 className="font-bold text-[#FF7A00] mb-1 font-serif">Sutra Botanical Advise:</h4>
                      <p className="text-slate-600 dark:text-slate-300">{bmiRecommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 space-y-2">
                    <Calculator className="h-10 w-10 mx-auto text-orange-200" />
                    <p className="font-semibold text-sm">Enter your weight and height on the left to show diagnostic recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Calorie Burn Calculator */}
          {activeSubTab === "calories" && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-5">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-serif">
                  🔥 Metabolic Energy expenditure
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Different postures recruit various musculature loops and burn energy at separate speeds.
                </p>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                    Select Yogasana Posture
                  </label>
                  <select
                    value={selectedCaloriePose}
                    onChange={(e) => setSelectedCaloriePose(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    {asanas.map((pose) => (
                      <option key={pose.id} value={pose.id}>
                        {pose.name} ({pose.sanskritName}) - {pose.caloriesPerMin} cal/m
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                    Practice duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={calorieMinutes}
                    onChange={(e) => setCalorieMinutes(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={calculateCalories}
                  className="w-full py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Estimate Energy expenditure
                </button>
              </div>

              {/* Output */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border dark:border-slate-800 flex flex-col justify-center h-full min-h-[300px]">
                {burnedCalories !== null ? (
                  <div className="text-center space-y-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-[#FF7A00] font-bold">
                      Estimated Metabolic Burn:
                    </p>
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-6xl font-black font-serif text-slate-800 dark:text-white tracking-tight animate-pulse text-[#FF7A00]">
                        {burnedCalories}
                      </span>
                      <span className="text-lg font-mono text-slate-400">kcal</span>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-200/50 text-amber-700 dark:text-amber-200 p-4 rounded-xl text-xs max-w-sm mx-auto">
                      ⚡ Burning {burnedCalories} kilocalories is comparable to running briskly for {(burnedCalories / 12).toFixed(1)} minutes, but with significant spinal decompression and deep breath benefit!
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 space-y-2">
                    <Flame className="h-10 w-10 mx-auto text-orange-200" />
                    <p className="font-semibold text-sm">Select flat hold alignments and customize practice timelines to calculate cellular outputs.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Daily Sadhana Tracker */}
          {activeSubTab === "tracker" && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-serif">
                    🙏 Consciousness / Sadhana Habits
                  </h3>
                  <button
                    onClick={resetTracker}
                    className="text-xs text-slate-400 hover:text-[#FF7A00] underline font-bold"
                  >
                    Reset Checkboxes
                  </button>
                </div>

                <div className="space-y-2.5">
                  {habits.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => toggleHabit(h.id)}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        h.checked
                          ? "bg-emerald-50/50 dark:bg-slate-800/60 border-emerald-300 text-emerald-900 dark:text-emerald-100"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-[#FF7A00]/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={h.checked}
                        readOnly
                        className="w-4.5 h-4.5 accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-medium">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streaks & Badges */}
              <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 text-center space-y-6">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    🔥 SADHANA STREAK
                  </p>
                  <p className="text-6xl font-black font-serif text-slate-800 dark:text-white mt-1">
                    {streak} <span className="text-xs font-mono font-semibold text-[#FF7A00]">Days</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Check all boxes to progress your consecutive habit count!
                  </p>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Practitioner Badges */}
                <div className="text-left">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Award className="h-4 w-4 text-[#FF7A00]" /> Unlocked Ribbons ({badges.filter((b) => b.unlocked).length}/{badges.length})
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          b.unlocked
                            ? "bg-orange-50/70 border-orange-200/55 text-slate-800"
                            : "bg-slate-50 border-transparent text-slate-300 blur-[0.5px]"
                        }`}
                        title={`${b.title}: ${b.description}`}
                      >
                        <span className="text-2xl block">{b.icon}</span>
                        <p className="text-[9px] font-bold font-mono tracking-tighter truncate mt-1">
                          {b.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Meditation Timer */}
          {activeSubTab === "timer" && (
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2 font-serif mx-auto">
                <Clock className="h-5 w-5 text-[#FF7A00]" /> Minimalist Yoga Meditation Timer
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Quiet the mind (Chitta Vritti Nirodha). Connect with clean atmospheric background noise and hold deep static awareness.
              </p>

              {/* Time select */}
              <div className="flex justify-center gap-3">
                {[2, 5, 10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    disabled={timerRunning}
                    onClick={() => setTimerMinutes(mins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      timerMinutes === mins
                        ? "bg-[#FF7A00] text-white border-transparent"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#FF7A00]"
                    } disabled:opacity-40`}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>

              {/* Visual Clock Face */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-orange-100 dark:border-slate-800 flex flex-col items-center justify-center mx-auto bg-white dark:bg-slate-900/60 shadow-inner">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-800 dark:text-white">
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-[9px] font-mono font-semibold tracking-wider text-slate-400 mt-1 uppercase">
                  {timerRunning ? "ALIGNING AWARENESS" : "STANDBY"}
                </span>

                {/* Animated soft halo ring if running */}
                {timerRunning && (
                  <div className="absolute inset-[-4px] rounded-full border-4 border-[#FF7A00] animate-ping opacity-25 pointer-events-none" />
                )}
              </div>

              {/* Complete banner */}
              {timerComplete && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 p-3 rounded-2xl max-w-sm mx-auto text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center gap-1.5">
                  <Bell className="h-4 w-4 animate-bounce" /> 
                  <span>Om Shanti. Meditation Session completed cleanly!</span>
                </div>
              )}

              {/* Atmosphere sound toggles */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Volume2 className="h-4 w-4" /> Soundscape:
                </span>
                {[
                  { id: "none", val: "🔇 Silence" },
                  { id: "om", val: "🧘‍♂️ Om Chanting" },
                  { id: "forest", val: "🌳 Forest Birds" },
                  { id: "ocean", val: "🌊 Ocean Waves" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setAmbientSound(s.id as any)}
                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                      ambientSound === s.id
                        ? "bg-[#FF7A00]/10 text-[#FF7A00] font-bold border border-[#FF7A00]"
                        : "bg-slate-50 dark:bg-slate-850 text-slate-500 border border-transparent"
                    }`}
                  >
                    {s.val}
                  </button>
                ))}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={toggleTimer}
                  className={`px-8 py-3.5 rounded-full font-bold text-xs cursor-pointer text-white flex items-center gap-2 shadow-md transition-all ${
                    timerRunning
                      ? "bg-slate-700 hover:bg-slate-800"
                      : "bg-[#FF7A00] hover:bg-[#E66E00] shadow-orange-500/10"
                  }`}
                >
                  {timerRunning ? (
                    <>
                      <Pause className="h-4.5 w-4.5" /> Pause Meditation
                    </>
                  ) : (
                    <>
                      <Play className="h-4.5 w-4.5" /> Start Meditation
                    </>
                  )}
                </button>

                <button
                  onClick={resetTimer}
                  className="px-6 py-3.5 rounded-full bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              {/* Simulated Ambient Player Audio Cue info */}
              {ambientSound !== "none" && timerRunning && (
                <div className="text-[10px] font-mono text-[#FF7A00] animate-pulse">
                  Playing looping ambient: "{ambientSound.toUpperCase()}" at soft therapeutic 432Hz.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
