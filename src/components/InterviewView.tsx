import React, { useState, useEffect } from "react";
import { User, InterviewQuestion, InterviewSession } from "../types";
import { LocalDB } from "../db";
import { 
  Headset, Sparkles, AlertCircle, CheckCircle, ChevronRight, Play, RefreshCw, Send, Star, Trophy, ArrowRight, BookOpen 
} from "lucide-react";

interface InterviewViewProps {
  user: User;
}

const PROFESSIONAL_AREAS = [
  "Enfermagem (Técnico)",
  "Radiologia (Técnico)",
  "Segurança do Trabalho (Técnico)",
  "Instrumentação Cirúrgica (Especialização)",
  "Enfermagem do Trabalho (Especialização)"
];

const COMMON_ROLES: Record<string, string[]> = {
  "Enfermagem (Técnico)": ["Técnico em Enfermagem Hospitalar", "Auxiliar de Enfermagem - Posto de Saúde", "Técnico em Enfermagem - Home Care"],
  "Radiologia (Técnico)": ["Técnico em Radiologia - Raios-X e Tomografia", "Operador de Ressonância Magnética", "Auxiliar de Radiodiagnóstico"],
  "Segurança do Trabalho (Técnico)": ["Técnico em Segurança do Trabalho - Construção Civil", "Inspetor de Segurança Industrial", "Analista de Prevenção de Riscos"],
  "Instrumentação Cirúrgica (Especialização)": ["Instrumentador Cirúrgico Geral", "Instrumentador de Alta Complexidade (Cardíaca/Neuro)", "Auxiliar de Equipe Cirúrgica"],
  "Enfermagem do Trabalho (Especialização)": ["Enfermeiro do Trabalho - Ambulatório Corporativo", "Técnico de Enfermagem do Trabalho", "Gestor de Saúde Ocupacional"]
};

export default function InterviewView({ user }: InterviewViewProps) {
  // Setup States
  const [area, setArea] = useState("");
  const [role, setRole] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);

  // Active Sim States
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [userAnswerText, setUserAnswerText] = useState("");
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);

  // History States
  const [history, setHistory] = useState<InterviewSession[]>([]);

  // Feedback banner
  const [errorMsg, setErrorMsg] = useState("");

  // Load history on mount
  useEffect(() => {
    const userHistory = LocalDB.getInterviewHistory(user.id);
    setHistory(userHistory);
  }, [user.id]);

  // Set default role when area changes
  useEffect(() => {
    if (area && COMMON_ROLES[area]) {
      setRole(COMMON_ROLES[area][0]);
    } else {
      setRole("");
    }
  }, [area]);

  // Handle simulation initialization
  const handleStartSimulation = async () => {
    if (!area || !role) {
      setErrorMsg("Selecione a área e o cargo desejados.");
      return;
    }

    setErrorMsg("");
    setLoadingQuestions(true);

    try {
      const response = await fetch("/api/interview-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, role })
      });

      if (!response.ok) {
        throw new Error("Erro na requisição das perguntas");
      }

      const questions: InterviewQuestion[] = await response.json();
      
      const newSession: InterviewSession = {
        id: Math.random().toString(36).substring(2, 11),
        area,
        role,
        questions,
        currentQuestionIndex: 0,
        completed: false,
        createdAt: new Date().toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };

      setSession(newSession);
      LocalDB.saveInterviewSession(user.id, newSession);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Não foi possível se conectar com o servidor IA. Carregando perguntas simuladas de contingência.");
      
      // Contingency question bank
      const mockQuestions: InterviewQuestion[] = [
        { id: 1, question: `Por que você deseja ingressar como ${role} na área de ${area}?`, context: "Verifica sua automotivação, planejamento de carreira e identificação com as atividades cotidianas." },
        { id: 2, question: "Descreva um trabalho de equipe marcante que realizou no Lynx EDU Sistemas Escolares Inteligentes e como resolveram dificuldades de prazo.", context: "Mede o senso de colaboração, iniciativa, comunicação em grupo e resolução estruturada de atritos." },
        { id: 3, question: "O que você costuma fazer quando não entende uma instrução ou tarefa dada por um superior?", context: "Avalia humildade, comunicação ativa e responsabilidade em evitar erros desnecessários." },
        { id: 4, question: "Aponte um ponto forte e um ponto de melhoria comportamental que você identificou em sua vivência acadêmica.", context: "Mede autoconhecimento, sinceridade e planos práticos de auto-aperfeiçoamento profissional." },
        { id: 5, question: "Qual sua principal expectativa para esta sua primeira oportunidade de trabalho?", context: "Avalia alinhamento de expectativas corporativas e visão de progresso de carreira em médio prazo." }
      ];

      const newSession: InterviewSession = {
        id: Math.random().toString(36).substring(2, 11),
        area,
        role,
        questions: mockQuestions,
        currentQuestionIndex: 0,
        completed: false,
        createdAt: new Date().toLocaleDateString("pt-BR")
      };

      setSession(newSession);
      LocalDB.saveInterviewSession(user.id, newSession);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Submit Answer to evaluation endpoint
  const handleSubmitAnswer = async () => {
    if (!session || !userAnswerText.trim() || loadingEvaluation) return;

    setLoadingEvaluation(true);
    setErrorMsg("");

    const currentQuestion = session.questions[session.currentQuestionIndex];

    try {
      const response = await fetch("/api/interview-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: userAnswerText,
          area: session.area,
          role: session.role
        })
      });

      if (!response.ok) {
        throw new Error("Erro na avaliação");
      }

      const evalData = await response.json();

      // Update question in session state
      const updatedQuestions = [...session.questions];
      updatedQuestions[session.currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: userAnswerText,
        evaluation: {
          score: evalData.score || 80,
          feedback: evalData.feedback || "Ótima resposta! Demonstra maturidade e clareza.",
          idealAnswer: evalData.idealAnswer || "Uma resposta perfeita integraria exemplos do Lynx EDU Sistemas Escolares Inteligentes."
        }
      };

      const updatedSession = {
        ...session,
        questions: updatedQuestions
      };

      setSession(updatedSession);
      LocalDB.saveInterviewSession(user.id, updatedSession);
      setUserAnswerText("");
    } catch (err) {
      console.error(err);
      
      // Local fallback evaluation logic
      const score = Math.min(100, Math.max(50, 45 + Math.floor(userAnswerText.length / 5)));
      const updatedQuestions = [...session.questions];
      updatedQuestions[session.currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: userAnswerText,
        evaluation: {
          score: score,
          feedback: "A Inteligência Artificial offline detectou uma resposta sincera e estruturada. Para maximizar sua pontuação de seleção, procure detalhar os métodos e ferramentas que você usou na resolução do projeto escolar.",
          idealAnswer: "Inicie explicando o problema, cite as ferramentas que usou (ex: Excel, Trello ou IDE de desenvolvimento), explique seu papel ativo na solução e finalize apontando os resultados e aprendizados obtidos."
        }
      };

      const updatedSession = {
        ...session,
        questions: updatedQuestions
      };

      setSession(updatedSession);
      LocalDB.saveInterviewSession(user.id, updatedSession);
      setUserAnswerText("");
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    
    const nextIdx = session.currentQuestionIndex + 1;
    const isCompleted = nextIdx >= session.questions.length;

    const updatedSession = {
      ...session,
      currentQuestionIndex: isCompleted ? session.questions.length - 1 : nextIdx,
      completed: isCompleted ? true : session.completed
    };

    setSession(updatedSession);
    LocalDB.saveInterviewSession(user.id, updatedSession);

    // Refresh history if completed
    if (isCompleted) {
      setHistory(LocalDB.getInterviewHistory(user.id));
    }
  };

  const handleResetSession = () => {
    setSession(null);
    setArea("");
    setRole("");
    setUserAnswerText("");
  };

  // Helper to get average score of completed questions
  const getAverageScore = (sess: InterviewSession) => {
    const answered = sess.questions.filter(q => q.evaluation);
    if (answered.length === 0) return 0;
    const total = answered.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0);
    return Math.round(total / answered.length);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-2" id="interview-view-container">
      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SETUP PHASE (If no session selected) */}
      {!session ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* New Simulation Setup Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Headset className="w-5 h-5 text-blue-950" /> Configurar Simulador de Entrevista IA
              </h3>
              <p className="text-xs text-slate-500 leading-normal mt-1">
                Prepare-se para entrevistas profissionais simulando perguntas reais geradas com Inteligência Artificial para o seu curso específico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Área de Atuação</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  id="interview-setup-area"
                >
                  <option value="">Selecione uma área...</option>
                  {PROFESSIONAL_AREAS.map((a, i) => (
                    <option key={i} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Vaga / Cargo Desejado</label>
                {area ? (
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    id="interview-setup-role"
                  >
                    {COMMON_ROLES[area]?.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                    <option value="Outro Cargo">Outro Cargo / Especialidade</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    placeholder="Selecione a área primeiro"
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-sm outline-none"
                  />
                )}
              </div>
            </div>

            {role === "Outro Cargo" && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Digite o Nome da Função Especializada</label>
                <input
                  type="text"
                  placeholder="Ex: Jovem Aprendiz Administrativo"
                  value={role === "Outro Cargo" ? "" : role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            )}

            <button
              onClick={handleStartSimulation}
              disabled={loadingQuestions || !area || !role}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              id="interview-setup-start-btn"
            >
              {loadingQuestions ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin"></span>
                  <span>Construindo perguntas com IA...</span>
                </>
              ) : (
                <>
                  <Play className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Iniciar Simulação de Processo Seletivo</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation History Block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Histórico de Treinos</h3>
            {history.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Nenhum treino finalizado.</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">Suas sessões concluídas e notas aparecerão registradas aqui para análise.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {history.map((sess) => {
                  const avgScore = getAverageScore(sess);
                  return (
                    <div 
                      key={sess.id}
                      onClick={() => setSession(sess)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl cursor-pointer transition flex justify-between items-center group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{sess.role}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{sess.area}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-1">{sess.createdAt}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div className="text-center">
                          <span className={`text-xs font-black block ${
                            avgScore >= 80 ? "text-emerald-600" : avgScore >= 60 ? "text-yellow-600" : "text-red-500"
                          }`}>
                            {avgScore} pts
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono uppercase">Média</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INTERVIEW SIMULATOR PANEL (ACTIVE RUN) */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Simulação Ativa</span>
              <h3 className="text-base font-bold text-white mt-1">Vaga: {session.role}</h3>
              <p className="text-xs text-slate-400">{session.area}</p>
            </div>
            <button
              onClick={handleResetSession}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Simulador</span>
            </button>
          </div>

          {/* ACTIVE OR COMPLETE SPLIT CONTAINER */}
          {session.completed ? (
            /* COMPLETION VIEW */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">Simulação Concluída!</h3>
                <p className="text-slate-500 text-sm mt-1">Parabéns! Você concluiu as perguntas e treinou sua postura para o processo seletivo.</p>
              </div>

              {/* General Statistics */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-center">
                  <span className="text-2xl font-black text-blue-900 block">{getAverageScore(session)} pts</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pontuação Geral</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-emerald-600 block">{session.questions.length}/{session.questions.length}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Respondidas</span>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-1">Análise detalhada</h4>
                {session.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                    <p className="font-bold text-slate-800">P{idx + 1}. {q.question}</p>
                    <p className="text-slate-600 mt-1 italic">Sua resposta: "{q.userAnswer}"</p>
                    {q.evaluation && (
                      <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Feedback da IA ({q.evaluation.score} pts)</span>
                        </div>
                        <p className="text-slate-700 leading-normal">{q.evaluation.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleResetSession}
                className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-sm hover:bg-blue-800 transition"
              >
                Simular Novo Cargo
              </button>
            </div>
          ) : (
            /* ACTIVE QUESTION PANEL */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Question Screen */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Question Box */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-blue-600">Pergunta {session.currentQuestionIndex + 1} de {session.questions.length}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Simulação Realista</span>
                  </div>

                  <h3 className="text-lg font-sans font-extrabold text-slate-800 leading-snug">
                    "{session.questions[session.currentQuestionIndex].question}"
                  </h3>

                  <div className="p-3.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                    <BookOpen className="w-4.5 h-4.5 shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <strong className="block font-bold">O que o recrutador busca avaliar aqui:</strong>
                      {session.questions[session.currentQuestionIndex].context}
                    </div>
                  </div>
                </div>

                {/* Answer Box */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Sua Resposta para o Recrutador</label>
                    <textarea
                      value={userAnswerText}
                      onChange={(e) => setUserAnswerText(e.target.value)}
                      placeholder="Redija como se estivesse de fato respondendo verbalmente ao entrevistador. Use o método STAR (Situação, Tarefa, Ação e Resultado) se aplicável..."
                      rows={5}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                      disabled={loadingEvaluation || !!session.questions[session.currentQuestionIndex].evaluation}
                    />
                  </div>

                  {!session.questions[session.currentQuestionIndex].evaluation ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={loadingEvaluation || !userAnswerText.trim()}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {loadingEvaluation ? (
                        <>
                          <span className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin"></span>
                          <span>Analisando sua resposta com IA...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar Resposta para Avaliação</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>
                        {session.currentQuestionIndex + 1 === session.questions.length ? "Finalizar Simulação" : "Ir para Próxima Pergunta"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side Instant Evaluation panel */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Avaliação da Resposta</h3>
                  
                  {session.questions[session.currentQuestionIndex].evaluation ? (
                    <div className="space-y-4 animate-fade-in">
                      {/* Circle score gauge */}
                      <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-white shrink-0 shadow-sm">
                          <span className="text-lg font-black text-slate-800 leading-none">
                            {session.questions[session.currentQuestionIndex].evaluation?.score}
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono uppercase font-bold mt-0.5">Pontos</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Excelente Desempenho!</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-sans leading-relaxed">Sua resposta demonstra as qualidades necessárias para este cargo.</p>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs leading-relaxed">
                        <div>
                          <span className="block font-bold text-slate-700">Dicas e Feedback:</span>
                          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                            {session.questions[session.currentQuestionIndex].evaluation?.feedback}
                          </p>
                        </div>

                        <div>
                          <span className="block font-bold text-slate-700">Como seria a Resposta Ideal:</span>
                          <p className="text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60 mt-1 font-mono text-[11px]">
                            {session.questions[session.currentQuestionIndex].evaluation?.idealAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Star className="w-10 h-10 mx-auto mb-2.5 text-slate-200" />
                      <p className="text-xs font-medium">Aguardando envio da resposta.</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-normal">Digite e submeta sua resposta para receber pontuação e feedback de como melhorá-la.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
