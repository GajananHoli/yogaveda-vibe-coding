import { useState, FormEvent } from "react";
import { Compass, Mail, ShieldAlert, BookOpen } from "lucide-react";

interface FooterProps {
  t: Record<string, string>;
}

export default function Footer({ t }: FooterProps) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean>(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubscribeSuccess(true);
    setEmailInput("");
    setTimeout(() => setSubscribeSuccess(false), 5000);
  };

  return (
    <footer id="yogaveda-footer" className="bg-slate-900 text-neutral-300 pt-16 pb-12 border-t border-slate-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-slate-800">
          
          {/* Col 1 Brand */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#FF7A00] text-white p-2 rounded-xl">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                Yoga<span className="text-[#FF7A00] italic">Veda</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated to restoring traditional Vedic geometry alignment coordinates, combined with clinical research guidelines to manage chronic lifestyle health indices naturally.
            </p>
          </div>

          {/* Col 2 Explore Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest">Explore Sadhana</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#hero" className="hover:text-[#FF7A00] transition-colors">Beginner Postures (Asanas)</a></li>
              <li><a href="#ai-coach" className="hover:text-[#FF7A00] transition-colors">AI Sadhana Plans</a></li>
              <li><a href="#tools" className="hover:text-[#FF7A00] transition-colors">BMI & Energy Calculators</a></li>
              <li><a href="#challenges" className="hover:text-[#FF7A00] transition-colors">Daily Yoga Challenges</a></li>
            </ul>
          </div>

          {/* Col 3 Resources */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest">Resources</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#clinical-studies" className="hover:text-[#FF7A00] transition-colors">Clinical Studies</a></li>
              <li><a href="#ayurveda" className="hover:text-[#FF7A00] transition-colors">Ayurvedic Dietetics</a></li>
              <li><a href="#teachers" className="hover:text-[#FF7A00] transition-colors">Expert Instructors</a></li>
              <li><a href="#faqs" className="hover:text-[#FF7A00] transition-colors">Standard FAQs</a></li>
            </ul>
          </div>

          {/* Col 4 Newsletter subscription */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-widest">Vedic Bulletin Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get clinical recommendations, yoga warnings, and alignment remedies directly in your mail inbox.
            </p>

            {subscribeSuccess && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-xl text-center">
                ✓ Pranam. Welcome to your wellness inbox list!
              </div>
            )}

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-[#FF7A00]"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E66E00] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Join</span>
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer & Clinical disclosure warning strictly requested */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between text-[11px] text-slate-500 gap-4">
          <div className="flex items-start gap-1.5 max-w-3xl leading-relaxed">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-500 flex-shrink-0" />
            <p>
              <strong>Disclaimer Medical Advice:</strong> All guidelines, holding durations, breathing ratios, and calculated metabolic values shown in YogaVeda are for educational, auxiliary reference. Do NOT substitute for certified medical diagnosis, cardiac consult, or physical operations rehabilitation. Always align slowly and practice within anatomical safety thresholds.
            </p>
          </div>
          
          <div className="whitespace-nowrap">
            © {new Date().getFullYear()} YogaVeda Inc. All Vedic wisdom conserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
