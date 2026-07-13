import React, { useState, useEffect } from "react";
import { Book, User, KBDocument } from "../types";
import { INITIAL_BOOKS, LocalDB } from "../db";
import { 
  BookOpen, Search, Filter, Clock, ChevronRight, ArrowLeft, Upload, File, HelpCircle, Check, Sparkles,
  Brain, Trash2, Cpu, FileText, CheckSquare, Square, Copy, Loader2 
} from "lucide-react";

interface LibraryViewProps {
  user: User;
}

const CATEGORIES = ["Todos", "Primeiro Emprego", "Entrevistas", "Currículos", "LinkedIn", "Carreira"];

export default function LibraryView({ user }: LibraryViewProps) {
  // Navigation Tabs: "library" (standard) or "kb" (AI Knowledge Center)
  const [activeTab, setActiveTab] = useState<"library" | "kb">("library");

  // --- LIBRARY TAB STATES ---
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // File Upload states for student's custom library catalog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<any>("Primeiro Emprego");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // --- KB TAB STATES (AI KNOWLEDGE CENTER) ---
  const [kbDocs, setKbDocs] = useState<KBDocument[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [kbSuccessMsg, setKbSuccessMsg] = useState("");
  const [kbErrorMsg, setKbErrorMsg] = useState("");

  // Search KB states
  const [kbQuery, setKbQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState("");
  const [copied, setCopied] = useState(false);

  // NLP Semantic Search states for documents selection
  const [kbDocSearchQuery, setKbDocSearchQuery] = useState("");
  const [isSearchingDocs, setIsSearchingDocs] = useState(false);
  const [kbDocSearchResults, setKbDocSearchResults] = useState<any[]>([]); // { id, relevanceScore, reason, snippet }
  const [kbDocSearchError, setKbDocSearchError] = useState("");

  const handleKBDocSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbDocSearchQuery.trim()) {
      setKbDocSearchResults([]);
      return;
    }
    if (kbDocs.length === 0) {
      setKbDocSearchError("Você precisa subir ao menos um documento no seu Centro de Conhecimento antes de fazer a busca por IA.");
      return;
    }

    setIsSearchingDocs(true);
    setKbDocSearchError("");

    try {
      const response = await fetch("/api/kb/search-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: kbDocSearchQuery,
          documents: kbDocs.map(d => ({ id: d.id, name: d.name, text: d.text })),
          provider: user.preferredProvider || "gemini",
          apiKey: user.openaiApiKey || ""
        })
      });

      if (!response.ok) {
        throw new Error("Erro na conexão com o robô de busca de relevância.");
      }

      const data = await response.json();
      const results = data.results || [];
      setKbDocSearchResults(results);

      // Auto-select documents with high relevance (score >= 40)
      const highlyRelevantIds = results
        .filter((r: any) => r.relevanceScore >= 40)
        .map((r: any) => r.id);

      if (highlyRelevantIds.length > 0) {
        setSelectedDocIds(highlyRelevantIds);
        setKbSuccessMsg(`${highlyRelevantIds.length} documento(s) com alta relevância selecionado(s) automaticamente!`);
        setTimeout(() => setKbSuccessMsg(""), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setKbDocSearchError(err.message || "Falha ao analisar relevância com IA.");
    } finally {
      setIsSearchingDocs(false);
    }
  };

  const handleClearDocSearch = () => {
    setKbDocSearchQuery("");
    setKbDocSearchResults([]);
    setKbDocSearchError("");
  };

  // Order documents: if we have search results, order by relevance score descending, otherwise standard
  const orderedDocs = React.useMemo(() => {
    if (kbDocSearchResults.length === 0) return kbDocs;
    
    const scoreMap = new Map<string, number>(
      kbDocSearchResults.map(r => [r.id as string, Number(r.relevanceScore) || 0])
    );
    
    return [...kbDocs].sort((a, b) => {
      const scoreA = scoreMap.get(a.id) || 0;
      const scoreB = scoreMap.get(b.id) || 0;
      return scoreB - scoreA;
    });
  }, [kbDocs, kbDocSearchResults]);

  // Load local user KB Documents on mount
  useEffect(() => {
    const docs = LocalDB.getKBDocuments(user.id);
    setKbDocs(docs);
    // Select all docs by default
    if (docs.length > 0) {
      setSelectedDocIds(docs.map(d => d.id));
    }
  }, [user.id]);

  // Filter books based on search & category selection
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "Todos" || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle uploading custom library catalog material
  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadDesc) return;

    const newBook: Book = {
      id: Math.random().toString(36).substring(2, 11),
      title: uploadTitle,
      category: uploadCategory,
      description: uploadDesc,
      readingTime: "5 min",
      gradient: "from-slate-700 to-slate-900",
      content: `### ${uploadTitle}\n\nEste é o material personalizado que você subiu à sua biblioteca.\n\n#### Descrição do Documento\n${uploadDesc}\n\n*Nota: Para extração e análise completa com Inteligência Artificial, use o painel 'Centro de Conhecimento IA' ao lado!*`
    };

    setBooks([newBook, ...books]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadOpen(false);
      setUploadTitle("");
      setUploadDesc("");
    }, 1200);
  };

  // --- KB UPLOAD HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setKbErrorMsg("");
    }
  };

  const handleKBDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
      setKbErrorMsg("Por favor, selecione um arquivo PDF, TXT ou MD.");
      return;
    }

    setIsUploading(true);
    setUploadMsg("Analisando estrutura do documento...");
    setKbErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      // Simulation messages
      const loadingInterval = setInterval(() => {
        const msgs = [
          "Lendo bytes e decodificando metadados...",
          "Extraindo conteúdo do PDF Lynx EDU...",
          "Analisando parágrafos e palavras-chave IA...",
          "Finalizando importação do documento..."
        ];
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        setUploadMsg(randomMsg);
      }, 1500);

      const response = await fetch("/api/kb/upload", {
        method: "POST",
        body: formData
      });

      clearInterval(loadingInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao realizar o processamento do PDF.");
      }

      const fileData = await response.json();

      // Add to local DB
      const newDoc: KBDocument = {
        id: Math.random().toString(36).substring(2, 11),
        name: fileData.name,
        size: fileData.size,
        text: fileData.text,
        uploadedAt: fileData.uploadedAt
      };

      const updatedDocs = LocalDB.addKBDocument(user.id, newDoc);
      setKbDocs(updatedDocs);
      
      // Auto-select the newly uploaded doc
      setSelectedDocIds(prev => [...prev, newDoc.id]);
      
      setKbSuccessMsg(`O arquivo "${fileData.name}" foi importado e vetorizado no Centro de Conhecimento com sucesso!`);
      setFileToUpload(null);
      // Reset input
      const fileInput = document.getElementById("kb-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setTimeout(() => setKbSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error(err);
      setKbErrorMsg(err.message || "Erro de conexão com o extrator de PDF.");
    } finally {
      setIsUploading(false);
      setUploadMsg("");
    }
  };

  const handleDeleteKBDoc = (id: string, name: string) => {
    if (window.confirm(`Tem certeza de que deseja remover o documento "${name}" do Centro de Conhecimento?`)) {
      const updated = LocalDB.deleteKBDocument(user.id, id);
      setKbDocs(updated);
      setSelectedDocIds(prev => prev.filter(docId => docId !== id));
    }
  };

  const handleToggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  // --- KB IA QUERY HANDLER ---
  const handleKBQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbQuery.trim() || isSearching) return;

    if (selectedDocIds.length === 0) {
      setKbErrorMsg("Selecione pelo menos um documento na lista para realizar a pergunta.");
      return;
    }

    setIsSearching(true);
    setKbErrorMsg("");
    setSearchResult("");

    try {
      // Concatenate text contents of all selected documents
      const selectedTexts = kbDocs
        .filter(d => selectedDocIds.includes(d.id))
        .map(d => `--- DOCUMENTO: ${d.name} ---\n${d.text}`)
        .join("\n\n");

      const response = await fetch("/api/kb/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: kbQuery,
          documentText: selectedTexts,
          provider: user.preferredProvider || "gemini",
          apiKey: user.openaiApiKey || ""
        })
      });

      if (!response.ok) {
        throw new Error("Erro na conexão com o mecanismo de busca inteligente.");
      }

      const data = await response.json();
      setSearchResult(data.text);
    } catch (err: any) {
      console.error(err);
      setKbErrorMsg(err.message || "Ocorreu uma falha ao pesquisar com Inteligência Artificial.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyResult = () => {
    if (!searchResult) return;
    navigator.clipboard.writeText(searchResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 sm:p-2" id="library-container">
      
      {/* Tab Selector Header */}
      <div className="flex border-b border-slate-200 gap-4" id="library-tab-selectors">
        <button
          onClick={() => { setActiveTab("library"); setActiveBook(null); }}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === "library" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>Biblioteca Digital</span>
        </button>
        <button
          onClick={() => setActiveTab("kb")}
          className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 relative ${
            activeTab === "kb" ? "border-blue-900 text-blue-950" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Brain className="w-4.5 h-4.5 text-blue-900 animate-pulse" />
          <span>Centro de Conhecimento IA</span>
          <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">PDF</span>
        </button>
      </div>

      {activeTab === "kb" ? (
        // ================== CENTRO DE CONHECIMENTO IA TAB ==================
        <div className="space-y-6 animate-fade-in" id="kb-center-container">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-2xl -mr-16 -mt-16"></div>
            <div className="max-w-2xl space-y-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/60 text-emerald-300 text-xs font-bold border border-blue-700/50">
                <Sparkles className="w-3.5 h-3.5" /> Exclusivo Lynx EDU IA
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight leading-tight">Centro de Conhecimento IA</h1>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Suba PDFs de editais, apostilas de estudo, manuais de estágio ou anotações profissionais. Nossa Inteligência Artificial lerá os arquivos e responderá suas dúvidas na hora baseada 100% no conteúdo deles!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Upload and Document list */}
            <div className="lg:col-span-1 space-y-6">
              {/* Document Uploader Form Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-900" /> Upload de PDF / TXT / MD
                </h3>

                <form onSubmit={handleKBDocUpload} className="space-y-3">
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-900/40 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50/80 transition relative group">
                    <input
                      type="file"
                      id="kb-file-input"
                      accept=".pdf,.txt,.md"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center group-hover:scale-110 transition">
                        <FileText className="w-5 h-5 text-blue-900" />
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {fileToUpload ? fileToUpload.name : "Clique ou arraste um PDF ou texto"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {fileToUpload ? `${(fileToUpload.size / 1024).toFixed(1)} KB` : "PDF, TXT ou MD até 10MB"}
                      </div>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="p-3 bg-blue-50 text-blue-950 border border-blue-100 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-semibold">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-950" />
                        <span>Extraindo texto...</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono italic">{uploadMsg}</p>
                    </div>
                  )}

                  {kbSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-[11px] rounded-xl border border-emerald-100">
                      {kbSuccessMsg}
                    </div>
                  )}

                  {kbErrorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-[11px] rounded-xl border border-red-100">
                      {kbErrorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!fileToUpload || isUploading}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-150 text-white disabled:text-slate-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {isUploading ? "Processando..." : "Vetorizar e Analisar Arquivo"}
                  </button>
                </form>
              </div>

              {/* Uploaded Documents Shelf */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <File className="w-4 h-4 text-blue-900" /> Meus Documentos ({kbDocs.length})
                  </h3>
                  {kbDocs.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      {selectedDocIds.length} selecionados
                    </span>
                  )}
                </div>

                {/* NLP Semantic Search Input for Documents list */}
                {kbDocs.length > 0 && (
                  <div className="space-y-2 border-b border-slate-100 pb-3" id="kb-document-nlp-search-container">
                    <form onSubmit={handleKBDocSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar por dúvida ou assunto com IA..."
                          value={kbDocSearchQuery}
                          onChange={(e) => setKbDocSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none transition"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearchingDocs || !kbDocSearchQuery.trim()}
                        className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {isSearchingDocs ? (
                          <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>Buscar com IA</span>
                      </button>
                    </form>

                    {kbDocSearchResults.length > 0 && (
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-blue-900 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" /> Ordenado por relevância com IA
                        </span>
                        <button
                          type="button"
                          onClick={handleClearDocSearch}
                          className="text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
                        >
                          Limpar busca
                        </button>
                      </div>
                    )}

                    {kbDocSearchError && (
                      <div className="text-[10px] text-red-600 font-semibold">{kbDocSearchError}</div>
                    )}
                  </div>
                )}

                {kbDocs.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-400 leading-normal px-4">
                    Você ainda não subiu nenhum arquivo. Adicione um edital ou apostila acima para começar!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {orderedDocs.map((doc) => {
                      const isSelected = selectedDocIds.includes(doc.id);
                      const searchResult = kbDocSearchResults.find(r => r.id === doc.id);
                      const hasScore = searchResult && searchResult.relevanceScore !== undefined;
                      const score = hasScore ? searchResult.relevanceScore : 0;
                      
                      let scoreBg = "bg-slate-100 text-slate-600";
                      if (score >= 70) {
                        scoreBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      } else if (score >= 30) {
                        scoreBg = "bg-amber-50 text-amber-700 border-amber-100";
                      } else if (hasScore) {
                        scoreBg = "bg-red-50 text-red-600 border-red-100 opacity-60";
                      }

                      return (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-xl border text-xs flex flex-col gap-2.5 transition ${
                            isSelected ? "border-blue-900 bg-blue-50/20" : "border-slate-200 hover:bg-slate-50"
                          } ${hasScore && score === 0 ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div 
                              className="flex items-start gap-2 cursor-pointer flex-1 min-w-0"
                              onClick={() => handleToggleSelectDoc(doc.id)}
                            >
                              <button type="button" className="text-blue-900 shrink-0 mt-0.5 cursor-pointer">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 fill-blue-900 text-white" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </button>
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <span className="font-bold text-slate-800 block truncate leading-tight" title={doc.name}>{doc.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono block">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {hasScore && (
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${scoreBg}`}>
                                  {score}%
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteKBDoc(doc.id, doc.name)}
                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                                title="Remover documento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {hasScore && score > 0 && (
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[10px] text-slate-600 animate-fade-in">
                              <p className="font-medium text-slate-700 leading-normal">
                                <strong className="text-slate-900">Motivo:</strong> {searchResult.reason}
                              </p>
                              {searchResult.snippet && (
                                <p className="font-mono bg-white p-1.5 rounded-lg text-[9px] text-slate-500 italic border border-slate-100/50 leading-relaxed">
                                  "{searchResult.snippet}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Q&A query dashboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Form Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-900 animate-pulse" /> Busca por IA Lynx EDU
                  </h2>
                  <p className="text-xs text-slate-500 leading-normal mt-1">
                    Insira sua pergunta de forma livre. O algoritmo irá cruzar os dados de todos os documentos marcados à esquerda para te responder com precisão cirúrgica.
                  </p>
                </div>

                <form onSubmit={handleKBQuery} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={kbQuery}
                      onChange={(e) => setKbQuery(e.target.value)}
                      placeholder="Ex: Qual o prazo limite de entrega do relatório de estágio citado no edital?"
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={isSearching || !kbQuery.trim()}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition disabled:bg-slate-150 disabled:text-slate-400 outline-none cursor-pointer"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </form>

                {/* Question Results Block */}
                {isSearching && (
                  <div className="p-8 bg-slate-50 border border-slate-150 rounded-2xl text-center space-y-3">
                    <Loader2 className="w-7 h-7 animate-spin text-blue-950 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">A Inteligência Artificial está lendo e consultando seus arquivos...</p>
                    <p className="text-[10px] text-slate-400 font-mono">Buscando por termos relevantes, comparando datas e gerando síntese</p>
                  </div>
                )}

                {searchResult && (
                  <div className="p-5 bg-blue-50/20 border border-blue-100 rounded-2xl space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-blue-900/10 pb-2">
                      <span className="text-[10px] font-bold text-blue-950 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-blue-900" /> Relatório de Resposta IA
                      </span>
                      <button
                        onClick={handleCopyResult}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer outline-none shadow-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar resposta</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="prose prose-blue text-xs sm:text-sm text-slate-700 leading-relaxed font-sans space-y-3">
                      {searchResult.split("\n\n").map((para, i) => {
                        if (para.startsWith("### ")) {
                          return <h3 key={i} className="text-sm font-bold text-slate-900 mt-4 border-b pb-1">{para.replace("### ", "")}</h3>;
                        }
                        if (para.startsWith("#### ")) {
                          return <h4 key={i} className="text-xs font-bold text-slate-800 mt-2">{para.replace("#### ", "")}</h4>;
                        }
                        if (para.startsWith("- ") || para.startsWith("* ")) {
                          return (
                            <ul key={i} className="list-disc list-inside pl-3 space-y-1 text-xs">
                              {para.split("\n").map((line, idx) => (
                                <li key={idx} className="text-slate-600">{line.replace(/^[-*]\s*/, "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={i} className="whitespace-pre-line">{para}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ================== STANDARD DIGITAL LIBRARY TAB ==================
        <div className="space-y-6 animate-fade-in" id="library-main-shelf">
          
          {/* READING MODE SCREEN OVERLAY (If book is active) */}
          {activeBook ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 space-y-6 animate-fade-in relative z-20" id="library-reading-view">
              {/* Back button */}
              <button
                onClick={() => setActiveBook(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Biblioteca</span>
              </button>

              {/* Book Hero Card header */}
              <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-slate-100">
                {/* Book Spine design cover */}
                <div className={`w-32 h-44 rounded-xl bg-gradient-to-br ${activeBook.gradient} text-white p-4 flex flex-col justify-between shadow-lg shrink-0`}>
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <h4 className="text-xs font-black leading-tight truncate-3-lines">{activeBook.title}</h4>
                  <span className="text-[8px] font-mono tracking-wider uppercase opacity-80">OC Carreira</span>
                </div>

                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase border border-blue-100">
                    {activeBook.category}
                  </span>
                  <h2 className="text-2xl font-sans font-extrabold text-slate-800 leading-tight">{activeBook.title}</h2>
                  <p className="text-slate-500 text-sm leading-normal">{activeBook.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Tempo de leitura estimado: {activeBook.readingTime}</span>
                  </div>
                </div>
              </div>

              {/* Book content (Beautiful Markdown rendering simulation) */}
              <article className="prose prose-blue max-w-3xl mx-auto py-4 text-slate-700 leading-relaxed space-y-5 text-sm sm:text-base">
                {activeBook.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("### ")) {
                    return <h3 key={index} className="text-lg font-sans font-extrabold text-slate-900 border-b pb-1.5 mt-6">{paragraph.replace("### ", "")}</h3>;
                  }
                  if (paragraph.startsWith("#### ")) {
                    return <h4 key={index} className="text-base font-bold text-slate-800 mt-4">{paragraph.replace("#### ", "")}</h4>;
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={index} className="list-disc list-inside pl-4 space-y-1 text-sm">
                        {paragraph.split("\n").map((li, liIdx) => (
                          <li key={liIdx} className="text-slate-600">{li.replace("- ", "").replace("* ", "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={index} className="whitespace-pre-line">{paragraph}</p>;
                })}
              </article>
            </div>
          ) : (
            /* LIBRARY MAIN SHELF GRID VIEW */
            <div className="space-y-6">
              
              {/* Top Filter and Search Bar Row */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200/80 print:hidden shadow-xs">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar livros, artigos e manuais..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  />
                </div>

                {/* Custom file upload button */}
                <button
                  onClick={() => setUploadOpen(!uploadOpen)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer outline-none shrink-0"
                  id="library-upload-trigger"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Adicionar à Estante</span>
                </button>
              </div>

              {/* CATEGORIES HORIZONTAL NAVIGATION PILLS */}
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full print:hidden">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition cursor-pointer shrink-0 ${
                      selectedCategory === cat 
                        ? "bg-blue-950 text-white shadow-sm" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* CUSTOM UPLOAD DIALOG POPUP OVERLAY */}
              {uploadOpen && (
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-md space-y-4 max-w-lg animate-fade-in print:hidden" id="library-upload-box">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Upload className="w-4.5 h-4.5 text-emerald-500" /> Subir Manual ou Artigo de Apoio
                    </h3>
                  </div>

                  {uploadSuccess ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
                      <Check className="w-5 h-5 text-emerald-600" /> Material adicionado com sucesso na prateleira da biblioteca!
                    </div>
                  ) : (
                    <form onSubmit={handleCustomUpload} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Título do Material</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Minha Análise de Vaga"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Categoria</label>
                          <select
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          >
                            <option value="Primeiro Emprego">Primeiro Emprego</option>
                            <option value="Entrevistas">Entrevistas</option>
                            <option value="Currículos">Currículos</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Carreira">Carreira</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notas Rápidas</label>
                          <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 text-[10px] text-slate-500 flex items-center gap-1 select-none">
                            <File className="w-3.5 h-3.5 text-slate-400" /> Notas manuais
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descrição / Notas de Estudo</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Descreva as anotações principais ou objetivos deste documento..."
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadOpen(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition"
                        >
                          Confirmar Envio
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* BOOKS SHELF GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="library-shelf-grid">
                {filteredBooks.map((book) => (
                  <div 
                    key={book.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div className="space-y-4">
                      {/* Styled Book Cover Header */}
                      <div className={`h-40 rounded-xl bg-gradient-to-br ${book.gradient} text-white p-4 flex flex-col justify-between relative overflow-hidden shadow-sm`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10"></div>
                        <BookOpen className="w-6 h-6 text-emerald-400 relative z-10" />
                        <h4 className="text-xs font-black relative z-10 leading-tight tracking-tight max-w-[85%]">{book.title}</h4>
                        <span className="text-[8px] font-mono tracking-widest uppercase opacity-85 relative z-10">Lynx EDU Sistemas Escolares Inteligentes</span>
                      </div>

                      {/* Info Row */}
                      <div className="space-y-2">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-md uppercase border border-blue-100">
                          {book.category}
                        </span>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition text-sm truncate">{book.title}</h3>
                        <p className="text-slate-500 text-xs leading-normal line-clamp-3">{book.description}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{book.readingTime}</span>
                      </div>
                      <button
                        onClick={() => setActiveBook(book)}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:text-slate-900 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Abrir Livro</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
