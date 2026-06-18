import { useState } from "react";
import { Yogasana } from "../types";
import { Search, SlidersHorizontal, Eye, Flame, AlertCircle, ShieldAlert, Heart, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

interface AsanaSectionProps {
  asanas: Yogasana[];
  t: Record<string, string>;
  selectedAsanaId: string | null;
  setSelectedAsanaId: (id: string | null) => void;
  filteredCategory: string;
  setFilteredCategory: (cat: string) => void;
}

export default function AsanaSection({
  asanas,
  t,
  selectedAsanaId,
  setSelectedAsanaId,
  filteredCategory,
  setFilteredCategory,
}: AsanaSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [filterAnatomy, setFilterAnatomy] = useState<string>("All");
  const [detailTab, setDetailTab] = useState<"guide" | "mistakes" | "science">("guide");

  // Get distinct categories
  const categories = ["All", "Beginner Yoga", "Weight Loss Yoga", "Back Pain Relief Yoga", "Yoga for Diabetes", "Yoga for Stress & Anxiety", "Senior Citizen Yoga", "Kids Yoga", "Prenatal Yoga"];

  // Filter poses
  const filteredAsanas = asanas.filter((asana) => {
    const matchesSearch =
      asana.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asana.sanskritName.includes(searchQuery) ||
      asana.englishName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filteredCategory === "All" ||
      asana.category.toLowerCase().includes(filteredCategory.replace(" Yoga", "").toLowerCase());

    const matchesDifficulty =
      filterDifficulty === "All" || asana.difficulty === filterDifficulty;

    const matchesAnatomy =
      filterAnatomy === "All" ||
      asana.benefits.physical.some((b) => b.toLowerCase().includes(filterAnatomy.toLowerCase()));

    return matchesSearch && matchesCategory && matchesDifficulty && matchesAnatomy;
  });

  const selectedAsana = asanas.find((a) => a.id === selectedAsanaId);

  return (
    <section id="popular-asanas-section" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-neutral-100">
            {t.poseFinder || "Yoga Pose Finder"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.poseFinderSub || "Explore and filter standard postures, understanding anatomical precision holds and breathing patterns."}
          </p>
          <div className="w-16 h-1 bg-[#FF7A00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Dynamic Controls / Filters */}
        <div className="mt-10 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-orange-100/30 dark:border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, Sanskrit term, benefits..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-[#FF7A00] dark:text-white"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-3">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-[#FF7A00] dark:text-white"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Anatomical Area Filter */}
            <div className="md:col-span-4">
              <select
                value={filterAnatomy}
                onChange={(e) => setFilterAnatomy(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:border-[#FF7A00] dark:text-white"
              >
                <option value="All">All Target Anatomies</option>
                <option value="spine">Spine & Lumbar Column</option>
                <option value="thigh">Hips & Thigh opening</option>
                <option value="neck">Cervical & Upper neck</option>
                <option value="ankles">Ankles & Foot arches</option>
                <option value="muscles">Muscles & Posture core</option>
              </select>
            </div>
          </div>

          {/* Categories Row */}
          <div className="mt-6 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase mr-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Categories:
            </span>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilteredCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  filteredCategory === cat
                    ? "bg-[#FF7A00]/10 border-[#FF7A00] text-[#FF7A00] font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pose Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {filteredAsanas.map((asana) => (
            <div
              key={asana.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-orange-50/20 dark:border-slate-800 hover:border-[#FF7A00]/20 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Pose Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={asana.img}
                    alt={asana.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider text-[#FF7A00] uppercase shadow-sm">
                    {asana.difficulty}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-[#FF7A00] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                      {asana.sanskritName}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-slate-800 dark:text-neutral-100 font-bold mt-2">
                    {asana.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    English: {asana.englishName}
                  </p>
                  
                  {/* Key attributes */}
                  <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1">
                      ⏱️ {asana.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      🔥 {asana.caloriesPerMin} cal/m
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedAsanaId(asana.id);
                    setDetailTab("guide");
                  }}
                  className="w-full px-4 py-2.5 bg-orange-50 hover:bg-[#FF7A00] text-slate-800/90 dark:text-orange-100 hover:text-white dark:bg-slate-800 dark:hover:bg-[#FF7A00] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent hover:border-[#FF7A00]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.viewDetails || "View Details"}</span>
                </button>
              </div>
            </div>
          ))}

          {filteredAsanas.length === 0 && (
            <div className="col-span-full py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl text-center">
              <RefreshCw className="h-8 w-8 text-orange-200 animate-spin-slow mx-auto mb-3" />
              <p className="text-slate-400 dark:text-slate-500 font-medium">No Yogasanas match your search options.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterDifficulty("All");
                  setFilterAnatomy("All");
                  setFilteredCategory("All");
                }}
                className="mt-3 text-xs font-bold text-[#FF7A00] underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Detailed Modal Overlay (Acts as Yogasana Detail Page) */}
        {selectedAsana && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl max-h-[88vh] overflow-y-auto shadow-2xl border border-orange-50/10 p-6 sm:p-8 relative text-left">
              
              {/* Close button */}
              <button
                onClick={() => setSelectedAsanaId(null)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7A00]/10 text-slate-500 hover:text-[#FF7A00] flex items-center justify-center transition-colors font-bold text-lg cursor-pointer"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="md:col-span-4 rounded-2xl overflow-hidden h-40 bg-slate-100">
                  <img
                    src={selectedAsana.img}
                    alt={selectedAsana.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#FF7A00] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase">
                      {selectedAsana.sanskritName}
                    </span>
                    <span className="text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                      Level: {selectedAsana.difficulty}
                    </span>
                    <span className="text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                      Est. Burn: {selectedAsana.caloriesPerMin} cal / Min
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3.5xl font-serif font-bold text-slate-800 dark:text-neutral-100 mt-3">
                    {selectedAsana.name}
                  </h1>
                  <p className="text-sm text-slate-400 font-medium">
                    English name: <span className="italic">{selectedAsana.englishName}</span>
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    A deep traditional posture centered on balancing bodily pathways (Agni/Prana) and improving skeletal joints alignment.
                  </p>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 mt-6 gap-6">
                <button
                  onClick={() => setDetailTab("guide")}
                  className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    detailTab === "guide"
                      ? "border-[#FF7A00] text-[#FF7A00]"
                      : "border-transparent text-slate-400 hover:text-[#FF7A00]"
                  }`}
                >
                  🎛️ Practice Guide
                </button>
                <button
                  onClick={() => setDetailTab("mistakes")}
                  className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    detailTab === "mistakes"
                      ? "border-b-amber-500 text-amber-500"
                      : "border-transparent text-slate-400 hover:text-amber-500"
                  }`}
                >
                  ⚠️ Alignment Mistakes & Warnings
                </button>
                <button
                  onClick={() => setDetailTab("science")}
                  className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                    detailTab === "science"
                      ? "border-b-emerald-500 text-emerald-500"
                      : "border-transparent text-slate-400 hover:text-emerald-500"
                  }`}
                >
                  🧪 Clinical Scientific Research
                </button>
              </div>

              {/* Tab Contents */}
              <div className="mt-6">
                {/* 1. Guide Tab */}
                {detailTab === "guide" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-700 dark:text-slate-300">
                    
                    {/* Instructions List */}
                    <div className="lg:col-span-7">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-[#FF7A00] mb-3 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4" /> {t.stepByStep || "Step-by-Step Instructions"}
                      </h3>
                      <ol className="space-y-3.5">
                        {selectedAsana.instructions.map((step, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs sm:text-sm leading-relaxed">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] flex items-center justify-center font-bold font-mono text-[11px]">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* hold duration & benefits */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-orange-50/40 dark:bg-slate-800/40 rounded-2xl p-4 border border-orange-100/30">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#FF7A00]">
                          💨 {t.breathingPattern || "Breathing Pattern"}
                        </h4>
                        <div className="mt-3.5 space-y-2 text-xs">
                          <p className="flex items-start gap-1">
                            <span className="text-[#FF7A00] font-bold">Inhale:</span> {selectedAsana.breathing.inhale}
                          </p>
                          {selectedAsana.breathing.hold && (
                            <p className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold">Hold:</span> {selectedAsana.breathing.hold}
                            </p>
                          )}
                          <p className="flex items-start gap-1">
                            <span className="text-[#FF7A00] font-bold">Exhale:</span> {selectedAsana.breathing.exhale}
                          </p>
                        </div>
                      </div>

                      {/* Benefits splits */}
                      <div>
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                          🎯 hold benefits splits
                        </h4>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg text-xs leading-relaxed">
                            <span className="font-bold text-slate-700 dark:text-slate-200 block border-b pb-0.5 mb-1">
                              Physical Anatomy
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {selectedAsana.benefits.physical.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg text-xs leading-relaxed">
                            <span className="font-bold text-[#FF7A00] block border-b pb-0.5 mb-1">
                              Nervous / Mind (Mental)
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {selectedAsana.benefits.mental.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg text-xs leading-relaxed">
                            <span className="font-bold text-emerald-600 block border-b pb-0.5 mb-1">
                              Clinical Medical Impact
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {selectedAsana.benefits.medical.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Mistakes & Precautions */}
                {detailTab === "mistakes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 dark:text-slate-300">
                    
                    {/* Common Mistakes */}
                    <div className="bg-amber-50/20 dark:bg-slate-800/20 p-5 rounded-2xl border border-amber-100/30">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4" /> {t.commonMistakes || "Common Mistakes to Avoid"}
                      </h3>
                      <ul className="space-y-3">
                        {selectedAsana.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex gap-2 text-xs sm:text-sm leading-relaxed">
                            <span className="text-amber-500 font-bold flex-shrink-0">✖</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* precautions / Avoid If */}
                    <div className="bg-rose-50/20 dark:bg-slate-800/20 p-5 rounded-2xl border border-rose-100/30">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5 font-bold">
                        <ShieldAlert className="h-4 w-4" /> {t.avoidIf || "Avoid Practice If (Precautions)"}
                      </h3>
                      <ul className="space-y-3">
                        {selectedAsana.precautions.map((prec, i) => (
                          <li key={i} className="flex gap-2 text-xs sm:text-sm leading-relaxed">
                            <span className="text-rose-500 font-bold flex-shrink-0">⚠️</span>
                            <span>{prec}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 rounded-xl flex items-start gap-1.5">
                        <span className="text-xs text-rose-600 font-medium">
                          If pregnant, recovering from recent hernia operations, high blood pressure flares, or acute spine herniations, consult your physician before attempting holds.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Research & Citations */}
                {detailTab === "science" && (
                  <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/40 text-slate-700 dark:text-slate-300">
                    <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5 font-bold">
                      🔬 {t.scientificResearch || "Scientific Clinical Evidence"}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed border-l-4 border-emerald-500 pl-4 py-1 italic font-medium">
                      "{selectedAsana.scientificEvidence.summary}"
                    </p>

                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mt-6 mb-3">
                      Citations & Peer-Reviewed Literature
                    </h4>
                    <ul className="space-y-3">
                      {selectedAsana.scientificEvidence.citations.map((cite, i) => (
                        <li key={i} className="text-xs flex items-start gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border">
                          <span className="text-[#FF7A00] font-bold">[{i + 1}]</span>
                          <div>
                            <p className="font-semibold">{cite}</p>
                            <a
                              href="https://pubmed.ncbi.nlm.nih.gov/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#FF7A00] underline mt-0.5 block inline-block"
                            >
                              Search indexing on PubMed
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Related Asanas footer */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                <span className="text-xs font-mono text-slate-400 uppercase mr-3">
                  🔗 Related Asanas:
                </span>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {selectedAsana.relatedAsanas.map((relId) => {
                    const match = asanas.find((a) => a.id === relId);
                    if (!match) return null;
                    return (
                      <button
                        key={relId}
                        onClick={() => {
                          setSelectedAsanaId(relId);
                          setDetailTab("guide");
                        }}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs font-semibold rounded-lg hover:bg-orange-50 hover:text-[#FF7A00] border transition-colors cursor-pointer"
                      >
                        {match.name} ({match.sanskritName})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
