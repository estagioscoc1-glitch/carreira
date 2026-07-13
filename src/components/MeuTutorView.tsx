import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "../types";
import { LOCAL_CONCURSOS_QUESTIONS } from "../data/concursosQuestions";
import { 
  Sparkles, MessageSquare, BookOpen, Award, CheckCircle, Zap, Star, Trophy, 
  X, Send, RotateCcw, Flame, Brain, ChevronRight, Play, Eye, 
  AlertTriangle, ArrowRight, HelpCircle, GraduationCap, Clock, ClipboardList, Target, ChevronLeft
} from "lucide-react";

interface MeuTutorViewProps {
  user: User;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface SimuladoQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  competence: string;
  recommendedTime: string;
  explanation: string;
  scientificJustification?: string;
  mnemonic?: string;
  trap?: string;
  relatedTopics?: string[];
  reference?: string;
}

export default function MeuTutorView({ user }: MeuTutorViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "lesson" | "simulado">("chat");
  const [isConcursoMode, setIsConcursoMode] = useState(false);

  // --- CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- LESSON STATE ---
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonMarkdown, setLessonMarkdown] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [activeLessonTab, setActiveLessonTab] = useState<"all" | "summary" | "flashcards" | "checklist">("all");
  const [flashcardFlipped, setFlashcardFlipped] = useState<Record<number, boolean>>({});

  // --- SIMULADO STATE ---
  const [simuladoBanca, setSimuladoBanca] = useState("VUNESP");
  const [simuladoCount, setSimuladoCount] = useState(10);
  const [simuladoMode, setSimuladoMode] = useState("Simulado Personalizado");
  const [simuladoLoading, setSimuladoLoading] = useState(false);
  const [simuladoQuestions, setSimuladoQuestions] = useState<SimuladoQuestion[]>([]);
  const [simuladoActive, setSimuladoActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [simuladoStartTime, setSimuladoStartTime] = useState<number | null>(null);
  const [simuladoElapsedTime, setSimuladoElapsedTime] = useState(0);
  const [simuladoFinished, setSimuladoFinished] = useState(false);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const suggestedTopics: Record<string, string[]> = {
    "Técnico em Enfermagem": [
      "Administração de Medicamentos e Cálculos",
      "Biossegurança e NR-32 na Enfermagem",
      "Anotações de Enfermagem e Ética Profissional COFEN",
      "Sinais Vitais e Semiologia Básica"
    ],
    "Técnico em Radiologia": [
      "Princípio ALARA e Proteção Radiológica",
      "Física das Radiações e Dosimetria",
      "Posicionamentos Radiológicos Convencionais",
      "Mamografia Digital e Tomografia de Crânio"
    ],
    "Técnico em Segurança do Trabalho": [
      "NR-01 (Disposições Gerais e PGR)",
      "CIPA (NR-05) e Investigação de Acidentes",
      "NR-35 (Trabalho em Altura) e Gestão de Riscos",
      "LTCAT, PCMSO e Perfil Profissiográfico Previdenciário (PPP)"
    ],
    "Especialização em Instrumentação Cirúrgica": [
      "Tempos Cirúrgicos e Paramentação Cirúrgica",
      "Montagem da Mesa de Instrumentos e CME",
      "Controle de Infecção no Bloco Operatório",
      "Normas de Biossegurança no Centro Cirúrgico"
    ]
  };

  const getSuggested = () => {
    return suggestedTopics[user.course] || [
      "Anatomia e Fisiologia Humana Básica",
      "Biossegurança Aplicada à Saúde",
      "Urgência e Emergência e Suporte Básico de Vida"
    ];
  };

  // Set initial chat messages
  useEffect(() => {
    const defaultWelcome = `Olá, **${user.name}**! Eu sou o seu **Tutor IA Supremo**. 
Equipado com o conhecimento de dezenas de professores doutores, especialistas de concursos e revisores de prova da área de **${user.course}**, estou aqui para preparar você para a aprovação definitiva e excelência no mercado de trabalho.

Como deseja iniciar seus estudos hoje?
* **Tira-Dúvidas**: Pode mandar qualquer pergunta teórica ou sobre provas.
* **Gerador de Aulas**: Digite ou selecione um tema para eu criar uma aula sob medida.
* **Simulados Inteligentes**: Escolha uma banca e teste seus conhecimentos com correção científica detalhada.`;

    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        text: defaultWelcome,
        timestamp: new Date()
      }
    ]);
  }, [user.course, user.name]);

  // Scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Simulado timer tick
  useEffect(() => {
    if (simuladoActive && !simuladoFinished) {
      timerRef.current = setInterval(() => {
        setSimuladoElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simuladoActive, simuladoFinished]);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/meu-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          course: user.course,
          studentName: user.name,
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, text: m.text })),
          isConcursoMode: isConcursoMode
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setChatMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: data.text,
          timestamp: new Date()
        }
      ]);
    } catch {
      setChatMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Ops! Tive uma pequena distração tentando consultar os arquivos técnicos. Poderia reformular ou repetir sua dúvida?",
          timestamp: new Date()
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateLesson = async (topic: string) => {
    if (!topic.trim()) return;
    setLessonTopic(topic);
    setLessonLoading(true);
    setLessonMarkdown(null);
    setActiveLessonTab("all");
    setFlashcardFlipped({});

    try {
      const response = await fetch("/api/meu-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lesson",
          course: user.course,
          theme: topic,
          studentName: user.name
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setLessonMarkdown(data.lessonMarkdown);
    } catch {
      setLessonMarkdown(`## Erro ao gerar aula\n\nDesculpe! Não foi possível gerar a aula para o tema **"${topic}"** no momento devido a uma falha na conexão técnica com o Tutor Supremo. Por favor, tente novamente.`);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleStartSimulado = async () => {
    setSimuladoLoading(true);
    setSimuladoQuestions([]);
    setSelectedAnswers({});
    setShowHint({});
    setSimuladoFinished(false);
    setSimuladoElapsedTime(0);

    try {
      const response = await fetch("/api/meu-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulado",
          course: user.course,
          board: simuladoBanca,
          questionCount: simuladoCount,
          examMode: simuladoMode
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        setSimuladoQuestions(data.questions);
      } else {
        throw new Error("Vazio");
      }
    } catch {
      // Fallback to local structured questions for high reliability
      const filtered = LOCAL_CONCURSOS_QUESTIONS.filter(
        q => q.course === user.course
      );
      
      const mapped: SimuladoQuestion[] = (filtered.length > 0 ? filtered : LOCAL_CONCURSOS_QUESTIONS)
        .slice(0, simuladoCount)
        .map((q, idx) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          difficulty: idx % 2 === 0 ? "Fácil" : "Média",
          competence: q.theme,
          recommendedTime: "2 min",
          explanation: q.explanation,
          scientificJustification: "Diretrizes vigentes nacionais.",
          mnemonic: "Memorize as palavras chave!",
          trap: "Fique de olho em palavras absolutas como 'nunca', 'sempre' ou 'obrigatoriamente'.",
          reference: "Manuais Técnicos Oficiais"
        }));

      setSimuladoQuestions(mapped);
    } finally {
      setSimuladoLoading(false);
      setSimuladoActive(true);
      setSimuladoStartTime(Date.now());
      setCurrentQuestionIdx(0);
    }
  };

  const handleAnswerQuestion = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const handleFinishSimulado = () => {
    setSimuladoFinished(true);
  };

  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-6 mb-4">{trimmed.substring(2)}</h2>;
      }
      if (trimmed.startsWith("## ")) {
        return <h3 key={idx} className="text-lg sm:text-xl font-bold text-blue-950 tracking-tight mt-5 mb-3 border-l-4 border-emerald-500 pl-3">{trimmed.substring(3)}</h3>;
      }
      if (trimmed.startsWith("### ")) {
        return <h4 key={idx} className="text-base font-bold text-slate-800 mt-4 mb-2">{trimmed.substring(4)}</h4>;
      }
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-slate-600 leading-relaxed mb-1">
            {renderBoldText(trimmed.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-slate-600 leading-relaxed mb-1">
            {renderBoldText(trimmed.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }
      if (trimmed === "") return <div key={idx} className="h-2"></div>;
      return (
        <p key={idx} className="text-sm text-slate-600 leading-relaxed mb-3">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (txt: string) => {
    const parts = txt.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900">{part}</strong> : part);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate final score metrics
  const correctCount = simuladoQuestions.filter(
    (q, idx) => selectedAnswers[idx] === q.correctIndex
  ).length;
  const totalCount = simuladoQuestions.length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const idealTimeSecs = totalCount * 120; // 2 minutes per question

  return (
    <div className="space-y-8" id="meu-tutor-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl border border-slate-800 p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-blue-500/10 rounded-full filter blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Tutor IA Supremo
            </div>
            <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight leading-none text-white">
              Sua Mentoria Acadêmica Definitiva
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              O maior ecossistema de ensino técnico de saúde do Lynx EDU Sistemas Escolares Inteligentes, projetado com inteligência artificial de ponta para sua excelência acadêmica e aprovação em concursos públicos.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsConcursoMode(!isConcursoMode)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-300 cursor-pointer flex items-center gap-2 border shadow-sm ${
                isConcursoMode 
                  ? "bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400" 
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/80"
              }`}
            >
              <Flame className={`w-4 h-4 ${isConcursoMode ? "text-slate-950 animate-bounce" : "text-amber-500"}`} />
              <span>Modo Concursos: {isConcursoMode ? "ATIVADO" : "DESATIVADO"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic sub navigation tabs */}
        <div className="flex gap-2 mt-8 border-t border-slate-800/80 pt-4 overflow-x-auto relative z-10">
          <button
            onClick={() => { setActiveSubTab("chat"); setSimuladoActive(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === "chat" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-800/40 text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Tira-Dúvidas 24/7
          </button>
          <button
            onClick={() => { setActiveSubTab("lesson"); setSimuladoActive(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === "lesson" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-800/40 text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Criador de Aulas IA
          </button>
          <button
            onClick={() => { setActiveSubTab("simulado"); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === "simulado" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-800/40 text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            Simulador Concursos
          </button>
        </div>
      </div>

      {/* Main body of tabs */}
      <AnimatePresence mode="wait">
        {/* TAB 1: CHAT TIRA DÚVIDAS */}
        {activeSubTab === "chat" && (
          <motion.div
            key="chat-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Sidebar with statistics and Concurso training */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-xl">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-700">Tutor de Elite</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Seu Curso Cadastrado</span>
                    <span className="text-sm font-extrabold text-blue-950 mt-1 block">{user.course}</span>
                  </div>

                  <div className="text-xs text-slate-500 leading-normal space-y-2">
                    <p className="flex gap-2 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Atendimento didático especializado com o método Feynman.</span>
                    </p>
                    <p className="flex gap-2 items-start">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Protocolos atualizados da Anvisa, MS e COFEN/CONTER.</span>
                    </p>
                    {isConcursoMode && (
                      <p className="flex gap-2 items-start p-2 bg-amber-50 rounded-lg border border-amber-100 font-medium text-amber-900">
                        <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Treinador focado nos padrões de pegadinha e estatísticas das maiores bancas brasileiras.</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions shortcuts */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-500" /> Tópicos Sugeridos
                </h4>
                <div className="space-y-2">
                  {getSuggested().map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(`Explique de forma detalhada o tópico: ${topic}`)}
                      className="w-full text-left p-2.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-slate-50 border border-slate-100 rounded-xl transition cursor-pointer font-medium"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Workspace */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[550px] overflow-hidden relative">
              {/* Top Profile Banner */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 to-emerald-600 text-white font-bold flex items-center justify-center rounded-xl text-sm shadow-sm">
                    {user.course.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Tutor IA de {user.course}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold font-mono">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span>DISPONÍVEL 24H • ESPECIALISTA</span>
                    </div>
                  </div>
                </div>

                {isConcursoMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Modo Concurso Ativo
                  </span>
                )}
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                          : "bg-slate-50 text-slate-800 border border-slate-200/60 rounded-tl-none"
                      }`}
                    >
                      <div className="markdown-body">
                        {renderFormattedMarkdown(msg.text)}
                      </div>
                      <span className={`block text-[9px] mt-1.5 text-right ${msg.role === "user" ? "text-blue-100" : "text-slate-400"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 text-slate-800 border border-slate-200/60 rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">Consultando protocolos científicos...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Faça uma pergunta sobre anatomia, NRs, dosimetria ou solicite uma questão comentada..."
                  disabled={chatLoading}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:hover:bg-blue-600 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GERADOR DE AULAS */}
        {activeSubTab === "lesson" && (
          <motion.div
            key="lesson-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Class Creator Setup */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Qual assunto técnico vamos masterizar hoje?
              </h3>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed mb-6">
                Informe o assunto abaixo. O Tutor IA Supremo gerará uma aula altamente didática e aprofundada com mnemônicos, caso prático, flashcards de memorização e simulados de fixação.
              </p>

              {/* Form setup */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    placeholder="Digite qualquer tópico (Ex: Dosimetria Ocupacional, RCP Avançada, NR-10...)"
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    disabled={lessonLoading}
                  />
                </div>
                <button
                  onClick={() => handleGenerateLesson(lessonTopic)}
                  disabled={lessonLoading || !lessonTopic.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  {lessonLoading ? "Gerando Aula de Elite..." : "Gerar Aula Completa"}
                </button>
              </div>

              {/* Suggestions cards */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Tópicos em Destaque do seu Curso:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {getSuggested().map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleGenerateLesson(topic)}
                      className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl hover:border-slate-300 transition text-xs font-semibold text-slate-700 cursor-pointer flex justify-between items-center"
                    >
                      <span>{topic}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lesson Loading state */}
            {lessonLoading && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col justify-center items-center shadow-xs">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-base font-bold text-slate-800 tracking-tight mt-6">Estruturando Aula Pedagógica de Alta Performance...</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-2">
                  O Tutor Supremo está compilando dados de diretrizes nacionais, referências bibliográficas, montando mnemônicos exclusivos e simulando casos práticos para seu estudo ativo.
                </p>
              </div>
            )}

            {/* Generated Lesson display */}
            {lessonMarkdown && !lessonLoading && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Lesson Banner Header */}
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-1">AULA EXCLUSIVA GERADA POR IA</span>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{lessonTopic}</h3>
                  </div>

                  {/* Export and action tools */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ClipboardList className="w-4 h-4 text-slate-400" />
                      Imprimir / Salvar PDF
                    </button>
                  </div>
                </div>

                {/* Main lesson screen */}
                <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                  <div className="markdown-body">
                    {renderFormattedMarkdown(lessonMarkdown)}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: SIMULADOS INTELIGENTES */}
        {activeSubTab === "simulado" && (
          <motion.div
            key="simulado-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {!simuladoActive ? (
              /* Setup Simulado View */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-500" /> Simulador de Concursos Públicos
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Crie provas personalizadas inéditas ou estruturadas no exato padrão da banca que você vai prestar!
                  </p>
                </div>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Selecione a Banca</label>
                    <select
                      value={simuladoBanca}
                      onChange={(e) => setSimuladoBanca(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VUNESP">VUNESP (Foco em Casos Clínicos)</option>
                      <option value="FGV">FGV (Foco Técnico Rigoroso)</option>
                      <option value="CESPE">CESPE / CEBRASPE (Assertivas e Normas)</option>
                      <option value="IBFC">IBFC (Metódico e Legislação)</option>
                      <option value="AOCP">AOCP (Prático e Legislação do SUS)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantidade de Questões</label>
                    <select
                      value={simuladoCount}
                      onChange={(e) => setSimuladoCount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 Questão (Rápida de Treino)</option>
                      <option value="2">2 Questões (Mini-treino)</option>
                      <option value="5">5 Questões (Fixação)</option>
                      <option value="10">10 Questões (Padrão Otimizado)</option>
                      <option value="20">20 Questões (Desempenho Geral)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Modo de Avaliação</label>
                    <select
                      value={simuladoMode}
                      onChange={(e) => setSimuladoMode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Simulado Personalizado">Simulado Personalizado</option>
                      <option value="Simulado Adaptativo">Simulado Adaptativo</option>
                      <option value="Prova por Banca">Prova por Banca</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex gap-3">
                  <ClipboardList className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="text-xs text-emerald-950 leading-relaxed">
                    <span className="font-extrabold block">Como funciona a correção detalhada:</span>
                    Ao final do simulado, o Tutor Supremo analisará suas respostas, fornecerá o gabarito comentado alternativa por alternativa, além de gerar um **Ranking instantâneo**, levantar seus **Pontos Fortes/Fracos** e entregar um **Plano de Estudos Automatizado** para você revisar os erros.
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleStartSimulado}
                    disabled={simuladoLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {simuladoLoading ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Montando Bloco de Questões com a IA...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4.5 h-4.5 fill-current" />
                        <span>Gerar e Iniciar Simulado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Active Simulado Workspace */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs max-w-3xl mx-auto overflow-hidden">
                {!simuladoFinished ? (
                  /* During test */
                  <div className="p-6 md:p-8 space-y-6">
                    {/* Top Stats bar */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-blue-600">PROVA EM ANDAMENTO</span>
                        <h4 className="text-xs font-bold text-slate-500 mt-1 font-mono">Banca: {simuladoBanca} • Questão {currentQuestionIdx + 1} de {totalCount}</h4>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-mono font-extrabold">{formatTime(simuladoElapsedTime)}</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentQuestionIdx + 1) / totalCount) * 100}%` }}
                      ></div>
                    </div>

                    {/* Question body */}
                    <div className="space-y-4">
                      <div className="flex gap-2 items-start">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          {simuladoQuestions[currentQuestionIdx]?.difficulty}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200">
                          {simuladoQuestions[currentQuestionIdx]?.competence}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 leading-relaxed font-sans">
                        {simuladoQuestions[currentQuestionIdx]?.question}
                      </p>

                      {/* Options selection */}
                      <div className="space-y-2.5 pt-2">
                        {simuladoQuestions[currentQuestionIdx]?.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswerQuestion(idx)}
                            className={`w-full text-left p-4 rounded-2xl border transition duration-200 text-xs sm:text-sm flex gap-3 items-center cursor-pointer ${
                              selectedAnswers[currentQuestionIdx] === idx
                                ? "bg-blue-50/80 border-blue-400 text-blue-900 ring-2 ring-blue-100/50"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedAnswers[currentQuestionIdx] === idx
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-slate-300 bg-white"
                            }`}>
                              {selectedAnswers[currentQuestionIdx] === idx && <CheckCircle className="w-3.5 h-3.5" />}
                            </div>
                            <span className="leading-normal">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Helper buttons (Hints, traps) */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex gap-2">
                        {simuladoQuestions[currentQuestionIdx]?.mnemonic && (
                          <button
                            onClick={() => setShowHint(prev => ({ ...prev, [currentQuestionIdx]: !prev[currentQuestionIdx] }))}
                            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Brain className="w-4 h-4 text-blue-500" />
                            {showHint[currentQuestionIdx] ? "Ocultar Dica" : "Ver Dica de Estudo"}
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          disabled={currentQuestionIdx === 0}
                          onClick={() => setCurrentQuestionIdx(p => p - 1)}
                          className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-40 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Anterior
                        </button>

                        {currentQuestionIdx < totalCount - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIdx(p => p + 1)}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            Próxima <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleFinishSimulado}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                          >
                            Concluir Simulado
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Display Hint detail */}
                    <AnimatePresence>
                      {showHint[currentQuestionIdx] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-amber-50 rounded-2xl border border-amber-200 p-4 overflow-hidden space-y-2 mt-4"
                        >
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5" /> DICA DO TUTOR SUPREMO:
                          </span>
                          <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                            {simuladoQuestions[currentQuestionIdx]?.mnemonic}
                          </p>
                          {simuladoQuestions[currentQuestionIdx]?.trap && (
                            <div className="pt-2 border-t border-amber-200/50 text-[11px] text-amber-700">
                              <span className="font-extrabold">🚨 Pegadinha da Banca: </span>
                              {simuladoQuestions[currentQuestionIdx]?.trap}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Finish / Results View */
                  <div className="p-6 md:p-8 space-y-8">
                    {/* Main score ring banner */}
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">RESULTADO GERAL</span>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Simulado Concluído com Sucesso!</h3>
                        <p className="text-xs text-slate-500">Banca avaliada: **{simuladoBanca}** • Tempo gasto: **{formatTime(simuladoElapsedTime)}**</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex flex-col justify-center items-center bg-white shadow-xs">
                          <span className="text-xl font-black text-emerald-600 leading-none">{scorePercent}%</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Acertos</span>
                        </div>
                        <div className="text-slate-800 font-mono text-xs">
                          <p>Gabarito: <span className="font-extrabold text-emerald-600">{correctCount}</span> / {totalCount}</p>
                          <p>Tempo Ideal: {formatTime(idealTimeSecs)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mock Competitor Ranking & Performance analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                        <Trophy className="w-10 h-10 text-amber-500 shrink-0 bg-white p-2 rounded-xl border border-slate-200/60 shadow-xs" />
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-700">RANKING DO SIMULADO</span>
                          <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">Sua Posição Estimada</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Com **{scorePercent}%** de aproveitamento, você está em **#14 de 980** candidatos que fizeram esta mesma prova para {user.course}. Excelente desempenho!
                          </p>
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                        <Zap className="w-10 h-10 text-emerald-500 shrink-0 bg-white p-2 rounded-xl border border-slate-200/60 shadow-xs" />
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-700 font-mono">ANÁLISE DE APRENDIZADO</span>
                          <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">Pontos Fortes & Fracos</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            <span className="text-emerald-700 font-bold">Forte:</span> Legislação e Biossegurança Geral.<br />
                            <span className="text-rose-600 font-bold">Atenção:</span> Detalhes finos de cálculos técnicos ou dosagem científica.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Study plan generator */}
                    <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl border border-slate-800 shadow-sm space-y-3">
                      <div className="flex gap-2 items-center text-amber-400">
                        <Brain className="w-5 h-5" />
                        <h4 className="text-sm font-black uppercase tracking-wider">Estudo Recomendado por seu Tutor Supremo</h4>
                      </div>
                      <div className="text-xs leading-relaxed space-y-2 text-slate-200">
                        <p>Com base nos seus erros ou tempo de resposta, recomendo fortemente focar sua revisão nos seguintes assuntos durante as próximas 48 horas:</p>
                        <ul className="space-y-1 ml-4 list-disc text-amber-300 font-bold">
                          <li>Revisão profunda de normativas da Anvisa e decretos ministeriais.</li>
                          <li>Cálculo de dosagens técnicas de medicamentos ou blindagem de física das radiações.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Review list of questions */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-blue-500" /> Revisar Questões Resolvidas
                      </h4>

                      <div className="space-y-4">
                        {simuladoQuestions.map((q, idx) => {
                          const isCorrect = selectedAnswers[idx] === q.correctIndex;
                          return (
                            <div key={q.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                              <div className={`px-4 py-3 border-b flex justify-between items-center ${
                                isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
                              }`}>
                                <span className="text-xs font-extrabold font-mono">Questão {idx + 1}</span>
                                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white border">
                                  {isCorrect ? "Correto" : "Incorreto"}
                                </span>
                              </div>

                              <div className="p-4 space-y-3 bg-white">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-normal">{q.question}</p>
                                
                                <div className="space-y-1.5 pt-2">
                                  {q.options.map((opt, oIdx) => (
                                    <div 
                                      key={oIdx} 
                                      className={`p-2 rounded-xl text-xs flex gap-2 ${
                                        oIdx === q.correctIndex 
                                          ? "bg-emerald-100/60 border border-emerald-200 text-emerald-950 font-bold" 
                                          : oIdx === selectedAnswers[idx]
                                            ? "bg-rose-100/60 border border-rose-200 text-rose-950 font-medium"
                                            : "bg-slate-50 text-slate-600"
                                      }`}
                                    >
                                      <span>{opt}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Comments from Tutor IA Supremo */}
                                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2 text-xs text-slate-600">
                                  <span className="block font-extrabold text-blue-950 uppercase tracking-wider text-[10px]">Justificativa do Tutor Supremo:</span>
                                  <p className="leading-relaxed">{q.explanation}</p>
                                  {q.scientificJustification && (
                                    <p className="text-[11px] text-slate-500 font-mono mt-1"><span className="font-extrabold text-blue-900">Referência Legal:</span> {q.scientificJustification}</p>
                                  )}
                                  {q.reference && (
                                    <p className="text-[11px] text-slate-400 italic"><span className="font-semibold text-slate-600">Bibliografia Recomendada:</span> {q.reference}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setSimuladoActive(false)}
                        className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                      >
                        Voltar para Configuração de Simulados
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
