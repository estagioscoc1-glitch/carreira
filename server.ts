import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import multer from "multer";
import { PDFParse } from "pdf-parse";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of Gemini API
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Using mock AI responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Middlewares
app.use(express.json());

// Configure Multer for In-memory file storage (PDF/TXT)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. AI Assistant Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, provider, apiKey: clientApiKey, studentProfile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages array" });
    }

    let profileContext = "";
    if (studentProfile) {
      profileContext = `
DADOS DO ALUNO PARA CONTEXTUALIZAÇÃO:
- Nome do Aluno: ${studentProfile.name || "Não informado"}
- Curso: ${studentProfile.course || "Não informado"}
- Objetivo de Carreira: ${studentProfile.objective || "Não informado"}
- Habilidades: ${studentProfile.skills || "Não informado"}
- Experiências: ${studentProfile.experience || "Não informado"}
- Cursos adicionais: ${studentProfile.courses || "Não informado"}
- Idiomas: ${studentProfile.languages || "Não informado"}
- Cidade/Localidade: ${studentProfile.city || "Não informado"}

Instruções Adicionais de Contexto:
Use o nome do aluno (${studentProfile.name || "estudante"}) calorosamente em sua resposta.
Utilize o perfil do aluno para contextualizar todas as sugestões que você fizer. Se ele estuda TI, fale de vagas de tecnologia; se estuda Administração, foque em carreiras corporativas ou comerciais; se ele não informou habilidades ou objetivos profissionais, lembre-o amigavelmente de que ele pode atualizar seu perfil na aba de "Perfil" ou "Currículo" para ganhar pontos no seu 'OC Score'.
`;
    }

    const systemInstruction = `Você é o Assistente de Carreira da plataforma premium OC Carreira IA, exclusiva para os alunos do Colégio Oswaldo Cruz. Seu objetivo principal é orientar, motivar e preparar os alunos do colégio para conquistar o primeiro emprego, estágio ou vagas de jovem aprendiz. Forneça respostas completas, profissionais, acolhedoras, objetivas e repletas de dicas práticas como formatação de currículo, LinkedIn, comportamento em entrevistas e desenvolvimento de competências. Seja sempre empático e encorajador.

${profileContext}`;

    // 1. OpenAI Integration Option
    if (provider === "openai") {
      const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "Chave OpenAI não configurada. Por favor, insira sua chave de API nas Configurações ou use o Google Gemini padrão." 
        });
      }

      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system" as const, content: systemInstruction },
          ...messages.map((m: { role: string; text: string }) => ({
            role: (m.role === "assistant" || m.role === "model" ? "assistant" : "user") as "assistant" | "user",
            content: m.text
          }))
        ]
      });

      return res.json({ text: response.choices[0]?.message?.content || "Desculpe, ocorreu uma falha ao gerar a resposta com a OpenAI." });
    }

    // 2. Google Gemini Integration (Default)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a simulated high-quality career advice if no API key is set
      const lastMessage = messages[messages.length - 1]?.text || "";
      const studentName = studentProfile?.name || "estudante";
      let mockReply = `Olá, ${studentName}! Como simulador do assistente do Colégio Oswaldo Cruz, estou pronto para te ajudar! Infelizmente a chave do Gemini não está configurada, mas aqui vai uma dica profissional personalizada: sempre destaque seus projetos escolares, trabalhos em grupo e habilidades socioemocionais (soft skills) no seu currículo para compensar a falta de experiência profissional formal!`;
      
      if (lastMessage.toLowerCase().includes("currículo") || lastMessage.toLowerCase().includes("curriculo")) {
        mockReply = `Excelente pergunta sobre currículo, ${studentName}! No seu currículo da OC Carreira, estruture-o com: 1. Seus dados de contato (${studentProfile?.city || "Sua cidade"}), 2. Objetivo claro (${studentProfile?.objective || "ex: 'Estágio em TI' ou 'Menor Aprendiz'"}), 3. Formação (Colégio Oswaldo Cruz no curso de ${studentProfile?.course || "seu curso"}), 4. Projetos relevantes desenvolvidos nas aulas, e 5. Competências técnicas e comportamentais (${studentProfile?.skills || "suas habilidades"}).`;
      } else if (lastMessage.toLowerCase().includes("entrevista")) {
        mockReply = `Olá, ${studentName}! Para ir bem em entrevistas para vagas na área de ${studentProfile?.course || "seu segmento"}: 1. Pesquise sobre a empresa, 2. Treine a auto-apresentação (como seu curso de ${studentProfile?.course || "sua formação"} se alinha à vaga), 3. Use o método STAR (Situação, Tarefa, Ação, Resultado) para contar conquistas de projetos escolares, 4. Vista-se de forma profissional e mantenha uma postura confiante.`;
      }
      return res.json({ text: mockReply });
    }

    const ai = getGeminiClient();
    
    // Format messages for @google/genai contents list
    const contents = messages.map((msg: { role: string; text: string }) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Chat endpoint:", error);
    res.status(500).json({ error: error.message || "Erro ao processar conversa de IA" });
  }
});

// 2. Resume Enhancer Endpoint
app.post("/api/resume-enhance", async (req, res) => {
  try {
    const { objective, experience, courses, skills, languages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock enhanced response
      return res.json({
        summary: "Estudante dedicado do Colégio Oswaldo Cruz focado em desenvolvimento profissional contínuo. Demonstra forte capacidade de aprendizado, trabalho em equipe e compromisso com resultados.",
        objective: objective ? `Otimizado: ${objective}` : "Busco oportunidade de primeiro emprego ou estágio para aplicar meus conhecimentos acadêmicos e colaborar com o crescimento da empresa.",
        experience: experience ? `Otimizado com termos de impacto:\n${experience}` : "Projetos acadêmicos desenvolvidos no Colégio Oswaldo Cruz demonstrando resolução de problemas.",
        courses: courses ? `Reestruturado:\n${courses}` : "Formação acadêmica no Colégio Oswaldo Cruz.",
        skills: skills ? `Habilidades agrupadas:\n${skills}` : "Habilidades interpessoais e técnicas básicas.",
        languages: languages ? `Idiomas validados:\n${languages}` : "Português Nativo."
      });
    }

    const ai = getGeminiClient();
    const prompt = `Você é um especialista em recrutamento e seleção e redator profissional de currículos. Sua tarefa é analisar as informações inseridas pelo aluno do Colégio Oswaldo Cruz e gerar uma versão altamente profissional, otimizada com palavras-chave de impacto para o mercado de trabalho, reestruturando tópicos para que fiquem atraentes e persuasivos para os recrutadores.
    
    INFORMAÇÕES FORNECIDAS PELO ALUNO:
    - Objetivo Profissional: ${objective || "Não preenchido"}
    - Experiências (mesmo que informais, voluntárias ou escolares): ${experience || "Não preenchido"}
    - Cursos e Formação: ${courses || "Não preenchido"}
    - Competências/Habilidades: ${skills || "Não preenchido"}
    - Idiomas: ${languages || "Não preenchido"}

    Gere:
    1. Um resumo profissional de alto impacto (summary) ideal para o topo do currículo.
    2. Objetivo otimizado.
    3. Experiências reescritas com verbos de ação e foco em realizações.
    4. Cursos e formação formatados profissionalmente.
    5. Habilidades organizadas e enriquecidas.
    6. Idiomas formatados adequadamente.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo profissional de alto impacto" },
            objective: { type: Type.STRING, description: "Objetivo profissional reescrito de forma direta e profissional" },
            experience: { type: Type.STRING, description: "Experiências descritas de forma profissional com verbos de ação" },
            courses: { type: Type.STRING, description: "Cursos e formação ordenados de maneira atraente" },
            skills: { type: Type.STRING, description: "Competências reestruturadas e agrupadas" },
            languages: { type: Type.STRING, description: "Idiomas listados profissionalmente" }
          },
          required: ["summary", "objective", "experience", "courses", "skills", "languages"]
        }
      }
    });

    const enhancedData = JSON.parse(response.text || "{}");
    res.json(enhancedData);
  } catch (error: any) {
    console.error("Error in Resume Enhance endpoint:", error);
    res.status(500).json({ error: error.message || "Erro ao aprimorar currículo" });
  }
});

// 3. Interview Simulator Questions Generator
app.post("/api/interview-start", async (req, res) => {
  try {
    const { area, role } = req.body;
    if (!area || !role) {
      return res.status(400).json({ error: "Missing area or role in request body" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mock questions
      return res.json([
        {
          id: 1,
          question: `Por que você escolheu a área de ${area} e por que quer trabalhar como ${role}?`,
          context: "Avalia sua motivação, interesse genuíno e se você pesquisou sobre a carreira."
        },
        {
          id: 2,
          question: "Fale sobre um projeto escolar ou trabalho em grupo marcante no Colégio Oswaldo Cruz. Qual foi o seu papel e como lidou com divergências?",
          context: "Avalia trabalho em equipe, comunicação, liderança e resolução de conflitos."
        },
        {
          id: 3,
          question: "Como você lida com situações de pressão ou prazos apertados nos seus estudos?",
          context: "Avalia resiliência, inteligência emocional e organização sob estresse."
        },
        {
          id: 4,
          question: "Qual você considera ser sua maior força e qual o seu principal ponto a melhorar professionalmente?",
          context: "Avalia autoconhecimento, humildade e proatividade em se desenvolver."
        },
        {
          id: 5,
          question: "Onde você se vê profissionalmente daqui a 3 anos?",
          context: "Avalia planejamento de carreira, ambição e se a vaga está alinhada aos seus objetivos de longo prazo."
        }
      ]);
    }

    const ai = getGeminiClient();
    const prompt = `Você é um recrutador técnico e de recursos humanos especialista em simulação de entrevistas de emprego.
    Gere uma lista de 5 perguntas de entrevista altamente pertinentes e realistas para um candidato que busca o primeiro emprego na Área Profissional de "${area}" para o Cargo/Função de "${role}".
    As perguntas devem incluir uma mescla de comportamentais (focadas em atitude, trabalho em equipe, resiliência) e perguntas voltadas para o início de carreira (desafios escolares, motivação).
    Para cada pergunta, inclua um 'context' explicando sucintamente o que o recrutador busca avaliar com ela.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER, description: "Número sequencial de 1 a 5" },
              question: { type: Type.STRING, description: "A pergunta a ser feita ao candidato" },
              context: { type: Type.STRING, description: "O que o recrutador avalia com essa pergunta e dicas de como responder" }
            },
            required: ["id", "question", "context"]
          }
        }
      }
    });

    const questions = JSON.parse(response.text || "[]");
    res.json(questions);
  } catch (error: any) {
    console.error("Error in Interview Start endpoint:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar perguntas de simulação" });
  }
});

// 4. Interview Evaluation Endpoint
app.post("/api/interview-evaluate", async (req, res) => {
  try {
    const { question, answer, area, role } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "Missing question or answer in request body" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mock evaluation
      return res.json({
        score: 75,
        feedback: "Sua resposta foi direta e demonstrou sinceridade. Para torná-la excelente, tente incluir exemplos práticos da sua vivência escolar no Colégio Oswaldo Cruz e use a estrutura STAR (descreva a Situação, a Tarefa que tinha, a Ação que tomou e o Resultado alcançado).",
        idealAnswer: "Uma resposta de alto nível começaria identificando um desafio real de projeto, descrevendo o papel ativo em resolvê-lo, demonstrando habilidades de comunicação interpessoal e terminando com a lição aprendida ou resultado positivo obtido."
      });
    }

    const ai = getGeminiClient();
    const prompt = `Você é um consultor sênior de carreira e recrutador. Avalie de forma construtiva e realista a resposta de um aluno buscando sua primeira vaga na área de "${area}" para a função de "${role}".
    
    PERGUNTA FEITA:
    "${question}"
    
    RESPOSTA DO ALUNO:
    "${answer}"

    Analise a resposta e forneça:
    1. Uma pontuação numérica de 0 a 100 baseada na clareza, relevância, uso de exemplos e profissionalismo.
    2. Um feedback amigável, construtivo e estruturado realçando os pontos fortes e o que pode ser melhorado para causar um impacto incrível no entrevistador.
    3. Um exemplo de resposta ideal (idealAnswer) estruturada e inspiradora, que o candidato poderia usar como modelo.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Nota da resposta de 0 a 100" },
            feedback: { type: Type.STRING, description: "Análise e dicas construtivas de melhoria" },
            idealAnswer: { type: Type.STRING, description: "Exemplo de resposta de alto impacto que o aluno poderia dar" }
          },
          required: ["score", "feedback", "idealAnswer"]
        }
      }
    });

    const evaluation = JSON.parse(response.text || "{}");
    res.json(evaluation);
  } catch (error: any) {
    console.error("Error in Interview Evaluate endpoint:", error);
    res.status(500).json({ error: error.message || "Erro ao avaliar resposta da entrevista" });
  }
});

// 5. PDF/Text Upload and Content Parser Endpoint
app.post("/api/kb/upload", upload.single("file"), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const { originalname, mimetype, buffer } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      extractedText = pdfData.text || "";
    } else if (mimetype === "text/plain" || mimetype === "text/markdown" || mimetype === "application/json") {
      extractedText = buffer.toString("utf-8");
    } else {
      // Fallback text try
      try {
        extractedText = buffer.toString("utf-8");
      } catch {
        return res.status(400).json({ error: "Tipo de arquivo não suportado. Envie PDF, TXT ou MD." });
      }
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "Não foi possível extrair texto legível deste documento." });
    }

    res.json({
      name: originalname,
      size: `${(buffer.length / 1024).toFixed(1)} KB`,
      text: extractedText,
      uploadedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error processing file upload:", error);
    res.status(500).json({ error: "Erro ao processar o arquivo de conhecimento." });
  }
});

// 6. Knowledge Base AI Search Query Engine
app.post("/api/kb/query", async (req: any, res: any) => {
  try {
    const { query, documentText, provider, apiKey: clientApiKey } = req.body;
    if (!query || !documentText) {
      return res.status(400).json({ error: "Faltando pergunta ou texto do documento de suporte." });
    }

    const systemInstruction = `Você é um Analista de Documentos e Tutor de Carreira do Colégio Oswaldo Cruz. Seu papel é responder perguntas baseando-se RIGOROSAMENTE e APENAS nas informações contidas nos documentos fornecidos pelo usuário. Forneça respostas organizadas, precisas e amigáveis em formato Markdown. Se a resposta não puder ser extraída diretamente ou inferred dos documentos fornecidos, responda exatamente o seguinte: 'Sinto muito, mas não consegui encontrar informações sobre este assunto nos documentos subidos no seu Centro de Conhecimento.'
    
    DOCUMENTOS DE REFERÊNCIA DISPONÍVEIS:
    ${documentText}`;

    if (provider === "openai") {
      const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "Chave OpenAI não configurada. Por favor, adicione sua chave de API nas Configurações ou selecione Google Gemini." 
        });
      }

      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: query }
        ]
      });

      return res.json({ text: response.choices[0]?.message?.content || "" });
    } else {
      // Default to Google Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ 
          text: `**Modo Simulação Ativo**: Com base no seu arquivo, o termo **'${query}'** parece estar referenciado, mas as chaves de API do Gemini/OpenAI não estão configuradas no servidor para produzir respostas contextualizadas complexas. Por favor, configure sua chave no painel de Secrets ou use chaves válidas.` 
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          systemInstruction: systemInstruction
        }
      });

      return res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error("Error in Knowledge Base AI query:", error);
    res.status(500).json({ error: error.message || "Erro ao consultar a Inteligência Artificial." });
  }
});

// Helper for local keyword-based semantic search fallback
function localSemanticSearch(query: string, documents: any[]) {
  const normalize = (str: string) => {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ");
  };

  const queryNormalized = normalize(query);
  const queryWords = queryNormalized.split(/\s+/).filter(w => w.length > 2);

  const stopwords = new Set([
    "como", "onde", "quando", "quem", "qual", "quais", "porque", "por que",
    "para", "com", "uma", "uma", "dos", "das", "pelo", "pela", "pelos", "pelas",
    "sobre", "entre", "esse", "essa", "este", "esta", "estes", "estas", "isso", "isto",
    "voces", "voce", "estagio", "estagios", "documento", "documentos", "arquivo"
  ]);

  const searchTerms = queryWords.filter(w => !stopwords.has(w));
  const termsToUse = searchTerms.length > 0 ? searchTerms : queryWords;

  const results = documents.map(doc => {
    const docNameNorm = normalize(doc.name);
    const docTextNorm = normalize(doc.text);

    let matchCount = 0;
    let nameMatches = 0;

    termsToUse.forEach(term => {
      if (docNameNorm.includes(term)) {
        nameMatches++;
      }
      
      const regex = new RegExp(`\\b${term}\\b`, "g");
      const matches = docTextNorm.match(regex);
      if (matches) {
        matchCount += matches.length;
      } else if (docTextNorm.includes(term)) {
        matchCount += 1;
      }
    });

    let score = 0;
    if (termsToUse.length > 0) {
      const matchedTerms = termsToUse.filter(term => docTextNorm.includes(term) || docNameNorm.includes(term)).length;
      const termRatio = matchedTerms / termsToUse.length;
      
      const frequencyBoost = Math.min(matchCount * 10, 40);
      const nameBoost = nameMatches * 20;
      
      score = Math.round(termRatio * 50 + frequencyBoost + nameBoost);
      if (score > 100) score = 100;
    }

    if (score === 0 && termsToUse.some(term => docTextNorm.includes(term) || docNameNorm.includes(term))) {
      score = 15;
    }

    let snippet = "";
    let reason = "";

    if (score > 0) {
      let matchIdx = -1;
      for (const term of termsToUse) {
        const idx = docTextNorm.indexOf(term);
        if (idx !== -1) {
          matchIdx = idx;
          break;
        }
      }

      if (matchIdx !== -1) {
        const snippetStart = Math.max(0, matchIdx - 100);
        const snippetEnd = Math.min(doc.text.length, matchIdx + 200);
        snippet = doc.text.substring(snippetStart, snippetEnd).replace(/\s+/g, " ").trim();
        if (snippetStart > 0) snippet = "..." + snippet;
        if (snippetEnd < doc.text.length) snippet = snippet + "...";
      } else {
        snippet = doc.text.substring(0, 200) + "...";
      }

      reason = `O documento menciona termos relevantes relacionados a sua pesquisa como ${termsToUse.slice(0, 3).map(t => `'${t}'`).join(", ")} (relevância aproximada de ${score}%).`;
    } else {
      snippet = doc.text.substring(0, 150) + "...";
      reason = "Nenhuma correspondência semântica direta ou por termos principais foi detectada neste documento.";
    }

    return {
      id: doc.id,
      relevanceScore: score,
      reason,
      snippet
    };
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// 6.5 NLP Document Semantic Search Route
app.post("/api/kb/search-docs", async (req: any, res: any) => {
  try {
    const { query, documents, provider, apiKey: clientApiKey } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Faltando a dúvida para pesquisa semântica." });
    }
    
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.json({ results: [] });
    }

    // Determine if we should run AI search or fallback to local semantic keyword matcher
    const useOpenAI = provider === "openai" && (clientApiKey || process.env.OPENAI_API_KEY);
    const useGemini = provider !== "openai" && process.env.GEMINI_API_KEY;

    if (!useOpenAI && !useGemini) {
      // Execute intelligent local NLP mock fallback
      const localResults = localSemanticSearch(query, documents);
      return res.json({ results: localResults });
    }

    const systemInstruction = `Você é um Robô de Busca Semântica Avançado para o Colégio Oswaldo Cruz. Sua função única é analisar uma lista de documentos e uma dúvida de um aluno para determinar quais documentos são relevantes para responder a essa dúvida.
    
    DÚVIDA DO ESTUDANTE: "${query}"

    DOCUMENTOS DISPONÍVEIS PARA ANÁLISE:
    ${documents.map(d => `--- ID: ${d.id} | NOME: ${d.name} ---\n${d.text.substring(0, 4000)}`).join("\n\n")}

    Para cada documento, avalie:
    1. relevanceScore: Atribua uma pontuação de relevância de 0 a 100 com base no quanto o texto aborda o assunto ou pode ajudar a responder à dúvida. Se não tiver relevância alguma, retorne 0.
    2. reason: Escreva em poucas palavras uma explicação objetiva explicando de que forma o conteúdo é relevante para a dúvida ou por que não tem relevância.
    3. snippet: Forneça um pequeno trecho (aproximadamente 100-200 caracteres) do documento que demonstra ou fundamenta essa relevância.

    Sua resposta deve ser estritamente formatada como um objeto JSON válido contendo um array "results" com os objetos de análise correspondentes de todos os documentos avaliados.
    Formato JSON esperado:
    {
      "results": [
        {
          "id": "id-do-documento",
          "relevanceScore": 95,
          "reason": "Menciona o prazo específico de assinatura do termo de estágio e quem deve assinar.",
          "snippet": "...todos os documentos relativos ao termo de compromisso de estágio deverão ser assinados pela coordenação..."
        }
      ]
    }`;

    if (useOpenAI) {
      const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Analise a relevância dos documentos para a dúvida do aluno: ${query}` }
        ],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || '{"results": []}');
      return res.json(parsed);
    } else {
      // Default to Google Gemini
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise a relevância dos documentos para a dúvida do aluno: ${query}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    relevanceScore: { type: Type.INTEGER },
                    reason: { type: Type.STRING },
                    snippet: { type: Type.STRING }
                  },
                  required: ["id", "relevanceScore", "reason", "snippet"]
                }
              }
            },
            required: ["results"]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{"results": []}');
      return res.json(parsed);
    }
  } catch (error: any) {
    console.error("Error in Knowledge Base NLP Document Search:", error);
    // On failure, fall back to our reliable local semantic engine rather than crashing
    try {
      const { query, documents } = req.body;
      const localResults = localSemanticSearch(query, documents);
      return res.json({ results: localResults });
    } catch {
      res.status(500).json({ error: error.message || "Erro ao realizar busca semântica." });
    }
  }
});

// 7. Full AI Resume Generator from Prompt
app.post("/api/resume-generate", async (req: any, res: any) => {
  try {
    const { prompt, studentName, studentCourse, provider, apiKey: clientApiKey } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Faltando o prompt de descrição para criação." });
    }

    const systemInstruction = `Você é um Redator Profissional de Currículos para estudantes do Colégio Oswaldo Cruz. Com base na descrição pessoal livre enviada pelo aluno, você deve criar e estruturar um currículo profissional de altíssimo nível, otimizado com palavras-chave de impacto, focado em vagas de Estágio, Jovem Aprendiz ou Primeiro Emprego.
    
    DADOS DO ALUNO:
    - Nome: ${studentName || "Estudante do Oswaldo Cruz"}
    - Curso: ${studentCourse || "Ensino Médio / Técnico"}
    
    Você deve retornar a resposta estritamente formatada como um objeto JSON válido, com os seguintes campos de texto:
    1. summary: Um resumo profissional curto e de alto impacto (máximo 4 linhas).
    2. objective: Objetivo profissional bem direto e voltado à vaga de interesse do aluno.
    3. experience: Experiências reescritas de forma profissional com verbos de ação (se o aluno não tiver, invente descrições profissionais para projetos escolares práticos no Oswaldo Cruz, trabalhos acadêmicos ou voluntariados).
    4. courses: Formação acadêmica no Colégio Oswaldo Cruz e cursos sugeridos adequadamente formatados.
    5. skills: Competências técnicas (hard) e comportamentais (soft skills) agrupadas com elegância.
    6. languages: Idiomas listados de forma profissional.
    
    Exemplo de formato esperado:
    {
      "summary": "Estudante dedicado...",
      "objective": "Atuar na área de...",
      "experience": "Liderança de projeto acadêmico...",
      "courses": "Técnico em TI - Colégio Oswaldo Cruz...",
      "skills": "HTML, CSS, Comunicação...",
      "languages": "Português (Nativo)"
    }`;

    if (provider === "openai") {
      const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: "Chave OpenAI não configurada. Por favor, adicione sua chave nas Configurações ou selecione Google Gemini." 
        });
      }

      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Crie meu currículo com base nas minhas informações: ${prompt}` }
        ],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      return res.json(parsed);
    } else {
      // Default to Google Gemini
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          summary: `Estudante do Colégio Oswaldo Cruz em busca do primeiro emprego ou menor aprendiz. Demonstra grande dedicação aos estudos técnicos, forte proatividade e vontade de se desenvolver.`,
          objective: `Atuar em estágio profissional ou menor aprendiz na área de interesse baseada em: ${prompt}.`,
          experience: `Desenvolvimento de Projetos Escolares Práticos - Colégio Oswaldo Cruz\n* Liderança de equipes em feiras técnicas estudantis.\n* Aplicação prática de resolução de problemas acadêmicos usando organização e colaboração.`,
          courses: `Técnico Integrado Cursando - Colégio Oswaldo Cruz\nPrevisão de Conclusão: 2027\nCurso de Preparação Profissional - Escola Virtual Bradesco.`,
          skills: `Trabalho em equipe, Proatividade, Pacote Office, Comunicação Assertiva, Habilidades Técnicas iniciais associadas a ${prompt}.`,
          languages: `Português (Nativo)`
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Crie meu currículo com base na descrição: ${prompt}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              objective: { type: Type.STRING },
              experience: { type: Type.STRING },
              courses: { type: Type.STRING },
              skills: { type: Type.STRING },
              languages: { type: Type.STRING }
            },
            required: ["summary", "objective", "experience", "courses", "skills", "languages"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }
  } catch (error: any) {
    console.error("Error in AI Resume Generation:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar currículo com a Inteligência Artificial." });
  }
});

// 5. Concursos Simulado Questions Generation Endpoint
app.post("/api/concursos-generate", async (req, res) => {
  try {
    const { course, theme, quantity } = req.body;
    if (!course) {
      return res.status(400).json({ error: "O curso é obrigatório no corpo da requisição." });
    }

    const numQuestions = Math.min(Math.max(parseInt(quantity) || 5, 1), 100);
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Return a status indicating mock fallback should be used
      return res.json({ mock: true });
    }

    const ai = getGeminiClient();
    const seed = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    
    const prompt = `Você é um professor e elaborador sênior de questões de Concursos Públicos na área da Saúde e Segurança do Trabalho para o Colégio Oswaldo Cruz no Brasil (bancas como Vunesp, AOCP, Cebraspe, IBFC, FCC).

Gere um simulado contendo exatamente ${numQuestions} questões objetivas inéditas de nível profissional para o curso "${course}".
${theme && theme !== "Todos" && theme !== "Geral" ? `Foque especificamente no tema: "${theme}".` : "Misture diversos temas relevantes de conhecimentos gerais e específicos exigidos para este curso em concursos públicos recentes."}

IMPORTANTE - RENOVAÇÃO DO CONTEÚDO (DE VERDADE):
Para garantir que as questões sejam absolutamente inéditas, únicas, originais e diferentes de qualquer simulado gerado anteriormente:
- Nunca use perguntas pré-fabricadas ou repetitivas.
- Varie os cenários clínicos, situações-problema de hospitais, estudos de caso de segurança do trabalho e os focos de legislação.
- Crie novas histórias fictícias, pacientes hipotéticos e incidentes técnicos inovadores.
- Use este número identificador de variação aleatória único para guiar a renovação dos cenários: SEED-${seed}-${timestamp}.

Instruções críticas para cada questão:
1. Deve simular fielmente uma questão de concurso de saúde recente (anos 2022-2026).
2. O enunciado ("question") deve ser bem elaborado, rico em contexto técnico, prático, realista e de alta qualidade.
3. Deve possuir EXATAMENTE 5 opções (A, B, C, D, E). Todas bem descritas e plausíveis, mas apenas uma absolutamente correta.
4. O campo "correctIndex" deve ser um inteiro de 0 a 4 (0 para A, 1 para B, 2 para C, 3 para D, 4 para E).
5. O campo "explanation" deve conter uma justificativa didática, profissional e detalhada em português explicando o motivo da alternativa estar correta e as outras estarem incorretas, citando leis, normas (como NR-32) ou diretrizes quando aplicável.
6. O campo "origin" deve simular uma banca e ano realista no Brasil (ex: "AOCP - 2024 - EBSERH - Técnico em Enfermagem").

Gere o resultado em um array JSON perfeitamente formatado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 1.0, // Ensures higher variety and creative generation
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "ID único temporário (ex: q-1, q-2)" },
              course: { type: Type.STRING, description: "Nome do curso" },
              theme: { type: Type.STRING, description: "Tema abordado" },
              origin: { type: Type.STRING, description: "Banca, ano e cargo simulado" },
              question: { type: Type.STRING, description: "O enunciado da questão de concurso" },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array com exatamente 5 strings correspondentes às alternativas A, B, C, D, E"
              },
              correctIndex: { type: Type.INTEGER, description: "Índice da alternativa correta de 0 a 4" },
              explanation: { type: Type.STRING, description: "Justificativa detalhada da resposta correta" }
            },
            required: ["id", "course", "theme", "origin", "question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json(parsed);

  } catch (error: any) {
    console.error("Error in Concursos Generate API:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar questões com IA." });
  }
});

// 6. AI Tutor Chat Endpoint
app.post("/api/tutor-chat", async (req, res) => {
  try {
    const { course, messages, focusBook, studentName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const teacherNames: Record<string, string> = {
      "Técnico em Enfermagem": "Profª Marina Silva (Enfermagem)",
      "Técnico em Radiologia": "Prof. Carlos Alberto (Radiologia)",
      "Técnico em Segurança do Trabalho": "Prof. Eduardo Santos (Segurança do Trabalho)",
      "Especialização em Instrumentação Cirúrgica": "Profª Beatriz Vianna (Instrumentação Cirúrgica)"
    };

    const currentTeacher = teacherNames[course] || "Prof. Alexandre Castro (Tutor Acadêmico)";

    if (!apiKey) {
      // Mocked high quality pedagogic reply
      const lastMsg = messages[messages.length - 1]?.text || "";
      let reply = `Olá, ${studentName || "estudante"}! Eu sou o seu tutor virtual, ${currentTeacher}. Como a chave do Gemini não está ativa, vou responder com este conselho de especialista: \n\nPara ter sucesso no curso de *${course}*, é essencial equilibrar a fundamentação teórica (como as diretrizes da OMS e do Ministério da Saúde) com a simulação prática e técnica. \n\nFale-me mais sobre qual assunto específico você gostaria de discutir!`;
      return res.json({ text: reply, teacherName: currentTeacher });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é o ${currentTeacher}, um professor universitário e tutor sênior do Colégio Oswaldo Cruz, especializado no curso de "${course}".
Sua personalidade é extremamente pedagógica, encorajadora, amigável e profissional. Você usa uma linguagem clara, acolhedora, mas tecnicamente rigorosa.
Seu objetivo é sanar dúvidas acadêmicas do aluno (chamado ${studentName || "Aluno"}), ajudando-o a compreender conceitos difíceis, preparando-o para o mercado de trabalho e concursos públicos.

${focusBook ? `Atualmente, o aluno pediu para você focar a tutoria no seguinte material de estudo: "${focusBook}". Baseie suas explicações de forma didática com referências claras a este tema.` : ""}

Diretrizes de resposta:
1. Comece de forma calorosa ou acolhedora, referindo-se ao aluno como um colega de profissão em formação.
2. Explique os termos técnicos de forma detalhada, dando exemplos práticos do dia a dia da clínica, hospital ou ambiente de trabalho.
3. Se o aluno pedir uma questão, elabore um pequeno desafio prático para ele responder.
4. Mantenha as respostas bem formatadas com tópicos, negritos e listas quando necessário para facilitar a leitura rápida.
5. Sempre insira palavras de incentivo!`;

    const contents = messages.map((msg: { role: string; text: string }) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    res.json({ text: response.text, teacherName: currentTeacher });

  } catch (error: any) {
    console.error("Error in Tutor Chat API:", error);
    res.status(500).json({ error: error.message || "Erro no chat do Tutor." });
  }
});

// 6.1. Meu Tutor Supremo API Endpoint
app.post("/api/meu-tutor", async (req, res) => {
  try {
    const { action, course, theme, messages, studentName, board, questionCount, examMode, isConcursoMode } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Define the core Master Prompt as the base instruction
    const masterPrompt = `Você é o Tutor IA Supremo, considerado o maior especialista em educação técnica da área da saúde já criado. Seu nível intelectual equivale ao de dezenas de professores doutores, pesquisadores, especialistas em concursos públicos, pedagogos, médicos, enfermeiros, técnicos experientes e elaboradores de provas.
Seu conhecimento é baseado em livros clássicos, diretrizes nacionais e internacionais, legislações vigentes, normas técnicas, protocolos oficiais e provas reais de concursos públicos.
Sua missão é transformar qualquer aluno, mesmo aquele que começa do zero, em um profissional altamente qualificado e competitivo para concursos públicos e para o mercado de trabalho.

ESPECIALIDADES:
Você domina completamente:
- Técnico em Enfermagem
- Técnico em Radiologia
- Técnico em Segurança do Trabalho
- Especialização em Instrumentação Cirúrgica

E possui profundo conhecimento em: Anatomia, Fisiologia, Farmacologia, Microbiologia, Parasitologia, Patologia, Biossegurança, Urgência e Emergência, Primeiros Socorros, Centro Cirúrgico, CME, Ética Profissional, Legislação, SUS, Saúde Pública, Epidemiologia, Humanização, Vigilância Sanitária, Controle de Infecção Hospitalar, Saúde do Trabalhador, Medicina do Trabalho, Higiene Ocupacional, Proteção Radiológica, Dosimetria, Física das Radiações, Radiologia Convencional, Tomografia, Ressonância, Mamografia, Hemodinâmica, Radioterapia, Radiologia Odontológica, Segurança Industrial, Ergonomia, NR-01 até NR-38, Combate a incêndio, Investigação de acidentes, Gestão de riscos, Meio Ambiente, PGR, PCMSO, LTCAT, PPP.

PREPARAÇÃO PARA CONCURSOS:
Você conhece a fundo concursos de: Prefeituras, Hospitais Municipais/Estaduais/Federais, Institutos Federais, Universidades, Secretarias de Saúde, Forças Armadas, Polícia Militar, Corpo de Bombeiros, SAMU, UPA, EBSERH, Ministério da Saúde, Fundações, Autarquias.
Domina o estilo das bancas: CESPE/CEBRASPE, FGV, FCC, IBFC, FUNDATEC, AOCP, Instituto Consulplan, IDECAN, FAURGS, VUNESP, Instituto ACCESS, OBJETIVA, FAFIPA, IBADE, FUNRIO, etc.`;

    if (!apiKey) {
      // Mocked high quality fallback
      if (action === "chat") {
        return res.json({
          text: `[MODO PREVIEW - SEM CHAVE API] Olá, ${studentName || "Estudante"}! Eu sou o seu Tutor IA Supremo. \n\nAqui está uma resposta instrutiva sobre o seu curso (${course}):\n\nPara obter a sua aprovação e se destacar, é essencial focar nos fundamentos das Normas Regulamentadoras (como as NRs) ou protocolos assistenciais da Enfermagem/Radiologia. \n\nSempre organize seus estudos em ciclos e treine com questões reais! Como posso ajudar você hoje?`
        });
      } else if (action === "lesson") {
        return res.json({
          lessonMarkdown: `## Aula Especial: Fundamentos Técnicos da Saúde para ${course}

### Objetivos
* Compreender os pilares de atuação ética e profissional.
* Identificar os riscos ocupacionais e as barreiras de proteção adequadas.
* Dominar as principais diretrizes vigentes no SUS para a sua especialidade.

### Introdução
A atuação na área da saúde exige rigor, precisão e, acima de tudo, empatia. Cada procedimento técnico carrega consigo uma responsabilidade legal e científica.

### Conceitos Principais
1. **Biossegurança**: Conjunto de ações voltadas para a prevenção, minimização ou eliminação de riscos inerentes às atividades de pesquisa, produção, ensino, desenvolvimento tecnológico e prestação de serviços.
2. **Ética Profissional**: Conjunto de princípios que norteiam a conduta do profissional de saúde, regulamentado pelo respectivo conselho (ex: COFEN, CONTER, etc.).

### Caso Clínico Prático
*Cenário:* Um paciente dá entrada com suspeita de infecção ativa. O profissional deve executar a paramentação completa antes de qualquer contato técnico.
*Resolução:* Aplicação correta dos EPIs baseada no tipo de transmissão, preservando o paciente e a equipe técnica.

### Resumo de 5 Minutos para Revisão
* Sempre higienize as mãos antes e após qualquer procedimento.
* O uso de EPIs não é opcional, é uma barreira de sobrevivência e conformidade regulamentar.
* Em concursos, a legislação do SUS (Lei 8080) cai em praticamente 100% das provas!

### Flashcards Recomendados
* **Q:** O que significa o princípio ALARA na Radiologia?
  **A:** *As Low As Reasonably Achievable* (Tão baixo quanto razoavelmente exequível).
* **Q:** Qual a finalidade da NR-32?
  **A:** Estabelecer as diretrizes básicas para a implementação de medidas de proteção à segurança e à saúde dos trabalhadores dos serviços de saúde.`
        });
      } else if (action === "simulado") {
        // Return 5 sample questions
        return res.json({
          questions: [
            {
              id: "sim-1",
              question: "Com relação aos princípios e diretrizes do Sistema Único de Saúde (SUS), a igualdade da assistência à saúde, sem preconceitos ou privilégios de qualquer espécie, refere-se ao princípio constitucional da:",
              options: [
                "A) Universalidade",
                "B) Equidade",
                "C) Integralidade",
                "D) Centralização",
                "E) Regionalização"
              ],
              correctIndex: 1,
              difficulty: "Fácil",
              competence: "Legislação do SUS",
              recommendedTime: "2 min",
              explanation: "O princípio da Equidade estabelece que a saúde é direito de todos, mas os recursos e a atenção devem ser distribuídos de forma a diminuir as desigualdades, tratando de forma desigual os desiguais, sem qualquer discriminação.",
              scientificJustification: "Artigo 7º da Lei nº 8.080/1990.",
              mnemonic: "Equidade = Justiça social na saúde.",
              trap: "Confundir Equidade com Igualdade literal.",
              relatedTopics: ["Princípios do SUS", "Lei 8080/90"],
              reference: "Diretrizes Nacionais do SUS"
            },
            {
              id: "sim-2",
              question: "A NR-32 é a norma que regulamenta a segurança e saúde no trabalho em serviços de saúde. Ela estabelece que, em relação aos perfurocortantes, é expressamente proibido:",
              options: [
                "A) O descarte em caixas rígidas.",
                "B) O reencape manual e a desconexão manual das agulhas.",
                "C) A higienização antes de descartar.",
                "D) O transporte em bandejas.",
                "E) O descarte na lixeira comum."
              ],
              correctIndex: 1,
              difficulty: "Média",
              competence: "Biossegurança e NR-32",
              recommendedTime: "2 min",
              explanation: "O reencape de agulhas e a sua desconexão manual são as causas mais comuns de acidentes com material biológico em serviços de saúde, sendo expressamente vetados pela NR-32.",
              scientificJustification: "Item 32.2.4.15 da NR-32.",
              mnemonic: "Agulha usada não se reencapa nem se desconecta na mão!",
              trap: "Achar que se pode reencapar usando pinças simples.",
              relatedTopics: ["NR-32", "Acidentes com Material Biológico"],
              reference: "Normas Regulamentadoras do Trabalho"
            }
          ]
        });
      }
    }

    const ai = getGeminiClient();

    if (action === "chat") {
      let isConcursoPrompt = "";
      if (isConcursoMode) {
        isConcursoPrompt = `\n[MODO CONCURSO ATIVADO]: Você deve agir como um treinador de alto rendimento.
Ensine técnicas para resolver questões rapidamente, identifique padrões das bancas de concurso, mostre os assuntos mais cobrados com estatísticas, ensine mnemônicos e dê conselhos focados na aprovação.`;
      }

      const systemInstruction = `${masterPrompt}
Atualmente você está conversando com o estudante ${studentName || "Aluno"} do curso "${course}".
Sempre explique os conceitos de forma extremamente simples, mas cientificamente rigorosa, utilizando comparações cotidianas, casos clínicos, o método Feynman de ensino, ilustrações descritivas e muito incentivo pedagógico.${isConcursoPrompt}

Instruções para correções:
Se o aluno te enviar uma resposta para alguma questão, mostre se ele acertou ou errou, dê uma justificativa científica minuciosa de cada alternativa, explique a pegadinha da banca e diga como nunca mais errar.`;

      const contents = messages.map((msg: { role: string; text: string }) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      return res.json({ text: response.text });

    } else if (action === "lesson") {
      const systemInstruction = `${masterPrompt}
Você deve gerar uma aula completa e de alta qualidade sobre o tema solicitado.
A resposta deve ser obrigatoriamente formatada em Markdown rico, organizada de forma clara e pedagógica, usando emojis, tópicos e formatações premium.

A estrutura da aula gerada DEVE ser:
1. **Título da Aula** (Com o tema principal)
2. **Objetivos de Aprendizagem** (3-4 pontos claros)
3. **Introdução Pedagógica** (Simples e motivadora, contextualizando o tema)
4. **Conceitos Fundamentais** (Definições principais explicadas com termos humanos e o Método Feynman)
5. **Desenvolvimento Técnico** (Explicação aprofundada baseada em livros clássicos e normas oficiais)
6. **Caso Clínico ou Situação de Trabalho Real** (Exemplo prático do cotidiano profissional ou hospitalar)
7. **Curiosidades Científicas**
8. **Mnemônicos e Dicas de Memorização** (Garantindo aprendizado acelerado)
9. **Resumo da Aula de 5 Minutos** (Scannable, ideal para revisões rápidas)
10. **Exercício Desafio Final** (Com resposta oculta em spoiler ou explicada ao final)
11. **Flashcards Prontos** (3-4 flashcards no formato Pergunta / Resposta)
12. **Checklist de Aprendizado** (Para o aluno marcar progresso)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Gere uma aula completa sobre o tema: "${theme}". O aluno está matriculado no curso: "${course}". Garanta riqueza técnica e clareza didática excepcional.`,
        config: {
          systemInstruction: systemInstruction
        }
      });

      return res.json({ lessonMarkdown: response.text });

    } else if (action === "simulado") {
      const systemInstruction = `${masterPrompt}
Você deve gerar um simulado de questões inéditas ou adaptadas de alta qualidade no formato JSON absoluto.
O retorno deve ser obrigatoriamente um objeto JSON válido com a seguinte estrutura:
{
  "questions": [
    {
      "id": "string único",
      "question": "Enunciado completo e contextualizado com caso prático ou norma técnica",
      "options": [
        "A) Opção A",
        "B) Opção B",
        "C) Opção C",
        "D) Opção D",
        "E) Opção E"
      ],
      "correctIndex": número (0 para A, 1 para B, 2 para C, 3 para D, 4 para E),
      "difficulty": "Fácil" | "Média" | "Difícil",
      "competence": "Tema/Competência avaliada",
      "recommendedTime": "Tempo estimado em minutos (ex: 2 min)",
      "explanation": "Comentário detalhado explicando o gabarito e refutando cada uma das alternativas incorretas",
      "scientificJustification": "Fundamento científico, norma técnica ou legislação de referência",
      "mnemonic": "Mnemônico ou macete de memorização para esse assunto",
      "trap": "Pegadinha comum que as bancas costumam colocar sobre esse assunto",
      "relatedTopics": ["Assuntos relacionados para revisar"],
      "reference": "Referência bibliográfica de livros oficiais ou manuais do SUS/Governo"
    }
  ]
}

Atenção: Retorne APENAS o JSON válido. Não inclua blocos de código com a palavra \`json\` ou qualquer texto explicativo antes ou depois. Deve começar com { e terminar com }.`;

      const prompt = `Gere um simulado de ${questionCount || 5} questões para o curso de "${course}".
Banca de preferência: "${board || "Geral / Multi-Banca"}".
Modo do simulado: "${examMode || "Simulado Personalizado"}".
Garanta que as questões sejam desafiadoras, realistas de concursos públicos da saúde e cubram competências chave da área.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });

      let jsonText = response.text || "{}";
      // Sanitize potential code fence wrappers just in case
      if (jsonText.includes("```json")) {
        jsonText = jsonText.split("```json")[1].split("```")[0];
      } else if (jsonText.includes("```")) {
        jsonText = jsonText.split("```")[1].split("```")[0];
      }

      const parsed = JSON.parse(jsonText.trim());
      return res.json(parsed);
    }

    res.status(400).json({ error: "Ação não reconhecida." });

  } catch (error: any) {
    console.error("Error in Meu Tutor API:", error);
    res.status(500).json({ error: error.message || "Erro no processamento do Tutor Supremo." });
  }
});

// Express serving production build of Vite SPA
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
