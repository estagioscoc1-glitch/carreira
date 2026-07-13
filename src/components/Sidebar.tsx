import React from "react";
import { 
  LayoutDashboard, MessageSquareText, FileUser, Headset, BookOpen, User, Settings, LogOut, Sparkles, Award, GraduationCap, Briefcase 
} from "lucide-react";
import LynxLogo from "./LynxLogo";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  studentName: string;
  studentCourse: string;
  avatarUrl?: string;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  onLogout, 
  studentName, 
  studentCourse,
  avatarUrl 
}: SidebarProps) {
  
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

  return (
    <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col justify-between border-r border-slate-800 relative z-30" id="app-sidebar">
      <div>
        {/* Brand/Logo Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-center">
          <LynxLogo size="sm" />
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2.5">Menu Principal</span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 group relative cursor-pointer ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 pl-2" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                id={`sidebar-tab-${item.id}`}
              >
                <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
                <span>{item.label}</span>
                
                {/* Visual marker */}
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-800/40 rounded-xl mb-3 border border-slate-800/60">
          <img 
            src={avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(studentName)}`}
            alt={studentName}
            className="w-10 h-10 rounded-lg bg-slate-700 p-0.5 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white truncate">{studentName}</h4>
            <p className="text-[10px] text-slate-400 truncate font-mono">{studentCourse}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
          id="sidebar-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  );
}
