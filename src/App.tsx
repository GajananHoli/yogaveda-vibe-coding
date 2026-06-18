import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import AsanaSection from "./components/AsanaSection";
import BreathingSection from "./components/BreathingSection";
import InteractiveTools from "./components/InteractiveTools";
import AiCoach from "./components/AiCoach";
import MiscSections from "./components/MiscSections";
import Footer from "./components/Footer";

// Data bindings
import {
  translations,
  yogasanasData,
  healthConditionsData,
  instructorsData,
  scientificArticlesData,
  blogPostsData,
  forumPostsData,
  challengesData,
  badgesData,
} from "./data";
import { ForumPost, Badge } from "./types";

export default function App() {
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedAsanaId, setSelectedAsanaId] = useState<string | null>(null);
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  // Local state for forum queries and milestones
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(forumPostsData);
  const [badges, setBadges] = useState<Badge[]>(badgesData);

  // Apply dark mode CSS class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load unlocked milestones from local storage if existing
  useEffect(() => {
    const savedBadges = localStorage.getItem("yogaveda-unlocked-badges");
    if (savedBadges) {
      try {
        const unlockedIds = JSON.parse(savedBadges) as string[];
        setBadges((prev) =>
          prev.map((b) => ({
            ...b,
            unlocked: unlockedIds.includes(b.id) || b.unlocked,
          }))
        );
      } catch (err) {}
    }
  }, []);

  const updateBadges = (badgeId: string) => {
    setBadges((prev) => {
      const updated = prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));
      const unlockedIds = updated.filter((b) => b.unlocked).map((b) => b.id);
      localStorage.setItem("yogaveda-unlocked-badges", JSON.stringify(unlockedIds));
      return updated;
    });
  };

  const addForumPost = (title: string, content: string, category: string) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: "Sadhaka Shanti",
      avatar: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=100",
      role: "Sadhaka",
      title,
      content,
      category,
      time: "Just now",
      likes: 1,
      replies: 0,
    };
    setForumPosts([newPost, ...forumPosts]);
  };

  // Get active translation record dictionary
  const t = translations[currentLang] || translations["en"];

  // Callback from Category Cards
  const handleCategorySelect = (categoryName: string) => {
    setFilteredCategory(categoryName);
    // Smoothly scroll down to the finder section
    const finderSection = document.getElementById("popular-asanas-section");
    if (finderSection) {
      finderSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreAsanasClick = () => {
    setFilteredCategory("All");
    const finderSection = document.getElementById("popular-asanas-section");
    if (finderSection) {
      finderSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] dark:bg-slate-950 text-slate-800 dark:text-neutral-100 transition-colors duration-300 antialiased font-sans">
      
      {/* 1. Header Navigation Option */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        t={t}
      />

      {/* 2. Main Tab View Controllers */}
      {activeTab === "dashboard" ? (
        <div className="space-y-0">
          
          {/* Hero */}
          <Hero
            t={t}
            setActiveTab={setActiveTab}
            onExploreClick={handleExploreAsanasClick}
          />

          {/* Yoga Category cards */}
          <CategorySection
            t={t}
            onCategorySelect={handleCategorySelect}
          />

          {/* Core Yoga Pose list with detail card handles */}
          <AsanaSection
            asanas={yogasanasData}
            t={t}
            selectedAsanaId={selectedAsanaId}
            setSelectedAsanaId={setSelectedAsanaId}
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
          />

          {/* Breathing Techniques Sanctuary */}
          <BreathingSection t={t} currentLang={currentLang} />

          {/* Sadhana tools - BMI / Calories / Habit list / Timer */}
          <InteractiveTools
            asanas={yogasanasData}
            badges={badges}
            updateBadges={updateBadges}
            t={t}
          />

          {/* AI Coach recommendation Form + Clinician Consultation Chat block */}
          <AiCoach t={t} />

          {/* Timelines, Expert Teachers, Challenges, clinical citations, communities */}
          <MiscSections
            instructors={instructorsData}
            researchArticles={scientificArticlesData}
            blogPosts={blogPostsData}
            challenges={challengesData}
            forumPosts={forumPosts}
            addForumPost={addForumPost}
            t={t}
          />
        </div>
      ) : activeTab === "finder" ? (
        <div className="pt-24 min-h-[70vh]">
          <AsanaSection
            asanas={yogasanasData}
            t={t}
            selectedAsanaId={selectedAsanaId}
            setSelectedAsanaId={setSelectedAsanaId}
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
          />
        </div>
      ) : activeTab === "tools" ? (
        <div className="pt-24 min-h-[70vh]">
          <InteractiveTools
            asanas={yogasanasData}
            badges={badges}
            updateBadges={updateBadges}
            t={t}
          />
        </div>
      ) : activeTab === "ai-coach" ? (
        <div className="pt-24 min-h-[70vh]">
          <AiCoach t={t} />
        </div>
      ) : (
        /* Community Tab */
        <div className="pt-24 min-h-[70vh] bg-white dark:bg-slate-900 pb-12">
          <MiscSections
            instructors={instructorsData}
            researchArticles={scientificArticlesData}
            blogPosts={blogPostsData}
            challenges={challengesData}
            forumPosts={forumPosts}
            addForumPost={addForumPost}
            t={t}
          />
        </div>
      )}

      {/* 3. Footer branding disclosure */}
      <Footer t={t} />
    </div>
  );
}
