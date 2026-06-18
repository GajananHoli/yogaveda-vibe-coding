import { motion } from "motion/react";
import { Sparkles, ArrowRight, HeartPulse, Compass, Users, Map } from "lucide-react";

interface HeroProps {
  t: Record<string, string>;
  setActiveTab: (tab: string) => void;
  onExploreClick: () => void;
}

export default function Hero({ t, setActiveTab, onExploreClick }: HeroProps) {
  const statFeatures = [
    {
      icon: <Compass className="w-5 h-5 text-[#FF7A00]" />,
      title: "500+ Yogasana Guides",
      desc: "Authentic physical postures & step-by-step alignments",
    },
    {
      icon: <Map className="w-5 h-5 text-amber-500" />,
      title: "Personalized Yoga Plans",
      desc: "Autonomic schedules generated live for your goals",
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      title: "Expert Instructors",
      desc: "Vedic master teachers to guide safe alignment adjustments",
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
      title: "Health Recommendations",
      desc: "Science-grounded poses targeting chronic lifestyle symptoms",
    },
  ];

  return (
    <div id="yogaveda-hero" className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 bg-[#FFFAF5] dark:bg-slate-950 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-[#FF7A00]/5 dark:bg-[#FF7A00]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100/60 dark:border-orange-900/30 text-xs font-semibold text-[#FF7A00] mb-4"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>VEDIC WISDOM MEETS CLINICAL REHABILITATION</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-serif text-slate-800 dark:text-neutral-100 mt-2 leading-tight tracking-tight font-bold"
            >
              {t.heroTitle || "Transform Your Mind, Body & Soul Through Yoga"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t.heroSubtitle || "Learn authentic Yogasanas, meditation, breathing techniques, and personalized wellness programs."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => setActiveTab("ai-coach")}
                className="bg-[#FF7A00] hover:bg-[#E66E00] text-white px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.ctaStart || "Start Your Journey"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onExploreClick}
                className="border-2 border-slate-700 dark:border-slate-300 text-slate-800 dark:text-slate-200 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-slate-800 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.ctaExplore || "Explore Yogasanas"}
              </button>
            </motion.div>
          </div>

          {/* Graphic/Image Right Column */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {/* Premium image of serene woman doing yoga */}
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                alt="Mindfulness Yoga Pose"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Float Card 1 inside photo */}
              <div className="absolute -bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-2xl shadow-xl border border-orange-100/40 dark:border-slate-700/50 backdrop-blur z-20 flex items-center gap-3">
                <div className="bg-orange-100 dark:bg-orange-950/40 p-2 rounded-xl text-[#FF7A00]">
                  🔥
                </div>
                <div>
                  <p className="text-xl font-bold font-serif text-slate-800 dark:text-white tracking-tight">108</p>
                  <p className="text-[10px] font-medium text-slate-400">Suryas Target</p>
                </div>
              </div>

              {/* Float Card 2 inside photo */}
              <div className="absolute -top-4 -left-4 bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-2xl shadow-xl border border-orange-100/40 dark:border-slate-700/50 backdrop-blur z-20 flex items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2 rounded-xl text-emerald-500 text-sm font-bold">
                  🕉️
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Ancient Sutras</p>
                  <p className="text-[10px] font-medium text-[#FF7A00]">Clinical Guidelines</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Grid Banner (Satisfies: 500+ Guides, Personalized plans, Experts, Health recommend) */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statFeatures.map((feat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-orange-100/30 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-all flex items-start space-x-3.5 group hover:border-[#FF7A00]/30"
              >
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-slate-800/80 group-hover:bg-[#FF7A00]/10 transition-colors">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#FF7A00] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
