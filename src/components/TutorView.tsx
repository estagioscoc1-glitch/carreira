import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Book } from "../types";
import { INITIAL_BOOKS } from "../db";
import { 
  GraduationCap, Send, BookOpen, Sparkles, Brain, RotateCcw, HelpCircle, 
  MessageSquare, ChevronRight, Check, Volume2, Flame, VolumeX
} from "lucide-react";

interface TutorViewProps {
  user: User;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export default function TutorView({ user }: TutorViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tutorState, setTutorState] = useState<"idle" | "thinking" | "explaining" | "proud">("idle");
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Training Option: Focus on a library book or General Tutoring
  const [selectedBookId, setSelectedBookId] = useState<string>("general");
  const [isTrained, setIsTrained] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Professor assigning based on student's course
  const getTeacherProfile = () => {
    switch (user.course) {
      case "Técnico em Enfermagem":
        return {
          name: "Profª Marina Silva",
          specialty: "Especialista em Enfermagem de Alta Complexidade e Biossegurança (NR-32)",
          avatarColor: "from-cyan-500 to-teal-600",
          accentColor: "text-teal-600",
          borderColor: "border-teal-100",
          bgColor: "bg-teal-50",
          iconColor: "text-teal-500",
          welcomeMessage: "Olá, futuro colega de profissão! Sou a Profª Marina. Estou pronta para tirar todas as suas dúvidas sobre semiotécnica, cálculos de medicamentos, biossegurança ou as normas da NR-32. Qual o seu desafio de estudo hoje?",
          avatarStyle: "nurse"
        };
      case "Técnico em Radiologia":
        return {
          name: "Prof. Carlos Alberto",
          specialty: "Doutor em Imagenologia e Proteção Radiológica (Princípio ALARA)",
          avatarColor: "from-blue-600 to-indigo-700",
          accentColor: "text-indigo-600",
          borderColor: "border-indigo-100",
          bgColor: "bg-indigo-50",
          iconColor: "text-indigo-500",
          welcomeMessage: "Saudações acadêmicas! Sou o Prof. Carlos. Vamos dominar juntos os segredos dos posicionamentos radiológicos, da física da radiação e da mamografia digital? Pode mandar suas dúvidas!",
          avatarStyle: "radiologist"
        };
      case "Técnico em Segurança do Trabalho":
        return {
          name: "Prof. Eduardo Santos",
          specialty: "Engenheiro de Segurança, Auditor e Consultor Sênior de NRs",
          avatarColor: "from-amber-500 to-orange-600",
          accentColor: "text-orange-600",
          borderColor: "border-orange-100",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-500",
          welcomeMessage: "Fala, prevencionista! Sou o Prof. Eduardo. Vamos conversar sobre as novas NRs, elaboração de rotas de fuga, CAT ou prevenção ativa de acidentes industriais? Estou pronto para te ajudar!",
          avatarStyle: "safety"
        };
      case "Especialização em Instrumentação Cirúrgica":
        return {
          name: "Profª Beatriz Vianna",
          specialty: "Especialista em Técnicas de Instrumentação Cirúrgica, Paramentação e Esterilização (CME)",
          avatarColor: "from-rose-500 to-pink-600",
          accentColor: "text-rose-600",
          borderColor: "border-rose-100",
          bgColor: "bg-rose-50",
          iconColor: "text-rose-500",
          welcomeMessage: "Olá! Sou a Profª Beatriz Vianna. Vamos dominar juntos os tempos cirúrgicos, montagem de mesa de instrumentos, controle de infecção e as melhores práticas dentro do bloco operatório? Pode perguntar!",
          avatarStyle: "instrumentacao"
        };
      default:
        return {
          name: "Prof. Alexandre Castro",
          specialty: "Tutor Acadêmico Sênior e Especialista em Didática na Saúde",
          avatarColor: "from-blue-900 to-slate-950",
          accentColor: "text-blue-900",
          borderColor: "border-slate-200",
          bgColor: "bg-slate-50",
          iconColor: "text-blue-900",
          welcomeMessage: `Olá, ${user.name}! Sou o Prof. Alexandre, seu Tutor Acadêmico. Estou aqui para sanar suas dúvidas, explicar tópicos complexos e te apoiar na preparação de provas e concursos públicos. Qual o assunto de hoje?`,
          avatarStyle: "general"
        };
    }
  };

  const teacher = getTeacherProfile();

  // Initialize tutor welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: teacher.welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [user.course]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Train the tutor on a specific topic
  const handleTrainTutor = () => {
    setIsTrained(true);
    setTrainingSuccess(true);
    setTutorState("proud");

    const book = INITIAL_BOOKS.find(b => b.id === selectedBookId);
    let trainReply = "";
    
    if (selectedBookId === "general") {
      trainReply = `Perfeito, ${user.name}! Meu foco de treinamento foi redefinido para **Tutoria Geral Abrangente** do curso de *${user.course}*. Estou pronto para responder a qualquer assunto da grade curricular!`;
    } else if (book) {
      trainReply = `Excelente escolha! Acabo de assimilar integralmente o conteúdo do guia **"${book.title}"** no meu banco de dados de mentoria. \n\nA partir de agora, minhas respostas estarão focadas nas técnicas, conceitos e diretrizes descritas neste material. Pergunte-me qualquer dúvida sobre isso!`;
    }

    // Play virtual beep
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {}
    }

    setTimeout(() => {
      setTrainingSuccess(false);
      setTutorState("idle");
      
      setMessages(prev => [
        ...prev,
        {
          id: `train-${Date.now()}`,
          role: "assistant",
          text: trainReply,
          timestamp: new Date()
        }
      ]);
    }, 1200);
  };

  // Submit chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setTutorState("thinking");

    try {
      // Find training content
      const book = INITIAL_BOOKS.find(b => b.id === selectedBookId);
      const focusText = book ? `LIVRO DE FOCO DE ESTUDO ATUAL: ${book.title}\nCONTEÚDO DO LIVRO:\n${book.content}` : "";

      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: user.course,
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          focusBook: focusText,
          studentName: user.name
        })
      });

      if (!response.ok) {
        throw new Error("Erro na conexão com o robô de tutoria.");
      }

      const data = await response.json();
      
      // Select emotional state depending on keywords
      const lowerReply = data.text.toLowerCase();
      if (lowerReply.includes("excelente") || lowerReply.includes("parabéns") || lowerReply.includes("ótimo") || lowerReply.includes("muito bem")) {
        setTutorState("proud");
      } else {
        setTutorState("explaining");
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: data.text,
          timestamp: new Date()
        }
      ]);

      // Play soft soft typing-done sound
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = 523.25; // C5 note
          gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {}
      }

      // Return to idle after explanation starts fading
      setTimeout(() => {
        setTutorState("idle");
      }, 5000);

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Ops, tive uma pequena distração tentando ler os arquivos. Pode repetir a sua pergunta para que eu me concentre melhor?",
          timestamp: new Date()
        }
      ]);
      setTutorState("idle");
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to format custom styled texts without full markdown lib
  const formatTutorText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Check for bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const cleaned = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 leading-relaxed mb-1.5">
            {renderBoldText(cleaned)}
          </li>
        );
      }
      // Check for headers (### or ####)
      if (line.trim().startsWith("####")) {
        return <h5 key={idx} className="text-xs font-bold text-slate-800 uppercase mt-3 mb-1.5 tracking-wider">{line.replace(/#/g, "").trim()}</h5>;
      }
      if (line.trim().startsWith("###") || line.trim().startsWith("##")) {
        return <h4 key={idx} className="text-sm font-extrabold text-blue-950 mt-4 mb-2 border-l-2 border-emerald-400 pl-2">{line.replace(/#/g, "").trim()}</h4>;
      }
      // Standard paragraph
      if (line.trim() === "") return <div key={idx} className="h-2"></div>;
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (txt: string) => {
    const parts = txt.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-900">{part}</strong> : part);
  };

  // SVG Animated Teacher Component
  const renderTeacherAnimation = () => {
    let eyesAnimation = {};
    let mouthAnimation = {};
    let handAnimation = {};
    let bgParticlesColor = "bg-emerald-400/20";

    switch (tutorState) {
      case "thinking":
        eyesAnimation = { y: [-1, 2, -1], rotate: [0, -3, 0] };
        mouthAnimation = { d: "M 22 28 Q 25 29 28 28" }; // thin slightly curved pondering line
        handAnimation = { y: [0, -4, 0], rotate: [0, 5, 0] };
        bgParticlesColor = "bg-amber-400/20";
        break;
      case "explaining":
        eyesAnimation = { scaleY: [1, 0.9, 1], y: [0, -1, 0] };
        mouthAnimation = { d: "M 22 28 Q 25 33 28 28" }; // open active mouth
        handAnimation = { x: [-2, 2, -2], y: [0, -6, 0] };
        bgParticlesColor = "bg-blue-400/20";
        break;
      case "proud":
        eyesAnimation = { scaleY: [0.3, 1, 0.3], y: [0, 0, 0] }; // happy squint blinking
        mouthAnimation = { d: "M 20 27 Q 25 34 30 27" }; // wide proud smile
        handAnimation = { y: [-8, 0, -8], rotate: [0, 10, 0] };
        bgParticlesColor = "bg-emerald-400/30";
        break;
      case "idle":
      default:
        eyesAnimation = { scaleY: [1, 1, 0.1, 1, 1], transition: { repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1] } };
        mouthAnimation = { d: "M 21 28 Q 25 31 29 28" }; // friendly relaxed smile
        handAnimation = { y: [0, -1, 0] };
        break;
    }

    // Color schemas based on avatar style
    let shirtColor = "#0f766e"; // teal (nurse)
    let collarColor = "#115e59";
    let hairColor = "#334155";
    let glassColor = "#2563eb";
    let accessory = null;

    if (teacher.avatarStyle === "radiologist") {
      shirtColor = "#1e3a8a"; // deep blue
      collarColor = "#172554";
      hairColor = "#1e293b";
      // Radiation shield badge
      accessory = (
        <g transform="translate(32, 33) scale(0.12)">
          <circle cx="25" cy="25" r="20" fill="#facc15" stroke="#1e293b" strokeWidth="2" />
          <path d="M 25 5 L 25 25 L 10 15 A 12 12 0 0 1 25 5" fill="#1e293b" />
          <path d="M 25 25 L 40 15 A 12 12 0 0 1 35 35 Z" fill="#1e293b" />
          <path d="M 25 25 L 25 45 A 12 12 0 0 1 10 35 Z" fill="#1e293b" />
          <circle cx="25" cy="25" r="4" fill="#facc15" />
        </g>
      );
    } else if (teacher.avatarStyle === "safety") {
      shirtColor = "#ea580c"; // orange safety vest
      collarColor = "#c2410c";
      hairColor = "#475569";
      // Safety helmet
      accessory = (
        <g transform="translate(13, 1) scale(0.7)">
          <path d="M 5 20 A 18 14 0 0 1 45 20 Z" fill="#eab308" />
          <rect x="4" y="18" width="42" height="3" rx="1.5" fill="#ca8a04" />
          <rect x="22" y="5" width="6" height="15" rx="1" fill="#facc15" />
        </g>
      );
    } else if (teacher.avatarStyle === "instrumentacao") {
      shirtColor = "#0d9488"; // surgical green/teal
      collarColor = "#0f766e";
      hairColor = "#1e293b";
      accessory = (
        <g>
          {/* Surgical Green Cap on the head */}
          <path d="M 14 17 C 14 10, 36 10, 36 17 Z" fill="#0d9488" opacity="0.95" />
          <ellipse cx="25" cy="11" rx="10" ry="3" fill="#115e59" opacity="0.3" />
          
          {/* Surgical Mask over mouth & nose */}
          <rect x="21" y="22" width="8" height="6" rx="1.5" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.5" />
          <line x1="21" y1="24" x2="29" y2="24" stroke="#38bdf8" strokeWidth="0.3" />
          <line x1="21" y1="26" x2="29" y2="26" stroke="#38bdf8" strokeWidth="0.3" />
        </g>
      );
    } else if (teacher.avatarStyle === "general") {
      shirtColor = "#0f172a"; // slate formal jacket
      collarColor = "#1e293b";
      hairColor = "#0f172a";
    }

    return (
      <div className="relative flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-3xl shadow-xs" id="tutor-avatar-stage">
        {/* Floating Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <AnimatePresence>
            {tutorState === "thinking" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: [1, 1.2, 1], y: -20, transition: { repeat: Infinity, duration: 2 } }}
                exit={{ opacity: 0 }}
                className="absolute right-12 top-8 text-amber-500 font-bold font-mono text-sm bg-amber-50 px-2 py-1 rounded-full border border-amber-200"
              >
                💡 Hmm...
              </motion.div>
            )}
            {tutorState === "proud" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [1, 1, 0], scale: [0.5, 1.5, 2], rotate: [0, 45, 90], transition: { duration: 1.5, repeat: Infinity } }}
                className="absolute left-8 top-12 text-emerald-500 text-lg"
              >
                ⭐
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core aura circle */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-36 h-36 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-xl ${bgParticlesColor} transition-colors duration-500`}
          ></motion.div>
        </div>

        {/* Teacher SVG Avatar */}
        <motion.svg 
          width="130" 
          height="130" 
          viewBox="0 0 50 50" 
          className="relative z-10 filter drop-shadow-md"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Hair back */}
          <circle cx="25" cy="20" r="11" fill={hairColor} />

          {/* Head & Neck */}
          <rect x="23" y="24" width="4" height="6" rx="1.5" fill="#fbcfe8" /> {/* neck */}
          <circle cx="25" cy="20" r="9" fill="#fbcfe8" /> {/* face */}

          {/* Hair front / bangs */}
          <path d="M 15 18 C 17 12, 33 12, 35 18 C 32 15, 18 15, 15 18 Z" fill={hairColor} />

          {/* Glasses */}
          <circle cx="21" cy="20" r="2.5" fill="none" stroke={glassColor} strokeWidth="0.8" />
          <circle cx="29" cy="20" r="2.5" fill="none" stroke={glassColor} strokeWidth="0.8" />
          <line x1="23.5" y1="20" x2="26.5" y2="20" stroke={glassColor} strokeWidth="0.8" />
          <line x1="18.5" y1="19.5" x2="17" y2="21" stroke={glassColor} strokeWidth="0.6" />
          <line x1="31.5" y1="19.5" x2="33" y2="21" stroke={glassColor} strokeWidth="0.6" />

          {/* Eyes inside glasses */}
          <motion.g animate={eyesAnimation}>
            <circle cx="21" cy="20" r="0.8" fill="#1e293b" />
            <circle cx="29" cy="20" r="0.8" fill="#1e293b" />
          </motion.g>

          {/* Eyebrows */}
          <path d="M 19 16.5 Q 21 16 23 17" fill="none" stroke="#475569" strokeWidth="0.5" />
          <path d="M 27 17 Q 29 16 31 16.5" fill="none" stroke="#475569" strokeWidth="0.5" />

          {/* Mouth */}
          <motion.path 
            animate={mouthAnimation}
            fill="none" 
            stroke="#be185d" 
            strokeWidth="0.8" 
            strokeLinecap="round" 
          />

          {/* Cheeks blush */}
          <circle cx="17.5" cy="22.5" r="1" fill="#f43f5e" opacity="0.3" />
          <circle cx="32.5" cy="22.5" r="1" fill="#f43f5e" opacity="0.3" />

          {/* Accessory Overlay (Helmet/Badge) */}
          {accessory}

          {/* Clothes (Torso) */}
          <path d="M 13 45 C 13 32, 37 32, 37 45 Z" fill={shirtColor} />
          {/* Collar/Labcoat lapel */}
          <path d="M 21 32 L 25 38 L 29 32 Z" fill="#f1f5f9" /> {/* inner V-neck shirt */}
          <path d="M 17 32 L 23 42 L 21 45 L 14 45 Z" fill={collarColor} />
          <path d="M 33 32 L 27 42 L 29 45 L 36 45 Z" fill={collarColor} />

          {/* Animated Arm/Hand gesturing */}
          <motion.g animate={handAnimation}>
            <circle cx="14" cy="40" r="2" fill="#fbcfe8" />
            <path d="M 13 42 Q 10 38 13 35" fill="none" stroke={collarColor} strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </motion.svg>

        {/* Status indicator badges */}
        <div className="text-center mt-3">
          <h3 className="text-sm font-extrabold text-slate-800 leading-none">{teacher.name}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1 leading-normal max-w-xs">{teacher.specialty}</p>
        </div>

        {/* Emotion status tag */}
        <div className="mt-3 flex gap-1.5 items-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500" id="tutor-status-badge">
            {tutorState === "idle" && "Disponível • Online"}
            {tutorState === "thinking" && "Analisando sua questão..."}
            {tutorState === "explaining" && "Explicando conteúdo..."}
            {tutorState === "proud" && "Orgulhosa de você!"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-1 sm:p-2 space-y-6" id="tutor-root-container">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-3xl -mr-16 -mt-16"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-emerald-300 text-xs font-bold border border-slate-700/50">
            <GraduationCap className="w-3.5 h-3.5" /> Mentor Curricular Exclusivo
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight leading-tight">Tutor Acadêmico Inteligente</h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Tire dúvidas conceituais profundas, solicite correções didáticas de exercícios, revise matérias do Lynx EDU Sistemas Escolares Inteligentes e receba questionários interativos criados sob medida para sua formação!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Teacher stage and Train Module */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* Animated Teacher Avatar */}
          {renderTeacherAnimation()}

          {/* Training Control Center */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-between space-y-4" id="tutor-training-panel">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4.5 h-4.5 text-blue-900" /> Treinar Meu Tutor
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Especifique qual material acadêmico ou guia você deseja que a inteligência do professor foque agora:
              </p>

              <div className="space-y-2 mt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Material de Foco</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBookId("general")}
                    className={`w-full text-left p-2.5 rounded-xl border transition text-xs flex items-center justify-between cursor-pointer ${
                      selectedBookId === "general"
                        ? "border-emerald-500 bg-emerald-50/40 text-slate-900 font-bold"
                        : "border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">Tutoria Geral ({user.course})</span>
                    {selectedBookId === "general" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  {INITIAL_BOOKS.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => setSelectedBookId(book.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition text-xs flex items-center justify-between cursor-pointer ${
                        selectedBookId === book.id
                          ? "border-emerald-500 bg-emerald-50/40 text-slate-900 font-bold"
                          : "border-slate-150 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex flex-col">
                        <span className="truncate">{book.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{book.category}</span>
                      </div>
                      {selectedBookId === book.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              {trainingSuccess ? (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-bold text-center animate-pulse flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sintonizando rede de tutoria...</span>
                </div>
              ) : (
                <button
                  onClick={handleTrainTutor}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aplicar Treinamento IA</span>
                </button>
              )}
              
              {/* Extra Utility sound button */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-2 border rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  soundEnabled 
                    ? "border-blue-200 bg-blue-50/30 text-blue-800" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>Efeitos Sonoros: {soundEnabled ? "Ligados" : "Desligados"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Dialog Box */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col h-[580px] overflow-hidden" id="tutor-chat-terminal">
          {/* Active Material Header Bar */}
          <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-slate-500" />
              <div className="text-xs text-slate-600 font-semibold truncate">
                Treinamento: <span className="font-extrabold text-blue-950">{selectedBookId === "general" ? "Grade Geral do Curso" : INITIAL_BOOKS.find(b => b.id === selectedBookId)?.title}</span>
              </div>
            </div>
            {isTrained && (
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-wider animate-pulse shrink-0">
                IA Sintonizada
              </span>
            )}
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/20" id="tutor-chat-history">
            {messages.map((msg) => {
              const isMe = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`max-w-[85%] flex gap-2.5 items-start ${isMe ? "flex-row-reverse" : ""}`}>
                    {/* Tiny Avatar badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs border text-xs font-bold ${
                      isMe 
                        ? "bg-blue-950 text-white border-blue-900" 
                        : `bg-gradient-to-tr ${teacher.avatarColor} text-white ${teacher.borderColor}`
                    }`}>
                      {isMe ? "Eu" : teacher.name[5]}
                    </div>

                    <div className="space-y-1">
                      {/* Name tag and date */}
                      <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 font-bold ${isMe ? "justify-end" : ""}`}>
                        <span>{isMe ? "Você" : teacher.name}</span>
                        <span>•</span>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Content Bubble */}
                      <div className={`p-4 rounded-2xl shadow-xs leading-normal ${
                        isMe 
                          ? "bg-slate-900 text-white rounded-tr-none" 
                          : "bg-white border border-slate-150 text-slate-800 rounded-tl-none"
                      }`}>
                        {isMe ? (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <div className="space-y-0.5">{formatTutorText(msg.text)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${teacher.bgColor} ${teacher.borderColor}`}>
                    <span className={`text-xs font-bold ${teacher.accentColor}`}>{teacher.name[5]}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold">{teacher.name} está digitando...</span>
                    <div className="bg-white border border-slate-150 p-4 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Help Doubts Select suggestions */}
          <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-200/50 flex gap-2 overflow-x-auto shrink-0 scrollbar-none" id="tutor-quick-suggestions">
            <span className="text-[10px] font-bold text-slate-400 flex items-center shrink-0">Dúvidas Comuns:</span>
            <button
              onClick={() => setInputText("Professor, como posso me destacar logo na primeira semana de estágio curricular?")}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-900 rounded-full text-[11px] text-slate-600 hover:text-slate-900 transition whitespace-nowrap cursor-pointer shrink-0"
            >
              Dicas de estágio
            </button>
            <button
              onClick={() => setInputText("Pode elaborar uma questão rápida sobre biossegurança hospitalar para eu tentar responder?")}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-900 rounded-full text-[11px] text-slate-600 hover:text-slate-900 transition whitespace-nowrap cursor-pointer shrink-0"
            >
              Me desafie com uma questão
            </button>
            <button
              onClick={() => setInputText("Professor, qual a importância prática de cumprir com total rigor os adornos recomendados na NR-32?")}
              className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-900 rounded-full text-[11px] text-slate-600 hover:text-slate-900 transition whitespace-nowrap cursor-pointer shrink-0"
            >
              Dúvida sobre NR-32 e adornos
            </button>
          </div>

          {/* Chat Input form Bar */}
          <div className="p-4 bg-white border-t border-slate-200/80 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={`Pergunte algo ao ${teacher.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-blue-900 transition disabled:opacity-60"
                id="tutor-chat-input-box"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 px-4 rounded-xl font-bold transition flex items-center justify-center cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
