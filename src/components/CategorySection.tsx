import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  t: Record<string, string>;
  onCategorySelect: (categoryName: string) => void;
}

export default function CategorySection({ t, onCategorySelect }: CategorySectionProps) {
  const categoriesList = [
    {
      name: "Beginner Yoga",
      desc: "Gentle postures, spinal warm-ups, and alignment baselines perfectly suited for newcomers.",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
      color: "from-blue-500/10 to-indigo-500/5",
    },
    {
      name: "Weight Loss Yoga",
      desc: "Active cardio and metabolism boosting sequences (like Surya Namaskars) to encourage lipolysis.",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
      color: "from-orange-500/10 to-amber-500/5",
    },
    {
      name: "Back Pain Relief Yoga",
      desc: "Decompress spinal discs and reinforce core ligaments for chronic lumbar lower back comfort.",
      img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400",
      color: "from-emerald-500/10 to-teal-500/5",
    },
    {
      name: "Yoga for Diabetes",
      desc: "Visceral twists and folds designed to massage cells and stabilize healthy insulin ranges.",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
      color: "from-rose-500/10 to-pink-500/5",
    },
    {
      name: "Yoga for Stress & Anxiety",
      desc: "Deep pranayama breathing patterns to reset panic cycles and build inner core peace.",
      img: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=400",
      color: "from-violet-500/10 to-purple-500/5",
    },
    {
      name: "Senior Citizen Yoga",
      desc: "Slow-paced poses focusing on ankle strength, vestibular support and joint flexibility.",
      img: "https://images.unsplash.com/photo-1552196564-97283c93b371?auto=format&fit=crop&q=80&w=400",
      color: "from-amber-500/10 to-yellow-500/5",
    },
    {
      name: "Kids Yoga",
      desc: "Dynamic and playful animal-themed movements to enhance attention spans naturally.",
      img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400",
      color: "from-sky-500/10 to-cyan-500/5",
    },
    {
      name: "Prenatal Yoga",
      desc: "Safe restorative holds promoting blood circulation and deep pelvic floor relaxation.",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
      color: "from-fuchsia-500/10 to-purple-500/5",
    },
  ];

  return (
    <section id="categories-section" className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-neutral-100">
            {t.categoriesTitle || "Yoga Categories Section"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.categoriesSub || "Curated programs for specific health objectives and experience levels."}
          </p>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categoriesList.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`group flex flex-col justify-between bg-gradient-to-b ${cat.color} dark:bg-slate-800 rounded-2xl border border-orange-50/30 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md hover:border-[#FF7A00]/30 transition-all`}
            >
              <div>
                {/* Header photo thumb */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/20" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-left group-hover:text-[#FF7A00] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 text-left leading-relaxed line-clamp-3">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <button
                  onClick={() => onCategorySelect(cat.name)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-850 hover:bg-[#FF7A00] dark:hover:bg-[#FF7A00] text-xs font-semibold text-[#FF7A00] hover:text-white rounded-xl shadow-sm border border-orange-100 dark:border-slate-700/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.learnMore || "Learn More"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
