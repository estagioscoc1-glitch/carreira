import React, { useState, useEffect } from "react";
import { User } from "./types";
import { LocalDB } from "./db";

// View Components
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardView from "./components/DashboardView";
import ChatView from "./components/ChatView";
import ResumeView from "./components/ResumeView";
import InterviewView from "./components/InterviewView";
import LibraryView from "./components/LibraryView";
import ConcursosView from "./components/ConcursosView";
import TutorView from "./components/TutorView";
import MeuTutorView from "./components/MeuTutorView";
import LmsView from "./components/LmsView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import LynxLogo from "./components/LynxLogo";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [checkingSession, setCheckingSession] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Check active session on mount
  useEffect(() => {
    const active = LocalDB.getSessionUser();
    if (active) {
      setUser(active);
    }
    setCheckingSession(false);
  }, []);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    LocalDB.setSessionUser(null);
    setUser(null);
    setCurrentTab("dashboard");
  };

  const handleProfileUpdate = (updatedFields: Partial<User> | User) => {
    if (!user) return;
    
    // Perform partial update or direct replace
    const updated = LocalDB.updateProfile(user.id, updatedFields);
    setUser(updated);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center gap-6" id="app-loading">
        <LynxLogo size="lg" />
        <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">Iniciando ambiente seguro...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" id="app-viewport">
      {/* Sidebar for Desktop */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onLogout={handleLogout}
        studentName={user.name}
        studentCourse={user.course}
        avatarUrl={user.avatarUrl}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          studentName={user.name}
          studentCourse={user.course}
          avatarUrl={user.avatarUrl}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Content Panel Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col" id="app-main-content">
          <div className="flex-1">
            {currentTab === "dashboard" && (
              <DashboardView user={user} setCurrentTab={setCurrentTab} />
            )}

            {currentTab === "chat" && (
              <ChatView user={user} />
            )}

            {currentTab === "resume" && (
              <ResumeView user={user} onProfileUpdate={handleProfileUpdate} />
            )}

            {currentTab === "interview" && (
              <InterviewView user={user} />
            )}

            {currentTab === "concursos" && (
              <ConcursosView user={user} />
            )}

            {currentTab === "tutor" && (
              <TutorView user={user} />
            )}

            {currentTab === "meututor" && (
              <MeuTutorView user={user} />
            )}

            {currentTab === "rh" && (
              <LmsView user={user} />
            )}

            {currentTab === "library" && (
              <LibraryView user={user} />
            )}

            {currentTab === "profile" && (
              <ProfileView user={user} onProfileUpdate={setUser} />
            )}

            {currentTab === "settings" && (
              <SettingsView user={user} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />
            )}
          </div>

          {/* Footer of the site */}
          <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 shrink-0">
            <div className="font-medium text-slate-500">
              Lynx EDU Sistemas Escolares Inteligentes • © 2026
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Plataforma OC Carreira IA • Sistema de Orientação Profissional
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
