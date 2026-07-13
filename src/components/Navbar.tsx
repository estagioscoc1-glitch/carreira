import React, { useState } from "react";
import { 
  Menu, X, Bell, User, LogOut, LayoutDashboard, MessageSquareText, FileUser, Headset, BookOpen, Settings, Sparkles, Award, GraduationCap, Briefcase,
  Sun, Moon
} from "lucide-react";
import LynxLogo from "./LynxLogo";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  studentName: string;
  studentCourse: string;
  avatarUrl?: string;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  studentName, 
  studentCourse,
  avatarUrl,
  onLogout,
  isDarkMode,
  setIsDarkMode
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getTabTitle = () => {
    switch (currentTab) {
      case "dashboard": return "Painel Principal";
      case "tutor": return "Tutor Acadêmico de IA";
      case "meututor": return "Meu Tutor IA";
      case "rh": return "Cursos & Treinamentos (LMS)";
      case "chat": return "Assistente de Carreira IA";
      case "concursos": return "Simulados de Concursos";
      case "resume": return "Currículo Inteligente";
      case "interview": return "Simulador de Entrevistas";
      case "library": return "Biblioteca Digital";
      case "profile": return "Perfil Profissional";
      case "settings": return "Configurações";
      default: return "Plataforma OC";
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tutor", label: "Tutor Acadêmico", icon: GraduationCap },
    { id: "meututor", label: "Meu Tutor", icon: Sparkles },
    { id: "rh", label: "Cursos / LMS", icon: Briefcase },
    { id: "chat", label: "Assistente IA", icon: MessageSquareText },
    { id: "concursos", label: "Simulados Concurso", icon: Award },
    { id: "resume", label: "Currículo", icon: FileUser },
    { id: "interview", label: "Entrevistas", icon: Headset },
    { id: "library", label: "Biblioteca", icon: BookOpen },
    { id: "profile", label: "Perfil", icon: User },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const demoNotifications = [
    { id: 1, title: "Novo livro disponível!", desc: "Leia o 'Manual da Entrevista Perfeita' na sua biblioteca." },
    { id: 2, title: "Dica do dia", desc: "Use o Assistente de Carreira IA para aprimorar seu objetivo profissional hoje." }
  ];

  return (
    <header className="bg-white border-b border-slate-200 h-16 shrink-0 flex items-center justify-between px-4 md:px-8 relative z-40" id="app-navbar">
      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 outline-none"
          id="navbar-mobile-toggle"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {/* Brand for Mobile */}
        <div className="flex items-center">
          <LynxLogo size="sm" lightMode={!isDarkMode} />
        </div>
      </div>

      {/* Desktop Title */}
      <div className="hidden md:flex items-center gap-2">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight" id="navbar-view-title">{getTabTitle()}</h1>
        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-100">
          ALUNO LYNX EDU
        </span>
      </div>

      {/* Notification and Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition outline-none cursor-pointer"
          title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          id="navbar-theme-toggle"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition outline-none relative cursor-pointer"
            id="navbar-notif-btn"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
              <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Notificações</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Ativo</span>
                </div>
                <div className="space-y-2">
                  {demoNotifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition">
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <h4 className="text-xs font-bold text-slate-800 leading-none">{studentName}</h4>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">{studentCourse}</span>
          </div>
          <button
            onClick={() => setCurrentTab("profile")}
            className="p-0.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200/60 transition outline-none cursor-pointer"
            id="navbar-profile-avatar"
          >
            <img 
              src={avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(studentName)}`}
              alt={studentName}
              className="w-8 h-8 rounded-lg bg-slate-50 object-cover"
            />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          {/* Menu Drawer */}
          <div className="fixed top-0 left-0 w-64 h-full bg-slate-900 text-white z-50 md:hidden flex flex-col justify-between p-4 shadow-2xl animate-slide-right">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center">
                  <LynxLogo size="sm" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isActive 
                          ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500" 
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
