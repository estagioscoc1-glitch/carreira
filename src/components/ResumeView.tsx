import React, { useState, useEffect } from "react";
import { User, ResumeData } from "../types";
import { LocalDB } from "../db";
import { 
  FileUser, Sparkles, Download, ArrowRight, Save, Clipboard, CheckCircle, AlertCircle, Edit3, Eye, Printer, Bot 
} from "lucide-react";

interface ResumeViewProps {
  user: User;
  onProfileUpdate: (updates: Partial<User>) => void;
}

export default function ResumeView({ user, onProfileUpdate }: ResumeViewProps) {
  // Try to load saved resume, or fallback to user profile details
  const [objective, setObjective] = useState(user.objective || "");
  const [experience, setExperience] = useState(user.experience || "");
  const [courses, setCourses] = useState(user.courses || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [languages, setLanguages] = useState(user.languages || "");

  // AI Enhanced Resume details
  const [enhancedResume, setEnhancedResume] = useState<ResumeData | null>(null);
  const [usingEnhanced, setUsingEnhanced] = useState(false);

  // AI Generation States
  const [generatorPrompt, setGeneratorPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatorPrompt.trim()) {
      setErrorMsg("Por favor, digite um resumo ou objetivo para que a IA possa gerar o currículo.");
      return;
    }

    setIsGenerating(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/resume-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: generatorPrompt,
          studentName: user.name,
          studentCourse: user.course,
          provider: user.preferredProvider || "gemini",
          apiKey: user.openaiApiKey || ""
        })
      });

      if (!response.ok) {
        throw new Error("Erro de comunicação com o gerador de currículos.");
      }

      const data = await response.json();
      
      // Populate fields
      setObjective(data.objective || "");
      setExperience(data.experience || "");
      setCourses(data.courses || "");
      setSkills(data.skills || "");
      setLanguages(data.languages || "Português (Nativo)");
      
      // Set as enhanced so user sees the generated summary
      setEnhancedResume({
        summary: data.summary || "",
        objective: data.objective || "",
        experience: data.experience || "",
        courses: data.courses || "",
        skills: data.skills || "",
        languages: data.languages || "Português (Nativo)"
      });
      setUsingEnhanced(true);
      
      // Save locally
      LocalDB.saveResume(user.id, {
        objective: data.objective || "",
        experience: data.experience || "",
        courses: data.courses || "",
        skills: data.skills || "",
        languages: data.languages || "Português (Nativo)",
        summary: data.summary || ""
      });

      setSuccessMsg("Currículo COMPLETO gerado por Inteligência Artificial! Analise o resultado e edite as seções como preferir.");
      setGeneratorPrompt("");
      setActiveTab("preview");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Falha ao gerar o currículo com Inteligência Artificial.");
    } finally {
      setIsGenerating(false);
    }
  };

  // States
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Keep in sync with user props if they change
    setObjective(user.objective || "");
    setExperience(user.experience || "");
    setCourses(user.courses || "");
    setSkills(user.skills || "");
    setLanguages(user.languages || "");
  }, [user]);

  // Handle manual saving to local DB
  const handleSave = (showToast = true) => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    setTimeout(() => {
      try {
        const updates = {
          objective,
          experience,
          courses,
          skills,
          languages
        };
        // Update both user session and resume specific data
        onProfileUpdate(updates);
        LocalDB.saveResume(user.id, {
          objective,
          experience,
          courses,
          skills,
          languages,
          summary: enhancedResume?.summary
        });

        if (showToast) {
          setSuccessMsg("Dados salvos e currículo gerado com sucesso!");
        }
      } catch (err: any) {
        setErrorMsg("Erro ao salvar currículo.");
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  // Query AI to enhance the resume data
  const handleAIEnhance = async () => {
    setLoadingAI(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/resume-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          objective,
          experience,
          courses,
          skills,
          languages
        })
      });

      if (!response.ok) {
        throw new Error("Erro de processamento da IA");
      }

      const data = await response.json();
      setEnhancedResume(data);
      setUsingEnhanced(true);
      setActiveTab("preview");
      setSuccessMsg("Currículo aprimorado pela Inteligência Artificial com sucesso! Analise a prévia.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Falha ao se conectar com os serviços de Inteligência Artificial. Utilizando otimização local.");
      
      // Local fallback enhancement
      setEnhancedResume({
        summary: `Estudante comprometido do Lynx EDU Sistemas Escolares Inteligentes, com forte orientação para resultados, trabalho em equipe e aprendizado ágil.`,
        objective: objective ? `Otimizado: Atuar profissionalmente aplicando habilidades e colaborar com o crescimento corporativo, tendo como objetivo principal: ${objective}` : "Jovem Aprendiz / Estagiário buscando primeira inserção profissional.",
        experience: experience || "Trabalhos práticos acadêmicos e atividades voluntárias integradas no Lynx EDU.",
        courses: courses || "Ensino Médio e cursos extracurriculares integrados.",
        skills: skills || "Competências interpessoais, organização e raciocínio lógico.",
        languages: languages || "Português Nativo."
      });
      setUsingEnhanced(true);
      setActiveTab("preview");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApplyAIChanges = () => {
    if (enhancedResume) {
      setObjective(enhancedResume.objective);
      setExperience(enhancedResume.experience);
      setCourses(enhancedResume.courses);
      setSkills(enhancedResume.skills);
      setLanguages(enhancedResume.languages);
      setUsingEnhanced(false);
      setEnhancedResume(null);
      setSuccessMsg("Alterações da Inteligência Artificial aplicadas ao seu formulário!");
      setActiveTab("edit");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Values used in the preview
  const displayObjective = usingEnhanced && enhancedResume ? enhancedResume.objective : objective;
  const displayExperience = usingEnhanced && enhancedResume ? enhancedResume.experience : experience;
  const displayCourses = usingEnhanced && enhancedResume ? enhancedResume.courses : courses;
  const displaySkills = usingEnhanced && enhancedResume ? enhancedResume.skills : skills;
  const displayLanguages = usingEnhanced && enhancedResume ? enhancedResume.languages : languages;
  const displaySummary = enhancedResume?.summary || "Estudante proativo e dedicado em constante evolução acadêmica e profissional pelo Lynx EDU Sistemas Escolares Inteligentes.";

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-2" id="resume-container">
      {/* Toast Feedback */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-2.5 text-sm border border-emerald-100 animate-fade-in print:hidden">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 text-red-600 rounded-xl flex items-start gap-2.5 text-sm border border-red-100 animate-shake print:hidden">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Screen Mode Switches (Form vs Real Live Preview) */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3 print:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "edit" ? "bg-blue-900 text-white shadow-md shadow-blue-950/10" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
            id="resume-tab-edit"
          >
            <Edit3 className="w-4 h-4" />
            <span>Formulário de Entrada</span>
          </button>
          <button
            onClick={() => {
              handleSave(false);
              setActiveTab("preview");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preview" ? "bg-blue-900 text-white shadow-md shadow-blue-950/10" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
            id="resume-tab-preview"
          >
            <Eye className="w-4 h-4" />
            <span>Prévia do Currículo</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAIEnhance}
            disabled={loadingAI}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            id="resume-ai-btn"
          >
            <Bot className="w-4 h-4" />
            <span>{loadingAI ? "Processando IA..." : "Otimizar com IA"}</span>
          </button>
        </div>
      </div>

      {/* Main Dual Grid Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* EDIT FORM (LEFT COLUMN ON DESKTOP) */}
        <div className={`space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs print:hidden ${
          activeTab === "edit" ? "block" : "hidden lg:block"
        }`}>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileUser className="w-5 h-5 text-blue-950" /> Preencha seus Dados do Currículo
            </h3>
            <p className="text-xs text-slate-500 leading-normal mt-1">
              Escreva livremente sobre suas aspirações e conhecimentos. Depois, use o botão <strong>Otimizar com IA</strong> para elevar a qualidade do vocabulário técnico.
            </p>
          </div>

          {/* AI Express Generator Box */}
          <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-2xl space-y-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-900 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gerador Expresso por IA (Criação Rápida)</h4>
                <p className="text-[10px] text-slate-500">Escreva um resumo livre e nossa IA construirá todas as seções para você!</p>
              </div>
            </div>
            
            <form onSubmit={handleAIGenerate} className="space-y-2">
              <textarea
                value={generatorPrompt}
                onChange={(e) => setGeneratorPrompt(e.target.value)}
                placeholder="Ex: Quero um currículo para vaga de TI, sou proativo, fiz projetos de HTML no colégio, sou muito comunicativo..."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
              <button
                type="submit"
                disabled={isGenerating || !generatorPrompt.trim()}
                className="w-full py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-150 text-white disabled:text-slate-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Criando currículo completo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gerar Currículo Completo com IA</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Objetivo Profissional</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Busco vaga de Jovem Aprendiz na área administrativa para auxiliar na organização de arquivos e atendimento ao cliente."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Experiências (Informal, Projetos, etc.)</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Ex: Trabalho escolar prático de desenvolvimento de um site html estático no Lynx EDU Sistemas Escolares Inteligentes. Atuação como líder de equipe e desenvolvimento do layout principal."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Cursos Acadêmicos / Formação</label>
              <textarea
                value={courses}
                onChange={(e) => setCourses(e.target.value)}
                placeholder="Ex: Técnico em TI (Cursando) - Lynx EDU Sistemas Escolares Inteligentes (Previsão de conclusão em 2027). Curso de Excel Avançado - Fundação Bradesco."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Competências e Habilidades</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Ex: Comunicação clara, proatividade, HTML, CSS, JavaScript, pacote Office, trabalho em equipe."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Idiomas</label>
              <textarea
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="Ex: Português (Nativo), Inglês (Intermediário - em desenvolvimento)."
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="w-full py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : "Salvar & Atualizar Currículo"}</span>
          </button>
        </div>

        {/* PRINTABLE PREVIEW (RIGHT COLUMN ON DESKTOP) */}
        <div className={`space-y-6 ${
          activeTab === "preview" ? "block" : "hidden lg:block"
        }`}>
          {/* AI Banner Actions if using AI version */}
          {usingEnhanced && enhancedResume && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800">
                  <strong className="block">Modo Otimizado por IA Ativo!</strong>
                  Esta é uma versão com vocabulário formal e termos técnicos recomendados para destacar seu perfil.
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleApplyAIChanges}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition"
                >
                  Salvar no Formulário
                </button>
                <button
                  onClick={() => setUsingEnhanced(false)}
                  className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition"
                >
                  Ver Original
                </button>
              </div>
            </div>
          )}

          {/* Action Trigger for PDF Export */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Exportar PDF / Imprimir</span>
            </button>
          </div>

          {/* REAL PROFESSIONAL RESUME TEMPLATE (Visually polished standard A4) */}
          <div className="bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-md max-w-[21cm] mx-auto text-slate-800 font-sans print:border-none print:shadow-none print:p-0" id="resume-document">
            {/* Document Header */}
            <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">{user.name}</h2>
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2.5 font-medium">
                {user.email && <span>E-mail: {user.email}</span>}
                {user.phone && <span>Telefone: {user.phone}</span>}
                {user.city && <span>Cidade: {user.city}</span>}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-wider">Estudante Lynx EDU Sistemas Escolares Inteligentes</p>
            </div>

            {/* Document Sections */}
            <div className="space-y-5 text-sm leading-relaxed text-slate-800">
              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Resumo Profissional</h4>
                <p className="text-slate-700 text-[13px]">{displaySummary}</p>
              </div>

              {/* Objective */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Objetivo</h4>
                <p className="text-slate-700 text-[13px]">{displayObjective || "Preencha o campo de objetivo no formulário para visualizar."}</p>
              </div>

              {/* Formação Acadêmica */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Formação Acadêmica</h4>
                <div className="text-[13px] whitespace-pre-wrap text-slate-700">
                  {displayCourses ? (
                    displayCourses
                  ) : (
                    <div>
                      <strong>Ensino Médio / Técnico</strong><br />
                      Lynx EDU Sistemas Escolares Inteligentes (Cursando)<br />
                      Previsão de Conclusão: 2027
                    </div>
                  )}
                </div>
              </div>

              {/* Experiência / Projetos */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Projetos / Histórico Profissional</h4>
                <p className="text-slate-700 text-[13px] whitespace-pre-wrap">
                  {displayExperience || "Registre projetos de equipe, trabalhos escolares de destaque ou experiências voluntárias no formulário."}
                </p>
              </div>

              {/* Competências */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Principais Competências</h4>
                <p className="text-slate-700 text-[13px] whitespace-pre-wrap">
                  {displaySkills || "Enumere suas principais competências técnicas e comportamentais."}
                </p>
              </div>

              {/* Idiomas */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2">Idiomas</h4>
                <p className="text-slate-700 text-[13px] whitespace-pre-wrap">
                  {displayLanguages || "Português (Nativo)"}
                </p>
              </div>
            </div>

            {/* Footer Sign */}
            <div className="text-center text-[10px] text-slate-400 mt-12 pt-4 border-t border-slate-100 italic">
              Currículo elaborado eletronicamente com o auxílio de inteligência artificial via OC Carreira IA.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
