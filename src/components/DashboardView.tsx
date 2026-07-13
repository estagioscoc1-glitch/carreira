import React, { useState, useEffect } from "react";
import { User } from "../types";
import { LocalDB } from "../db";
import { 
  Sparkles, MessageSquareText, FileUser, Headset, BookOpen, ChevronRight, Trophy, Briefcase, Target, CheckCircle, ArrowUpRight, Award, Zap, Star,
  Calendar, TrendingUp, CheckSquare, ListTodo, Clock, GraduationCap, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

interface DashboardViewProps {
  user: User;
  setCurrentTab: (tab: string) => void;
}

export default function DashboardView({ user, setCurrentTab }: DashboardViewProps) {
  const profilePercent = LocalDB.getProfileCompletion(user);
  const [hoveredMetric, setHoveredMetric] = useState<"none" | "profile" | "resume" | "interview">("none");
  const [chartView, setChartView] = useState<"goals" | "hours" | "breakdown">("goals");
  const { score, profilePoints, resumePoints, interviewPoints, level, tips } = LocalDB.getOCScore(user);

  // Dynamic weekly tracker calculations using user's database actions
  const interviewsCount = LocalDB.getInterviewHistory(user.id).filter(i => i.completed).length;
  const docsCount = LocalDB.getKBDocuments(user.id).length;
  const resumeSaved = !!LocalDB.getSavedResume(user.id);

  // Completed activities checks count
  const profileStepsFilled = [
    !!user.name && !!user.email,
    !!user.course && !!user.city,
    !!user.objective,
    !!user.skills && !!user.languages,
    !!user.experience
  ].filter(Boolean).length;

  // Career Readiness progress metrics
  const resume = LocalDB.getSavedResume(user.id);
  let resumePercent = 0;
  if (resume) {
    const resumeFields = [
      resume.summary,
      resume.experience,
      resume.skills,
      resume.courses,
      resume.objective
    ];
    const filledCount = resumeFields.filter(f => f && f.toString().trim().length > 0).length;
    resumePercent = Math.round((filledCount / resumeFields.length) * 100);
  } else {
    const userFields = [
      user.objective,
      user.skills,
      user.experience,
      user.courses
    ];
    const filledCount = userFields.filter(f => f && f.toString().trim().length > 0).length;
    resumePercent = Math.round((filledCount / userFields.length) * 100);
  }

  const interviewPercent = Math.min(100, interviewsCount * 50); // 50% for first, 100% for 2 or more completed simulations
  const readinessPercent = Math.round((profilePercent + resumePercent + interviewPercent) / 3);

  // Toast notification state and logic
  interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: "badge" | "milestone";
    iconName: "star" | "award" | "trophy" | "zap" | "trending";
  }

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const notifiedKey = `oc-career-notified-${user.id}`;
    let notifiedList: string[] = [];
    try {
      const stored = localStorage.getItem(notifiedKey);
      if (stored) {
        notifiedList = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    const currentNotifications: { id: string; title: string; message: string; type: "badge" | "milestone"; iconName: "star" | "award" | "trophy" | "zap" | "trending" }[] = [];

    // Check milestones
    if (readinessPercent >= 10) {
      currentNotifications.push({
        id: "milestone-10",
        title: "Marco: 10% de Prontidão! 🚀",
        message: "Primeiro passo dado rumo ao seu futuro profissional!",
        type: "milestone",
        iconName: "zap"
      });
    }
    if (readinessPercent >= 50) {
      currentNotifications.push({
        id: "milestone-50",
        title: "Marco: Metade do Caminho! ⚡",
        message: "Você ultrapassou 50% de preparação para o mercado de trabalho!",
        type: "milestone",
        iconName: "trending"
      });
    }
    if (readinessPercent >= 80) {
      currentNotifications.push({
        id: "milestone-80",
        title: "Marco: Nível de Elite! 🔥",
        message: "Sua preparação está avançada. Você se destaca da maioria!",
        type: "milestone",
        iconName: "trending"
      });
    }
    if (readinessPercent === 100) {
      currentNotifications.push({
        id: "milestone-100",
        title: "Marco: 100% Pronto! 🎓🎉",
        message: "Fantástico! Você completou toda a sua jornada de preparação profissional!",
        type: "milestone",
        iconName: "trophy"
      });
    }

    // Check badges
    if (readinessPercent >= 20) {
      currentNotifications.push({
        id: "badge-starter",
        title: "Selo Conquistado: Aspirante OC! 🌟",
        message: "Parabéns! Mapeamento inicial do seu perfil concluído com sucesso.",
        type: "badge",
        iconName: "star"
      });
    }
    if (readinessPercent >= 60) {
      currentNotifications.push({
        id: "badge-pro",
        title: "Selo Conquistado: Foco Profissional! 🎖️",
        message: "Currículo estruturado de alto nível e otimizado com nossa IA.",
        type: "badge",
        iconName: "award"
      });
    }
    if (readinessPercent >= 90) {
      currentNotifications.push({
        id: "badge-ready",
        title: "Selo Conquistado: Pronto pro Mercado! 🏆",
        message: "Incrível! Você concluiu todos os treinamentos e simulações com sucesso.",
        type: "badge",
        iconName: "trophy"
      });
    }

    // Filter to find new ones
    const newNotifiedList = [...notifiedList];
    const newToastsToTrigger: ToastNotification[] = [];

    currentNotifications.forEach(notif => {
      if (!notifiedList.includes(notif.id)) {
        newNotifiedList.push(notif.id);
        newToastsToTrigger.push({
          id: `${notif.id}-${Date.now()}`, // unique runtime ID
          title: notif.title,
          message: notif.message,
          type: notif.type,
          iconName: notif.iconName
        });
      }
    });

    if (newToastsToTrigger.length > 0) {
      // Save updated list back to localStorage
      try {
        localStorage.setItem(notifiedKey, JSON.stringify(newNotifiedList));
      } catch (e) {
        console.error(e);
      }

      // Add to toast state with short delays for stacking nicely if multiple are triggered
      newToastsToTrigger.forEach((toast, index) => {
        setTimeout(() => {
          setToasts(prev => [...prev, toast]);
          
          // Auto dismiss after 7 seconds
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
          }, 7000);
        }, index * 400); // slight delay between multiple notifications
      });
    }
  }, [readinessPercent, user.id]);

  const getToastIcon = (iconName: string) => {
    const baseClass = "w-5 h-5";
    switch (iconName) {
      case "star":
        return <Star className={`${baseClass} text-amber-500 fill-amber-500`} />;
      case "award":
        return <Award className={`${baseClass} text-indigo-500`} />;
      case "trophy":
        return <Trophy className={`${baseClass} text-emerald-500`} />;
      case "zap":
        return <Zap className={`${baseClass} text-amber-500 fill-amber-500`} />;
      case "trending":
        return <TrendingUp className={`${baseClass} text-blue-500`} />;
      default:
        return <CheckCircle className={`${baseClass} text-blue-500`} />;
    }
  };

  const weeklyActivitiesData = [
    { 
      day: "Seg", 
      "Metas": 2, 
      "Concluidas": Math.min(2, profileStepsFilled > 0 ? profileStepsFilled : 1), 
      "Horas": profileStepsFilled > 0 ? profileStepsFilled * 0.8 : 0.5,
      "Pontos": Math.round((profilePercent / 100) * 150),
      "Detalhe": "Preenchimento de dados de perfil"
    },
    { 
      day: "Ter", 
      "Metas": 2, 
      "Concluidas": docsCount > 0 ? Math.min(3, docsCount + 1) : 1, 
      "Horas": docsCount > 0 ? docsCount * 1.2 : 0.4,
      "Pontos": docsCount > 0 ? 100 : 20,
      "Detalhe": "Subida de editais e apostilas"
    },
    { 
      day: "Qua", 
      "Metas": 3, 
      "Concluidas": resumeSaved ? 3 : 1, 
      "Horas": resumeSaved ? 2.5 : 0.6,
      "Pontos": resumeSaved ? 150 : 30,
      "Detalhe": "Criação de currículo otimizado por IA"
    },
    { 
      day: "Qui", 
      "Metas": 2, 
      "Concluidas": user.skills ? 2 : 1, 
      "Horas": user.skills ? 1.5 : 0.5,
      "Pontos": user.skills ? 80 : 15,
      "Detalhe": "Definição de soft & hard skills"
    },
    { 
      day: "Sex", 
      "Metas": 3, 
      "Concluidas": interviewsCount > 0 ? Math.min(4, interviewsCount * 2) : 1, 
      "Horas": interviewsCount > 0 ? interviewsCount * 1.8 : 0.8,
      "Pontos": interviewPoints > 0 ? interviewPoints : 50,
      "Detalhe": "Treinamento com o Simulador de Entrevista"
    },
    { 
      day: "Sáb", 
      "Metas": 2, 
      "Concluidas": (interviewsCount > 0 || docsCount > 0) ? 2 : 1, 
      "Horas": (interviewsCount > 0 || docsCount > 0) ? 3.0 : 1.0,
      "Pontos": Math.round(score * 0.4),
      "Detalhe": "Revisão de relatórios de feedback IA"
    },
    { 
      day: "Dom", 
      "Metas": 1, 
      "Concluidas": score >= 500 ? 1 : 0, 
      "Horas": score >= 500 ? 1.5 : 0.2,
      "Pontos": Math.round(score * 0.1),
      "Detalhe": "Planejamento de novas candidaturas"
    }
  ];

  const totalMetas = weeklyActivitiesData.reduce((acc, curr) => acc + curr.Metas, 0);
  const totalConcluidas = weeklyActivitiesData.reduce((acc, curr) => acc + curr["Concluidas"], 0);
  const totalHoras = Number(weeklyActivitiesData.reduce((acc, curr) => acc + curr.Horas, 0).toFixed(1));
  const performanceRate = Math.round((totalConcluidas / totalMetas) * 100);

  // Active level theme variables
  const theme = {
    "Iniciante": {
      color: "text-amber-400",
      accent: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      bg: "stroke-slate-800",
      desc: "Você está dando os primeiros passos rumo ao mercado!"
    },
    "Intermediário": {
      color: "text-sky-400",
      accent: "bg-sky-500/10 text-sky-300 border-sky-500/20",
      bg: "stroke-slate-800",
      desc: "Excelente! Continue preenchendo dados e treinando para evoluir."
    },
    "Avançado": {
      color: "text-indigo-400",
      accent: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      bg: "stroke-slate-800",
      desc: "Grande destaque! Seu perfil está muito próximo do ideal."
    },
    "Pronto para o Mercado": {
      color: "text-emerald-400",
      accent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      bg: "stroke-slate-800",
      desc: "Sensacional! Perfil de alto nível totalmente pronto para contratação!"
    }
  }[level];

  // Radial configurations
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 1000) * circumference;

  // Quick access configurations
  const quickAccess = [
    {
      id: "chat",
      title: "Assistente IA",
      desc: "Tire dúvidas sobre mercado de trabalho e receba feedback em tempo real de carreira.",
      icon: MessageSquareText,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      btnText: "Iniciar Conversa"
    },
    {
      id: "tutor",
      title: "Tutor Acadêmico de IA",
      desc: "Tire dúvidas teóricas profundas das disciplinas com professor IA treinado na sua área.",
      icon: GraduationCap,
      color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      btnText: "Estudar com Professor"
    },
    {
      id: "concursos",
      title: "Simulado Concurso",
      desc: "Estude com questões de concursos da saúde recentes, gabarite provas e veja sua nota.",
      icon: Award,
      color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      btnText: "Iniciar Simulado"
    },
    {
      id: "resume",
      title: "Currículo Inteligente",
      desc: "Preencha seus dados e gere um currículo premium otimizado por Inteligência Artificial.",
      icon: FileUser,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      btnText: "Editar & Gerar"
    },
    {
      id: "interview",
      title: "Simulador de Entrevista",
      desc: "Treine respostas para perguntas reais de recrutadores e receba avaliação com IA.",
      icon: Headset,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      btnText: "Começar Simulação"
    },
    {
      id: "library",
      title: "Biblioteca de Carreira",
      desc: "Acesse e leia manuais, dicas de LinkedIn, modelos de currículo e técnicas de oratória.",
      icon: BookOpen,
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      btnText: "Explorar Livros"
    }
  ];

  // Check which profile fields are filled
  const profileChecks = [
    { label: "Dados Básicos (Nome, Email)", done: !!user.name && !!user.email },
    { label: "Curso & Cidade", done: !!user.course && !!user.city },
    { label: "Objetivo Profissional", done: !!user.objective },
    { label: "Competências & Idiomas", done: !!user.skills && !!user.languages },
    { label: "Experiência ou Projetos", done: !!user.experience }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-2" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500 rounded-full filter blur-3xl opacity-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-800/60 text-blue-200 border border-blue-700/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Plataforma Exclusiva Lynx EDU
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-sans font-extrabold tracking-tight">
              Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">{user.name}</span>! 👋
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5 font-medium">
              Pronto para alavancar seu futuro profissional? Selecionamos as melhores ferramentas para você hoje.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
                Curso: <strong className="text-white">{user.course}</strong>
              </div>
              {user.city && (
                <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300">
                  Cidade: <strong className="text-white">{user.city}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab("chat")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-600/10 flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Falar com Assistente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Career Readiness Progress Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs relative overflow-hidden" id="career-readiness-section">
        {/* Decorative subtle background accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full filter blur-2xl"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 mb-2">
                <Target className="w-3.5 h-3.5 text-blue-500" /> Indicador de Carreira
              </div>
              <h3 className="text-xl font-sans font-extrabold text-slate-800 tracking-tight">
                Status de Prontidão para o Mercado
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Seu nível de preparação geral com base no preenchimento do perfil, currículo gerado e simulações de entrevista feitas com nossa Inteligência Artificial.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Prontidão Geral</span>
              <span className="text-4xl font-black text-slate-800 tracking-tight">{readinessPercent}%</span>
            </div>
          </div>

          {/* Large overall readiness progress bar */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${readinessPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
              <span>Nível Inicial</span>
              <span className={readinessPercent >= 40 ? "text-blue-600 font-bold" : ""}>Perfil Mapeado</span>
              <span className={readinessPercent >= 75 ? "text-indigo-600 font-bold" : ""}>Currículo Otimizado</span>
              <span className={readinessPercent === 100 ? "text-emerald-600 font-bold" : ""}>Pronto para o Mercado! 🎉</span>
            </div>
          </div>

          {/* Badges system */}
          <div className="border-t border-b border-slate-100 py-5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Selo de Conquistas (Metas Desbloqueadas)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Badge 1: Starter */}
              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-300 ${
                readinessPercent >= 20 
                  ? "bg-amber-50/60 border-amber-200/80 hover:bg-amber-50" 
                  : "bg-slate-50/40 border-slate-200/40 opacity-60"
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                  readinessPercent >= 20 
                    ? "bg-amber-100 text-amber-700 ring-4 ring-amber-50" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800">Aspirante OC</h4>
                    {readinessPercent >= 20 ? (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded-full">Desbloqueado</span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">20% Necessário</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Mapeamento inicial do perfil concluído</p>
                </div>
              </div>

              {/* Badge 2: Pro */}
              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-300 ${
                readinessPercent >= 60 
                  ? "bg-indigo-50/60 border-indigo-200/80 hover:bg-indigo-50" 
                  : "bg-slate-50/40 border-slate-200/40 opacity-60"
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                  readinessPercent >= 60 
                    ? "bg-indigo-100 text-indigo-700 ring-4 ring-indigo-50" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800">Foco Profissional</h4>
                    {readinessPercent >= 60 ? (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/60 px-1.5 py-0.2 rounded-full">Desbloqueado</span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">60% Necessário</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Currículo estruturado e exportado</p>
                </div>
              </div>

              {/* Badge 3: Ready */}
              <div className={`flex items-center gap-3 p-3 rounded-2xl border transition duration-300 ${
                readinessPercent >= 90 
                  ? "bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50" 
                  : "bg-slate-50/40 border-slate-200/40 opacity-60"
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                  readinessPercent >= 90 
                    ? "bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800">Pronto pro Mercado</h4>
                    {readinessPercent >= 90 ? (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded-full">Desbloqueado</span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400">90% Necessário</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">Treino completo de simulação de entrevista</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subsections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* 1. Profile section */}
            <div className="bg-slate-50/60 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 transition duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/10">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    profilePercent === 100 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {profilePercent}% Completo
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dados do Perfil</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Preencha suas experiências, cursos extracurriculares e competências principais.
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${profilePercent}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab("profile")}
                className="w-full mt-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 hover:border-slate-300 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Editar Perfil</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* 2. Resume section */}
            <div className="bg-slate-50/60 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 transition duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/10">
                    <FileUser className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    resumePercent === 100 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : resumePercent > 0 
                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {resumePercent === 0 ? "Não Iniciado" : `${resumePercent}% Completo`}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Currículo Inteligente</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Elabore o currículo com as seções estruturadas e receba otimização de IA de alta qualidade.
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${resumePercent}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab("resume")}
                className="w-full mt-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 hover:border-slate-300 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Gerar Currículo IA</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* 3. Interview section */}
            <div className="bg-slate-50/60 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 transition duration-300">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/10">
                    <Headset className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    interviewPercent === 100 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : interviewPercent > 0 
                        ? "bg-emerald-50/60 text-emerald-600 border border-emerald-100/50"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {interviewPercent === 0 ? "Não Iniciado" : `${interviewPercent}% Treinado`}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Simulador de Entrevista</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Treine respostas para perguntas de processos seletivos reais e receba feedback em áudio e texto.
                  </p>
                </div>

                {/* Progress Mini Bar */}
                <div className="h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${interviewPercent}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab("interview")}
                className="w-full mt-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 hover:border-slate-300 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Treinar Entrevista</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Completion Bento Box */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between" id="profile-progress-card">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Seu Perfil Profissional</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {profilePercent}% Completo
              </span>
            </div>

            {/* Progress Circular/Bar Visual */}
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-emerald-500`}
                style={{ width: `${profilePercent}%` }}
              ></div>
            </div>

            {/* Checklist of filled properties */}
            <div className="space-y-2.5">
              {profileChecks.map((check, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <CheckCircle className={`w-4 h-4 shrink-0 ${check.done ? "text-emerald-500" : "text-slate-300"}`} />
                  <span className={check.done ? "text-slate-700 font-medium" : "text-slate-400"}>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab("profile")}
            className="w-full mt-6 py-2.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <span>Preencher Perfil Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* OC Score Gamified System Bento Card */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-6 rounded-2xl text-white flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden" id="oc-score-dashboard-card">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full filter blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-2xl -ml-10 -mb-10"></div>
          
          <div className="space-y-5">
            {/* Title / Header */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Índice de Empregabilidade</span>
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  <Trophy className="w-5 h-5 text-amber-400" /> Sistema OC Score
                </h3>
              </div>
              <span className={`text-[10px] border font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${theme.accent}`}>
                {level}
              </span>
            </div>

            {/* Split Grid for Gauge and List */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Column: Radial Chart Visual */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={level === "Iniciante" ? "#f59e0b" : level === "Intermediário" ? "#2563eb" : level === "Avançado" ? "#4f46e5" : "#10b981"} />
                        <stop offset="50%" stopColor={level === "Iniciante" ? "#eab308" : level === "Intermediário" ? "#0ea5e9" : level === "Avançado" ? "#8b5cf6" : "#14b8a6"} />
                        <stop offset="100%" stopColor={level === "Iniciante" ? "#facc15" : level === "Intermediário" ? "#22d3ee" : level === "Avançado" ? "#ec4899" : "#34d399"} />
                      </linearGradient>
                      <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Track */}
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className={theme.bg}
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />

                    {/* Glowing shadow ring (underneath) */}
                    <motion.circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="url(#scoreGradient)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      style={{ filter: "url(#glowFilter)", opacity: 0.5 }}
                    />

                    {/* Active Progress Segment */}
                    <motion.circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="url(#scoreGradient)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Inner Score Badge */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black tracking-tight text-white">{score}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">/ 1000 pts</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Breakdown with interactive hover/details */}
              <div className="sm:col-span-7 space-y-3">
                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Detalhamento Técnico</span>
                  <p className="text-[10px] text-slate-300 leading-tight h-8 min-h-[32px] overflow-hidden">
                    {hoveredMetric === "none" ? theme.desc : (
                      hoveredMetric === "profile" ? "Garante visibilidade máxima e preenchimento correto dos dados de contato para recrutadores." :
                      hoveredMetric === "resume" ? "Qualidade e otimização do seu currículo com base na estrutura avançada guiada por IA." :
                      "Sua pontuação de performance média em testes e simulações com IA."
                    )}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {/* Profile Metric Row */}
                  <div 
                    className={`p-2 rounded-xl transition border cursor-pointer ${
                      hoveredMetric === "profile" ? "bg-white/10 border-white/20 shadow-md" : "bg-white/5 border-white/5 hover:bg-white/5"
                    }`}
                    onMouseEnter={() => setHoveredMetric("profile")}
                    onMouseLeave={() => setHoveredMetric("none")}
                  >
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                        <CheckCircle className={`w-3.5 h-3.5 ${profilePoints >= 300 ? "text-emerald-400" : "text-blue-400"}`} />
                        Perfil Completo
                      </span>
                      <span className="font-mono font-bold text-slate-100">{profilePoints} <span className="text-slate-400 font-medium">/ 300 pts</span></span>
                    </div>
                    {hoveredMetric === "profile" && (
                      <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${(profilePoints / 300) * 100}%` }}></div>
                      </div>
                    )}
                  </div>

                  {/* Resume Metric Row */}
                  <div 
                    className={`p-2 rounded-xl transition border cursor-pointer ${
                      hoveredMetric === "resume" ? "bg-white/10 border-white/20 shadow-md" : "bg-white/5 border-white/5 hover:bg-white/5"
                    }`}
                    onMouseEnter={() => setHoveredMetric("resume")}
                    onMouseLeave={() => setHoveredMetric("none")}
                  >
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                        <Star className={`w-3.5 h-3.5 ${resumePoints >= 300 ? "text-emerald-400" : "text-purple-400"}`} />
                        Currículo IA
                      </span>
                      <span className="font-mono font-bold text-slate-100">{resumePoints} <span className="text-slate-400 font-medium">/ 300 pts</span></span>
                    </div>
                    {hoveredMetric === "resume" && (
                      <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400" style={{ width: `${(resumePoints / 300) * 100}%` }}></div>
                      </div>
                    )}
                  </div>

                  {/* Interview Metric Row */}
                  <div 
                    className={`p-2 rounded-xl transition border cursor-pointer ${
                      hoveredMetric === "interview" ? "bg-white/10 border-white/20 shadow-md" : "bg-white/5 border-white/5 hover:bg-white/5"
                    }`}
                    onMouseEnter={() => setHoveredMetric("interview")}
                    onMouseLeave={() => setHoveredMetric("none")}
                  >
                    <div className="flex justify-between text-xs items-center">
                      <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                        <Zap className={`w-3.5 h-3.5 ${interviewPoints >= 320 ? "text-emerald-400" : "text-amber-400"}`} />
                        Simulador Entrevista
                      </span>
                      <span className="font-mono font-bold text-slate-100">{interviewPoints} <span className="text-slate-400 font-medium">/ 400 pts</span></span>
                    </div>
                    {hoveredMetric === "interview" && (
                      <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${(interviewPoints / 400) * 100}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Smart dynamic recommended tip ticker */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Missão de Upgrade Recomendada:
              </span>
              <div className="bg-white/5 border border-white/5 hover:border-emerald-500/20 rounded-xl p-3 flex gap-2.5 items-start transition duration-300">
                <div className="w-6 h-6 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-200 leading-normal font-semibold font-sans">
                    {tips[0]}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Complete esta missão para atualizar sua pontuação em tempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Bento Block 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-200 mb-4">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-sans font-bold text-slate-800">Próximos Passos</h3>
            <p className="text-slate-500 text-xs leading-relaxed mt-2">
              Para quem está começando, o <strong>Objetivo Profissional</strong> e os <strong>Projetos Escolares</strong> são as informações mais avaliadas pelas empresas parceiras do Lynx EDU Sistemas Escolares Inteligentes.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("library")}
            className="w-full mt-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-100"
          >
            <span>Ver Livros de Carreira</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Card Component */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs overflow-hidden" id="analytics-section">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h3 className="font-sans font-bold text-slate-800 text-lg">Análise de Produtividade & Metas Semanais</h3>
            </div>
            <p className="text-slate-500 text-xs">
              Monitore seu ritmo de preparação, metas de desenvolvimento profissional e o tempo investido na sua carreira.
            </p>
          </div>

          {/* Tab Selector Controls */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto text-xs font-semibold text-slate-600 border border-slate-200/40">
            <button
              onClick={() => setChartView("goals")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartView === "goals" 
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/30 font-bold" 
                  : "hover:text-slate-900"
              }`}
            >
              Metas Semanais
            </button>
            <button
              onClick={() => setChartView("hours")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartView === "hours" 
                  ? "bg-white text-purple-600 shadow-xs border border-slate-200/30 font-bold" 
                  : "hover:text-slate-900"
              }`}
            >
              Horas Ativas
            </button>
            <button
              onClick={() => setChartView("breakdown")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartView === "breakdown" 
                  ? "bg-white text-amber-600 shadow-xs border border-slate-200/30 font-bold" 
                  : "hover:text-slate-900"
              }`}
            >
              Evolução OC Score
            </button>
          </div>
        </div>

        {/* Dashboard Analytics Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Chart Frame */}
          <div className="lg:col-span-8 bg-slate-50/50 rounded-2xl border border-slate-100 p-4 min-h-[300px] flex flex-col justify-between">
            <div className="h-64 w-full" id="recharts-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === "goals" ? (
                  <ComposedChart data={weeklyActivitiesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any, name: any) => {
                        if (name === "Concluidas") return [value, "Atividades Concluídas"];
                        if (name === "Metas") return [value, "Meta Estipulada"];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Dia: ${label}`}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#475569' }} />
                    <Area type="monotone" dataKey="Metas" name="Meta Estipulada" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGoals)" />
                    <Bar dataKey="Concluidas" name="Atividades Concluídas" fill="#10b981" barSize={18} radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                ) : chartView === "hours" ? (
                  <ComposedChart data={weeklyActivitiesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} unit="h" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`${value} horas`, "Tempo de Estudo"]}
                      labelFormatter={(label) => `Dia: ${label}`}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#475569' }} />
                    <Area type="monotone" dataKey="Horas" name="Tempo Dedicado (Horas)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                    <Line type="monotone" dataKey="Horas" stroke="#d946ef" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                ) : (
                  <ComposedChart data={weeklyActivitiesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`${value} pts`, "Evolução do Score"]}
                      labelFormatter={(label) => `Dia: ${label}`}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500, color: '#475569' }} />
                    <Area type="monotone" dataKey="Pontos" name="Pontos Acumulados no OC Score" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPoints)" />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-medium px-2 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> Atualizado em tempo real conforme suas interações
              </span>
              <span>Lynx EDU Sistemas Escolares Inteligentes • Carreira IA</span>
            </div>
          </div>

          {/* Metric details / Stats Breakdown column */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              {/* Box 1: Performance */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-sans">Aproveitamento de Metas</span>
                  <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {performanceRate}%
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">{totalConcluidas} de {totalMetas}</h4>
                <p className="text-slate-500 text-[11px] leading-snug mt-1">
                  Atividades de orientação de carreira, revisão de perfil e exercícios concluídos esta semana.
                </p>
                <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${performanceRate}%` }} ></div>
                </div>
              </div>

              {/* Box 2: Total Hours */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider font-sans">Dedicado aos Estudos</span>
                  <span className="text-purple-600 font-black text-sm bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {totalHoras}h
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">Foco em Carreira</h4>
                <p className="text-slate-500 text-[11px] leading-snug mt-1">
                  Tempo estimado preparando currículos, lendo materiais e interagindo com feedbacks da IA.
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                  <span className="text-[10px] text-purple-600 font-bold font-sans">Ritmo considerado saudável e produtivo</span>
                </div>
              </div>
            </div>

            {/* List of recommended activities for the day */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/55">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                <ListTodo className="w-3.5 h-3.5 text-blue-500" /> Atividades por dia da semana
              </h4>
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {weeklyActivitiesData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/40 last:border-0">
                    <span className="font-semibold text-slate-700 w-8">{item.day}</span>
                    <span className="text-slate-500 text-[10px] truncate max-w-[130px]">{item.Detalhe}</span>
                    <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                      item["Concluidas"] >= item.Metas 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {item["Concluidas"]}/{item.Metas}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Area Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight uppercase tracking-wider text-xs">Acesso Rápido às Ferramentas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6" id="dashboard-quick-grid">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-normal mt-2">{item.desc}</p>
                </div>
                
                <button
                  onClick={() => setCurrentTab(item.id)}
                  className="w-full mt-5 py-2.5 bg-slate-50 text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-slate-100 group-hover:border-slate-200"
                >
                  <span>{item.btnText}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Celebratory Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex gap-3 relative overflow-hidden backdrop-blur-md ${
                toast.type === "badge"
                  ? "bg-amber-50/95 border-amber-200 text-amber-900 shadow-amber-500/10"
                  : "bg-blue-50/95 border-blue-200 text-blue-900 shadow-blue-500/10"
              }`}
            >
              {/* Ambient pulse background for celebratory feel */}
              <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full filter blur-xl ${
                toast.type === "badge" ? "bg-amber-400/20" : "bg-blue-400/20"
              }`} />

              <div className={`p-2.5 rounded-xl shrink-0 ${
                toast.type === "badge" ? "bg-amber-100" : "bg-blue-100"
              }`}>
                {getToastIcon(toast.iconName)}
              </div>

              <div className="flex-1 min-w-0 pr-6 relative z-10">
                <span className={`block text-[9px] font-extrabold uppercase tracking-widest ${
                  toast.type === "badge" ? "text-amber-700" : "text-blue-700"
                }`}>
                  {toast.type === "badge" ? "Nova Conquista!" : "Grande Progresso!"}
                </span>
                <h4 className="text-sm font-bold tracking-tight text-slate-800 mt-0.5">
                  {toast.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition cursor-pointer relative z-20"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
