export interface ConcursoQuestion {
  id: string;
  course: string;
  theme: string;
  origin: string;
  question: string;
  options: string[];
  correctIndex: number; // 0 = A, 1 = B, 2 = C, 3 = D, 4 = E
  explanation: string;
}

export const LOCAL_CONCURSOS_QUESTIONS: ConcursoQuestion[] = [
  // --- TÉCNICO EM ENFERMAGEM ---
  {
    id: "enf-1",
    course: "Técnico em Enfermagem",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "IBFC - 2023 - EBSERH - Técnico em Enfermagem",
    question: "De acordo com a Lei Orgânica da Saúde (Lei nº 8.080/1990), a iniciativa privada participará do Sistema Único de Saúde (SUS) em caráter:",
    options: [
      "A) Principal e prioritário.",
      "B) Subsidiário e obrigatório.",
      "C) Complementar, tendo preferência as entidades filantrópicas e as sem fins lucrativos.",
      "D) Exclusivo para procedimentos de alta complexidade.",
      "E) Paritário e concorrente direto."
    ],
    correctIndex: 2,
    explanation: "Conforme o Artigo 199, § 1º da Constituição Federal de 1988 e o Artigo 4º da Lei nº 8.080/1990, as instituições privadas poderão participar do Sistema Único de Saúde de forma complementar, mediante contrato de direito público ou convênio, tendo preferência as entidades filantrópicas e as sem fins lucrativos."
  },
  {
    id: "enf-2",
    course: "Técnico em Enfermagem",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "VUNESP - 2024 - Prefeitura de São Paulo - Técnico em Enfermagem",
    question: "Durante a administração de medicamentos por via intramuscular (IM) na região ventro-glútea (técnica de Hochstetter), o técnico em enfermagem deve saber que a principal vantagem desse sítio é:",
    options: [
      "A) Ser uma região de fácil auto-aplicação pelo paciente.",
      "B) Estar livre de grandes vasos sanguíneos e nervos importantes, além de ter menor espessura de tecido subcutâneo.",
      "C) Permitir volumes de infusão de até 10 ml em dose única.",
      "D) Ter absorção mais lenta do que a via subcutânea ordinária.",
      "E) Não requerer higienização com álcool 70% por ser área estéril."
    ],
    correctIndex: 1,
    explanation: "A região ventro-glútea é considerada a mais segura para injeções intramusculares porque é livre de grandes vasos e nervos importantes (como o nervo ciático), possui menor espessura de gordura subcutânea e é delimitada por marcos ósseos muito claros (espinha ilíaca anterossuperior, crista ilíaca e grande trocanter do fêmur)."
  },
  {
    id: "enf-3",
    course: "Técnico em Enfermagem",
    theme: "Emergência & Primeiros Socorros",
    origin: "AOCP - 2022 - Instituto de Saúde - Técnico em Enfermagem",
    question: "De acordo com as diretrizes da American Heart Association (AHA) para Reanimação Cardiopulmonar (RCP) em adultos, qual deve ser a frequência ideal e a profundidade das compressões torácicas no suporte básico de vida?",
    options: [
      "A) 80 a 100 compressões por minuto, com profundidade de 3 cm.",
      "B) 100 a 120 compressões por minuto, com profundidade de pelo menos 5 cm (não excedendo 6 cm).",
      "C) Exatamente 120 compressões por minuto, com profundidade de 7 cm.",
      "D) 60 a 80 compressões por minuto, com profundidade livre.",
      "E) 140 compressões por minuto, com profundidade de 4 cm."
    ],
    correctIndex: 1,
    explanation: "As diretrizes da AHA determinam que a frequência de compressão torácica deve ser de 100 a 120 compressões por minuto e a profundidade deve ser de pelo menos 2 polegadas (5 cm), evitando ultrapassar as 2,4 polegadas (6 cm) para prevenir lesões internas graves e garantir o retorno venoso."
  },
  {
    id: "enf-4",
    course: "Técnico em Enfermagem",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "COFEN - Código de Ética dos Profissionais de Enfermagem",
    question: "O Código de Ética dos Profissionais de Enfermagem preconiza que recusar-se a executar atividades que não sejam de sua competência técnica, científica, ética e legal, ou que não ofereçam segurança ao profissional, à pessoa, à família e à coletividade é um(a):",
    options: [
      "A) Dever do profissional.",
      "B) Proibição expressa.",
      "C) Direito do profissional.",
      "D) Penalidade administrativa.",
      "E) Recomendação opcional."
    ],
    correctIndex: 2,
    explanation: "Segundo o Artigo 22 do Código de Ética dos Profissionais de Enfermagem (Resolução COFEN nº 564/2017), é um DIREITO do profissional recusar-se a executar atividades que não sejam de sua competência legal/técnica ou que representem riscos à sua segurança física ou dos assistidos."
  },
  {
    id: "enf-5",
    course: "Técnico em Enfermagem",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "FGV - 2023 - Tribunal de Justiça - Técnico em Enfermagem",
    question: "Na verificação dos sinais vitais, uma frequência cardíaca de 52 batimentos por minuto em um paciente adulto em repouso e sem histórico de atletismo é classificada como:",
    options: [
      "A) Taquicardia.",
      "B) Normocardia.",
      "C) Bradicardia.",
      "D) Arritmia sinusal severa.",
      "E) Pulso filiforme."
    ],
    correctIndex: 2,
    explanation: "A frequência cardíaca normal (normocardia) para um adulto em repouso varia entre 60 e 100 batimentos por minuto (bpm). Valores abaixo de 60 bpm são classificados como bradicardia, e valores acima de 100 bpm são classificados como taquicardia."
  },

  // --- TÉCNICO EM RADIOLOGIA ---
  {
    id: "rad-1",
    course: "Técnico em Radiologia",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "CONTER - Código de Ética do Técnico em Radiologia",
    question: "Sob as diretrizes de proteção radiológica da Portaria nº 453/1998 e Resolução RDC 611/2022 da ANVISA, qual princípio determina que as exposições médicas devem ser mantidas no nível mais baixo razoavelmente exequível (ALARA)?",
    options: [
      "A) Princípio da Justificação.",
      "B) Princípio da Limitação de Doses Individuais.",
      "C) Princípio da Otimização.",
      "D) Princípio da Prevenção de Acidentes.",
      "E) Princípio da Calibração Periódica."
    ],
    correctIndex: 2,
    explanation: "O princípio da Otimização (ou princípio ALARA - As Low As Reasonably Achievable) dita que o projeto, o planejamento do uso e a operação de instalações e fontes de radiação devem ser realizados de modo a garantir que as exposições sejam tão baixas quanto possível, considerando fatores sociais e econômicos."
  },
  {
    id: "rad-2",
    course: "Técnico em Radiologia",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "AOCP - 2023 - EBSERH - Tecnólogo em Radiologia",
    question: "Para a realização de uma radiografia de tórax de rotina, a posição padrão recomendada e a distância foco-filme (DFF) ideal são, respectivamente:",
    options: [
      "A) AP (Anteroposterior) e DFF de 1,00 metro.",
      "B) PA (Posteroanterior) e DFF de 1,80 metro.",
      "C) Decúbito lateral e DFF de 1,20 metro.",
      "D) Oblíqua anterior e DFF de 1,00 metro.",
      "E) AP lordótica e DFF de 1,50 metro."
    ],
    correctIndex: 1,
    explanation: "A radiografia de tórax de rotina é realizada na posição PA (Posteroanterior) para minimizar a ampliação geométrica do coração (magnificação cardíaca) e com uma DFF de 1,80m (180 cm) para obter feixes de raios-X mais paralelos, reduzindo a penumbra e a distorção da imagem."
  },
  {
    id: "rad-3",
    course: "Técnico em Radiologia",
    theme: "Anatomia & Fisiologia Humana",
    origin: "IBFC - 2022 - SES-DF - Técnico em Radiologia",
    question: "Na anatomia radiográfica do membro superior, o osso que se articula proximalmente com a cavidade glenoide da escápula e distalmente com o rádio e a ulna é o:",
    options: [
      "A) Clavícula.",
      "B) Úmero.",
      "C) Esterno.",
      "D) Carpo.",
      "E) Fêmur."
    ],
    correctIndex: 1,
    explanation: "O úmero é o osso longo do braço. Sua cabeça (extremidade proximal) articula-se com a cavidade glenoide da escápula (articulação glenoumeral do ombro) e sua extremidade distal articula-se com a cabeça do rádio e com a incisura troclear da ulna (articulação do cotovelo)."
  },
  {
    id: "rad-4",
    course: "Técnico em Radiologia",
    theme: "Segurança e Normas Regulamentadoras",
    origin: "VUNESP - 2023 - HC-Unicamp - Técnico em Radiologia",
    question: "Qual dos seguintes materiais é o mais comumente utilizado em barreiras de proteção (como biombos e aventais) contra a radiação ionizante de diagnóstico médico, devido ao seu elevado número atômico e densidade?",
    options: [
      "A) Alumínio.",
      "B) Cobre.",
      "C) Chumbo (Pb).",
      "D) Concreto celular.",
      "E) Plástico acrílico."
    ],
    correctIndex: 2,
    explanation: "O chumbo (número atômico 82) possui alta densidade e alto número atômico, o que maximiza a probabilidade de ocorrência do efeito fotoelétrico, tornando-o o atenuador ideal e mais prático para blindagem contra raios-X diagnósticos."
  },
  {
    id: "rad-5",
    course: "Técnico em Radiologia",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "IADES - 2021 - Técnico em Radiologia",
    question: "Em exames de Tomografia Computadorizada (TC) com uso de contraste iodado endovenoso, qual critério de triagem do paciente é o mais crítico antes da administração do contraste para prevenir Nefropatia Induzida por Contraste?",
    options: [
      "A) Nível de glicemia de jejum.",
      "B) Avaliação da função renal (Taxa de Filtração Glomerular / Creatinina).",
      "C) Medição da pressão intraocular.",
      "D) Radiografia prévia do abdômen total.",
      "E) Frequência respiratória basal."
    ],
    correctIndex: 1,
    explanation: "O contraste iodado é excretado pelos rins. Avaliar a função renal através da dosagem de creatinina sérica e cálculo da Taxa de Filtração Glomerular (TFG) é indispensável para rastrear insuficiência renal crônica ou aguda, minimizando o risco de toxicidade renal grave induzida pelo meio de contraste."
  },

  // --- TÉCNICO EM SEGURANÇA DO TRABALHO ---
  {
    id: "seg-1",
    course: "Técnico em Segurança do Trabalho",
    theme: "Segurança e Normas Regulamentadoras",
    origin: "FGV - 2023 - MME - Técnico em Segurança do Trabalho",
    question: "A Norma Regulamentadora nº 6 (NR-6) estabelece os direitos e deveres de empregadores e trabalhadores sobre Equipamentos de Proteção Individual (EPI). De acordo com a norma, compete ao empregador:",
    options: [
      "A) Adquirir o EPI adequado ao risco de cada atividade e fornecê-lo gratuitamente ao trabalhador.",
      "B) Responsabilizar-se pela higienização diária e guarda particular do EPI na residência do trabalhador.",
      "C) Fabricar ou importar os EPIs que serão utilizados por seus contratados.",
      "D) Cobrar uma taxa simbólica de coparticipação para a manutenção dos EPIs de alta tecnologia.",
      "E) Recomendar o uso de EPI apenas quando as ferramentas coletivas falharem por mais de 30 dias."
    ],
    correctIndex: 0,
    explanation: "Segundo a NR-6, cabe ao empregador fornecer gratuitamente ao empregado o EPI adequado ao risco, em perfeito estado de conservação e funcionamento, bem como treinar o trabalhador sobre seu uso correto e exigir sua utilização."
  },
  {
    id: "seg-2",
    course: "Técnico em Segurança do Trabalho",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "CESPE/Cebraspe - 2024 - Petrobras - Técnico de Segurança",
    question: "O documento legal que estabelece a metodologia para identificação, avaliação e controle dos riscos ocupacionais nas empresas, unificando o antigo PPRA em um escopo mais moderno dentro da NR-1, chama-se:",
    options: [
      "A) PCMSO (Programa de Controle Médico de Saúde Ocupacional).",
      "B) PGR (Programa de Gerenciamento de Riscos).",
      "C) LTCAT (Laudo Técnico das Condições Ambientais do Trabalho).",
      "D) CAT (Comunicação de Acidente de Trabalho).",
      "E) APR (Análise Preliminar de Risco)."
    ],
    correctIndex: 1,
    explanation: "Com a modernização da NR-1 (Disposições Gerais e Gerenciamento de Riscos Ocupacionais), o PPRA foi substituído pelo PGR (Programa de Gerenciamento de Riscos), composto pelo Inventário de Riscos Ocupacionais e pelo Plano de Ação."
  },
  {
    id: "seg-3",
    course: "Técnico em Segurança do Trabalho",
    theme: "Segurança e Normas Regulamentadoras",
    origin: "AOCP - 2023 - UFPB - Técnico em Segurança do Trabalho",
    question: "A NR-32 (Segurança e Saúde no Trabalho em Serviços de Saúde) tem por finalidade estabelecer as diretrizes básicas para a implementação de medidas de proteção à segurança e à saúde dos trabalhadores dos serviços de saúde. Em relação aos riscos biológicos, a norma proíbe terminantemente:",
    options: [
      "A) O uso de jalecos brancos na área de triagem de pacientes.",
      "B) O reencape manual de agulhas e a desconexão manual de agulhas de seringas.",
      "C) O descarte de seringas em caixas de papelão rígido.",
      "D) O trabalho de gestantes na recepção hospitalar.",
      "E) A vacinação compulsória contra hepatite B."
    ],
    correctIndex: 1,
    explanation: "A NR-32 proíbe o reencape manual e a desconexão manual de agulhas (subitem 32.2.4.15) de forma absoluta, pois este ato é uma das maiores causas de acidentes com perfurocortantes e contaminação por patógenos veiculados pelo sangue."
  },
  {
    id: "seg-4",
    course: "Técnico em Segurança do Trabalho",
    theme: "Emergência & Primeiros Socorros",
    origin: "FCC - 2022 - TRT - Técnico em Segurança do Trabalho",
    question: "Em caso de incêndio em equipamentos elétricos energizados (como painéis disjuntores ou computadores), qual é a classe de incêndio correspondente e o tipo de extintor de incêndio RECOMENDADO?",
    options: [
      "A) Classe A; extintor de Água Pressurizada.",
      "B) Classe B; extintor de Espuma Química.",
      "C) Classe C; extintor de Dióxido de Carbono (CO2) ou Pó Químico Seco (PQS).",
      "D) Classe D; extintor de Cloreto de Sódio especial.",
      "E) Classe K; extintor de Acetato de Potássio."
    ],
    correctIndex: 2,
    explanation: "Incêndios envolvendo eletricidade energizada pertencem à Classe C. Água ou espuma não devem ser usadas porque conduzem eletricidade (risco de choque elétrico grave). O extintor recomendado é o de Dióxido de Carbono (CO2) ou Pó Químico (PQS), que são agentes não condutores."
  },
  {
    id: "seg-5",
    course: "Técnico em Segurança do Trabalho",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "IBFC - 2021 - EBSERH - Técnico em Segurança",
    question: "A taxa de gravidade (TG) de acidentes de trabalho é um indicador essencial estabelecido pela NBR 14280. Esse indicador representa o número de dias perdidos e debitados por milhão de:",
    options: [
      "A) Trabalhadores registrados no CNPJ.",
      "B) Horas-homem de exposição ao risco (HHE).",
      "C) Salários mínimos pagos na folha anual.",
      "D) Dias efetivamente trabalhados no ano comercial.",
      "E) Vistorias de inspeção de segurança realizadas."
    ],
    correctIndex: 1,
    explanation: "Tanto a Taxa de Frequência (TF) quanto a Taxa de Gravidade (TG) são calculadas tendo como base o número de horas-homem de exposição ao risco (HHE) expresso por milhão (1.000.000 de horas de exposição ocupacional), seguindo as normas da ABNT NBR 14280."
  },

  // --- ESPECIALIZAÇÃO EM INSTRUMENTAÇÃO CIRÚRGICA ---
  {
    id: "ins-1",
    course: "Especialização em Instrumentação Cirúrgica",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "VUNESP - 2024 - Instrumentador Cirúrgico - HC",
    question: "Na montagem da mesa de instrumentação para cirurgia geral, a correta divisão clássica dos quadrantes de instrumentos, contados em ordem cronológica de utilização a partir do canto inferior esquerdo, é:",
    options: [
      "A) Síntese, Especialidade, Hemostasia, Diérese.",
      "B) Diérese (corte), Preensão/Hemostasia, Afastamento/Exposição, Síntese (fechamento).",
      "C) Afastamento, Diérese, Auxiliar, Descarte.",
      "D) Lavagem, Aspiração, Sutura, Cautério.",
      "E) Anestesia, Dissecção, Coagulação, Síntese."
    ],
    correctIndex: 1,
    explanation: "A montagem lógica e organizada da mesa cirúrgica acompanha os tempos operatórios (tempos cirúrgicos fundamentais): primeiro a Diérese (bisturis, tesouras para cortar), segundo a Preensão e Hemostasia (pinças hemostáticas para pinçar vasos), terceiro a Exposição/Afastamento (afastadores para abrir campo de visão) e por último a Síntese (porta-agulhas e fios para costurar)."
  },
  {
    id: "ins-2",
    course: "Especialização em Instrumentação Cirúrgica",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "AOCP - 2023 - Residência em Centro Cirúrgico",
    question: "Durante um procedimento cirúrgico estéril, o instrumentador cirúrgico deve manter a sua barreira estéril (área em que é considerado totalmente limpo para manipulação livre de materiais). Quais partes do avental cirúrgico são consideradas estéreis após a paramentação?",
    options: [
      "A) Todo o avental, desde a gola até a barra inferior, incluindo as costas.",
      "B) Da linha da cintura até os ombros na parte anterior, e as mangas desde o punho até 5 cm acima do cotovelo.",
      "C) Apenas os punhos elásticos e os ombros anteriores.",
      "D) A parte posterior (costas) e as axilas bilaterais.",
      "E) O avental completo, exceto a região que fica abaixo dos joelhos."
    ],
    correctIndex: 1,
    explanation: "De acordo com os princípios de assepsia de centro cirúrgico (RDC 15/2012 e diretrizes da SOBECC), os aventais cirúrgicos são considerados estéreis apenas na frente, do nível do tórax (ombros anteriores) até o nível da mesa cirúrgica (cintura), e nas mangas, de 5 cm acima do cotovelo até o punho. As costas e axilas não são estéreis devido à transpiração e movimento."
  },
  {
    id: "ins-3",
    course: "Especialização em Instrumentação Cirúrgica",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "IBFC - 2022 - EBSERH - Enfermeiro de Centro Cirúrgico",
    question: "O Protocolo de Cirurgia Segura da Organização Mundial da Saúde (OMS), incorporado ao SUS, estabelece uma lista de verificação (Checklist) em três momentos operatórios cruciais. Quais são esses momentos?",
    options: [
      "A) Entrada da internação, Admissão na UTI, Alta médica.",
      "B) Antes da indução anestésica (Sign In), Antes da incisão cirúrgica (Time Out) e Antes do paciente sair da sala cirúrgica (Sign Out).",
      "C) Na lavagem de mãos, Na esterilização em autoclave, Na contagem de compressas pós-operatórias.",
      "D) Na consulta pré-anestésica, Na internação eletiva, No retorno ambulatorial.",
      "E) No início da manhã, No intervalo de plantões, No encerramento noturno."
    ],
    correctIndex: 1,
    explanation: "O Checklist de Cirurgia Segura é dividido em: 1. Antes da indução anestésica (Sign In - identificação, demarcação de sítio, consentimento); 2. Antes da incisão cirúrgica (Time Out - confirmação de equipe, profilaxia antibiótica, materiais críticos); 3. Antes do paciente sair da sala cirúrgica (Sign Out - contagem de agulhas e compressas, rotulagem de biópsias)."
  },
  {
    id: "ins-4",
    course: "Especialização em Instrumentação Cirúrgica",
    theme: "Anatomia & Fisiologia Humana",
    origin: "VUNESP - 2023 - Instrumentação",
    question: "A pinça hemostática de ponta curva, sem dente e ranhuras transversais em toda a extensão interna de suas garras, muito utilizada para preensão de pedículos delicados ou tecidos finos, é conhecida como:",
    options: [
      "A) Pinça Kocher.",
      "B) Pinça Kelly.",
      "C) Pinça Backhaus.",
      "D) Pinça Cheron.",
      "E) Pinça Allis."
    ],
    correctIndex: 1,
    explanation: "A pinça Kelly possui ranhuras transversais que cobrem cerca de metade a dois terços de suas garras (enquanto a pinça Halsted-Mosquito é menor e a pinça Crile tem ranhuras em toda a garra, mas clinicamente a Kelly é a pinça clássica de hemostasia geral e preensão delicada de vasos sem trauma cortante)."
  },
  {
    id: "ins-5",
    course: "Especialização em Instrumentação Cirúrgica",
    theme: "Segurança e Normas Regulamentadoras",
    origin: "RDC 15 ANVISA - Esterilização de Produtos de Saúde",
    question: "Para o processamento e esterilização de materiais cirúrgicos termorresistentes no centro cirúrgico, o método físico de escolha padrão recomendado pela ANVISA devido a sua eficácia, segurança e custo-benefício é:",
    options: [
      "A) Calor seco em Estufa comercial de convecção.",
      "B) Vapor saturado sob pressão em Autoclave.",
      "C) Imersão química em Glutaraldeído a 2%.",
      "D) Exposição a gás Óxido de Etileno (ETO).",
      "E) Radiação gama ionizante cobalto-60."
    ],
    correctIndex: 1,
    explanation: "A esterilização por vapor saturado sob pressão em Autoclaves é o método físico mais seguro, econômico e eficiente para materiais termorresistentes (metal, tecido cirúrgico, silicone), agindo por desnaturação térmica rápida das proteínas celulares microbianas."
  },

  // --- ESPECIALIZAÇÃO EM ENFERMAGEM DO TRABALHO ---
  {
    id: "eft-1",
    course: "Especialização em Enfermagem do Trabalho",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "CESPE/Cebraspe - 2024 - Petrobras - Enfermeiro do Trabalho",
    question: "No âmbito do PCMSO (Norma Regulamentadora nº 7 - NR-7), cabe ao enfermeiro do trabalho ou médico coordenador emitir um documento de emissão obrigatória para cada exame médico ocupacional realizado pelo trabalhador. Esse documento chama-se:",
    options: [
      "A) CAT (Comunicação de Acidente de Trabalho).",
      "B) ASO (Atestado de Saúde Ocupacional).",
      "C) LTCAT (Laudo Técnico das Condições Ambientais).",
      "D) PPP (Perfil Profissiográfico Previdenciário).",
      "E) Ficha Médica Ocupacional Unificada."
    ],
    correctIndex: 1,
    explanation: "O ASO (Atestado de Saúde Ocupacional) é o documento emitido obrigatoriamente pelo médico do trabalho ou após exames supervisionados, detalhando se o trabalhador está apto ou inapto para a função, incluindo riscos ocupacionais da atividade e exames complementares realizados."
  },
  {
    id: "eft-2",
    course: "Especialização em Enfermagem do Trabalho",
    theme: "Segurança e Normas Regulamentadoras",
    origin: "FCC - 2023 - TRT - Enfermeiro do Trabalho",
    question: "A NR-4 estabelece as diretrizes para a criação e dimensionamento do SESMT (Serviço Especializado em Engenharia de Segurança e em Medicina do Trabalho). Dentre os profissionais que compõem obrigatoriamente o SESMT, dependendo do grau de risco e número de funcionários, constam:",
    options: [
      "A) Biomédico, Psicólogo Organizacional e Assistente Social.",
      "B) Médico do Trabalho, Engenheiro de Segurança do Trabalho, Técnico em Segurança do Trabalho, Enfermeiro do Trabalho e Auxiliar/Técnico em Enfermagem do Trabalho.",
      "C) Fisioterapeuta Laboral, Nutricionista e Educador Físico.",
      "D) Técnico em Radiologia, Odontólogo do Trabalho e Socorrista Noturno.",
      "E) Advogado Previdenciário, Técnico de Manutenção e Diretor de RH."
    ],
    correctIndex: 1,
    explanation: "O quadro regulamentar da NR-4 define que o SESMT é constituído exclusivamente por: Engenheiro de Segurança do Trabalho, Médico do Trabalho, Enfermeiro do Trabalho, Técnico de Segurança do Trabalho e Auxiliar ou Técnico de Enfermagem do Trabalho."
  },
  {
    id: "eft-3",
    course: "Especialização em Enfermagem do Trabalho",
    theme: "Procedimentos Técnicos & Práticas Clínicas",
    origin: "IBFC - 2023 - EBSERH - Enfermeiro do Trabalho",
    question: "Ao atender um colaborador que sofreu acidente com perfurocortante contendo vestígios de sangue de paciente-fonte desconhecido, qual é a conduta imediata recomendada pelas diretrizes de saúde do trabalhador do Ministério da Saúde?",
    options: [
      "A) Lavar o local exaustivamente com água e sabão (ou soro fisiológico) e encaminhar imediatamente para triagem de Profilaxia Pós-Exposição (PEP) contra HIV/Hepatites nas primeiras horas (preferencialmente até 2 horas).",
      "B) Espremer vigorosamente o local da punção para sangrar e aplicar álcool iodado concentrado por 15 minutos.",
      "C) Prescrever repouso domiciliar de 3 dias para observar se surgem sintomas febris.",
      "D) Solicitar imediatamente exames de biópsia hepática no colaborador acidentado.",
      "E) Encaminhar o material cortante utilizado para análise laboratorial de DNA microbiano."
    ],
    correctIndex: 0,
    explanation: "A conduta padrão pós-acidente com perfurocortantes biológicos é: 1. Higienizar a área com água e sabão (cuidados locais, não friccionar agressivamente para não aumentar microfissuras); 2. Iniciar a Profilaxia Pós-Exposição (PEP) idealmente em até 2 horas (e no máximo 72 horas) para garantir eficácia antiviral profilática contra HIV e Hepatite B."
  },
  {
    id: "eft-4",
    course: "Especialização em Enfermagem do Trabalho",
    theme: "Legislação do SUS & Ética Profissional",
    origin: "VUNESP - 2023 - Prefeitura de Campinas - Enfermeiro do Trabalho",
    question: "As Doenças Relacionadas ao Trabalho (DRT) são classificadas epidemiologicamente de acordo com a Classificação de Schilling. Aquela categoria de patologia em que o trabalho é considerado um FATOR DE RISCO CONTRIBUTIVO, MAS NÃO NECESSÁRIO (como Hipertensão Arterial Sistêmica, Varizes de membros inferiores, Coronariopatias e Doenças Mentais), pertence ao grupo de:",
    options: [
      "A) Schilling I.",
      "B) Schilling II.",
      "C) Schilling III.",
      "D) Schilling IV.",
      "E) Schilling Zero."
    ],
    correctIndex: 1,
    explanation: "A Classificação de Schilling divide as doenças em: Schilling I (Trabalho como causa necessária - Silicose, Saturnismo); Schilling II (Trabalho como fator contributivo, mas não necessário - Hipertensão, DORT, Doença Coronariana); Schilling III (Trabalho como provocador de distúrbio latente ou agravador de doença preexistente - Bronquite asmática, Dermatite de contato, Varizes)."
  },
  {
    id: "eft-5",
    course: "Especialização em Enfermagem do Trabalho",
    theme: "Anatomia & Fisiologia Humana",
    origin: "AOCP - 2022 - Tribunal Regional Eleitoral - Saúde do Trabalho",
    question: "No contexto da Ergonomia e da NR-17, as patologias ocupacionais mais frequentes que afetam o sistema musculoesquelético de digitadores e operadores de telemarketing, causando dor, inflamação nos tendões, fadiga muscular localizada e limitação articular de punhos/ombros, são chamadas de:",
    options: [
      "A) Doença Ocupacional Aguda de Impacto.",
      "B) LER/DORT (Lesões por Esforços Repetitivos / Distúrbios Osteomusculares Relacionados ao Trabalho).",
      "C) Fibromialgia Ocupacional Crônica.",
      "D) Neuropatia Diabética Laboral.",
      "E) Osteoartrite Generalizada Traumática."
    ],
    correctIndex: 1,
    explanation: "As LER/DORT (Lesões por Esforços Repetitivos / Distúrbios Osteomusculares Relacionados ao Trabalho) são as afecções mais comuns provocadas por movimentos repetitivos, posturas inadequadas mantidas por longos períodos, esforço físico vigoroso e ritmo de trabalho estressante, normatizados preventivamente pela NR-17."
  }
];
