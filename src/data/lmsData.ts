export interface LmsCourse {
  id: string;
  title: string;
  category: "Enfermagem" | "Radiologia" | "Instrumentação Cirúrgica" | "Desenvolvimento Profissional" | "Segurança do Paciente" | "Humanização";
  duration: number; // hours
  xpReward: number;
  progress: number; // percentage
  status: "not_started" | "in_progress" | "completed";
  image: string;
  instructor: string;
  shortDesc: string;
  modules: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Colaborador {
  id: string;
  name: string;
  department: string;
  hospital: string;
  score: number;
  level: number;
  xp: number;
  completedCourses: number;
  hours: number;
  badges: { id: string; title: string; icon: string; description: string; date: string }[];
}

export const MOCK_COLABORADORES: Colaborador[] = [
  {
    id: "col-1",
    name: "Ana Souza",
    department: "Pediatria",
    hospital: "Hospital Lynx EDU - Matriz",
    score: 1450,
    level: 5,
    xp: 4500,
    completedCourses: 8,
    hours: 32,
    badges: [
      { id: "b1", title: "Primeiros Passos", icon: "Star", description: "Completou o onboarding inicial do hospital", date: "10/01/2026" },
      { id: "b2", title: "Herói da Biossegurança", icon: "Shield", description: "Gabaritou o curso de NR-32", date: "22/02/2026" }
    ]
  },
  {
    id: "col-2",
    name: "Carlos Eduardo",
    department: "Imaginologia / Radiologia",
    hospital: "Hospital Lynx EDU - Matriz",
    score: 1320,
    level: 4,
    xp: 3800,
    completedCourses: 6,
    hours: 24,
    badges: [
      { id: "b1", title: "Primeiros Passos", icon: "Star", description: "Completou o onboarding inicial do hospital", date: "12/01/2026" }
    ]
  },
  {
    id: "col-3",
    name: "Juliana Santos",
    department: "Centro Cirúrgico",
    hospital: "Hospital Lynx EDU - Zona Sul",
    score: 1780,
    level: 6,
    xp: 5900,
    completedCourses: 12,
    hours: 48,
    badges: [
      { id: "b1", title: "Primeiros Passos", icon: "Star", description: "Completou o onboarding", date: "05/01/2026" },
      { id: "b2", title: "Herói da Biossegurança", icon: "Shield", description: "Gabaritou o curso de NR-32", date: "15/01/2026" },
      { id: "b3", title: "Mestre da Assepsia", icon: "Award", description: "Alcançou 100% de aproveitamento em Instrumentação", date: "02/03/2026" }
    ]
  },
  {
    id: "col-4",
    name: "Você (Estudante)",
    department: "Treinamento / Educação Continuada",
    hospital: "Hospital Lynx EDU - Matriz",
    score: 850,
    level: 3,
    xp: 2200,
    completedCourses: 3,
    hours: 12,
    badges: [
      { id: "b1", title: "Primeiros Passos", icon: "Star", description: "Completou o onboarding inicial do hospital", date: "12/05/2026" }
    ]
  }
];

export const LMS_COURSES: LmsCourse[] = [
  {
    id: "lms-c1",
    title: "Segurança do Paciente e Metas Internacionais (OMS)",
    category: "Segurança do Paciente",
    duration: 6,
    xpReward: 350,
    progress: 100,
    status: "completed",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
    instructor: "Dra. Helena Martins (Qualidade)",
    shortDesc: "Domine as 6 metas internacionais de segurança estabelecidas pela OMS e garanta conformidade na acreditação ONA/ISO.",
    modules: ["Meta 1: Identificação Correta do Paciente", "Meta 2: Comunicação Efetiva", "Meta 3: Segurança nos Medicamentos de Alta Vigilância", "Meta 4: Cirurgia Segura", "Meta 5: Prevenção de Infecções (Higiene das Mãos)", "Meta 6: Prevenção de Quedas e Lesão por Pressão"]
  },
  {
    id: "lms-c2",
    title: "NR-32: Segurança e Saúde em Serviços de Saúde",
    category: "Enfermagem",
    duration: 8,
    xpReward: 400,
    progress: 70,
    status: "in_progress",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400",
    instructor: "Engº Roberto Costa (Segurança do Trabalho)",
    shortDesc: "Legislação obrigatória, riscos biológicos, químicos e radiológicos, uso adequado de EPIs e prevenção de acidentes com perfurocortantes.",
    modules: ["Introdução à NR-32", "Riscos Biológicos e Vacinação Obrigatória", "Manuseio de Perfurocortantes e Proibições Gerais", "Riscos Químicos e Quimioterápicos", "Plano de Proteção Radiológica Hospitalar", "Resíduos de Serviços de Saúde (PGRSS)"]
  },
  {
    id: "lms-c3",
    title: "Proteção Radiológica e Dosimetria Hospitalar",
    category: "Radiologia",
    duration: 10,
    xpReward: 500,
    progress: 0,
    status: "not_started",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400",
    instructor: "Físico Dr. André Albuquerque",
    shortDesc: "Princípios físicos da radiação, limites de dose, uso de dosímetros, equipamentos de proteção individual plumbíferos e blindagem de salas.",
    modules: ["Física das Radiações Ionizantes", "Efeitos Biológicos da Radiação", "Princípio ALARA e Otimização", "Monitoração Individual (Dosímetro)", "Blindagens e Controle de Áreas", "Legislação e Portaria 453 (RDC 330)"]
  },
  {
    id: "lms-c4",
    title: "Assepsia e Tempos Cirúrgicos no Bloco Operatório",
    category: "Instrumentação Cirúrgica",
    duration: 12,
    xpReward: 600,
    progress: 100,
    status: "completed",
    image: "https://images.unsplash.com/photo-1551225317-83b63e443154?auto=format&fit=crop&q=80&w=400",
    instructor: "Profª Beatriz Vianna (Instrumentadora)",
    shortDesc: "Domine a paramentação, escovação das mãos, montagem de mesa de instrumental por especialidade e tempos fundamentais (diérese, hemostasia, síntese).",
    modules: ["Paramentação Estéril e Escovação Hospitalar", "Classificação e Organização de Instrumentais", "Os Quatro Tempos Cirúrgicos", "Assepsia e Antissepsia do Campo Operatório", "Controle de Compressas e Agulhas", "Descontaminação pós-cirúrgica e CME"]
  },
  {
    id: "lms-c5",
    title: "Atendimento Humanizado no Ambiente Hospitalar",
    category: "Humanização",
    duration: 4,
    xpReward: 250,
    progress: 100,
    status: "completed",
    image: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=400",
    instructor: "Psicóloga Laura Mendes",
    shortDesc: "Princípios do SUS de acolhimento e escuta qualificada. Posturas éticas para atendimento em momentos críticos e comunicação de notícias difíceis.",
    modules: ["Princípios da Humanização (PNH)", "Acolhimento com Classificação de Risco", "Relação Profissional-Paciente-Família", "Comunicação de Notícias Difíceis", "Empatia e Escuta Ativa na Prática", "Resolução de Conflitos na Recepção"]
  },
  {
    id: "lms-c6",
    title: "Academia da Carreira: Postura, Promoções e Liderança",
    category: "Desenvolvimento Profissional",
    duration: 15,
    xpReward: 1000,
    progress: 15,
    status: "in_progress",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400",
    instructor: "Drª Patrícia Linhares (Diretora de RH)",
    shortDesc: "Aprenda como se destacar, conquistar promoções internas, apresentar projetos de melhoria, criar seu PDI e preparar-se para posições de chefia.",
    modules: ["Plano de Carreira e Desenvolvimento Individual (PDI)", "Como Construir Autoridade e Ser Referência na Equipe", "Networking e Atuação em Comissões Hospitalares", "Preparação para Cargos de Liderança Técnica", "Apresentação Eficiente de Projetos de Melhoria", "A postura ideal durante auditorias (ONA/JCI)"]
  }
];

export const LMS_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  "lms-c1": [
    {
      id: "q1",
      question: "Qual das alternativas representa a Meta 1 das Metas Internacionais de Segurança do Paciente estabelecidas pela OMS?",
      options: ["A) Melhorar a segurança dos medicamentos de alta vigilância", "B) Identificar corretamente o paciente", "C) Garantir cirurgias com local correto", "D) Reduzir o risco de infecções associadas aos cuidados de saúde", "E) Reduzir o risco de lesões decorrentes de quedas"],
      correctIndex: 1,
      explanation: "A primeira meta internacional da OMS exige a identificação correta do paciente por meio de pelo menos dois identificadores (ex: nome completo e data de nascimento), nunca utilizando o número do leito."
    },
    {
      id: "q2",
      question: "Para uma comunicação efetiva (Meta 2), qual técnica consiste no receptor repetir a instrução de volta de forma verbal para confirmação?",
      options: ["A) Feedback passivo", "B) Protocolo SBAR", "C) Read-back (Leitura repetida / dupla checagem verbal)", "D) Brainstorming técnico", "E) Prontuário eletrônico"],
      correctIndex: 2,
      explanation: "O processo de 'Read-back' (leitura de retorno) exige que o receptor de uma ordem verbal de urgência anote a prescrição, leia em voz alta para confirmação e o emissor valide se está correto antes de qualquer administração."
    },
    {
      id: "q3",
      question: "Com relação aos eletrólitos concentrados de alta vigilância (Meta 3), qual das seguintes condutas é recomendada?",
      options: ["A) Armazená-los soltos nas enfermarias e expostos a todos.", "B) Utilizar rotulação colorida de alto contraste e guardá-los sob acesso restrito.", "C) Diluir todos de forma prévia em garrafas de plástico comuns.", "D) Administrar sem dupla checagem em casos não-emergenciais.", "E) Descartá-los diretamente no lixo comum infectante vermelho."],
      correctIndex: 1,
      explanation: "Medicamentos de alta vigilância, como eletrólitos concentrados (Kcl 19,2%, por exemplo), devem possuir identificação visual diferenciada e ser mantidos sob restrição para evitar administração equivocada por engano."
    },
    {
      id: "q4",
      question: "O checklist de 'Cirurgia Segura' (Meta 4) preconizado pela OMS divide-se em três etapas temporais. Quais são?",
      options: ["A) Triagem, Internação e Alta hospitalar", "B) Antes da indução anestésica (Sign-in), antes da incisão cirúrgica (Time-out) e antes do paciente sair da sala (Sign-out)", "C) Consulta de rotina, Exame de Imagem e Procedimento", "D) Assepsia de mãos, Paramentação de equipe e Esterilização de materiais", "E) Escovação, Hemostasia e Sutura pós-operatória"],
      correctIndex: 1,
      explanation: "O checklist oficial da OMS de Cirurgia Segura compreende as etapas críticas: Sign-in (antes de anestesiar), Time-out (imediamente antes de incisar) e Sign-out (antes de remover o paciente da sala de cirurgia)."
    },
    {
      id: "q5",
      question: "De acordo com as diretrizes de Higiene das Mãos da OMS (Meta 5), quantos são os 'momentos fundamentais' para a higienização?",
      options: ["A) 2 momentos", "B) 3 momentos", "C) 5 momentos", "D) 7 momentos", "E) 10 momentos"],
      correctIndex: 2,
      explanation: "A OMS preconiza os 5 momentos de higiene das mãos: 1) Antes do contato com o paciente; 2) Antes da realização de procedimento limpo/asséptico; 3) Após risco de exposição a fluidos corporais; 4) Após contato com o paciente; 5) Após contato com áreas próximas ao paciente."
    },
    {
      id: "q6",
      question: "Para mitigar o risco de lesões por pressão (Meta 6) em pacientes acamados, qual a periodicidade recomendada para mudança de decúbito?",
      options: ["A) A cada 30 minutos", "B) A cada 2 horas", "C) Uma vez por plantão (12 horas)", "D) Somente quando o paciente solicitar", "E) Apenas uma vez por dia"],
      correctIndex: 1,
      explanation: "O reposicionamento ou mudança de decúbito a cada 2 horas é o padrão-ouro de enfermagem para aliviar a compressão tecidual contínua em proeminências ósseas e evitar a isquemia local."
    },
    {
      id: "q7",
      question: "Qual das seguintes escalas é a mais utilizada no Brasil para avaliar o risco de quedas (Meta 6) em pacientes hospitalizados?",
      options: ["A) Escala de Braden", "B) Escala de Glasgow", "C) Escala de Morse", "D) Escala de Apgar", "E) Escala de Beck"],
      correctIndex: 2,
      explanation: "A Escala de Quedas de Morse avalia múltiplos fatores (histórico de quedas, diagnóstico secundário, auxílio na marcha, terapia intravenosa, marcha e estado mental) para classificar o nível de risco do paciente."
    },
    {
      id: "q8",
      question: "A Escala de Braden serve primordialmente para avaliar o risco de:",
      options: ["A) Queda de maca", "B) Erro de identificação de amostra", "C) Lesão por Pressão (LPP)", "D) Parada Cardiorrespiratória", "E) Choque Anafilático"],
      correctIndex: 2,
      explanation: "A Escala de Braden é uma ferramenta amplamente validada que quantifica o risco de desenvolvimento de Lesões por Pressão com base em percepção sensorial, umidade, atividade, mobilidade, nutrição e fricção/força de cisalhamento."
    },
    {
      id: "q9",
      question: "Em qual fase do checklist de cirurgia segura ocorre a contagem formal de compressas, agulhas e verificação das amostras de biópsia?",
      options: ["A) Sign-in", "B) Time-out", "C) Sign-out", "D) No pós-operatório imediato na UTI", "E) Na internação na ala cirúrgica"],
      correctIndex: 2,
      explanation: "A contagem de compressas e agulhas e a identificação/rotulação de amostras são realizadas na fase de Sign-out, antes de o cirurgião fechar a cavidade e de o paciente deixar a sala cirúrgica."
    },
    {
      id: "q10",
      question: "Quem é responsável pelo reporte de incidentes ou 'quase erros' (near misses) de segurança do paciente no hospital?",
      options: ["A) Apenas a chefia de enfermagem", "B) Apenas o médico responsável pelo plantão", "C) Qualquer colaborador da equipe multidisciplinar que presenciar o fato", "D) O próprio paciente e seus familiares", "E) Somente o auditor externo da ONA"],
      correctIndex: 2,
      explanation: "Todos os membros da equipe multidisciplinar de saúde (técnicos, enfermeiros, médicos, farmacêuticos, etc.) têm o dever profissional de notificar incidentes ao Núcleo de Segurança do Paciente para fins de melhoria contínua."
    }
  ],
  "lms-c2": [
    {
      id: "q1",
      question: "Qual Norma Regulamentadora do Ministério do Trabalho é responsável por dispor sobre a segurança e saúde no trabalho em serviços de saúde?",
      options: ["A) NR-10", "B) NR-15", "C) NR-32", "D) NR-35", "E) NR-38"],
      correctIndex: 2,
      explanation: "A NR-32 é o principal marco regulatório nacional com foco exclusivo na proteção dos trabalhadores dos estabelecimentos de assistência à saúde."
    },
    {
      id: "q2",
      question: "Com relação aos recipientes de descarte de perfurocortantes, o limite máximo de preenchimento seguro recomendado por norma é:",
      options: ["A) Até encher por completo", "B) 2/3 (dois terços) ou até a linha limitadora", "C) 1/2 (metade) do volume", "D) 90% da capacidade total", "E) Depende do tamanho das agulhas"],
      correctIndex: 1,
      explanation: "A NR-32 estabelece que os coletores devem ser preenchidos até 2/3 de sua capacidade total ou até atingirem a linha indicativa limitadora para evitar acidentes no manuseio do descarte."
    },
    {
      id: "q3",
      question: "Sobre o reencape e desconexão de agulhas após o uso em pacientes, a NR-32 estabelece que:",
      options: [
        "A) É permitido se feito com muito cuidado.",
        "B) É obrigatório para evitar acidentes na caixa.",
        "C) É expressamente proibido o reencape manual e a desconexão manual.",
        "D) Pode ser feito desde que o profissional use luvas estéreis.",
        "E) É permitido apenas na sala de emergência."
      ],
      correctIndex: 2,
      explanation: "É terminantemente vedado o reencape manual e a desconexão manual de agulhas usadas, por ser um dos maiores fatores geradores de acidentes com exposição de patógenos biológicos sanguíneos."
    },
    {
      id: "q4",
      question: "Quem deve arcar com os custos de vacinação obrigatória e fornecimento de Equipamentos de Proteção Individual (EPI) no ambiente hospitalar?",
      options: [
        "A) O próprio colaborador.",
        "B) O sindicato da categoria profissional.",
        "C) O SUS de forma assistencial.",
        "D) O empregador (hospital), de forma inteiramente gratuita.",
        "E) Dividido 50% entre hospital e funcionário."
      ],
      correctIndex: 3,
      explanation: "De acordo com as leis do trabalho brasileiras e as NRs, todos os EPIs adequados e vacinas contra patógenos aos quais o funcionário esteja exposto devem ser garantidos gratuitamente pelo empregador."
    },
    {
      id: "q5",
      question: "Durante o manuseio de materiais perfurocortantes, qual das seguintes condutas é considerada totalmente INSEGURA e proibida?",
      options: [
        "A) Descartar agulhas imediatamente no ponto de uso.",
        "B) Carregar agulhas expostas soltas em bolsos de jaleco ou calças.",
        "C) Utilizar caixas coletoras rígidas de papelão amarelo.",
        "D) Verificar se o coletor atingiu o nível limite antes de descartar.",
        "E) Utilizar luvas de procedimento ao puncionar veias."
      ],
      correctIndex: 1,
      explanation: "Levar agulhas soltas em bolsos é um perigo extremo que viola regras básicas de biossegurança de qualquer hospital de alto padrão."
    },
    {
      id: "q6",
      question: "Qual tipo de resíduo hospitalar deve ser descartado no saco vermelho (Grupo A)?",
      options: [
        "A) Resíduos comuns recicláveis.",
        "B) Resíduos químicos de revelação de imagem.",
        "C) Resíduos potencialmente infectantes (biológicos).",
        "D) Sobras de alimentos do refeitório.",
        "E) Seringas vazias não infectadas."
      ],
      correctIndex: 2,
      explanation: "O Grupo A abrange os resíduos com a possível presença de agentes biológicos que, por suas características de maior virulência ou concentração, podem apresentar risco de infecção (ex: gaze com sangue, culturas de patógenos)."
    },
    {
      id: "q7",
      question: "A NR-32 veda aos trabalhadores de serviços de saúde o uso de adornos nos postos de trabalho. O que é considerado adorno?",
      options: [
        "A) Apenas brincos grandes.",
        "B) Jaleco de manga longa.",
        "C) Anéis, alianças, pulseiras, relógios, colares e brincos de qualquer tamanho.",
        "D) Crachás de identificação do hospital.",
        "E) Óculos de grau médico."
      ],
      correctIndex: 2,
      explanation: "Segundo a NR-32, relógios, alianças, anéis, colares, brincos e pulseiras acumulam agentes biológicos dificultando a higienização adequada das mãos e punhos."
    },
    {
      id: "q8",
      question: "Em caso de acidente com material biológico (perfurocortante contaminado), a primeira conduta imediata do trabalhador deve ser:",
      options: [
        "A) Tomar antibióticos preventivos por conta própria.",
        "B) Lavar abundantemente o local com água e sabão (ou soro se em mucosas) e notificar a chefia/SESMT imediatamente.",
        "C) Ignorar o fato se a agulha parecia limpa.",
        "D) Espremer o ferimento até sangrar bastante.",
        "E) Jogar álcool iodado fervendo no corte."
      ],
      correctIndex: 1,
      explanation: "A lavagem com água e sabão ajuda a reduzir a carga viral e biológica local e a notificação é vital para iniciar os protocolos de profilaxia de urgência (PEP)."
    },
    {
      id: "q9",
      question: "Qual das seguintes vacinas NÃO faz parte das doses obrigatórias que o hospital deve fornecer e fiscalizar para atuação de técnicos na área da saúde?",
      options: [
        "A) Hepatite B",
        "B) Dupla Adulto (Difteria e Tétano)",
        "C) Tríplice Viral (Sarampo, Caxumba, Rubéola)",
        "D) Influenza (gripe)",
        "E) Febre Tifoide (salvo indicações epidemiológicas muito específicas)"
      ],
      correctIndex: 4,
      explanation: "Hepatite B, Tétano, Difteria e Influenza são clássicas vacinas obrigatórias da NR-32. Febre tifoide não consta na listagem padrão geral obrigatória para todos os funcionários do Brasil."
    },
    {
      id: "q10",
      question: "O PGR (Programa de Gerenciamento de Riscos) no ambiente hospitalar deve prever ações específicas de proteção contra:",
      options: [
        "A) Apenas riscos ergonômicos leves.",
        "B) Riscos físicos, químicos, biológicos, ergonômicos e de acidentes.",
        "C) Apenas reclamações de pacientes.",
        "D) Atrasos na entrega de medicamentos de marca.",
        "E) Riscos ambientais externos à cidade."
      ],
      correctIndex: 1,
      explanation: "O PGR hospitalar moderno de alta performance deve englobar todas as categorias de riscos ocupacionais que possam comprometer a integridade física e mental dos colaboradores do hospital."
    }
  ],
  "lms-c3": [
    {
      id: "q1",
      question: "Quais são os três pilares fundamentais da proteção radiológica estabelecidos pela legislação nacional?",
      options: ["A) Filtração, Colimação e Kilovoltagem", "B) Justificação, Otimização (Princípio ALARA) e Limitação de Dose", "C) Dosimetria, Blindagem e Equipamento plumbífero", "D) Velocidade, Distância e Contraste do filme", "E) Distância, Isolação e Reconstrução 3D"],
      correctIndex: 1,
      explanation: "A proteção radiológica apoia-se em três princípios básicos internacionais: Justificação (haver benefício real), Otimização (manter doses o mais baixo possível - ALARA) e Limitação de dose (não exceder os limites anuais legais para IOEs e público)."
    },
    {
      id: "q2",
      question: "Qual o limite de dose anual equivalente estabelecido para o cristalino de Indivíduos Ocupacionalmente Expostos (IOE) no Brasil?",
      options: ["A) 1 mSv / ano", "B) 15 mSv / ano", "C) 20 mSv / ano", "D) 150 mSv / ano", "E) 500 mSv / ano"],
      correctIndex: 2,
      explanation: "De acordo com as atualizações das normas da CNEN e RDC 330, o limite de dose equivalente anual para o cristalino de IOE passou a ser de 20 mSv (média ponderada em 5 anos, não excedendo 50 mSv em um único ano)."
    },
    {
      id: "q3",
      question: "Qual material metálico, devido ao seu elevado número atômico, é o principal elemento utilizado na confecção de barreiras físicas e vestimentas plumbíferas?",
      options: ["A) Alumínio", "B) Ferro fundido", "C) Chumbo", "D) Cobre", "E) Titânio"],
      correctIndex: 2,
      explanation: "O chumbo (Z=82) é extremamente eficaz na atenuação de raios X por conta da sua alta densidade eletrônica, sendo o elemento de escolha para os aventais protetores e biombos."
    },
    {
      id: "q4",
      question: "Ao utilizar o avental plumbífero protetor, onde o dosímetro individual de tórax deve ser posicionado pelo técnico?",
      options: ["A) Por baixo do avental de chumbo", "B) Preso no bolso da calça do uniforme", "C) Por cima do avental plumbífero, na região do tórax", "D) No punho do braço dominante", "E) Pendurado no teto da sala de exames"],
      correctIndex: 2,
      explanation: "Segundo a norma, o dosímetro de tórax do IOE deve ser fixado sobre o avental de chumbo (no tórax/gola) para registrar a dose que atinge as partes não protegidas (como tireoide e olhos) do profissional."
    },
    {
      id: "q5",
      question: "O termo ALARA significa que a exposição à radiação deve ser mantida tão baixa quanto racionalmente exequível. O que representa a letra 'R' em ALARA?",
      options: ["A) Radiação (Radiation)", "B) Razoável / Racionalmente (Reasonably)", "C) Regulamentar (Regular)", "D) Reduzido (Reduced)", "E) Rápido (Rapidly)"],
      correctIndex: 1,
      explanation: "ALARA significa 'As Low As Reasonably Achievable' (Tão baixo quanto razoavelmente exequível/alcançável), incorporando custos e benefícios sociais."
    },
    {
      id: "q6",
      question: "Qual tipo de radiação ionizante possui maior poder de penetração, requerendo estruturas espessas de concreto ou chumbo para blindagem?",
      options: ["A) Partículas Alfa", "B) Partículas Beta", "C) Radiação Sonora", "D) Raios Gama / Raios X de alta energia", "E) Raios Infravermelhos"],
      correctIndex: 3,
      explanation: "Os raios X e gama são ondas eletromagnéticas de alta frequência (fótons energéticos) que, sem carga ou massa, possuem altíssimo poder de penetração, necessitando de blindagem densa de concreto ou chumbo."
    },
    {
      id: "q7",
      question: "Qual das resoluções da ANVISA é o atual regulamento técnico geral sobre os requisitos sanitários para o funcionamento de serviços de radiologia diagnóstica no Brasil?",
      options: ["A) Portaria 453/98", "B) RDC 330/2019", "C) RDC 50/2002", "D) NR-15", "E) RDC 20/2014"],
      correctIndex: 1,
      explanation: "A RDC 330/2019 da ANVISA revogou normativas anteriores (como a icônica Portaria 453/98) e estabeleceu o novo marco regulatório para o diagnóstico por imagem no Brasil."
    },
    {
      id: "q8",
      question: "Os efeitos biológicos da radiação ionizante classificados como estocásticos são aqueles em que:",
      options: ["A) A severidade do dano aumenta proporcionalmente com a dose recebida.", "B) Existe um limiar de dose abaixo do qual o efeito não ocorre.", "C) A probabilidade de ocorrência do efeito é proporcional à dose, sem limiar de segurança (como o câncer).", "D) Ocorrem de forma imediata dentro de 24 horas da exposição.", "E) São reversíveis de imediato após a aplicação de soro."],
      correctIndex: 2,
      explanation: "Efeitos estocásticos não possuem limiar de dose de segurança; a probabilidade de ocorrer (mutações genéticas, carcinogênese) aumenta com a dose, mas a severidade do tumor é independente da quantidade de radiação."
    },
    {
      id: "q9",
      question: "Se uma técnica em radiologia (IOE) notifica gravidez ao hospital, qual procedimento deve ser imediatamente adotado?",
      options: ["A) Ela deve ser demitida por incapacidade técnica temporária.", "B) Ela deve ser remanejada de imediato para atividades administrativas ou setores sem exposição à radiação primária.", "C) Ela deve continuar operando exames usando avental duplo de chumbo.", "D) Ela deve dobrar sua carga horária para compensar as faltas futuras.", "E) Ela deve realizar dosimetria diária obrigatória na sala cirúrgica."],
      correctIndex: 1,
      explanation: "A legislação estabelece proteção especial à gestante IOE: ao notificar a gravidez, ela deve ser remanejada para tarefas onde a exposição seja desprezível, garantindo que a dose na superfície abdominal não exceda 1 mSv no restante da gestação."
    },
    {
      id: "q10",
      question: "Qual equipamento é utilizado pelo técnico ou físico em radiologia para quantificar os níveis de radiação de fuga e ambiental nas salas de exame?",
      options: ["A) Negatoscópio", "B) Dosímetro termoluminescente de pulso", "C) Câmara de ionização / Contador Geiger-Müller (Monitor de área)", "D) Fantoma acrílico de calibração", "E) Fita métrica de colimação"],
      correctIndex: 2,
      explanation: "Os monitores de área portáteis (como câmaras de ionização ou contadores Geiger-Müller) servem para medir taxas de exposição e fazer levantamento radiométrico ambiental das salas e arredores."
    }
  ],
  "lms-c4": [
    {
      id: "q1",
      question: "Quais são os quatro tempos cirúrgicos fundamentais que ocorrem em sequência cronológica padrão durante uma cirurgia?",
      options: ["A) Escovação, Antissepsia, Anestesia e Sutura", "B) Diérese, Hemostasia, Exérese (ou tempo especial) e Síntese", "C) Incisão, Aspiração, Isolamento e Fechamento", "D) Paramentação, Campo operatório, Cirurgia e CME", "E) Diérese, Dissecação, Drenagem e Alta"],
      correctIndex: 1,
      explanation: "Os quatro tempos fundamentais da técnica cirúrgica são: 1) Diérese (separação/corte dos tecidos); 2) Hemostasia (parada ou contenção do sangramento); 3) Exérese (retirada do órgão ou tecido); 4) Síntese (reunião/sutura dos tecidos)."
    },
    {
      id: "q2",
      question: "Qual a finalidade principal do processo de escovação/degermação das mãos e antebraços antes de entrar no campo estéril?",
      options: ["A) Eliminar 100% da microbiota residente de forma permanente.", "B) Limpar as unhas para melhor visualização sob o foco cirúrgico.", "C) Eliminar a microbiota transitória e reduzir a microbiota residente da pele com efeito residual duradouro.", "D) Amaciar a pele para calçar as luvas sem rasgá-las.", "E) Substituir a necessidade do uso de luvas cirúrgicas estéreis."],
      correctIndex: 2,
      explanation: "Não é possível esterilizar a pele (microbiota residente profunda nunca morre 100%), mas a escovação reduz drasticamente a carga bacteriana profunda e elimina bactérias transitórias superficiais colhidas em superfícies."
    },
    {
      id: "q3",
      question: "Qual antisséptico degermante é mais amplamente recomendado para escovação cirúrgica devido ao seu excelente efeito residual cumulativo de até 6 horas?",
      options: ["A) Álcool líquido 70%", "B) Clorexidina degermante (Gluconato de Clorexidina 4%)", "C) Éter sulfúrico", "D) Soro fisiológico morno", "E) Iodo metálico concentrado"],
      correctIndex: 1,
      explanation: "A clorexidina degermante a 4% liga-se fortemente aos tecidos epidérmicos, mantendo uma excelente e prolongada atividade bactericida residual por várias horas sob a luva cirúrgica."
    },
    {
      id: "q4",
      question: "Na montagem da mesa cirúrgica convencional do instrumentador, onde devem ser dispostos os materiais de diérese (como bisturis e tesouras de corte)?",
      options: ["A) No quadrante central da mesa", "B) No quadrante anterior esquerdo (entrada da mesa)", "C) No quadrante posterior direito", "D) Fora da mesa, em cima do paciente", "E) Guardados dentro das caixas metálicas de CME"],
      correctIndex: 1,
      explanation: "De acordo com a padronização ergonômica da mesa do instrumentador, o material de diérese (corte) inicia o fluxo cirúrgico e fica posicionado no quadrante anterior esquerdo (ou canto de fácil acesso inicial)."
    },
    {
      id: "q5",
      question: "Qual a diferença conceitual e prática entre Assepsia e Antissepsia no ambiente cirúrgico?",
      options: ["A) Assepsia refere-se a tecidos vivos e Antissepsia a superfícies inanimadas.", "B) Assepsia é um conjunto de medidas para impedir a entrada de patógenos em meio isento deles (foco em objetos/ambiente); Antissepsia é a desinfecção de tecidos vivos usando formulações químicas.", "C) Ambas são exatamente sinônimos em português.", "D) Antissepsia destrói vírus e assepsia destrói apenas esporos fúngicos.", "E) Assepsia exige o uso de autoclave e antissepsia exige calor seco."],
      correctIndex: 1,
      explanation: "Assepsia é o conjunto de métodos para evitar a contaminação de um meio (ex: esterilizar materiais, paramentação, higienizar a sala). Antissepsia é o uso de agentes químicos sobre a pele ou mucosas íntegras para reduzir micróbios."
    },
    {
      id: "q6",
      question: "De quem é a responsabilidade pela contagem física rigorosa de compressas, gases e agulhas cirúrgicas antes do fechamento da cavidade do paciente?",
      options: ["A) Exclusivamente do cirurgião principal.", "B) Do instrumentador cirúrgico em conjunto com o enfermeiro/técnico circulante da sala.", "C) Da recepcionista do bloco cirúrgico.", "D) Do anestesista de plantão técnico.", "E) Do próprio paciente após acordar da anestesia."],
      correctIndex: 1,
      explanation: "A contagem de compressas e agulhas é um processo de dupla checagem vital para a segurança. O instrumentador (que controla a mesa) e o circulante (que recolhe materiais desprezados) são responsáveis diretos pela conferência física matemática antes do fechamento."
    },
    {
      id: "q7",
      question: "Qual método de esterilização física é o mais econômico, rápido, seguro e o padrão-ouro em CME para artigos hospitalares termorresistentes?",
      options: ["A) Óxido de Etileno (EtO)", "B) Autoclave a Vapor Saturado sob Pressão", "C) Estufa de Calor Seco (Forno de Pasteur)", "D) Imersão em Glutaraldeído 2%", "E) Radiação por Cobalto-60"],
      correctIndex: 1,
      explanation: "A autoclave a vapor sob pressão combina umidade e alta temperatura para coagular e desidratar as proteínas de micro-organismos e esporos com extrema rapidez e sem toxicidade química."
    },
    {
      id: "q8",
      question: "Qual das seguintes pinças cirúrgicas clássicas é um exemplo de instrumental de hemostasia temporária/definitiva por pinçamento?",
      options: ["A) Pinça de Backhaus", "B) Pinça de Halsted (Mosquito) ou Kelly", "C) Tesoura de Metzenbaum", "D) Afastador de Farabeuf", "E) Porta-agulha de Mayo-Hegar"],
      correctIndex: 1,
      explanation: "As pinças de Kelly, Halsted e Rochester são clássicos instrumentais de pinçamento vascular para estancar sangramentos por compressão mecânica direta dos vasos (Hemostasia)."
    },
    {
      id: "q9",
      question: "O indicador biológico de terceira geração (leitura rápida) usado para validar ciclos de autoclaves a vapor utiliza esporos de qual bactéria?",
      options: ["A) Bacillus atrophaeus", "B) Geobacillus stearothermophilus", "C) Clostridium tetani", "D) Escherichia coli", "E) Staphylococcus aureus"],
      correctIndex: 1,
      explanation: "Os esporos de *Geobacillus stearothermophilus* são altamente resistentes ao calor úmido, sendo o micro-organismo biológico padrão mundial para testar a eficácia de ciclos de autoclave a vapor."
    },
    {
      id: "q10",
      question: "Em qual classificação de potencial de contaminação se enquadra uma cirurgia realizada no trato digestório sem quebra significativa de assepsia técnica?",
      options: ["A) Cirurgia Limpa", "B) Cirurgia Potencialmente Contaminada (Limpa-Contaminada)", "C) Cirurgia Contaminada", "D) Cirurgia Infectada", "E) Cirurgia Séptica"],
      correctIndex: 1,
      explanation: "Cirurgias potencialmente contaminadas ocorrem em órgãos que naturalmente abrigam flora bacteriana (trato digestório, respiratório ou urinário), sob condições controladas e sem contaminação macroscópica evidente."
    }
  ],
  "lms-c5": [
    {
      id: "q1",
      question: "A Política Nacional de Humanização (HumanizaSUS) preconiza que a humanização deve ser entendida como:",
      options: ["A) Um conjunto de discursos bonitos sem aplicação real prática.", "B) Uma política pública transversal que norteia as relações de trabalho, gestão e assistência no SUS.", "C) Um programa assistencialista voltado apenas para doação de mantimentos.", "D) Uma comissão isolada criada para resolver problemas administrativos do RH.", "E) Um treinamento de etiqueta comercial para recepção."],
      correctIndex: 1,
      explanation: "A PNH entende a humanização de forma transversal, cruzando toda a rede assistencial e alterando as práticas de gestão, cuidado e processos laborais em saúde."
    },
    {
      id: "q2",
      question: "No Protocolo de Manchester de Classificação de Risco hospitalar, qual cor é atribuída ao paciente em estado de emergência (risco imediato de morte)?",
      options: ["A) Azul", "B) Verde", "C) Amarelo", "D) Laranja", "E) Vermelho"],
      correctIndex: 4,
      explanation: "A cor vermelha indica atendimento imediato (prioridade máxima), representando pacientes críticos em choque, parada cardiorrespiratória ou traumas graves que necessitam de intervenção imediata da equipe médica."
    },
    {
      id: "q3",
      question: "No contexto da comunicação humanizada, a técnica da 'Escuta Ativa' consiste em:",
      options: ["A) Escutar o paciente enquanto digita no prontuário sem olhar para ele.", "B) Ouvir com empatia, mantendo contato visual, sem julgamentos, focando em entender as dimensões física e emocional do relato do paciente.", "C) Fingir que está concordando com tudo apenas para agilizar a fila.", "D) Interromper o relato a cada 10 segundos para corrigir termos técnicos.", "E) Chamar o segurança sempre que o paciente iniciar um choro."],
      correctIndex: 1,
      explanation: "A escuta ativa exige presença plena, contato visual e postura receptiva para compreender as dores do paciente além do sintoma puramente clínico."
    },
    {
      id: "q4",
      question: "Qual o protocolo internacionalmente consagrado e estruturado em 6 etapas para guiar profissionais de saúde na delicada tarefa de comunicar notícias difíceis ou óbitos?",
      options: ["A) Protocolo de Manchester", "B) Protocolo SPIKES", "C) Protocolo SBAR", "D) Protocolo de Helsinque", "E) Protocolo de Harvard"],
      correctIndex: 1,
      explanation: "O protocolo SPIKES (Setting, Perception, Invitation, Knowledge, Emotions, Strategy) é uma ferramenta mnemônica que ajuda o profissional a preparar o ambiente, avaliar a percepção do familiar, passar a informação de forma humanizada e gerenciar reações emocionais."
    },
    {
      id: "q5",
      question: "Ao lidar com um acompanhante irritado na recepção de um hospital, qual conduta profissional demonstra humanização e controle emocional?",
      options: ["A) Responder no mesmo tom agressivo para demonstrar autoridade.", "B) Ignorar a pessoa fingindo que ela não está ali.", "C) Ouvir as queixas calmamente, manter tom de voz brando, demonstrar empatia e buscar uma solução real dentro das normas da instituição.", "D) Chamar a polícia de imediato para retirar o acompanhante à força.", "E) Oferecer medicamentos sedativos sem receita médica."],
      correctIndex: 2,
      explanation: "A desescalada de conflitos na saúde começa pelo acolhimento da angústia da pessoa. Manter a calma, validar a preocupação e focar na solução resolve a imensa maioria dos atritos na recepção."
    },
    {
      id: "q6",
      question: "A diretriz da 'Transversalidade' da PNH significa essencialmente que:",
      options: ["A) Os hospitais devem possuir corredores transversais mais amplos.", "B) A humanização deve atravessar e integrar diferentes saberes, práticas, categorias profissionais e setores do hospital.", "C) O enfermeiro-chefe tem autoridade transversal absoluta sobre o médico técnico.", "D) O paciente tem direito de escolher qualquer leito do hospital.", "E) Os custos hospitalares devem ser divididos de forma transversal na folha."],
      correctIndex: 1,
      explanation: "Transversalidade na PNH busca romper as barreiras corporativas e de hierarquias isoladas, gerando conexões horizontais entre médicos, técnicos, administrativos e pacientes."
    },
    {
      id: "q7",
      question: "O conceito de 'Ambiência' na humanização dos serviços de saúde envolve:",
      options: ["A) Apenas a decoração estética com plantas artificiais.", "B) A criação de espaços saudáveis, acolhedores, confortáveis e facilitadores de interações humanas que promovam o bem-estar físico e mental.", "C) A pintura obrigatória de todas as paredes de cor branca brilhante.", "D) O desligamento total de lâmpadas para economizar energia no plantão.", "E) A contratação de músicos em tempo integral para as salas cirúrgicas."],
      correctIndex: 1,
      explanation: "A ambiência engloba iluminação adequada, redução de ruídos (poluição sonora), ventilação, conforto térmico, acessibilidade física e áreas de convívio que desospitalizem o ambiente clínico."
    },
    {
      id: "q8",
      question: "O respeito absoluto à autonomia do paciente ao consentir ou recusar determinado tratamento baseia-se em qual princípio bioético da saúde?",
      options: ["A) Princípio da Não-Maleficência", "B) Princípio da Autonomia", "C) Princípio da Beneficência", "D) Princípio da Justiça Distributiva", "E) Princípio do Utilitarismo"],
      correctIndex: 1,
      explanation: "A autonomia concede ao indivíduo capaz o direito ético e legal de tomar decisões sobre seu próprio corpo e saúde após ser devidamente informado sobre os riscos e benefícios envolvidos."
    },
    {
      id: "q9",
      question: "Segundo as premissas da humanização, o acolhimento deve ser realizado em qual momento do fluxo assistencial hospitalar?",
      options: ["A) Somente após o paciente receber alta da internação.", "B) Exclusivamente pelo médico na hora da consulta cirúrgica.", "C) Em todos os momentos do atendimento, desde a recepção até a alta do paciente, por todos os colaboradores do hospital.", "D) Apenas se o paciente estiver chorando muito.", "E) Somente por psicólogos contratados para este fim específico."],
      correctIndex: 2,
      explanation: "Acolhimento não é um espaço físico ou uma recepção; é uma postura ética de recepção e escuta que deve ser praticada por todos os profissionais de saúde em toda a jornada do paciente."
    },
    {
      id: "q10",
      question: "Qual das seguintes ferramentas práticas pode ser usada na UTI para humanizar o leito e resgatar a identidade do paciente acamado?",
      options: ["A) Prontuário Afetivo (quadro de cabeceira com preferências, apelidos, hobbies e fotos do paciente)", "B) Restrição mecânica de braços e pernas preventivamente", "C) Proibição total de visitas familiares para diminuir infecção", "D) Isolamento sonoro completo com fones de ouvido no paciente", "E) Manter o paciente de costas para as janelas o dia todo"],
      correctIndex: 0,
      explanation: "O 'prontuário afetivo' (ou biografia de cabeceira) aproxima a equipe da história de vida do paciente intubado ou debilitado, lembrando a todos que ali reside uma pessoa com preferências, sonhos e conexões, e não apenas uma patologia diagnóstica."
    }
  ],
  "lms-c6": [
    {
      id: "q1",
      question: "No contexto de recursos humanos hospitalares de alta performance, o que significa a sigla PDI?",
      options: ["A) Protocolo de Diagnóstico Imediato", "B) Plano de Desenvolvimento Individual", "C) Programa de Demissão Indireta", "D) Parecer de Desempenho Institucional", "E) Painel de Descontaminação de Instrumental"],
      correctIndex: 1,
      explanation: "O Plano de Desenvolvimento Individual (PDI) é uma ferramenta estratégica onde colaborador e liderança mapeiam competências a evoluir e definem ações práticas e cronogramas para o crescimento profissional."
    },
    {
      id: "q2",
      question: "Durante uma auditoria externa de acreditação de qualidade (ex: ONA ou JCI) no seu setor de trabalho, qual deve ser a postura profissional do técnico?",
      options: ["A) Tentar se esconder ou pedir folga no dia para evitar perguntas do auditor.", "B) Responder às perguntas de forma calma, clara e verdadeira, baseando-se estritamente nos protocolos e rotinas vigentes do hospital.", "C) Inventar respostas técnicas complexas mesmo sem ter certeza do fluxo correto.", "D) Culpar publicamente outros colegas por eventuais falhas identificadas.", "E) Discutir de forma agressiva com o auditor caso ele aponte uma inconformidade."],
      correctIndex: 1,
      explanation: "Auditores buscam rastreabilidade e consistência prática. Apresentar os fluxos reais de forma honesta, segura e demonstrando conhecimento do protocolo institucional do Lynx EDU é a melhor postura técnica."
    },
    {
      id: "q3",
      question: "Como um técnico em saúde recém-contratado pode construir autoridade técnica legítima e conquistar respeito positivo na sua escala técnica?",
      options: ["A) Sendo o primeiro a espalhar boatos e fofocas internas na ala de descanso.", "B) Demonstrando pontualidade exemplar, domínio técnico ético dos protocolos de biossegurança e atitude cooperativa proativa no plantão.", "C) Reclamando constantemente das escalas de trabalho para a chefia de RH.", "D) Fingindo saber realizar procedimentos complexos que nunca praticou.", "E) Evitando conversar com técnicos de outros turnos."],
      correctIndex: 1,
      explanation: "A reputação e autoridade profissional constroem-se com consistência, responsabilidade ética e respeito recíproco nas interações cotidianas."
    },
    {
      id: "q4",
      question: "De que forma a participação ativa em comissões internas hospitalares (como CIPA, CCIH ou NSP) impulsiona o plano de carreira do técnico?",
      options: ["A) Garante aumento salarial automático imediato no mês seguinte.", "B) Isenta o colaborador de cumprir seus plantões e rotinas básicas.", "C) Amplia o networking multidisciplinar, constrói reputação técnica e desenvolve visão gerencial estratégica de processos de qualidade.", "D) Permite aplicar advertências disciplinares a médicos seniores do hospital.", "E) Garante estabilidade vitalícia incondicional no emprego do hospital."],
      correctIndex: 2,
      explanation: "Fazer parte de comissões expõe o profissional a desafios globais do hospital, estreita relações com gerências e diretorias de qualidade e qualifica o currículo para promoções futuras de supervisão."
    },
    {
      id: "q5",
      question: "Ao apresentar uma proposta ou projeto de melhoria técnica para a gerência de RH ou diretoria hospitalar, qual foco de argumentação é mais persuasivo?",
      options: ["A) Apresentar apenas justificativas emocionais de preferência pessoal.", "B) Demonstrar o impacto do projeto na segurança do paciente, na eficiência de processos, na redução de desperdício técnico de insumos e no retorno de qualidade (dados tangíveis).", "C) Exigir que o projeto seja aceito sem apresentar dados de viabilidade ou custos.", "D) Apresentar um documento longo de 500 páginas sem resumos gerenciais.", "E) Focar apenas em reclamar das falhas das outras coordenações."],
      correctIndex: 1,
      explanation: "Propostas de alto impacto para tomada de decisão gerencial devem combinar problemas reais descritos com clareza a indicadores quantificáveis de melhoria (ex: queda de 30% nas infecções ou otimização de tempo de exames)."
    },
    {
      id: "q6",
      question: "O conceito de 'Liderança Situacional' na supervisão ou gerência técnica de saúde pressupõe que o líder deve:",
      options: ["A) Adotar o mesmo comportamento rígido e imutável com todas as pessoas em qualquer circunstância.", "B) Adaptar seu estilo de liderança (direcionar, apoiar, treinar ou delegar) com base no nível de maturidade profissional e competência da equipe para cada tarefa.", "C) Tomar decisões baseado apenas em afinidades pessoais de amizade.", "D) Deixar a equipe trabalhar sem qualquer tipo de feedback ou regras básicas.", "E) Centralizar 100% de todas as pequenas tarefas técnicas em si mesmo."],
      correctIndex: 1,
      explanation: "A liderança situacional reconhece que cada colaborador está em um estágio de prontidão diferente para tarefas distintas, exigindo posturas flexíveis de orientação ou autonomia para potencializar talentos."
    },
    {
      id: "q7",
      question: "Qual o indicador comportamental e técnico mais confiável de que um colaborador está 'pronto' para uma promoção interna hospitalar?",
      options: ["A) Possuir mais tempo de casa, mesmo sem atualizar seu conhecimento técnico.", "B) Executar consistentemente sua função atual com excelência e já demonstrar comportamentos e competências alinhados à nova posição técnica pretendida.", "C) Apadrinhamento político na gerência de RH do hospital.", "D) Fazer menos perguntas e apenas acenar positivamente para a coordenação.", "E) Solicitar promoção por escrito diariamente na caixa de sugestões do RH."],
      correctIndex: 1,
      explanation: "Prontidão corporativa moderna consiste em atingir maturidade na função atual e demonstrar competências de autogestão e liderança que tornam o cargo futuro um passo natural de carreira."
    },
    {
      id: "q8",
      question: "Durante reuniões de mediação de conflitos entre profissionais de turnos diferentes, a abordagem mais produtiva é:",
      options: ["A) Estimular acusações mútuas para ver quem vence o argumento.", "B) Focar na busca por culpados específicos para aplicação rápida de punições.", "C) Identificar as falhas de passagem de plantão de forma sistêmica e criar em conjunto uma lista de checagem estruturada de transmissão de dados (SBAR).", "D) Ignorar as divergências fingindo que as falhas operacionais não causam danos de segurança.", "E) Sortear um culpado de cada turno para equilibrar as punições do hospital."],
      correctIndex: 2,
      explanation: "Problemas na saúde quase sempre decorrem de falhas estruturais ou de canais de comunicação ineficazes. Abordar o processo por meio de melhorias coletivas pacíficas de sistemas resolve a causa raiz dos conflitos."
    },
    {
      id: "q9",
      question: "O conceito moderno de 'Lifelong Learning' (Aprendizado ao Longo da Vida) na área técnica de saúde indica:",
      options: ["A) Que após obter o diploma técnico, o profissional está completamente pronto e nunca mais precisará estudar de forma teórica.", "B) Que a educação deve ser contínua e constante ao longo de toda a carreira profissional, visando acompanhar atualizações científicas, novas legislações e avanços tecnológicos de saúde.", "C) Que o estudante deve permanecer matriculado no colégio por pelo menos 30 anos seguidos.", "D) Que somente profissionais da área administrativa precisam fazer cursos de informática.", "E) Que o hospital deve arcar com 100% do tempo de lazer extra do colaborador."],
      correctIndex: 1,
      explanation: "Na saúde digital de alta velocidade, novos medicamentos, protocolos baseados em evidência e inovações em radiodiagnóstico exigem resiliência mental e dedicação ao aprendizado contínuo para evitar a obsolescência técnica."
    },
    {
      id: "q10",
      question: "Se o técnico percebe um desperdício contínuo de agulhas e equipos em seu plantão hospitalar, qual a conduta profissional recomendada?",
      options: ["A) Reclamar de forma ruidosa com os pacientes para constranger a administração.", "B) Propor à comissão ou chefia de enfermagem uma revisão do fluxo de dispensação de materiais e sugerir treinamentos rápidos de manipulação responsável de kits clínicos.", "C) Levar os materiais excedentes para sua residência particular para evitar que sejam jogados fora.", "D) Não tomar nenhuma iniciativa, pois os insumos hospitalares são de responsabilidade do diretor financeiro do hospital.", "E) Cortar o fornecimento de materiais aos leitos para zerar o consumo do setor."],
      correctIndex: 1,
      explanation: "Propor soluções estruturadas para mitigar desperdício demonstra proatividade, visão financeira consciente de custos e alto senso de pertencimento e zelo pelo patrimônio operacional coletivo do Hospital Lynx EDU."
    }
  ]
}

export const MOCK_NOT_REQUIRED_COURSES = [
  { id: "req-1", title: "Suporte Básico de Vida (BLS)", status: "Vencido em 12/05/2026", type: "Obrigatório", hours: 4 },
  { id: "req-2", title: "Treinamento Geral ONA: Qualidade na Assistência", status: "Pendente (Prazo: 30/08/2026)", type: "Obrigatório", hours: 6 },
  { id: "req-3", title: "Lavagem das Mãos e CCIH", status: "Regularizado", type: "Periódico", hours: 2 }
];

export const MOCK_COMMISSIONS = [
  { id: "com-1", name: "CIPA - Comissão Interna de Prevenção de Acidentes", desc: "Desenvolve campanhas de SIPAT e mapeamento de riscos hospitalares.", members: "12 membros" },
  { id: "com-2", name: "COFEN/Comissão de Ética de Enfermagem", desc: "Garante o cumprimento do Código de Ética Profissional nas condutas de assistência.", members: "6 membros" },
  { id: "com-3", name: "CCIH - Comissão de Controle de Infecção Hospitalar", desc: "Elabora e monitora as taxas de infecção cirúrgica e barreiras bacterianas.", members: "8 membros" },
  { id: "com-4", name: "Núcleo de Segurança do Paciente (NSP)", desc: "Mapeamento de eventos adversos e revisão das metas internacionais OMS.", members: "10 membros" }
];
