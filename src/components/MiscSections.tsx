import { useState, FormEvent } from "react";
import { Instructor, ResearchArticle, Testimonial, Challenge, BlogPost, ForumPost } from "../types";
import { Award, BookOpen, Star, Sparkles, Smartphone, Download, UserPlus, Info, PlusCircle, HelpCircle, ChevronDown, CheckCircle } from "lucide-react";

interface MiscSectionsProps {
  instructors: Instructor[];
  researchArticles: ResearchArticle[];
  blogPosts: BlogPost[];
  challenges: Challenge[];
  forumPosts: ForumPost[];
  addForumPost: (title: string, content: string, category: string) => void;
  t: Record<string, string>;
}

export default function MiscSections({
  instructors,
  researchArticles,
  blogPosts,
  challenges,
  forumPosts,
  addForumPost,
  t,
}: MiscSectionsProps) {
  // Navigation for minor tabs
  const [activeTeachId, setActiveTeachId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Challenge states
  const [activeChallenges, setActiveChallenges] = useState<Record<string, number>>({});
  const [challengeCompleteAlert, setChallengeCompleteAlert] = useState<string | null>(null);

  // FAQ Accordion index
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // New forum post form states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCat, setNewPostCat] = useState("General Sadhana");
  const [forumNotice, setForumNotice] = useState<string | null>(null);

  const roadmapSteps = [
    { step: "Step 1", title: "Learn Breathing", desc: "Awaken the prana with Anulom Vilom and measured 4-4-4 seconds breathing cycles." },
    { step: "Step 2", title: "Basic Yoga", desc: "Achieve baseline pelvic stature and neck support with Tadasana alignment holding." },
    { step: "Step 3", title: "Flexibility Training", desc: "Deepen muscular flexibility across Hamstring and Spine extensors with Cobra & Triangle." },
    { step: "Step 4", title: "Advanced Yogasana", desc: "Master stamina-intensive holding complexes like Dhanurasana & Full Surya flows." },
    { step: "Step 5", title: "Meditation", desc: "Establish static alpha wave brain relaxation sitting tall in locked Lotus pads." },
    { step: "Step 6", title: "Wellness Mastery", desc: "Integrate Ayurvedic herbs, daily routines, and daily self-assessment trackers." },
  ];

  const faqs = [
    { q: "What is Yoga?", a: "Yoga is an ancient Sanskrit system (meaning union) combining physical stretches (Asanas), breathing coordinates (Pranayama), and meditation codes (Dhyana) to calm the heart and optimize physiological and mental equilibrium." },
    { q: "Which Yoga is best for beginners?", a: "We recommend starting with alignment holds like Tadasana (Mountain Pose) and Vrikshasana (Tree Pose) which build foot arches, knee anchors, and postural awareness safely without stress." },
    { q: "Can Yoga reduce weight?", a: "Yes. Postures like Surya Namaskar and Dhanurasana serve as intense aerobic metabolic boosters, engaging whole-body obliques, toning core muscles, and speeding resting metabolic rates." },
    { q: "Is Yoga safe for seniors?", a: "Absolutely. Slow, restorative holds focusing on static chairs, wall balances, and non-strenuous ankle alignments (like Tree Pose with support) are excellent for preventing falls in seniors." },
    { q: "How often should I practice?", a: "We believe consistency is superior to volume. Practicing 10-15 minutes of safe, steady holds daily inside YogaVeda yields superior cellular and vascular health than one long intermittent session of 90 minutes." },
  ];

  const handleBookSession = (teacherName: string) => {
    setBookingSuccess(`Your consultation with ${teacherName} is booked for tomorrow at 8:00 AM. Check your inbox for video links!`);
    setActiveTeachId(null);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const incrementChallengeProgress = (chId: string, max: number) => {
    setActiveChallenges((prev) => {
      const current = prev[chId] || 0;
      if (current >= max - 1) {
        setChallengeCompleteAlert(`Incredible! You completed the ${chId.replace("-", " ").toUpperCase()}. Milestone unlocked!`);
        setTimeout(() => setChallengeCompleteAlert(null), 5000);
        return { ...prev, [chId]: max };
      }
      return { ...prev, [chId]: current + 1 };
    });
  };

  const handleFormForumPost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    addForumPost(newPostTitle.trim(), newPostContent.trim(), newPostCat);
    setNewPostTitle("");
    setNewPostContent("");
    setForumNotice("Your post has been broadcast to other YogaVeda sadhakas!");
    setTimeout(() => setForumNotice(null), 4000);
  };

  return (
    <div id="miscellaneous-visual-sections" className="space-y-0">
      
      {/* 1. YOGA LEARNING JOURNEY TIMELINE */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-neutral-100">
              {t.journeyTitle || "Yoga Learning Journey Roadmap"}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {t.journeySub || "A clear milestone timeline designed to progress your practice step-by-step from beginner holds to wellness mastery."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mt-12 relative">
            {roadmapSteps.map((s, idx) => (
              <div
                key={idx}
                className="bg-orange-50/20 dark:bg-slate-850 p-6 rounded-2xl border border-orange-100/30 hover:border-[#FF7A00]/50 transition-all text-left relative"
              >
                <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase block">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mt-1">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {s.desc}
                </p>

                {idx < 5 && (
                  <div className="hidden lg:block absolute right-[-15px] top-1/2 -translate-y-1/2 text-orange-200 text-lg font-bold z-10">
                    ➔
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CLOUD CHALLENGES TIMELINESS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-orange-50/20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              {t.challengesTitle || "Mindful Yoga Challenges"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 text-center">
              {t.challengesSub || "Unlock milestones, track daily tasks, and reinforce lifelong consistent sadhana."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          {/* Success notifications */}
          {challengeCompleteAlert && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold rounded-2xl text-center max-w-lg mx-auto flex items-center justify-center gap-1.5 animate-bounce">
              <Award className="h-5 w-5 text-emerald-500" />
              <span>{challengeCompleteAlert}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {challenges.map((ch) => {
              const currentProgress = activeChallenges[ch.id] || 0;
              const maxSteps = ch.tasks.length;
              const percent = Math.round((currentProgress / maxSteps) * 100);

              return (
                <div
                  key={ch.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border dark:border-slate-800/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <span className="text-[10px] font-mono bg-orange-100 text-[#FF7A00] dark:bg-orange-950/40 px-2.5 py-0.5 rounded font-bold uppercase">
                      🕒 {ch.duration}
                    </span>
                    <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-white mt-3">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {ch.description}
                    </p>

                    {/* Next task to check */}
                    {percent < 100 ? (
                      <div className="mt-4 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border">
                        <p className="text-[10px] font-mono uppercase text-slate-400">Next Target:</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                          {ch.tasks[currentProgress] || "First milestone"}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 text-center">
                        <p className="text-xs font-bold text-emerald-700">✓ Completed Successfully!</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                      <span>Milestones: {currentProgress}/{maxSteps}</span>
                      <span className="text-[#FF7A00]">{percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF7A00] to-amber-500 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {percent < 100 && (
                      <button
                        onClick={() => incrementChallengeProgress(ch.id, maxSteps)}
                        className="w-full mt-4 py-2 bg-orange-50 hover:bg-[#FF7A00] hover:text-white text-[#FF7A00] font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        ✓ Mark Next Task Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CLINICAL RESEARCH SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-widest bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full">
              CLINICAL EVIDENCE
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mt-3">
              {t.scienceTitle || "Evidence-Based Yoga Research"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 text-center">
              {t.scienceSub || "Peer-reviewed studies proving metabolic changes, endocrine balances, and brain wave shifts."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {researchArticles.map((art) => (
              <div
                key={art.id}
                className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200/40 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#FF7A00] uppercase font-mono tracking-wide">
                    PUBMED CITATION
                  </h4>
                  <h3 className="text-base font-bold font-serif mt-2.5 text-slate-800 dark:text-neutral-100">
                    "{art.title}"
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">{art.citation}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed italic">
                    "{art.summary}"
                  </p>
                </div>

                <div className="mt-6 border-t pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    INDEXED: MEDLINE
                  </span>
                  <a
                    href={art.pubmedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#FF7A00] underline"
                  >
                    Read on PubMed 🡵
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPERT TEACHERS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-orange-50/20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              {t.teachersTitle || "Sutra Expert Teachers"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 text-center">
              {t.teachersSub || "Certified teachers guiding alignment adjustments, anatomy mechanics, and deep traditional breathing patterns."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          {bookingSuccess && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl max-w-md mx-auto text-center flex items-center gap-1.5">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
              <span>{bookingSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {instructors.map((teach) => (
              <div
                key={teach.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={teach.img}
                      alt={teach.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7A00]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-850 dark:text-white">
                        {teach.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Ex: {teach.experience}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-semibold">
                    Certified in: <span className="text-[#FF7A00]">{teach.specialization}</span>
                  </p>

                  <div className="flex items-center gap-1 mt-3">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold font-mono">{teach.rating}</span>
                    <span className="text-[10px] text-slate-400">(Vedic Board Verified)</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTeachId(teach.id)}
                  className="w-full mt-6 py-2.5 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs rounded-xl cursor-pointer transition-colors text-center"
                >
                  Book Private Consultation (Online)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking session modal dialog */}
        {activeTeachId && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 text-left border">
              <h3 className="text-lg font-bold font-serif text-slate-850 dark:text-white">
                Book Diagnostic Consultation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Prepare your metrics and questions for personal postural modifications advice.
              </p>

              <div className="space-y-3.5 mt-5">
                <div>
                  <label className="block text-[10px] font-mono tracking-widest font-bold uppercase text-slate-400">
                    Consultation Subject
                  </label>
                  <select className="w-full px-3 py-1.5 border rounded text-xs dark:bg-slate-800">
                    <option>Posture adjustments warnings</option>
                    <option>Endocrine metabolic advice</option>
                    <option>Pranayama rhythm breathing patterns</option>
                    <option>Stress and sleep alignment holds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-widest font-bold uppercase text-slate-400">
                    Scheduled Time Slots
                  </label>
                  <select className="w-full px-3 py-1.5 border rounded text-xs dark:bg-slate-800">
                    <option>Tomorrow, 8:00 AM - 8:30 AM (IST)</option>
                    <option>Tomorrow, 5:00 PM - 5:30 PM (IST)</option>
                    <option>Day after, 9:00 AM - 9:30 AM (IST)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 mt-6 justify-end">
                <button
                  onClick={() => setActiveTeachId(null)}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const match = instructors.find((i) => i.id === activeTeachId);
                    if (match) handleBookSession(match.name);
                  }}
                  className="px-4 py-2 bg-[#FF7A00] text-white rounded text-xs font-bold"
                >
                  Confirm Secure Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. COMMUNITY DISCUSSION FORUM */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              {t.forumTitle || "Yogic Community Forum"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 text-center">
              {t.forumSub || "Ask posture queries, share achievements, and interact with other global seekers."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          {forumNotice && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl max-w-md mx-auto text-center">
              {forumNotice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* New Post Form */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/50">
              <h4 className="text-sm font-mono font-bold tracking-widest text-[#FF7A00] uppercase mb-4">
                ➕ Broadcast Post to community
              </h4>

              <form onSubmit={handleFormForumPost} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="E.g. How to prevent knee stress in Padmasana?"
                    className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newPostCat}
                    onChange={(e) => setNewPostCat(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white dark:bg-slate-800 dark:text-white focus:outline-none"
                  >
                    <option>Sadhana Alignment</option>
                    <option>Dietary Habits</option>
                    <option>Breathing & Meditation</option>
                    <option>Clinical Yoga Therapy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">
                    Question / Achievement Content
                  </label>
                  <textarea
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Explain what steps you took, alignments, or warning signs..."
                    className="w-full px-3.5 py-2 border rounded-xl text-xs bg-white dark:bg-slate-800 dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Broadcast Post Live
                </button>
              </form>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-8 space-y-4">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-50/50 dark:bg-slate-900/60 p-5 rounded-2xl border dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{post.author}</span>
                        <span className="bg-orange-100 text-[#FF7A00] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          {post.role}
                        </span>
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">{post.time}</p>
                    </div>
                  </div>

                  <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase mt-2.5">
                    {post.category}
                  </span>

                  <h4 className="text-sm font-bold text-slate-850 dark:text-white font-serif mt-1.5">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex gap-4 text-[11px] text-slate-400 font-mono mt-4 pt-3 border-t">
                    <span>👍 {post.likes} Likes</span>
                    <span>💬 {post.replies} Responses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO-OPTIMIZED BLOG */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-orange-50/20 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              {t.blogTitle || "Vedic & Botanical Insights"}
            </h2>
            <p className="mt-3 text-sm text-slate-500 text-center">
              {t.blogSub || "Explore posture alignments, Ayurveda diet plans, and deep metabolic analyses."}
            </p>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {blogPosts.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-800 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#FF7A00] text-white px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide">
                      {blog.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-mono text-slate-400 block">{blog.date}</span>
                    <h3 className="text-base font-bold font-serif text-slate-800 dark:text-white mt-1 group-hover:text-[#FF7A00] transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <span className="text-xs font-mono font-bold text-[#FF7A00] group-hover:underline cursor-pointer">
                    Read Article 📖
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. APP STORE PROMOTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-950 dark:to-[#FF7A00]/20 text-white text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-black">{t.mobileApp || "Download YogaVeda Mobile App"}</h2>
            <p className="text-orange-50 text-sm mt-3 leading-relaxed max-w-2xl">
              Take your sadhana anywhere. Access custom offline audio soundscapes, track daily habits automatically, and use secure visual guides for incorrect back bends.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-3.5 lg:justify-end">
            <button className="bg-slate-900 border border-transparent rounded-xl px-5 py-3 hover:bg-slate-800 flex items-center gap-2 transition-all shadow-md cursor-pointer">
              <Smartphone className="h-5 w-5 text-[#FF7A00]" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 leading-none">Get it on</p>
                <p className="text-xs font-bold leading-tight">Google PlayStore</p>
              </div>
            </button>
            <button className="bg-slate-900 border border-transparent rounded-xl px-5 py-3 hover:bg-slate-800 flex items-center gap-2 transition-all shadow-md cursor-pointer">
              <Download className="h-5 w-5 text-amber-500 animate-bounce" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-slate-400 leading-none">Download on</p>
                <p className="text-xs font-bold leading-tight">App Store</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-orange-50/20 text-left">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              {t.faqTitle || "Frequently Asked Questions"}
            </h2>
            <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = faqOpenIndex === i;
              return (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-950 rounded-2xl border transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#FF7A00] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
