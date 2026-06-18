import { useState, useEffect } from "react";
import { Compass, Moon, Sun, Globe, User, BookOpen, Menu, X, Flame } from "lucide-react";

interface NavbarProps {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: Record<string, string>;
}

export default function Navbar({
  currentLang,
  setCurrentLang,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  t,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
    { code: "gu", label: "ગુજરાતી" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Home" },
    { id: "finder", label: t.poseFinder || "Pose Finder" },
    { id: "tools", label: "Sadhana Tools" },
    { id: "ai-coach", label: "AI Yogi" },
    { id: "community", label: "Community" },
  ];

  return (
    <nav
      id="yogaveda-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 shadow-md py-3 backdrop-blur-md"
          : "bg-white/70 dark:bg-slate-900/70 py-5 backdrop-blur-sm"
      } border-b border-orange-100/30 dark:border-slate-800/50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="bg-[#FF7A00] text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <Compass className="h-6 w-6 animate-spin-slow" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-serif font-bold tracking-tight text-slate-800 dark:text-neutral-100 flex items-center">
                Yoga<span className="text-[#FF7A00] italic">Veda</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#FF7A00] uppercase">
                {t.subtitle ? t.subtitle.slice(0, 24) : "Authentic Guide"}...
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 lg:space-x-4 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-orange-50 dark:bg-slate-800 text-[#FF7A00] font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-[#FF7A00] hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Control Triggers */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-[#FF7A00] transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-orange-50 hover:text-[#FF7A00] transition-colors">
                <Globe className="h-4 w-4 text-[#FF7A00]" />
                <span>
                  {languages.find((l) => l.code === currentLang)?.label || "English"}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-orange-50 dark:border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                      currentLang === lang.code
                        ? "text-[#FF7A00] bg-orange-50/50 dark:bg-slate-700/50 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live User indicator */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-[#FF7A00]/5 dark:from-orange-500/20 dark:to-transparent px-3 py-2 rounded-xl border border-orange-200/40">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-100 font-medium">
                Sadhaka
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-[#FF7A00]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-orange-100 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-orange-50 dark:bg-slate-800 text-[#FF7A00] font-bold"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Mobile Languages */}
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-4 mb-2">
              Select Language
            </p>
            <div className="grid grid-cols-2 gap-2 px-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs text-center border transition-all ${
                    currentLang === lang.code
                      ? "border-[#FF7A00] bg-orange-50/40 text-[#FF7A00] font-bold"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
