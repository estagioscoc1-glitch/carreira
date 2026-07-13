import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";
import { 
  LmsCourse, Colaborador, LMS_COURSES, MOCK_COLABORADORES, LMS_QUIZ_QUESTIONS, 
  MOCK_NOT_REQUIRED_COURSES, MOCK_COMMISSIONS, QuizQuestion 
} from "../data/lmsData";
import { getModuleContent } from "../data/moduleContents";
import { 
  Award, BookOpen, GraduationCap, Sparkles, Trophy, CheckCircle, Clock, Zap, AlertTriangle, 
  ChevronRight, Calendar, Search, ShieldAlert, BarChart3, Users, Settings, Plus, Trash2, 
  Download, Printer, Play, ArrowRight, Eye, Volume2, HelpCircle, FileText, Check, X, Bookmark, Target, Star
} from "lucide-react";

interface LmsViewProps {
  user: User;
}

export default function LmsView({ user }: LmsViewProps) {
  // State definitions
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog" | "career" | "tutor" | "hr_manager">("dashboard");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [accessibilitySpeech, setAccessibilitySpeech] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  // Collaborative & stats state
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(MOCK_COLABORADORES);
  const [courses, setCourses] = useState<LmsCourse[]>(LMS_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<LmsCourse | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  
  // Classroom states
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [interactiveQuizActive, setInteractiveQuizActive] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [certificateEarned, setCertificateEarned] = useState<LmsCourse | null>(null);
  
  // AI Tutor states
  const [tutorQuery, setTutorQuery] = useState("");
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Olá! Sou a sua **Tutora IA Especialista em Educação Corporativa Hospitalar**. Estou aqui para esclarecer suas dúvidas sobre os cursos técnicos de saúde, ajudá-lo a planejar sua promoção profissional ou resolver dúvidas clínicas de assepsia, radioproteção e NRs. Qual o seu foco de hoje?" }
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);

  // HR Admin States
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState<LmsCourse["category"]>("Enfermagem");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseInstructor, setNewCourseInstructor] = useState("");
  const [newCourseDuration, setNewCourseDuration] = useState(8);

  // Career Academy: Personal Development Plan (PDI) state
  const [pdiGoals, setPdiGoals] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "g-1", text: "Completar o treinamento de Biossegurança e NR-32", done: false },
    { id: "g-2", text: "Participar de uma comissão hospitalar (ex: CIPA ou CCIH)", done: false },
    { id: "g-3", text: "Apresentar um micro-projeto de melhoria no meu setor", done: false },
    { id: "g-4", text: "Estudar 2 horas semanais na Academia da Carreira", done: true }
  ]);
  const [newPdiGoal, setNewPdiGoal] = useState("");

  // Hotspot interaction state
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Auto scroll for tutor
  const tutorEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    tutorEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tutorMessages, tutorLoading]);

  // Voice Speech Accessibility
  const speakText = (text: string) => {
    if (!accessibilitySpeech) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  };

  const togglePdiGoal = (id: string) => {
    setPdiGoals(pdiGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const addPdiGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdiGoal.trim()) return;
    setPdiGoals([...pdiGoals, { id: `g-${Date.now()}`, text: newPdiGoal, done: false }]);
    setNewPdiGoal("");
  };

  // Simulate AI Tutor Interaction
  const handleTutorSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tutorQuery.trim() || tutorLoading) return;

    const userMsg = { role: "user" as const, text: tutorQuery };
    setTutorMessages(prev => [...prev, userMsg]);
    setTutorQuery("");
    setTutorLoading(true);

    try {
      const response = await fetch("/api/meu-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          course: user.course,
          studentName: user.name,
          messages: [...tutorMessages, userMsg],
          isConcursoMode: false
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setTutorMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      speakText(data.text);
    } catch {
      // Offline fallback helper
      let responseText = "Entendi o seu ponto! É fundamental que em auditorias hospitalares ONA as ações estejam documentadas de acordo com as diretrizes. Posso gerar um plano de estudos sobre isso para você.";
      if (userMsg.text.toLowerCase().includes("prom") || userMsg.text.toLowerCase().includes("carreira")) {
        responseText = `Excelente pergunta, ${user.name}! Para conquistar uma promoção dentro de hospitais de alta performance, siga o método de três etapas:
1. **Atitude Participativa**:Candidate-se a comissões como a CIPA ou CCIH. Isso aumenta sua visibilidade interna.
2. **Qualificação Continuada**: Mantenha todos os seus treinamentos obrigatórios acima de 90% de aproveitamento.
3. **Plano de Desenvolvimento Individual (PDI)**: Defina metas trimestrais de evolução técnica com o seu supervisor imediato.`;
      } else if (userMsg.text.toLowerCase().includes("nr-32") || userMsg.text.toLowerCase().includes("perfuro")) {
        responseText = "A NR-32 proíbe estritamente o reencape manual ou a desconexão manual de agulhas. Caso ocorra um acidente perfurocortante contaminado, lave o local intensamente com água e sabão e comunique o SESMT ou CCIH em até 2 horas para início da profilaxia pós-exposição (PEP).";
      }
      setTutorMessages(prev => [...prev, { role: "assistant", text: responseText }]);
      speakText(responseText);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourse: LmsCourse = {
      id: `lms-custom-${Date.now()}`,
      title: newCourseTitle,
      category: newCourseCategory,
      duration: newCourseDuration,
      xpReward: newCourseDuration * 50,
      progress: 0,
      status: "not_started",
      image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400",
      instructor: newCourseInstructor || "Instrutor Convidado",
      shortDesc: newCourseDesc || "Este curso oferece conhecimento técnico essencial para a educação continuada e conformidade de acreditação hospitalar.",
      modules: ["Introdução e Objetivos", "Princípios Básicos", "Procedimentos Operacionais Padrão (POP)", "Avaliação e Exercícios Práticos"]
    };

    setCourses([newCourse, ...courses]);
    setShowAddCourseModal(false);
    setNewCourseTitle("");
    setNewCourseDesc("");
    setNewCourseInstructor("");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // Launch Classroom
  const startClassroom = (course: LmsCourse) => {
    setSelectedCourse(course);
    setActiveModuleIndex(0);
    setInteractiveQuizActive(false);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCertificateEarned(null);
  };

  // Handle Quiz Answer selection
  const selectQuizAnswer = (qIdx: number, oIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: oIdx
    });
  };

  // Submit Quiz
  const submitQuiz = () => {
    const questions = LMS_QUIZ_QUESTIONS[selectedCourse?.id || ""] || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100;
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70 && selectedCourse) {
      // Mark course completed
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...c, progress: 100, status: "completed" } : c));
      // Award certificate
      setCertificateEarned(selectedCourse);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // Filter courses by selected category
  const getCategorizedCourses = (category: LmsCourse["category"]) => {
    return courses.filter(c => c.category === category);
  };

  // Overall student progression
  const totalCompleted = courses.filter(c => c.status === "completed").length;
  const totalHoursCompleted = courses.filter(c => c.status === "completed").reduce((acc, c) => acc + c.duration, 0);
  const totalXpEarned = courses.filter(c => c.status === "completed").reduce((acc, c) => acc + c.xpReward, 0) + 1200; // base xp

  const badgeIcons: Record<string, any> = {
    Star: Star,
    Shield: ShieldAlert,
    Award: Award
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-8 rounded-3xl transition duration-300 ${
      themeMode === "dark" ? "bg-slate-950 text-white border border-slate-900" : "bg-slate-50 text-slate-900"
    } ${highContrast ? "contrast-150" : ""}`}>
      
      {/* Platform Accessibility Panel */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900 text-white rounded-2xl px-5 py-3 border border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black tracking-wide uppercase font-mono text-emerald-300">
            SISTEMA LMS HOSPITALAR SUPREMO 2026 • CENTRAL DE RH
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio voice narrator accessibility switch */}
          <button
            onClick={() => {
              setAccessibilitySpeech(!accessibilitySpeech);
              speakText("Leitor de tela ativado. Sinta-se confortável para ouvir os comentários.");
            }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 transition ${
              accessibilitySpeech ? "bg-emerald-500 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Leitor Voz: {accessibilitySpeech ? "LIGADO" : "DESLIGADO"}</span>
          </button>

          {/* High Contrast */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition ${
              highContrast ? "bg-yellow-500 text-slate-950" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Alto Contraste
          </button>

          {/* Light/Dark Mode */}
          <button
            onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
            className="px-3 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Tema: {themeMode === "light" ? "Claro" : "Escuro"}
          </button>
        </div>
      </div>

      {/* Main LMS Title Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-blue-950 rounded-3xl border border-teal-500/20 p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-extrabold uppercase border border-emerald-500/20 tracking-wider">
              Educação Continuada & Treinamentos
            </span>
            <h1 className="text-2xl md:text-3xl font-sans font-black tracking-tight leading-none text-white">
              Olá, {user.name} 👋
            </h1>
            <p className="text-xs text-teal-300 font-medium max-w-xl">
              Seu desenvolvimento profissional começa hoje. Conquiste novos níveis, domine regulamentações e acelere sua promoção no Hospital Lynx EDU.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setActiveTab("dashboard"); setSelectedCourse(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                activeTab === "dashboard" ? "bg-emerald-500 text-slate-950 font-black shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Meu Painel
            </button>
            <button
              onClick={() => { setActiveTab("catalog"); setSelectedCourse(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                activeTab === "catalog" ? "bg-emerald-500 text-slate-950 font-black shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Catálogo de Trilhas
            </button>
            <button
              onClick={() => { setActiveTab("career"); setSelectedCourse(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                activeTab === "career" ? "bg-emerald-500 text-slate-950 font-black shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Academia da Carreira
            </button>
            <button
              onClick={() => { setActiveTab("tutor"); setSelectedCourse(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                activeTab === "tutor" ? "bg-emerald-500 text-slate-950 font-black shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Mentoria IA
            </button>
            <button
              onClick={() => { setActiveTab("hr_manager"); setSelectedCourse(null); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer ${
                activeTab === "hr_manager" ? "bg-emerald-500 text-slate-950 font-black shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              Controle RH
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Mini Leaderboard and Quick KPIs (Sticky/Sidebar style) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* User Gamification Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                LV{3}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{user.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{user.course}</p>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 font-mono">
                <span>XP: {totalXpEarned} / 5000</span>
                <span>Nível 3</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(totalXpEarned / 5000) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quick counters */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Cursos</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{totalCompleted}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Horas</span>
                <span className="text-sm font-black text-slate-800 mt-0.5 block">{totalHoursCompleted}h</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Pontos</span>
                <span className="text-sm font-black text-emerald-600 mt-0.5 block">{totalXpEarned * 2}</span>
              </div>
            </div>

            {/* Badges won */}
            <div className="pt-3 border-t border-slate-100">
              <span className="block text-[9px] font-extrabold uppercase text-slate-400 mb-2">Medalhas Conquistadas ({MOCK_COLABORADORES[3].badges.length})</span>
              <div className="flex gap-2">
                {MOCK_COLABORADORES[3].badges.map((b) => {
                  const Icon = badgeIcons[b.icon] || Star;
                  return (
                    <div 
                      key={b.id} 
                      title={`${b.title}: ${b.description}`}
                      className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center cursor-help"
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leaderboard per Sector (Collaborative feeling) */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-500" /> Ranking do Setor (Educação)
            </h4>
            <div className="space-y-2.5">
              {colaboradores.map((col, idx) => (
                <div key={col.id} className="flex items-center justify-between text-xs p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 w-4 font-mono text-center">{idx + 1}º</span>
                    <div>
                      <span className="font-extrabold text-slate-700">{col.name}</span>
                      <span className="block text-[9px] text-slate-400">{col.department}</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-emerald-600">{col.score} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending / Obligatory Courses widget */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Metas de Compliance (RH)
            </h4>
            <div className="space-y-2">
              {MOCK_NOT_REQUIRED_COURSES.map((r) => (
                <div key={r.id} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-[10px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-700">{r.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold uppercase">{r.type}</span>
                  </div>
                  <p className="text-slate-500 font-semibold">{r.status}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Active workspace area based on active tab */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">

            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && !selectedCourse && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Active/Resume studying banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest font-mono">CONTINUE DE ONDE PAROU</span>
                    <h3 className="text-base font-black text-slate-800">NR-32: Segurança e Saúde em Serviços de Saúde</h3>
                    <p className="text-xs text-slate-500">Módulo 4 de 6 • 70% concluído</p>
                  </div>
                  <button
                    onClick={() => startClassroom(courses[1])}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Retomar Aula
                  </button>
                </div>

                {/* Grid of My Active Courses */}
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider mb-4">Minha Trilha de Desenvolvimento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((course) => (
                      <div 
                        key={course.id}
                        className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
                      >
                        <div className="h-32 relative overflow-hidden shrink-0">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-white uppercase tracking-wider">
                            {course.category}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-extrabold text-slate-800 leading-tight line-clamp-1">{course.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">Instrutor: {course.instructor}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.shortDesc}</p>
                          </div>

                          <div className="space-y-3 pt-2">
                            {/* Course Progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>Progresso</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${course.progress}%` }}></div>
                              </div>
                            </div>

                            {/* View Modules toggle */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCourseId(expandedCourseId === course.id ? null : course.id);
                              }}
                              className="w-full py-1.5 text-[10px] font-extrabold text-blue-600 hover:text-blue-800 transition flex items-center justify-center gap-1 cursor-pointer border border-dashed border-blue-200 rounded-xl bg-blue-50/50"
                            >
                              <span>{expandedCourseId === course.id ? "OCULTAR MÓDULOS ▲" : `VER MÓDULOS DO CURSO (${course.modules.length}) ▼`}</span>
                            </button>

                            {/* Expandable modules list */}
                            {expandedCourseId === course.id && (
                              <div className="pt-2 border-t border-slate-100 space-y-1 animate-fade-in">
                                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Módulos:</span>
                                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                                  {course.modules.map((mod, modIdx) => {
                                    const totalMods = course.modules.length;
                                    const completedCount = Math.floor((course.progress / 100) * totalMods);
                                    const isCompleted = course.progress === 100 || modIdx < completedCount;
                                    const isCurrent = course.progress > 0 && course.progress < 100 && modIdx === completedCount;

                                    return (
                                      <div key={modIdx} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold p-1.5 rounded-lg bg-slate-50 border border-slate-100/50">
                                        {isCompleted ? (
                                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                        ) : isCurrent ? (
                                          <Play className="w-2.5 h-2.5 text-blue-500 shrink-0 fill-current" />
                                        ) : (
                                          <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                                        )}
                                        <span className="truncate">{mod}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Start/Resume button */}
                            <button
                              onClick={() => startClassroom(course)}
                              className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              {course.progress === 100 ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  <span>Rever Conteúdo</span>
                                </>
                              ) : course.progress > 0 ? (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Continuar</span>
                                </>
                              ) : (
                                <span>Iniciar Trilha</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Goals Quick overview */}
                <div className="p-5 bg-white border border-slate-200/60 rounded-3xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-5 h-5 text-emerald-500" /> Meu Plano de Desenvolvimento Individual (PDI)
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">Progresso PDI</span>
                  </div>
                  <div className="space-y-2 pt-2">
                    {pdiGoals.slice(0, 3).map((goal) => (
                      <div 
                        key={goal.id} 
                        onClick={() => togglePdiGoal(goal.id)}
                        className="flex gap-2.5 items-center p-2.5 rounded-xl hover:bg-slate-50 border border-slate-50 hover:border-slate-100 transition cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          goal.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                        }`}>
                          {goal.done && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-xs ${goal.done ? "line-through text-slate-400 font-medium" : "text-slate-700 font-bold"}`}>
                          {goal.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: CATALOG */}
            {activeTab === "catalog" && !selectedCourse && (
              <motion.div
                key="catalog-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Catálogo de Trilhas Acadêmicas e Regulamentares</h3>
                  <p className="text-xs text-slate-500">
                    Selecione e filtre as trilhas projetadas para cada especialidade do ambiente hospitalar de alta performance.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {["Enfermagem", "Radiologia", "Instrumentação Cirúrgica", "Segurança do Paciente", "Humanização", "Desenvolvimento Profissional"].map((cat) => (
                      <div 
                        key={cat}
                        className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 transition cursor-pointer space-y-2"
                        onClick={() => {
                          const matching = courses.find(c => c.category === cat);
                          if (matching) {
                            startClassroom(matching);
                          }
                        }}
                      >
                        <span className="block text-xs font-bold text-slate-800">{cat}</span>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase font-mono">
                          {courses.filter(c => c.category === cat).length} Trilhas Disponíveis
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display All Courses List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Todas as Trilhas Cadastradas</h4>
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div 
                        key={course.id}
                        className="bg-white border border-slate-200/60 p-4 rounded-3xl hover:shadow-xs transition duration-300 flex flex-col gap-4"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex gap-4 items-center">
                            <img src={course.image} alt={course.title} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                            <div>
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-extrabold uppercase">{course.category}</span>
                              <h4 className="text-sm font-black text-slate-800 mt-1">{course.title}</h4>
                              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{course.shortDesc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0">
                            <div className="text-right text-xs text-slate-400 font-mono">
                              <p className="font-extrabold text-slate-700">{course.duration} horas</p>
                              <p>{course.xpReward} XP</p>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCourseId(expandedCourseId === course.id ? null : course.id);
                              }}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>{expandedCourseId === course.id ? "Ocultar Módulos" : "Ver Módulos"}</span>
                            </button>

                            <button
                              onClick={() => startClassroom(course)}
                              className="px-4 py-2 bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-white rounded-xl text-xs font-extrabold transition cursor-pointer"
                            >
                              Matricular-se
                            </button>
                          </div>
                        </div>

                        {/* Expandable modules list in catalog */}
                        {expandedCourseId === course.id && (
                          <div className="pt-3 border-t border-slate-100 space-y-2 bg-slate-50/50 p-3 rounded-2xl animate-fade-in">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Estrutura de Módulos & Grade Curricular</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {course.modules.map((mod, modIdx) => (
                                <div key={modIdx} className="flex items-center gap-2 text-xs text-slate-700 font-bold p-2 rounded-xl bg-white border border-slate-100">
                                  <div className="w-5 h-5 bg-blue-50 text-blue-600 font-mono text-[10px] font-extrabold rounded-md flex items-center justify-center shrink-0">
                                    {modIdx + 1}
                                  </div>
                                  <span className="truncate">{mod}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: CAREER ACADEMY (ACADEMIA DA CARREIRA) */}
            {activeTab === "career" && !selectedCourse && (
              <motion.div
                key="career-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Academia Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-2xl"></div>
                  <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                      <Zap className="w-3 h-3 text-emerald-400" /> Academia da Carreira Hospitalar
                    </div>
                    <h3 className="text-lg font-black tracking-tight leading-none">Como ser promovido e se destacar dentro do hospital</h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Aprenda a construir networking interno, agir com maestria em auditorias ONA/JCI e montar projetos de melhoria contínua que impressionam gestores de enfermagem, radiologia e diretoria.
                    </p>
                  </div>
                </div>

                {/* Grid of lessons/advices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* PDI Plan Generator Interactive widget */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-3xl space-y-4">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">PLANOS DE DESENVOLVIMENTO INDIVIDUAL</h4>
                      <h3 className="text-sm font-black text-slate-800 mt-1">Gerenciador PDI Ativo</h3>
                    </div>

                    <form onSubmit={addPdiGoal} className="flex gap-2">
                      <input
                        type="text"
                        value={newPdiGoal}
                        onChange={(e) => setNewPdiGoal(e.target.value)}
                        placeholder="Adicionar nova meta (Ex: Ler POP de paramentação...)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {pdiGoals.map((goal) => (
                        <div 
                          key={goal.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition"
                        >
                          <div 
                            onClick={() => togglePdiGoal(goal.id)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1"
                          >
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              goal.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {goal.done && <Check className="w-3 h-3" />}
                            </div>
                            <span className={`text-xs ${goal.done ? "line-through text-slate-400" : "text-slate-700 font-semibold"}`}>
                              {goal.text}
                            </span>
                          </div>
                          <button
                            onClick={() => setPdiGoals(pdiGoals.filter(g => g.id !== goal.id))}
                            className="p-1 hover:bg-rose-100 text-rose-500 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Auditories Preparation checklist */}
                  <div className="bg-white border border-slate-200/60 p-5 rounded-3xl space-y-4">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">COMPLIANCE & AUDITORIA ONA</h4>
                      <h3 className="text-sm font-black text-slate-800 mt-1">Como agir diante de auditores</h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-medium">
                        <strong>Lembrete ONA:</strong> Nunca simule que sabe um procedimento se esquecer. Diga: <em>&quot;Isso está descrito no POP de número 14 e posso consultá-lo imediatamente em nosso sistema.&quot;</em> Isso demonstra maturidade!
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2 items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Mantenha o crachá sempre visível e paramentação impecável.</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Saiba citar as 6 Metas de Segurança do Paciente de cor.</span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Identifique os resíduos biológicos do seu setor corretamente.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Comissões Hospitalares options */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Trilha das Comissões Hospitalares (Construção de Autoridade)</h3>
                  <p className="text-xs text-slate-500">
                    Participar ativamente de comissões técnicas hospitalares é uma das formas mais robustas de chamar atenção positiva de gerentes de enfermagem e radiologia. Conheça as principais:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {MOCK_COMMISSIONS.map((com) => (
                      <div key={com.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">{com.members}</span>
                          <h4 className="text-xs font-black text-slate-800 leading-tight">{com.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{com.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setTutorMessages(prev => [
                              ...prev,
                              { role: "user", text: `Gostaria de saber como ingressar e colaborar na comissão: ${com.name}` },
                              { role: "assistant", text: `Que excelente iniciativa, ${user.name}! Participar da **${com.name}** impulsionará drasticamente sua carreira. No Hospital Lynx EDU, o processo seletivo de comissões ocorre anualmente, mas você pode se inscrever como voluntário ou propor projetos de melhoria para a liderança técnica da comissão. Gostaria de sugerir algum projeto inicial de assepsia, radioproteção ou prevenção de perfurocortantes?` }
                            ]);
                            setActiveTab("tutor");
                          }}
                          className="w-full py-1.5 bg-slate-900 hover:bg-emerald-500 text-white hover:text-slate-950 font-bold rounded-xl text-[10px] transition cursor-pointer"
                        >
                          Saber Como Ingressar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: MENTORIA IA (TUTORA IA) */}
            {activeTab === "tutor" && !selectedCourse && (
              <motion.div
                key="tutor-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-slate-200/60 shadow-xs flex flex-col h-[550px] overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-slate-950 font-black flex items-center justify-center rounded-xl text-xs">
                      IA
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800">Tutora de Educação Continuada IA</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase font-mono animate-pulse">Especialista Hospitalar • Responde em Segundos</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {tutorMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-emerald-500 text-slate-950 font-bold rounded-tr-none shadow-xs" 
                          : "bg-slate-50 text-slate-800 border border-slate-200/50 rounded-tl-none"
                      }`}>
                        <div className="markdown-body space-y-1">
                          {msg.text.split("\n").map((line, lIdx) => (
                            <p key={lIdx}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {tutorLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                        <span className="font-bold">Analisando literatura médica e NRs...</span>
                      </div>
                    </div>
                  )}
                  <div ref={tutorEndRef} />
                </div>

                <form onSubmit={handleTutorSubmit} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    placeholder="Pergunte sobre como progredir na empresa, biossegurança ou dúvidas de aula..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={tutorLoading}
                  />
                  <button
                    type="submit"
                    disabled={tutorLoading || !tutorQuery.trim()}
                    className="px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer disabled:opacity-40"
                  >
                    Enviar
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB: HR MANAGER CONTROLE */}
            {activeTab === "hr_manager" && !selectedCourse && (
              <motion.div
                key="hr-manager-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Manager KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Treinamentos Ativos</span>
                    <span className="text-xl font-black text-slate-800">{courses.length}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Colaboradores Cadastrados</span>
                    <span className="text-xl font-black text-slate-800">{colaboradores.length}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Média de Progresso Geral</span>
                    <span className="text-xl font-black text-emerald-600">68%</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Horas de Treinamento</span>
                    <span className="text-xl font-black text-blue-600">116 hrs</span>
                  </div>
                </div>

                {/* Course administration panel */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Painel Administrativo de Cursos</h3>
                      <p className="text-xs text-slate-400">Cadastre, edite ou exclua trilhas e avaliações do hospital.</p>
                    </div>

                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Cadastrar Curso
                    </button>
                  </div>

                  {/* Course list managed table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-600 border-collapse">
                      <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                        <tr>
                          <th className="py-3 px-4">Trilha</th>
                          <th className="py-3 px-4">Categoria</th>
                          <th className="py-3 px-4">Instrutor</th>
                          <th className="py-3 px-4 text-center">Duração</th>
                          <th className="py-3 px-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((c) => (
                          <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-extrabold text-slate-800">{c.title}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold uppercase text-[9px]">{c.category}</span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-500">{c.instructor}</td>
                            <td className="py-3 px-4 text-center font-mono font-bold">{c.duration}h</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                title="Excluir curso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interactive team performance log */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Desempenho da Equipe de Técnicos</h3>
                      <p className="text-xs text-slate-400">Acompanhamento de conformidade de NRs de cada colaborador.</p>
                    </div>

                    <button
                      onClick={() => alert("Simulando exportação para relatório PDF...")}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Exportar Planilha Excel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colaboradores.map((col) => (
                      <div key={col.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-800">{col.name}</h4>
                            <p className="text-[10px] text-slate-400">{col.department}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-bold text-[9px]">Nível {col.level}</span>
                        </div>

                        {/* Progress Bar of employee */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>Treinamentos Concluídos</span>
                            <span>{col.completedCourses} cursos</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(col.completedCourses / 12) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* CLASSROOM MODE (active course is selected) */}
            {selectedCourse && (
              <motion.div
                key="classroom-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                
                {/* Classroom Header Banner */}
                <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="space-y-1 relative z-10">
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider">
                      {selectedCourse.category}
                    </span>
                    <h3 className="text-base font-black tracking-tight mt-1">{selectedCourse.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Por: {selectedCourse.instructor}</p>
                  </div>

                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative z-10"
                  >
                    <X className="w-4 h-4" /> Voltar ao Painel
                  </button>
                </div>

                {/* Progress bar classroom */}
                <div className="h-1.5 bg-slate-100 shrink-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((activeModuleIndex + 1) / (selectedCourse.modules.length + 1)) * 100}%` }}
                  ></div>
                </div>

                {/* Lesson Screen / Interactive slide representation with Left Sidebar Course Grade */}
                <div className="grid grid-cols-1 lg:grid-cols-4 border-t border-slate-100 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  
                  {/* Left Column: Grade of Modules */}
                  <div className="lg:col-span-1 bg-slate-50/50 p-4 md:p-5 space-y-4">
                    <div className="pb-3 border-b border-slate-200 flex flex-col gap-1 shrink-0">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">CONTEÚDO DA TRILHA</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase">Módulos de Estudo</h4>
                    </div>
                    
                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 animate-fade-in">
                      {selectedCourse.modules.map((mod, modIdx) => {
                        const isActive = modIdx === activeModuleIndex && !interactiveQuizActive;
                        const isCompleted = modIdx < activeModuleIndex || selectedCourse.progress === 100;

                        return (
                          <button
                            key={modIdx}
                            onClick={() => {
                              setActiveModuleIndex(modIdx);
                              setInteractiveQuizActive(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-[11px] font-bold transition flex items-center gap-2 cursor-pointer ${
                              isActive 
                                ? "bg-blue-600/10 border-blue-400 text-blue-700 shadow-xs" 
                                : isCompleted 
                                ? "bg-emerald-500/5 border-emerald-100 text-slate-700 hover:bg-slate-100"
                                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400"
                            }`}
                          >
                            <div className="shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : isActive ? (
                                <Play className="w-3.5 h-3.5 text-blue-500 fill-current animate-pulse" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-300 text-[9px] font-mono text-center flex items-center justify-center font-bold">
                                  {modIdx + 1}
                                </div>
                              )}
                            </div>
                            <span className="line-clamp-2 leading-tight">{mod}</span>
                          </button>
                        );
                      })}

                      {/* Final Quiz entry button in sidebar list */}
                      <button
                        onClick={() => {
                          setInteractiveQuizActive(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-[11px] font-extrabold transition flex items-center gap-2 cursor-pointer ${
                          interactiveQuizActive
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400"
                        }`}
                      >
                        <Award className={`w-4 h-4 shrink-0 ${interactiveQuizActive ? "text-emerald-500" : "text-slate-400"}`} />
                        <span className="truncate">Avaliação / Quiz Final</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Active module content */}
                  <div className="lg:col-span-3 p-6 md:p-8 space-y-6">
                  
                  {!interactiveQuizActive ? (
                    /* General Slide/Text lesson view */
                    <div className="space-y-6">
                      
                      {/* Premium visual image backdrop or color callout card */}
                      <div className="bg-slate-950 text-white rounded-3xl p-6 relative overflow-hidden min-h-[160px] flex flex-col justify-end">
                        <img 
                          src={selectedCourse.image} 
                          alt="aula banner" 
                          className="absolute inset-0 w-full h-full object-cover opacity-20 filter saturate-50" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                        <div className="relative z-10 space-y-2">
                          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">
                            MÓDULO {activeModuleIndex + 1} DE {selectedCourse.modules.length}
                          </span>
                          <h4 className="text-lg font-black tracking-tight leading-none text-white">
                            {selectedCourse.modules[activeModuleIndex]}
                          </h4>
                        </div>
                      </div>

                      {/* Interactive click hotspot simulation */}
                      {(() => {
                        const currentModuleContent = getModuleContent(
                          selectedCourse.id,
                          activeModuleIndex,
                          selectedCourse.title,
                          selectedCourse.modules[activeModuleIndex] || ""
                        );
                        return (
                          <>
                            <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5" /> INTERATIVIDADE: Clique nas bolhas para explorar conceitos importantes:
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                {currentModuleContent.hotspots.map((hot) => (
                                  <div 
                                    key={hot.id}
                                    onClick={() => {
                                      setActiveHotspot(activeHotspot === hot.id ? null : hot.id);
                                      speakText(hot.text);
                                    }}
                                    className={`p-3.5 rounded-2xl border transition duration-200 cursor-pointer ${
                                      activeHotspot === hot.id 
                                        ? "bg-slate-900 border-slate-800 text-white" 
                                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                    }`}
                                  >
                                    <h5 className="text-xs font-black">{hot.title}</h5>
                                    {activeHotspot === hot.id && (
                                      <p className="text-[11px] text-emerald-400 mt-2 leading-relaxed font-medium">
                                        {hot.text}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Explanatory core content using high quality clinical case layout */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">ESTUDO DE CASO CLÍNICO REAL</h4>
                              <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed">
                                <span className="font-extrabold block mb-1">{currentModuleContent.caseStudy.title}:</span>
                                {currentModuleContent.caseStudy.text}
                              </div>
                            </div>
                          </>
                        );
                      })()}

                      {/* Bottom navigation slide buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <button
                          disabled={activeModuleIndex === 0}
                          onClick={() => setActiveModuleIndex(p => p - 1)}
                          className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Anterior
                        </button>

                        {activeModuleIndex < selectedCourse.modules.length - 1 ? (
                          <button
                            onClick={() => setActiveModuleIndex(p => p + 1)}
                            className="px-5 py-2.5 bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-white rounded-xl text-xs font-black tracking-wide transition cursor-pointer"
                          >
                            Avançar Módulo
                          </button>
                        ) : (
                          <button
                            onClick={() => setInteractiveQuizActive(true)}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-wider transition cursor-pointer"
                          >
                            Ir para o Quiz Final (10 Questões)
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* 10 Question Interactive Quiz Panel */
                    <div className="space-y-6">
                      
                      {/* Top status bar */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">AVALIAÇÃO FINAL COMPLIANCE</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Banca Interna Hospitalar • Meta de 70% para aprovação</p>
                        </div>

                        <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-mono font-bold text-xs">
                          {currentQuizIdx + 1} de {LMS_QUIZ_QUESTIONS["lms-c2"].length} Questões
                        </span>
                      </div>

                      {!quizSubmitted ? (
                        /* Standard Quiz screen */
                        <div className="space-y-6">
                          
                          {/* Question Statement */}
                          <div className="space-y-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase border border-emerald-200">
                              Questão {currentQuizIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed">
                              {LMS_QUIZ_QUESTIONS["lms-c2"][currentQuizIdx].question}
                            </p>
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            {LMS_QUIZ_QUESTIONS["lms-c2"][currentQuizIdx].options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => selectQuizAnswer(currentQuizIdx, oIdx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center gap-3 cursor-pointer ${
                                  selectedAnswers[currentQuizIdx] === oIdx 
                                    ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-100/50" 
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  selectedAnswers[currentQuizIdx] === oIdx ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                                }`}>
                                  {selectedAnswers[currentQuizIdx] === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>

                          {/* Prev/Next buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <button
                              disabled={currentQuizIdx === 0}
                              onClick={() => setCurrentQuizIdx(p => p - 1)}
                              className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              Voltar
                            </button>

                            {currentQuizIdx < LMS_QUIZ_QUESTIONS["lms-c2"].length - 1 ? (
                              <button
                                onClick={() => setCurrentQuizIdx(p => p + 1)}
                                className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Próxima Questão
                              </button>
                            ) : (
                              <button
                                onClick={submitQuiz}
                                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase text-xs tracking-wider transition cursor-pointer"
                              >
                                Enviar para Avaliação
                              </button>
                            )}
                          </div>

                        </div>
                      ) : (
                        /* Quiz results screen and instant feedbacks */
                        <div className="space-y-6">
                          
                          {/* Score visual card */}
                          <div className={`p-6 rounded-3xl text-center space-y-2 border ${
                            quizScore >= 70 ? "bg-emerald-50/50 border-emerald-100 text-emerald-950" : "bg-rose-50/50 border-rose-100 text-rose-950"
                          }`}>
                            <Trophy className={`w-12 h-12 mx-auto ${quizScore >= 70 ? "text-amber-500 animate-bounce" : "text-rose-400"}`} />
                            <h3 className="text-base font-black">
                              {quizScore >= 70 ? "Parabéns! Você foi Aprovado!" : "Infelizmente você não alcançou os 70%"}
                            </h3>
                            <p className="text-xs">Sua nota final foi de **{quizScore}%** acertos.</p>
                          </div>

                          {/* Detailed feedback list */}
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            <h5 className="text-xs font-extrabold uppercase text-slate-400">Revisão do Gabarito Comentado</h5>
                            {LMS_QUIZ_QUESTIONS["lms-c2"].map((q, idx) => {
                              const isCorrect = selectedAnswers[idx] === q.correctIndex;
                              return (
                                <div key={q.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                                  <div className="flex justify-between items-start gap-2">
                                    <p className="font-extrabold text-slate-800">{idx + 1}. {q.question}</p>
                                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider ${
                                      isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                    }`}>
                                      {isCorrect ? "Acertou" : "Errou"}
                                    </span>
                                  </div>
                                  <p className="text-slate-500 leading-normal">
                                    <strong className="text-slate-700">Resposta Correta:</strong> {q.options[q.correctIndex]}
                                  </p>
                                  <p className="text-[11px] text-blue-900 bg-blue-50/40 p-2 rounded-lg border border-blue-100/50">
                                    <strong className="text-blue-950">Explicação Científica:</strong> {q.explanation}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Certificate download trigger if approved */}
                          {quizScore >= 70 && certificateEarned && (
                            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl text-slate-950 space-y-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-950/80">CERTIFICADO EMITIDO</span>
                                <h4 className="text-base font-black tracking-tight leading-none">Certificado de Extensão e Educação Continuada</h4>
                                <p className="text-xs font-semibold text-slate-900/90">Carregado com sucesso no seu perfil do Lynx EDU LMS!</p>
                              </div>

                              {/* Realistic generated preview certificate inside the app */}
                              <div className="p-6 bg-white border-8 border-double border-slate-800 rounded-2xl text-center space-y-4 text-slate-800 max-w-lg mx-auto shadow-md">
                                <span className="block text-xs font-serif font-black tracking-widest text-slate-500 uppercase">LYNX EDU SISTEMAS ESCOLARES INTELIGENTES</span>
                                <h3 className="text-base sm:text-lg font-serif font-black tracking-tight">CERTIFICADO DE CONCLUSÃO</h3>
                                <p className="text-xs font-serif leading-relaxed italic text-slate-600">
                                  Certificamos para os devidos fins legais que o aluno(a) **{user.name}** concluiu com aproveitamento de excelência o treinamento regulamentar de **{selectedCourse.title}**, com carga horária de **{selectedCourse.duration} horas** letivas, na data de 11 de Julho de 2026.
                                </p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                                  <span>QR Code: Validado ✓</span>
                                  <span>Código: LYNX-LMS-{selectedCourse.id.toUpperCase()}</span>
                                </div>
                              </div>

                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => window.print()}
                                  className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-900"
                                >
                                  <Printer className="w-4 h-4" /> Imprimir Certificado
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Footer restart buttons */}
                          <div className="flex gap-2 justify-end pt-3">
                            {quizScore < 70 && (
                              <button
                                onClick={resetQuiz}
                                className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Tentar Novamente
                              </button>
                            )}

                            <button
                              onClick={() => { setSelectedCourse(null); setInteractiveQuizActive(false); }}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                            >
                              Sair para Painel
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* HR Admin: Cadastrar Curso Modal representation */}
      <AnimatePresence>
        {showAddCourseModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full overflow-hidden shadow-xl"
            >
              <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-wider">Novo Curso Corporativo</h3>
                <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="p-6 space-y-4 text-xs text-slate-700">
                <div className="space-y-1">
                  <label className="block font-bold">Título da Trilha</label>
                  <input
                    type="text"
                    required
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="Ex: Farmacologia Básica na Enfermagem"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">Categoria</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as LmsCourse["category"])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="Enfermagem">Enfermagem</option>
                    <option value="Radiologia">Radiologia</option>
                    <option value="Instrumentação Cirúrgica">Instrumentação Cirúrgica</option>
                    <option value="Segurança do Paciente">Segurança do Paciente</option>
                    <option value="Humanização">Humanização</option>
                    <option value="Desenvolvimento Profissional">Desenvolvimento Profissional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">Professor / Instrutor</label>
                  <input
                    type="text"
                    value={newCourseInstructor}
                    onChange={(e) => setNewCourseInstructor(e.target.value)}
                    placeholder="Ex: Profª Marina Silva"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">Breve Descrição</label>
                  <textarea
                    value={newCourseDesc}
                    onChange={(e) => setNewCourseDesc(e.target.value)}
                    placeholder="Descreva brevemente o conteúdo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-h-[60px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">Carga Horária (Horas)</label>
                  <input
                    type="number"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black uppercase rounded-xl"
                  >
                    Salvar Trilha
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCourseModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
