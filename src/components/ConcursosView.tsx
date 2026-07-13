import React, { useState, useEffect } from "react";
import { 
  Trophy, Award, HelpCircle, BookOpen, CheckCircle, XCircle, AlertCircle, 
  ChevronRight, RefreshCw, Play, Clock, ClipboardList, Sparkles, ArrowRight, 
  Target, ThumbsUp, Lightbulb, Activity, ArrowLeft, Trash2
} from "lucide-react";
import { motion } from "motion/react";
import { User } from "../types";
import { LOCAL_CONCURSOS_QUESTIONS, ConcursoQuestion } from "../data/concursosQuestions";

interface ConcursosViewProps {
  user: User;
}

interface SimuladoHistoryItem {
  id: string;
  course: string;
  theme: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  isAi: boolean;
}

const THEMES = [
  "Todos / Geral",
  "Legislação do SUS & Ética Profissional",
  "Procedimentos Técnicos & Práticas Clínicas",
  "Emergência & Primeiros Socorros",
  "Anatomia & Fisiologia Humana",
  "Segurança e Normas Regulamentadoras"
];

const QUANTITIES = [5, 10, 20, 50, 100];

export default function ConcursosView({ user }: ConcursosViewProps) {
  // Config States
  const [selectedCourse, setSelectedCourse] = useState(user.course || "Técnico em Enfermagem");
  const [selectedTheme, setSelectedTheme] = useState("Todos / Geral");
  const [selectedQty, setSelectedQty] = useState(5);
  const [useAI, setUseAI] = useState(false);
  
  // Game/Simulation States
  const [status, setStatus] = useState<"config" | "loading" | "active" | "completed">("config");
  const [questions, setQuestions] = useState<ConcursoQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerConfirmed, setAnswerConfirmed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // holds indices of selected answers
  const [score, setScore] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Preparando simulado...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Stats and History States
  const [history, setHistory] = useState<SimuladoHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"simular" | "historico">("simular");
  const [errorMsg, setErrorMsg] = useState("");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`oc_simulados_history_${user.id}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Erro ao carregar histórico de simulados", e);
    }
  }, [user.id]);

  // Adjust pre-selected course when user changes
  useEffect(() => {
    if (user.course) {
      setSelectedCourse(user.course);
    }
  }, [user.course]);

  // Handle Starting Simulado
  const handleStartSimulado = async () => {
    setStatus("loading");
    setLoadingProgress(0);
    setErrorMsg("");
    setLoadingMessage(useAI ? "Iniciando inteligência artificial..." : "Acessando banco de questões...");

    let progressTimer: any;
    const startProgressAnimation = (targetDuration: number) => {
      const startTime = Date.now();
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(95, Math.floor((elapsed / targetDuration) * 95));
        setLoadingProgress(pct);

        // Update loading message dynamically based on progress for extra detail and polish
        if (useAI) {
          if (pct < 25) {
            setLoadingMessage("Conectando ao modelo de linguagem clínica da Lynx EDU...");
          } else if (pct < 55) {
            setLoadingMessage("Sincronizando com editais públicos recentes (EBSERH, SUS)...");
          } else if (pct < 80) {
            setLoadingMessage("Estruturando enunciados de concursos e alternativas técnicos...");
          } else {
            setLoadingMessage("Gerando gabarito detalhado com explicações do professor...");
          }
        } else {
          if (pct < 50) {
            setLoadingMessage("Pesquisando no banco de dados local da Lynx EDU...");
          } else {
            setLoadingMessage("Extraindo questões selecionadas para o simulado...");
          }
        }
      }, 70);
    };

    try {
      if (useAI) {
        startProgressAnimation(4000); // 4 seconds animation target for AI
        
        // Call backend API
        const response = await fetch("/api/concursos-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course: selectedCourse,
            theme: selectedTheme,
            quantity: selectedQty
          })
        });

        clearInterval(progressTimer);

        if (!response.ok) {
          throw new Error("Não foi possível gerar questões de simulado por IA.");
        }

        const data = await response.json();

        if (data.mock) {
          // Graceful fallback if no API key
          setLoadingMessage("IA indisponível. Carregando do nosso banco offline...");
          setLoadingProgress(85);
          await new Promise(resolve => setTimeout(resolve, 800));
          setLoadingProgress(100);
          await new Promise(resolve => setTimeout(resolve, 300));
          loadLocalQuestions();
        } else if (Array.isArray(data) && data.length > 0) {
          setLoadingProgress(100);
          setLoadingMessage("Simulado gerado com sucesso!");
          await new Promise(resolve => setTimeout(resolve, 400));
          setQuestions(data);
          startSimulation(data);
        } else {
          throw new Error("Formato de questões geradas por IA inválido.");
        }
      } else {
        // Offline / Local
        startProgressAnimation(1200); // 1.2 seconds animation target for offline
        await new Promise(resolve => setTimeout(resolve, 1200));
        clearInterval(progressTimer);
        setLoadingProgress(100);
        setLoadingMessage("Questões carregadas!");
        await new Promise(resolve => setTimeout(resolve, 300));
        loadLocalQuestions();
      }
    } catch (error: any) {
      if (progressTimer) clearInterval(progressTimer);
      console.error(error);
      setErrorMsg(error.message || "Erro de conexão ao gerar simulado por IA. Iniciando com questões locais.");
      
      setLoadingMessage("Sincronizando modo offline de segurança...");
      setLoadingProgress(80);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      loadLocalQuestions();
    }
  };

  const loadLocalQuestions = () => {
    // Filter questions by course
    let filtered = LOCAL_CONCURSOS_QUESTIONS.filter(q => q.course === selectedCourse);

    // Filter by theme if not general
    if (selectedTheme !== "Todos / Geral") {
      filtered = filtered.filter(q => q.theme === selectedTheme);
    }

    // If we don't have enough matching questions, backfill from the same course general pool
    if (filtered.length === 0) {
      filtered = LOCAL_CONCURSOS_QUESTIONS.filter(q => q.course === selectedCourse);
    }

    // Shuffle and slice
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, selectedQty);

    // If finalQuestions has fewer items than requested, we can mix general health questions
    if (finalQuestions.length === 0) {
      // Emergency ultimate fallback
      finalQuestions.push({
        id: "fallback-1",
        course: selectedCourse,
        theme: "Procedimentos Técnicos",
        origin: "Concurso Lynx EDU - 2025",
        question: "De acordo com os preceitos de assepsia e controle de infecção hospitalar, qual é a medida individual mais simples e de maior impacto comprovado para a prevenção de infecções em ambientes de saúde?",
        options: [
          "A) Utilização sistemática de luvas estéreis em todos os procedimentos.",
          "B) Higienização correta das mãos com água e sabonete ou preparação alcoólica.",
          "C) Uso contínuo de máscaras do tipo N95 por toda a equipe.",
          "D) Desinfecção diária de todas as paredes das enfermarias com cloro ativo.",
          "E) Esterilização em autoclave de todos os prontuários físicos."
        ],
        correctIndex: 1,
        explanation: "A higienização das mãos é mundialmente reconhecida como a medida primária mais barata, simples e eficaz para prevenir a transmissão de patógenos e reduzir infecções relacionadas à assistência à saúde (IRAS)."
      });
    }

    setQuestions(finalQuestions);
    startSimulation(finalQuestions);
  };

  const startSimulation = (qList: ConcursoQuestion[]) => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerConfirmed(false);
    setUserAnswers([]);
    setScore(0);
    setStatus("active");
  };

  // Option select handler
  const handleSelectOption = (index: number) => {
    if (answerConfirmed) return;
    setSelectedOption(index);
  };

  // Confirm Answer handler
  const handleConfirmAnswer = () => {
    if (selectedOption === null || answerConfirmed) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, selectedOption]);
    setAnswerConfirmed(true);
  };

  // Next Question handler
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswerConfirmed(false);
    } else {
      // Completed!
      handleCompleteSimulado();
    }
  };

  // Handle Simulado Completion
  const handleCompleteSimulado = () => {
    const finalScore = score + (selectedOption === questions[currentIndex].correctIndex && !answerConfirmed ? 1 : 0);
    const finalAnswers = [...userAnswers];
    if (!answerConfirmed && selectedOption !== null) {
      finalAnswers.push(selectedOption);
    }

    const percentage = Math.round((score / questions.length) * 100);
    
    // Save history item
    const newHistoryItem: SimuladoHistoryItem = {
      id: "sim-" + Date.now(),
      course: selectedCourse,
      theme: selectedTheme,
      score: score,
      total: questions.length,
      percentage: percentage,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      isAi: useAI
    };

    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem(`oc_simulados_history_${user.id}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error(e);
    }

    setStatus("completed");
  };

  const handleDeleteHistoryItem = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== idToDelete);
    setHistory(updated);
    localStorage.setItem(`oc_simulados_history_${user.id}`, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (window.confirm("Deseja realmente apagar todo o seu histórico de simulados?")) {
      setHistory([]);
      localStorage.removeItem(`oc_simulados_history_${user.id}`);
    }
  };

  // Performance Rating Calculations
  const getRatingInfo = (percent: number) => {
    if (percent === 100) {
      return {
        title: "Gabaritou! Desempenho Perfeito",
        color: "text-emerald-500 bg-emerald-50 border-emerald-200",
        message: "Espetacular! Você acertou todas as questões. Esse desempenho é digno de primeiro lugar em concursos públicos de alto nível!"
      };
    } else if (percent >= 80) {
      return {
        title: "Excelente Preparação!",
        color: "text-blue-500 bg-blue-50 border-blue-200",
        message: "Excelente! Você demonstrou domínio sólido e amplo das matérias. Está no caminho ideal para a aprovação."
      };
    } else if (percent >= 50) {
      return {
        title: "Bom Trabalho! Continue Focado",
        color: "text-amber-500 bg-amber-50 border-amber-200",
        message: "Muito bom! Você acertou mais da metade do simulado. Revise os pontos onde errou usando as justificativas abaixo para alcançar o topo."
      };
    } else {
      return {
        title: "Foco nos Estudos & Revisão",
        color: "text-red-500 bg-red-50 border-red-200",
        message: "Não desanime de forma alguma! O simulado serve exatamente para mapear os pontos fracos. Revise as explicações detalhadas e refaça a prova."
      };
    }
  };

  const getThemeStatistics = () => {
    if (history.length === 0) return null;
    const totalSims = history.length;
    const avgPercentage = Math.round(history.reduce((acc, curr) => acc + curr.percentage, 0) / totalSims);
    const bestPercentage = Math.max(...history.map(item => item.percentage));
    return { totalSims, avgPercentage, bestPercentage };
  };

  const stats = getThemeStatistics();

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="concursos-view-container">
      {/* View Header Tabs */}
      {status === "config" && (
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("simular")}
              className={`pb-3 text-sm font-bold border-b-2 transition relative ${
                activeTab === "simular" 
                  ? "text-blue-600 border-blue-600" 
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Novo Simulado
              </span>
            </button>
            <button
              onClick={() => setActiveTab("historico")}
              className={`pb-3 text-sm font-bold border-b-2 transition relative ${
                activeTab === "historico" 
                  ? "text-blue-600 border-blue-600" 
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Histórico de Provas
                {history.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">
                    {history.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- CONFIG PORTAL SCREEN ----------------- */}
      {status === "config" && activeTab === "simular" && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-8"
        >
          {/* Welcome Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Simulado para Concursos Públicos de Saúde</h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Prepare-se com milhares de questões de provas de concursos recentes do Brasil. Teste seus conhecimentos práticos e teóricos de forma direcionada.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Selecione a Especialidade</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition appearance-none cursor-pointer font-medium"
                >
                  <option value="Técnico em Enfermagem">Técnico em Enfermagem</option>
                  <option value="Técnico em Radiologia">Técnico em Radiologia</option>
                  <option value="Técnico em Segurança do Trabalho">Técnico em Segurança do Trabalho</option>
                  <option value="Especialização em Instrumentação Cirúrgica">Especialização em Instrumentação Cirúrgica</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">Padrão pré-selecionado de acordo com seu perfil acadêmico.</p>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Tema do Simulado</label>
              <div className="relative">
                <HelpCircle className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition appearance-none cursor-pointer font-medium"
                >
                  {THEMES.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400">Selecione um tópico específico ou misture todos.</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Quantidade de Questões</label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-mono">
                  {selectedQty} {selectedQty === 1 ? "Questão" : "Questões"}
                </span>
              </div>
              
              {/* Presets */}
              <div className="flex gap-2">
                {QUANTITIES.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSelectedQty(qty)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      selectedQty === qty 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10" 
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              {/* Slider and Input row */}
              <div className="flex items-center gap-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(parseInt(e.target.value) || 5)}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={selectedQty}
                    onChange={(e) => {
                      const val = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 100);
                      setSelectedQty(val);
                    }}
                    className="w-14 text-center py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                  <span className="text-[10px] font-bold text-slate-400">MÁX 100</span>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Mecanismo do Simulado</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUseAI(false)}
                  className={`p-3 text-left rounded-2xl border transition flex flex-col gap-1 cursor-pointer ${
                    !useAI 
                      ? "bg-blue-50/60 border-blue-200 ring-1 ring-blue-500/20" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className={`text-xs font-bold ${!useAI ? "text-blue-700" : "text-slate-800"}`}>Banco Concursos OC</span>
                  <span className="text-[10px] text-slate-500">Questões reais pré-selecionadas off-line.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseAI(true)}
                  className={`p-3 text-left rounded-2xl border transition flex flex-col gap-1 cursor-pointer ${
                    useAI 
                      ? "bg-violet-50/60 border-violet-200 ring-1 ring-violet-500/20" 
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${useAI ? "text-violet-700" : "text-slate-800"}`}>
                    Gerador Inteligente IA <Sparkles className="w-3 h-3 text-violet-500 fill-violet-500/10" />
                  </span>
                  <span className="text-[10px] text-slate-500">Gera milhares de questões inéditas recentes de provas por IA.</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 text-xs text-slate-600">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed space-y-1">
              <p className="font-bold text-slate-800">Dica de Sucesso para Concursos:</p>
              <p>Recomendamos começar com simulados de 5 a 10 questões rápidas sobre <strong>Legislação do SUS</strong>, que é comum a praticamente todas as provas de residência e hospitais municipais/estaduais.</p>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            onClick={handleStartSimulado}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 text-base cursor-pointer"
            id="start-simulado-btn"
          >
            <Play className="w-5 h-5 fill-white" />
            Iniciar Prova Simulada
          </button>
        </motion.div>
      )}

      {/* ----------------- HISTORICO SCREEN ----------------- */}
      {status === "config" && activeTab === "historico" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6"
        >
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Suas Provas Recentes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Veja seu progresso acadêmico histórico nos simulados de concursos.</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs font-semibold text-red-500 hover:text-red-700 transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Apagar Tudo
              </button>
            )}
          </div>

          {/* Performance Summary Cards */}
          {history.length > 0 && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">Total de Simulados</p>
                <p className="text-2xl font-black text-slate-800">{stats.totalSims}</p>
              </div>
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">Média de Acertos</p>
                <p className={`text-2xl font-black ${stats.avgPercentage >= 70 ? "text-emerald-600" : stats.avgPercentage >= 50 ? "text-amber-500" : "text-red-500"}`}>{stats.avgPercentage}%</p>
              </div>
              <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">Melhor Pontuação</p>
                <p className="text-2xl font-black text-blue-600">{stats.bestPercentage}%</p>
              </div>
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Nenhum simulado registrado</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Você ainda não completou nenhuma prova. Vá para a aba 'Novo Simulado' e faça sua primeira tentativa!</p>
              </div>
              <button
                onClick={() => setActiveTab("simular")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Começar Agora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                        {item.course}
                      </span>
                      {item.isAi && (
                        <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> IA
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      Tema: <span className="text-slate-500 font-normal">{item.theme}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-500">Acertos</p>
                      <p className="text-sm font-black text-slate-900">
                        {item.score} de {item.total} <span className="text-xs text-slate-400 font-normal">({item.percentage}%)</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Circle visual progress */}
                      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="18" cy="18" r="14" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
                          <circle 
                            cx="18" 
                            cy="18" 
                            r="14" 
                            stroke={item.percentage >= 70 ? "#10b981" : item.percentage >= 50 ? "#f59e0b" : "#ef4444"} 
                            strokeWidth="3" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 14}
                            strokeDashoffset={2 * Math.PI * 14 * (1 - item.percentage / 100)}
                          />
                        </svg>
                        <span className="absolute text-[10px] font-black text-slate-700">{item.percentage}%</span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Apagar este simulado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ----------------- LOADING STATE SCREEN ----------------- */}
      {status === "loading" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center flex flex-col justify-center items-center min-h-[380px] space-y-6 animate-fade-in" id="concursos-loading-screen">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-ping duration-1000"></div>
            <div className="absolute inset-2 bg-blue-500/10 rounded-full animate-pulse"></div>
            
            <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-600 to-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 max-w-md w-full">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-wider text-blue-600 uppercase">Simulador de Concursos</span>
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight transition-all duration-300">
                {loadingMessage}
              </h3>
            </div>

            {/* Smooth animated progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 p-[2px]">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center px-1 text-[10px] font-bold text-slate-400 font-mono">
                <span>{useAI ? "PROCESSANDO MODELO DE IA" : "BUSCANDO BANCO LOCAL"}</span>
                <span className="text-blue-600">{loadingProgress}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Garantindo o pleno alinhamento com os editais da EBSERH, SUS, prefeituras brasileiras e as diretrizes e normas regulamentadoras nacionais de saúde.
            </p>
          </div>
        </div>
      )}

      {/* ----------------- ACTIVE TEST SIMULATION SCREEN ----------------- */}
      {status === "active" && questions.length > 0 && (
        <div className="space-y-6">
          {/* Simulation Header */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-0.5">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                {selectedCourse}
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Tema: <span className="font-normal text-slate-500">{selectedTheme}</span>
              </h3>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
              <div className="text-left md:text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Progresso da Prova</p>
                <p className="text-sm font-extrabold text-slate-800">Questão {currentIndex + 1} de {questions.length}</p>
              </div>

              {/* Progress Tracker circular */}
              <div className="w-10 h-10 shrink-0 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="20" 
                    cy="20" 
                    r="16" 
                    stroke="#2563eb" 
                    strokeWidth="3" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 * (1 - (currentIndex + 1) / questions.length)}
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-slate-700">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Question Box Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            {/* Linear Progress Indicator */}
            <div className="h-1.5 w-full bg-slate-100">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Origin Tag */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[11px] font-bold rounded-xl flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> {questions[currentIndex].origin}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: #{questions[currentIndex].id}</span>
              </div>

              {/* Question Body Text */}
              <h4 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed font-sans">
                {questions[currentIndex].question}
              </h4>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {questions[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === questions[currentIndex].correctIndex;
                  
                  let optionStyle = "border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-50";
                  if (isSelected && !answerConfirmed) {
                    optionStyle = "border-blue-500 bg-blue-50/40 text-blue-950 ring-2 ring-blue-500/20";
                  }
                  
                  if (answerConfirmed) {
                    if (isCorrectAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-50/40 text-emerald-950 ring-2 ring-emerald-500/20";
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-50/40 text-red-950 ring-2 ring-red-500/20";
                    } else {
                      optionStyle = "border-slate-200 bg-slate-100/30 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={answerConfirmed}
                      className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition flex items-start gap-3 relative cursor-pointer ${optionStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                        isSelected && !answerConfirmed
                          ? "bg-blue-600 text-white"
                          : answerConfirmed && isCorrectAnswer
                            ? "bg-emerald-600 text-white"
                            : answerConfirmed && isSelected
                              ? "bg-red-600 text-white"
                              : "bg-white text-slate-400 border border-slate-200"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      
                      <span className="flex-1 leading-relaxed">{option}</span>

                      {answerConfirmed && isCorrectAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                      )}
                      {answerConfirmed && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 self-center" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanations & Correction Panel (Displays after answer confirmation) */}
              {answerConfirmed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border ${
                    selectedOption === questions[currentIndex].correctIndex 
                      ? "bg-emerald-50/30 border-emerald-100" 
                      : "bg-red-50/20 border-red-100"
                  } space-y-3`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${
                      selectedOption === questions[currentIndex].correctIndex 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedOption === questions[currentIndex].correctIndex ? (
                        <ThumbsUp className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`text-sm font-bold ${
                      selectedOption === questions[currentIndex].correctIndex ? "text-emerald-800" : "text-red-800"
                    }`}>
                      {selectedOption === questions[currentIndex].correctIndex 
                        ? "Você acertou! Parabéns!" 
                        : "Incorreto. Mas tudo bem, veja a justificativa abaixo para aprender:"}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-8">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" /> Justificativa Detalhada
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                      {questions[currentIndex].explanation}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {!answerConfirmed ? (
                  <button
                    type="button"
                    onClick={handleConfirmAnswer}
                    disabled={selectedOption === null}
                    className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                      selectedOption === null 
                        ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
                    }`}
                  >
                    Confirmar Resposta
                    <CheckCircle className="w-4.5 h-4.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {currentIndex + 1 < questions.length ? (
                      <>
                        Próxima Questão
                        <ChevronRight className="w-4.5 h-4.5" />
                      </>
                    ) : (
                      <>
                        Ver Resultados do Simulado
                        <Trophy className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- COMPLETED / RESULT METRICS SCREEN ----------------- */}
      {status === "completed" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Main Score Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6 md:space-y-8 text-center relative overflow-hidden">
            {/* Ambient Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-md">
                🏆
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">Simulado Finalizado!</h2>
                <p className="text-xs text-slate-400">Progresso completado com sucesso.</p>
              </div>

              {/* Circular score gauge */}
              <div className="py-2 flex justify-center">
                <div className="relative w-36 h-36 flex flex-col items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="#2563eb" 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - score / questions.length)}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-black text-slate-900">{score}/{questions.length}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Acertos</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Feedback Card */}
              {(() => {
                const percent = Math.round((score / questions.length) * 100);
                const rating = getRatingInfo(percent);
                return (
                  <div className={`p-4 rounded-2xl border text-left space-y-2 ${rating.color}`}>
                    <p className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-blue-600" /> {rating.title}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {rating.message}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 max-w-lg mx-auto">
              <button
                onClick={() => setStatus("config")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Configurar Outro
              </button>

              <button
                onClick={() => startSimulation(questions)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Refazer Esta Prova
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ClipboardList className="w-5 h-5 text-blue-500" /> Revisão de Questões do Simulado
            </h3>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userAnswerIdx = userAnswers[idx];
                const isCorrect = userAnswerIdx === q.correctIndex;

                return (
                  <div key={q.id} className="p-5 border border-slate-100 rounded-2xl space-y-4 hover:border-slate-200 transition">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs text-slate-400 font-mono font-bold uppercase">{q.origin}</span>
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {isCorrect ? "Acertou" : "Errou"}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="text-sm font-bold text-slate-800 leading-relaxed font-sans">{q.question}</p>

                    {/* Options list static review */}
                    <div className="space-y-2 pl-2">
                      {q.options.map((option, oIdx) => {
                        const isChosen = userAnswerIdx === oIdx;
                        const isCorrectOpt = oIdx === q.correctIndex;

                        let optClass = "text-slate-500";
                        if (isCorrectOpt) {
                          optClass = "text-emerald-700 font-bold flex items-center gap-1.5";
                        } else if (isChosen && !isCorrect) {
                          optClass = "text-red-700 font-bold flex items-center gap-1.5";
                        }

                        return (
                          <div key={oIdx} className={`text-xs p-2 rounded-xl flex items-start gap-2 ${
                            isCorrectOpt 
                              ? "bg-emerald-50/50" 
                              : isChosen 
                                ? "bg-red-50/30" 
                                : ""
                          }`}>
                            <span className={`w-5 h-5 shrink-0 rounded-md font-mono flex items-center justify-center text-[10px] font-bold ${
                              isCorrectOpt 
                                ? "bg-emerald-500 text-white" 
                                : isChosen 
                                  ? "bg-red-500 text-white" 
                                  : "bg-slate-100 text-slate-500"
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className={optClass}>{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanations block */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 text-xs text-slate-600 leading-relaxed space-y-1.5 font-sans">
                      <p className="font-extrabold text-slate-700 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Explicação e Correção:
                      </p>
                      <p className="whitespace-pre-line">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  setStatus("config");
                  setActiveTab("simular");
                }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar ao Início dos Simulados
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
