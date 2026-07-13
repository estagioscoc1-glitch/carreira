import { User, ChatHistoryItem, ResumeData, InterviewSession, Message, KBDocument } from "./types";

// Helper for unique IDs
function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// Initial dummy books database
export const INITIAL_BOOKS = [
  {
    id: "b1",
    title: "Guia de Sobrevivência do Primeiro Emprego",
    category: "Primeiro Emprego" as const,
    description: "Manual completo e aprofundado para estudantes que buscam se destacar no primeiro emprego ou estágio técnico. Estratégias de adaptação, etiqueta corporativa e comunicação.",
    readingTime: "45 min (Conteúdo Completo)",
    gradient: "from-blue-600 to-indigo-700",
    content: `# Guia de Sobrevivência do Primeiro Emprego: Do Estágio Técnico ao Sucesso Profissional
*Desenvolvido pelo Núcleo de Carreiras do Lynx EDU Sistemas Escolares Inteligentes*

---

## Introdução: A Grande Transição Acadêmica-Profissional

Entrar no mercado de trabalho técnico representa um dos marcos de transição mais significativos na trajetória de qualquer estudante. A transição da sala de aula — um ambiente de aprendizado controlado, focado em avaliações e suporte pedagógico — para o ecossistema corporativo ou de serviços de saúde, onde a entrega de resultados, a responsabilidade legal e o trabalho sob pressão são rotinas, pode parecer assustadora. 

Este guia foi elaborado detalhadamente para dotar você, aluno ou egresso do Lynx EDU Sistemas Escolares Inteligentes, das ferramentas conceituais, comportamentais e táticas necessárias para se destacar desde o primeiro dia de seu estágio técnico ou primeiro emprego formal.

---

## Capítulo 1: Mudança de Mentalidade (Mindset) e Soft Skills Fundamentais

### 1.1 Do "Aluno" ao "Profissional"
Enquanto estudante, sua principal responsabilidade é absorver conhecimento e demonstrar essa absorção por meio de testes. No ambiente profissional, seu valor está diretamente associado à sua capacidade de **resolver problemas** e **agregar valor** aos processos da instituição.

*   **Proatividade versus Passividade:** Não espere que seu supervisor venha até você para determinar cada pequeno passo. Quando terminar uma tarefa, reporte a conclusão e pergunte de maneira educada: *"Professor/Supervisor, concluí a verificação dos leitos. Posso auxiliar na organização da triagem ou há outro protocolo que eu deva apoiar?"*
*   **Gestão de Erros:** Erros acontecem, especialmente no início da carreira. No entanto, a postura profissional diante do erro é o que diferencia os excelentes profissionais. Nunca tente ocultar uma falha (especialmente na área da saúde ou segurança, onde isso pode ter consequências críticas). Adote o protocolo: **Reportar imediatamente -> Propor uma correção imediata -> Documentar o aprendizado.**

### 1.2 Soft Skills Indispensáveis para o Sucesso Técnico
*   **Empatia e Atendimento Humanizado:** Essencial para técnicos em enfermagem, radiologia ou instrumentação cirúrgica. Lembre-se de que o paciente ou cliente está frequentemente em um momento de vulnerabilidade física ou emocional.
*   **Comunicação Assertiva:** Evite gírias, abreviações extremas e ruídos de comunicação. Use a técnica de *loop fechado* (repetir as instruções de volta ao emissor para garantir o entendimento correto: *"Entendido, enfermeira-chefe, devo aplicar o medicamento X no paciente do leito 3, correto?"*).

---

## Capítulo 2: Ética Profissional e Normas Regulamentadoras (Aprofundamento na NR-32)

No ambiente de saúde e técnico, a ética profissional e a segurança do trabalho caminham lado a lado. Compreender as legislações vigentes não é apenas um requisito para concursos, mas um dever diário de sobrevivência e proteção mútua.

### 2.1 A Importância Crítica da NR-32
A **Norma Regulamentadora 32 (NR-32)** tem por finalidade estabelecer as diretrizes básicas para a implementação de medidas de proteção à segurança e à saúde dos trabalhadores dos serviços de saúde.

*   **Adornos Zero (Princípio Fundamental):** É terminantemente proibido o uso de adornos (anéis, alianças, brincos, pulseiras, relógios de pulso, colares, piercings expostos) nos postos de trabalho por parte de todos os profissionais de saúde. Adornos acumulam patógenos difíceis de higienizar e representam risco biológico direto.
*   **Uso de Equipamentos de Proteção Individual (EPI):** O uso correto de luvas, máscaras (como a N95/PFF2 em isolamentos de aerossóis), óculos de proteção e jalecos (que nunca devem ser usados fora do ambiente de trabalho técnico) é obrigatório e inegociável.
*   **Descarte de Perfurocortantes:** Agulhas e ampolas devem ser descartadas exclusivamente em recipientes coletores rígidos (como a caixa de Descarpack) no local de sua geração, sendo estritamente proibido o reencape manual de agulhas.

---

## Capítulo 3: Comunicação Interpessoal, Feedback e Relacionamento em Equipe

### 3.1 A Arte de Receber Feedback
O feedback construtivo é o combustível para o seu crescimento acelerado. Muitos profissionais iniciantes recebem o feedback de forma defensiva ou pessoal.
*   **Postura de Escuta Ativa:** Ao receber uma crítica profissional, mantenha o contato visual, ouça até o final sem interromper, e diga: *"Agradeço o apontamento, supervisor. Vou revisar este fluxo e implementar a mudança a partir de agora."*
*   **Filtro Profissional:** Lembre-se de que o feedback é sobre o seu **trabalho/processo**, e não sobre o seu caráter ou valor como ser humano.

### 3.2 Navegando pelas Relações Interpessoais na Equipe Multidisciplinar
No hospital ou na empresa, você trabalhará com enfermeiros, médicos, técnicos de outras áreas, pessoal administrativo e de higiene. A regra de ouro é: **Respeito absoluto à hierarquia técnica e cordialidade irrestrita com todas as funções.**
*   Evite envolver-se em fofocas ou panelinhas corporativas.
*   Seja o profissional que foca nas soluções, não nos conflitos internos.

---

## Capítulo 4: Superando a Timidez e Construindo um Networking Autêntico

### 4.1 O Desafio da Timidez nos Primeiros Dias
Muitos estudantes do Lynx EDU Sistemas Escolares Inteligentes relatam travar ou sentir extrema timidez ao interagir com médicos, supervisores e pacientes.
*   **Técnica do Roteiro Prévio:** Antes de entrar em contato com um supervisor ou paciente, mentalize ou anote em um bloco as 3 frases principais que você precisa dizer.
*   **Linguagem Corporal Aberta:** Mantenha os ombros relaxados, coluna ereta e cabeça erguida. Uma postura assertiva envia sinais ao seu cérebro de que você está no controle.

### 4.2 Networking Ético no Estágio
Networking não é "pedir favores", mas sim construir relacionamentos profissionais de confiança mútua.
1.  **Destaque-se pela Competência:** O melhor networking é fazer o seu trabalho com maestria técnica e excelente atitude.
2.  **Demonstre Interesse Genuíno:** Converse com técnicos experientes nas horas de intervalo. Pergunte sobre a jornada deles: *"Profissional, como foi o seu início? Qual conselho você daria para quem está começando hoje?"*

---

## Capítulo 5: Aprendizado Contínuo e Adaptação Tecnológica

O mercado de trabalho atual exige atualização contínua. Equipamentos de radiologia atualizam-se com novos softwares, protocolos de enfermagem são revistos com base em evidências clínicas, e sistemas hospitalares eletrônicos são implementados constantemente.
*   **Mantenha um Diário Técnico:** Ao chegar em casa após o plantão ou jornada, anote os principais procedimentos realizados, termos que você não conhecia e dúvidas a pesquisar.
*   **Certificações de Curto Prazo:** Invista em cursos complementares de punção venosa, cálculo de medicamentos, suporte básico de vida (BLS) ou biossegurança. Isso valoriza o seu currículo e aumenta consideravelmente sua segurança prática.`,
  },
  {
    id: "b2",
    title: "Manual da Entrevista Perfeita",
    category: "Entrevistas" as const,
    description: "Guia prático para dominar dinâmicas de grupo, entrevistas de emprego e seleções técnicas em hospitais e clínicas. Aprenda a estruturar respostas com o Método STAR.",
    readingTime: "50 min (Conteúdo Completo)",
    gradient: "from-teal-500 to-emerald-600",
    content: `# Manual da Entrevista Perfeita: Conquistando sua Vaga na Área da Saúde e Tecnologia
*Desenvolvido pelo Núcleo de Simulações e Carreira do Lynx EDU Sistemas Escolares Inteligentes*

---

## Introdução: A Psicologia do Recrutador

Para vencer o nervosismo em uma entrevista, você precisa primeiro entender o que se passa na mente de quem está contratando. O recrutador de um hospital ou empresa de saúde tem três grandes dúvidas que precisam ser sanadas por você:
1.  **Você sabe fazer o trabalho?** (Competência Técnica)
2.  **Você quer fazer o trabalho de forma excelente?** (Motivação e Atitude)
3.  **Você se adapta à nossa cultura e à equipe?** (Soft Skills e Alinhamento Cultural)

Este manual completo vai estruturar toda a sua preparação passo a passo para que você entre na sala de entrevista seguro, sabendo exatamente como comunicar seu potencial técnico e comportamental.

---

## Capítulo 1: O Planejamento e a Preparação Pré-Entrevista

Cerca de 80% do sucesso em uma entrevista depende do que você faz **antes** de colocar os pés na empresa ou hospital.

### 1.1 Pesquisa de Campo Aprofundada
*   **A Instituição:** Pesquise sobre a história do hospital ou clínica. Quantos leitos possui? É referência em alguma especialidade? Qual é a missão e os valores declarados (ex: atendimento humanizado, segurança do paciente)?
*   **O Cargo:** Releia detalhadamente os requisitos da vaga. Se a vaga pede "experiência prática em exames radiológicos contrastados", prepare-se para detalhar como você estudou e praticou essa matéria nos laboratórios de ponta do Lynx EDU Sistemas Escolares Inteligentes.

### 1.2 Checklist de Apresentação Pessoal e Logística
*   **Vigilância de Dress Code:** Para a área da saúde e segurança do trabalho, preze por discrição extrema. Unhas limpas e curtas, cabelos presos (para evitar contaminações), maquiagem e perfumes discretos, roupas sóbrias (evite shorts, saias curtas, decotes ou roupas com marcas gigantescas de grife). Sapatos fechados são obrigatórios.
*   **Pontualidade Lynx EDU:** Calcule o trajeto para chegar exatamente **15 a 20 minutos antes** do horário marcado. Atraso em processo seletivo da saúde é um eliminador automático instantâneo, pois sugere irresponsabilidade no cumprimento de plantões.

---

## Capítulo 2: Dominando o Método STAR com Casos Práticos

Perguntas comportamentais (do tipo *"Me conte sobre uma situação difícil..."*) são o coração dos processos seletivos modernos. A melhor forma de respondê-las é através do **Método STAR**:

*   **S - Situação:** Contextualize o cenário de forma breve, explicando o desafio.
*   **T - Tarefa:** Explique qual era a sua responsabilidade direta naquele momento.
*   **A - Ação:** Descreva em detalhes as ações práticas e técnicas que VOCÊ adotou.
*   **R - Resultado:** Apresente os resultados tangíveis, aprendizados e conquistas geradas.

### 2.1 Exemplo Prático 1: Técnico em Enfermagem (Lidando com Paciente Difícil)
> *"**[Situação]** Durante meu estágio curricular supervisionado na ala geriátrica, atendi um paciente de 78 anos extremamente resistente à medicação prescrita, demonstrando agressividade verbal com a equipe de enfermagem. 
> **[Tarefa]** Como técnico responsável pelo plantão da tarde, minha tarefa era realizar a administração segura da medicação oral prescrita sem causar estresse ao paciente ou quebrar as regras de segurança.
> **[Ação]** Em vez de confrontá-lo, usei a escuta ativa para entender o motivo da resistência. Descobri que ele sentia náuseas ao tomar o comprimido em jejum. Expliquei de forma calma os benefícios do remédio, verifiquei com a enfermeira-chefe se poderíamos administrar junto com um pequeno lanche autorizado pela nutrição, e apresentei a ele essa alternativa humanizada.
> **[Resultado]** O paciente aceitou de imediato, manteve-se calmo e cooperativo durante todo o restante do meu estágio e a equipe adotou essa abordagem pacífica como padrão."*

### 2.2 Exemplo Prático 2: Técnico em Segurança do Trabalho (Identificação de Risco)
> *"**[Situação]** Durante as visitas técnicas práticas do curso no Lynx EDU Sistemas Escolares Inteligentes a um canteiro de obras parceiro, identifiquei que alguns operários estavam trabalhando em alturas superiores a 2 metros sem o talabarte do cinturão de segurança ancorado na linha de vida.
> **[Tarefa]** Minha obrigação ética como futuro técnico de segurança era alertar sobre a condição insegura iminente e propor uma abordagem corretiva sem gerar conflito com os trabalhadores.
> **[Ação]** Aproximei-me dos trabalhadores de forma educativa, e não punitiva. Relembrei a importância de retornar para suas famílias com segurança, mostrei o risco imediato de queda grave de acordo com a NR-35 e auxiliei-os pessoalmente a fazer o engate correto no ponto de ancoragem adequado.
> **[Resultado]** Os operários agradeceram o cuidado ativo, ancoraram-se imediatamente e o mestre de obras elogiou minha postura empática e focada na cultura de prevenção ativa."*

---

## Capítulo 3: Respondendo às Perguntas Mais Difíceis sem Medo

### 3.1 "Fale sobre você"
Esta é a pergunta de abertura mais comum. O erro é contar sua história de vida pessoal ou listar seu currículo inteiro. 
*   **Abordagem Correta (Fórmula do Pitch):** Fale sobre o seu **presente** (estudante dedicado no Lynx EDU Sistemas Escolares Inteligentes, curso X), conecte com seu **passado técnico** (projetos práticos desenvolvidos, estágios, feiras de saúde) e finalize com seu **futuro** (por que esta vaga específica é o próximo passo perfeito para você demonstrar seu potencial).

### 3.2 "Qual o seu maior ponto fraco?"
Evite clichês como *"sou perfeccionista demais"* ou *"trabalho muito"*. Os recrutadores detestam essas respostas porque parecem artificiais.
*   **Abordagem Correta (Fórmula da Evolução):** Cite um ponto fraco **real**, de preferência comportamental ou de processo simples, mas mostre imediatamente como você está trabalhando de forma ativa para corrigi-lo.
*   *Exemplo:* *"Antigamente, eu sentia muita timidez para falar em público ou apresentar relatórios para grandes equipes. Ciente disso, durante meu curso na Lynx EDU, me candidatei voluntariamente para liderar os seminários de saúde coletiva e baixei aplicativos de oratória. Hoje, já me sinto muito mais confiante e continuo evoluindo."*

---

## Capítulo 4: Comunicação Não-Verbal e Postura

Seu corpo fala antes mesmo de você abrir a boca. Elementos não-verbais podem transmitir insegurança ou arrogância se não forem polidos.

*   **O Aperto de Mão e Cumprimento:** Firme e acompanhado de um sorriso sincero e contato visual direto. Demonstra energia e prontidão.
*   **O Olhar:** Olhe nos olhos do entrevistador. Se houver mais de um entrevistador na mesa, distribua o olhar entre eles de forma equilibrada (cerca de 70% do tempo olhando para quem fez a pergunta e 30% para os demais).
*   **As Mãos:** Mantenha as mãos visíveis sobre a mesa. Evite braços cruzados (passa imagem de defensiva) ou ficar estalando os dedos ou batendo o pé (transmite ansiedade extrema). Use gestos suaves para enfatizar suas explicações de forma harmônica.

---

## Capítulo 5: Perguntas Inteligentes para Você Fazer ao Entrevistador

Ao final da entrevista, o recrutador quase sempre perguntará: *"Você tem alguma dúvida?"*. Responder *"Não, está tudo claro"* demonstra falta de interesse ou pouca curiosidade profissional.
Surpreenda positivamente fazendo uma ou duas destas perguntas inteligentes:
1.  *"Como é a rotina de treinamento continuado para a equipe de técnicos de enfermagem/radiologia aqui no hospital?"*
2.  *"Quais são as principais metas ou desafios que a instituição projeta para este setor de saúde no próximo ano?"*
3.  *"O que diferencia um estagiário ou técnico de sucesso absoluto aqui dentro daqueles que realizam apenas o básico?"*`,
  },
  {
    id: "b3",
    title: "Currículo de Alto Impacto",
    category: "Currículos" as const,
    description: "Técnicas avançadas de redação de currículo, seleção de palavras-chave para passar nos robôs ATS e modelos prontos para diferentes cursos técnicos.",
    readingTime: "40 min (Conteúdo Completo)",
    gradient: "from-purple-600 to-pink-600",
    content: `# Currículo de Alto Impacto: O Segredo para Passar pelos Robôs de Recrutamento (ATS)
*Guia de Redação Curricular Otimizada - Lynx EDU Sistemas Escolares Inteligentes*

---

## Introdução: O que são os Sistemas ATS e como eles Eliminam Currículos

Hoje em dia, grandes hospitais, clínicas e redes de saúde utilizam softwares conhecidos como **ATS (Applicant Tracking Systems)** para triar os currículos que recebem. Esses softwares atuam como robôs que varrem o arquivo do seu currículo em busca de palavras-chave, formação acadêmica e termos técnicos específicos relacionados à vaga. 

Se o seu currículo não contiver essas palavras-chave ou se possuir um design complexo (com tabelas, barras de nível de competência em estrelas, fotos sem necessidade ou gráficos), ele será descartado de forma automática antes mesmo de um ser humano lê-lo.

Este guia prático ensina você a estruturar um currículo profissional de altíssimo impacto, legível tanto para os robôs de recrutamento quanto para os olhos de recrutadores humanos experientes.

---

## Capítulo 1: A Anatomia Estrutural de um Currículo Perfeito

Um currículo profissional técnico deve ter, idealmente, **uma única página** (no máximo duas, caso possua muitos anos de experiência técnica relevante). Menos é mais! A estrutura deve seguir esta ordem linear lógica:

### 1.1 Dados de Contato (No topo)
*   **Nome Completo:** Em destaque (Fonte tamanho 16 ou 18, em negrito).
*   **Informações Essenciais:** Cidade e Estado, Celular com DDD, E-mail profissional (ex: \`lucas.silva@email.com\`, evite apelidos de infância) e link do seu perfil no LinkedIn.
*   **O que NÃO colocar:** RG, CPF, Carteira de Habilitação (a menos que solicitado pela vaga de motorista/móvel), foto (só coloque se o edital exigir expressamente), endereço completo com rua e número (por motivos de privacidade e segurança).

### 1.2 Objetivo Profissional (Direto e Específico)
Nunca coloque "à disposição da empresa" ou "auxiliar no que for preciso". Defina o cargo ou setor de forma clara.
*   *Correto:* **Objetivo: Técnico em Enfermagem / Estagiário de Enfermagem**
*   *Correto:* **Objetivo: Técnico em Radiologia - Setor de Tomografia e Raio-X**

### 1.3 Resumo Profissional (Seu Pitch de Vendas em 3 Frases)
Um texto curto, de 3 a 4 linhas, que resume quem você é tecnicamente.
*   *Exemplo:* *"Estudante do curso Técnico em Segurança do Trabalho no Lynx EDU Sistemas Escolares Inteligentes, com sólido conhecimento prático em mapeamento de riscos corporativos, elaboração de rotas de fuga e aplicação de treinamentos de NR-10 e NR-35. Experiência prática em laboratório com ferramentas de medição de ruído, iluminação e calor. Proativo, focado na cultura preventiva e atualizado com as novas legislações trabalhistas."*

---

## Capítulo 2: Formação Acadêmica e Projetos Escolares (O Grande Diferencial)

Como estudante ou recém-formado sem anos de experiência formal em CTPS, o seu grande diferencial está na forma como você descreve a sua formação e as atividades práticas realizadas nas dependências e laboratórios do Lynx EDU Sistemas Escolares Inteligentes.

### 2.1 Destacando o Lynx EDU Sistemas Escolares Inteligentes (Referência de Ensino)
*   Formação: **Técnico em Enfermagem**
*   Instituição: **Lynx EDU Sistemas Escolares Inteligentes - OC**
*   Conclusão prevista: **Dezembro de 2026**

### 2.2 Valorizando Projetos Práticos (Transformando Estudo em Experiência)
Substitua o campo "Não possuo experiência anterior" por uma seção chamada **"Projetos e Práticas Relevantes"**:
*   **Prática de Semiologia e Semiotécnica Hospitalar:** Realização de simulações práticas de verificação de sinais vitais, higiene e conforto, punção venosa periférica, passagem de sondas e cálculos complexos de dosagem de medicamentos em laboratório hospitalar simulado de alta fidelidade na Lynx EDU.
*   **Simulado Integrado de Atendimento de Urgência:** Atuação ativa na triagem, imobilização e protocolo de suporte básico de vida (SBV) em acidentes simulados sob supervisão docente, demonstrando excelente controle emocional e agilidade técnica.

---

## Capítulo 3: Habilidades e Competências (Palavras-Chave para o ATS)

As palavras-chave que você inclui nessa seção devem combinar conhecimentos técnicos específicos (**Hard Skills**) e atitudes profissionais (**Soft Skills**).

### 3.1 Exemplo de Palavras-Chave para Técnico em Enfermagem:
*   Sinais Vitais (SSVV)
*   Punção Venosa Periférica
*   Passagem de Sonda Vesical (SVD/SVA)
*   Curativos e Biossegurança
*   Administração de Medicamentos
*   Atendimento Humanizado
*   Diretrizes da NR-32

### 3.2 Exemplo de Palavras-Chave para Técnico em Radiologia:
*   Posicionamento Radiológico
*   Exames de Imagem Contrastados
*   Proteção Radiológica (Princípio ALARA)
*   Tomografia Computadorizada (TC)
*   Mamografia Digital
*   Ética Profissional e Biossegurança
*   Sistemas PACS e DICOM

---

## Capítulo 4: Modelos Práticos Prontos para Uso (Basta Adaptar)

Aqui está um esqueleto de texto perfeito e clean de currículo técnico para você copiar e adaptar:

\`\`\`text
[NOME COMPLETO]
[Cidade - UF] | [Telefone com DDD] | [E-mail Profissional] | [Link do LinkedIn]

OBJETIVO
Técnico em Enfermagem (ou insira seu curso correspondente)

RESUMO PROFISSIONAL
Estudante do curso Técnico em Enfermagem no Lynx EDU Sistemas Escolares Inteligentes, focado no atendimento humanizado, precisão nos cuidados técnicos e conformidade estrita com as normas de biossegurança (NR-32). Experiência em rotinas hospitalares simuladas em laboratório e forte habilidade de cooperação em equipes multidisciplinares. Em busca de oportunidade de estágio ou vaga efetiva para aplicar minha paixão pelo cuidar e dedicação técnica.

FORMAÇÃO ACADÊMICA
Curso Técnico em Enfermagem
Lynx EDU Sistemas Escolares Inteligentes (OC) - Conclusão prevista para [Mês/Ano]

PROJETOS E PRÁTICAS ACADÊMICAS
Práticas de Laboratório de Enfermagem (Lynx EDU Sistemas Escolares Inteligentes - [Ano])
• Administração e Cálculo de Medicamentos: Prática intensiva com dosagens, diluições, vias de administração e prevenção de erros vacinais.
• Sinais Vitais e Monitorização: Aferição e interpretação de pressão arterial, frequência cardíaca, oximetria e temperatura corporal em ambiente controlado.
• Curativos Avançados: Limpeza e aplicação de curativos de média complexidade utilizando técnica estéril adequada.

COMPETÊNCIAS TÉCNICAS E COMPORTAMENTAIS
• Punção venosa periférica e coleta de exames.
• Normas regulamentadoras e biossegurança de saúde (NR-32).
• Suporte Básico de Vida (SBV) e PCR simulada.
• Empatia, proatividade e excelente comunicação verbal.

CURSOS COMPLEMENTARES
• Curso de Punção Venosa Avançada e Coleta a Vácuo - 40 horas ([Ano])
• Suporte Básico de Vida (BLS) - 20 horas ([Ano])
• Informática Básica (Pacote Office completo)
\`\`\`
`,
  },
  {
    id: "b4",
    title: "Construindo um LinkedIn Campeão",
    category: "LinkedIn" as const,
    description: "Manual para transformar seu LinkedIn em um ímã de vagas e conexões profissionais na saúde. Otimização de perfil e estratégias de postagem.",
    readingTime: "42 min (Conteúdo Completo)",
    gradient: "from-blue-700 to-sky-600",
    content: `# Construindo um LinkedIn Campeão: O Guia Definitivo de Networking para Estudantes Técnicos
*Desenvolvido pela Coordenação de Comunicação e Empregabilidade - Lynx EDU Sistemas Escolares Inteligentes*

---

## Introdução: Por que o LinkedIn é Essencial para a Área Técnica e da Saúde

Existe um mito de que o LinkedIn serve apenas para profissionais de escritório, tecnologia corporativa ou diretores de multinacionais. Isso é um erro estratégico gravíssimo! 

Hoje, hospitais de ponta (como o Hospital Albert Einstein, Sírio-Libanês, redes de saúde privadas, laboratórios como Fleury, Dasa, e grandes prestadoras de serviços de Segurança do Trabalho) usam ativamente o LinkedIn para buscar novos talentos, estagiários e técnicos recém-formados.

Ter um perfil otimizado no LinkedIn significa ter uma **vitrine profissional aberta 24 horas por dia**, pronta para ser encontrada pelos olhos de recrutadores e gerentes de enfermagem/técnicos. Este guia vai te ensinar o passo a passo exato para deixar seu perfil impecável e iniciar um networking ativo e estratégico.

---

## Capítulo 1: Otimizando cada seção do perfil passo a passo

Os recrutadores gastam menos de 10 segundos ao bater o olho em um perfil antes de decidir se vão continuar lendo ou se vão fechar a página. Por isso, a parte visual e o topo do seu perfil devem estar perfeitos.

### 1.1 Foto de Perfil Profissional
Sua foto de perfil é seu primeiro contato visual. Ela deve transmitir **confiança** e **acessibilidade**.
*   **Iluminação e Enquadramento:** Use uma foto com boa iluminação natural, com enquadramento do peito para cima (retrato). O fundo deve ser preferencialmente neutro ou levemente desfocado.
*   **Expressão:** Sorria! Um sorriso leve transmite empatia, uma habilidade vital na área da saúde e segurança do trabalho.
*   **Vestimenta:** Use roupas discretas e adequadas à sua profissão técnica. Jaleco impecável (se aplicável à saúde) ou blusa social de cores neutras funcionam extremamente bem.
*   **O que EVITAR:** Selfies tiradas de cima para baixo no espelho do banheiro, fotos em festas com outras pessoas recortadas da imagem, óculos de sol ou filtros exagerados de redes sociais.

### 1.2 Banner ou Imagem de Capa
O banner fica logo atrás da sua foto. Substitua a imagem azul padrão do LinkedIn por algo que reforce sua área técnica de estudos.
*   *Exemplos de ideias:* Uma imagem em alta resolução de um laboratório de saúde limpo, equipamentos de radiologia, uma imagem abstrata representando o cuidar/saúde humana ou uma foto profissional do campus/fachada do Lynx EDU Sistemas Escolares Inteligentes.

### 1.3 O Título Profissional (Sua principal isca de buscas)
O maior erro de um estudante é colocar apenas "Estudante" ou "Desempregado" no título profissional. O título deve conter as **palavras-chave** do cargo que você quer ocupar.
*   *Ruim:* "Estudante na Lynx EDU" ou "Em busca de transição de carreira"
*   *Excelente:* **Estudante Técnico em Enfermagem | Lynx EDU Sistemas Escolares Inteligentes | Buscando Estágio ou Vaga Efetiva**
*   *Excelente:* **Técnico em Segurança do Trabalho | Segurança Industrial | Normas Regulamentadoras (NRs) | Lynx EDU Sistemas Escolares Inteligentes**

---

## Capítulo 2: Como Escrever uma Seção "Sobre" Irresistível e Humanizada

A seção "Sobre" (antigo resumo) é onde você conta a sua história profissional de forma pessoal, envolvente e focada em objetivos. Escreva sempre em **primeira pessoa do singular (Eu)**.

### 2.1 A Fórmula Perfeita de Redação do "Sobre":
1.  **Apresentação & Paixão pela Área:** *"Sou estudante apaixonado pela saúde e pelo cuidado humanizado, atualmente me capacitando no curso Técnico em Enfermagem do tradicional Lynx EDU Sistemas Escolares Inteligentes..."*
2.  **Destaques de Aprendizado Técnico:** *"Durante minha jornada acadêmica, venho desenvolvendo sólida base prática em simulações realísticas de sinais vitais, punção venosa, curativos, administração farmacológica e aplicação rigorosa da biossegurança e diretrizes da NR-32..."*
3.  **Projetos e Postura Interpessoal:** *"Trabalho muito bem sob pressão, possuo forte espírito colaborativo para atuar em equipes multidisciplinares de saúde e sou focado no atendimento acolhedor aos pacientes e seus familiares..."*
4.  **Chamada para Ação (Call to Action):** *"Estou aberto a conexões profissionais, oportunidades de estágio técnico ou posições iniciais. Sinta-se à vontade para me enviar uma mensagem aqui no LinkedIn ou pelo e-mail: meu.email@email.com."*

---

## Capítulo 3: Produzindo Conteúdo e Engajando para Ganhar Visibilidade

Não basta criar o perfil e sumir da plataforma. Para ser visto, você precisa interagir e gerar pequenos conteúdos que provem sua paixão pelo estudo.

### 3.1 Compartilhe sua Jornada de Estudos
*   Tirou uma foto elegante do laboratório de enfermagem ou radiologia do Lynx EDU Sistemas Escolares Inteligentes durante uma aula prática de curativos ou posicionamento? Poste!
*   *Escreva uma legenda simples:* *"Hoje tivemos uma aula prática fantástica no Lynx EDU Sistemas Escolares Inteligentes sobre técnicas avançadas de posicionamento para exames contrastados com o professor X. Reforçar o posicionamento correto é fundamental não apenas para a qualidade da imagem, mas principalmente para garantir a segurança e o conforto do paciente seguindo o princípio ALARA de proteção radiológica. Seguimos evoluindo!"*
*   Isso prova para os recrutadores que você é um estudante ativo, engajado e que ama o que estuda.

### 3.2 Engajamento Estratégico em Postagens de Terceiros
*   Siga hospitais locais e empresas de segurança do trabalho do seu interesse.
*   Siga chefias de enfermagem, coordenadores de radiologia e profissionais de SESMT seniores.
*   Quando eles postarem algo relevante sobre saúde ou legislação, comente de forma educada e enriquecedora: *"Excelente postagem, profissional! A biossegurança e o treinamento constante da equipe técnica são fundamentais para reduzir os índices de contaminação e acidentes hospitalares. Parabéns pela reflexão!"*

---

## Capítulo 4: Buscando Vagas com Filtros Avançados do LinkedIn

O LinkedIn possui ferramentas de busca extremamente poderosas para você encontrar vagas ocultas que não aparecem nas plataformas comuns.
1.  **Alinhamento de Filtros:** Vá na barra de pesquisa e digite "Estágio Enfermagem" ou "Técnico Segurança do Trabalho". Filtre por "Vagas" e defina o local como sua cidade de preferência.
2.  **Alerta de Vagas:** Ative o botão "Receber alertas de vagas" com os termos desejados para receber notificações no seu e-mail ou celular assim que uma vaga nova for aberta por um recrutador.`,
  },
  {
    id: "b5",
    title: "Planejamento de Carreira e Hard Skills",
    category: "Carreira" as const,
    description: "Método completo para planejar seus próximos 5 anos, equilibrar soft e hard skills e manter-se atualizado com as demandas da saúde digital e hospitalar.",
    readingTime: "45 min (Conteúdo Completo)",
    gradient: "from-amber-500 to-orange-600",
    content: `# Planejamento de Carreira de Longo Prazo e Habilidades Técnicas (Hard Skills)
*Manual de Direcionamento Profissional para Alunos do Lynx EDU Sistemas Escolares Inteligentes*

---

## Introdução: O Mercado de Trabalho Técnico Dinâmico e Desafiador

O mercado de trabalho para técnicos em saúde, radiologia, enfermagem e segurança do trabalho está passando por transformações profundas nas últimas décadas. A incorporação de prontuários eletrônicos de saúde inteligentes, softwares avançados de imagem diagnóstica, inteligência artificial auxiliando no mapeamento de riscos corporativos e a exigência por profissionais cada vez mais integrados e versáteis mudaram as regras do jogo.

Para construir uma carreira sólida, sustentável e bem remunerada, você não pode depender apenas da sorte. É vital estabelecer um **Planejamento de Carreira Estratégico** e identificar quais habilidades técnicas (**Hard Skills**) e comportamentais (**Soft Skills**) são mais escassas e valorizadas pelas empresas e hospitais atualmente.

---

## Capítulo 1: O Método de Planejamento Estratégico Pessoal (As Metas SMART)

Saber para onde você quer ir é o primeiro passo para garantir que você não perderá tempo com cursos inúteis ou escolhas profissionais aleatórias.

### 1.1 Metas SMART para sua Carreira Técnica
Sempre que definir um objetivo profissional, certifique-se de estruturá-lo de forma **SMART (Specific, Measurable, Achievable, Relevant, Time-bound)**:

*   **S - Específica:** O que exatamente você quer alcançar? (ex: Obter vaga de técnico em UTI neonatal).
*   **M - Mensurável:** Como você medirá que atingiu a meta? (ex: Assinar o contrato de trabalho formal ou ser aprovado em 1º lugar no processo seletivo).
*   **A - Atingível:** É uma meta realista de acordo com seu momento atual de formação? (ex: Sim, pois vou me formar técnico em Enfermagem este ano).
*   **R - Relevante:** Como isso se alinha com seu propósito e futuro profissional de longo prazo? (ex: Trabalhar em UTI neonatal é meu grande sonho e oferece ótima remuneração técnica).
*   **T - Temporal:** Qual é o prazo limite para concluir essa meta? (ex: Até dezembro do próximo ano).

### 1.2 Exemplo de Planejamento de Metas de Carreira:
*   **Curto Prazo (Próximos 6 a 12 meses):** Concluir o curso técnico na Lynx EDU com média geral superior a 8.5 e garantir uma vaga de estágio supervisionado em um hospital geral de grande porte. Realizar curso extracurricular de Punção Venosa Avançada.
*   **Médio Prazo (Próximos 2 a 3 anos):** Conquistar a efetivação profissional como Técnico de Enfermagem Pleno, focar nos cuidados de terapia intensiva (UTI) e iniciar curso de Especialização Técnica em Enfermagem em Terapia Intensiva ou Instrumentação Cirúrgica.
*   **Longo Prazo (Próximos 5 anos):** Consolidar-se como profissional de referência técnica no setor hospitalar, iniciar graduação acadêmica em Enfermagem de forma planejada e galgar cargo de coordenação técnica ou liderança de plantão.

---

## Capítulo 2: Identificando as Hard Skills Mais Demandadas

Hard skills são as habilidades técnicas, mensuráveis e testáveis que você aprende na sala de aula, nos laboratórios e em certificações específicas.

### 2.1 Habilidades Técnicas Premium para a Saúde (Técnico em Enfermagem)
*   **Gasometria Arterial e Punção de Acesso Venoso Difícil:** Técnicos que dominam a punção segura de veias de difícil acesso por fragilidade capilar são extremamente cobiçados em UTIs e Prontos-Socorros.
*   **Cálculo Farmacológico de Alta Complexidade:** O domínio impecável das contas de gotejamento de soro, dosagem pediátrica e diluição de antibióticos previne erros críticos e salva vidas cotidianamente.
*   **Operação de Prontuários Eletrônicos (Tasy, MV, SoulMV):** Conhecer as principais interfaces de sistemas hospitalares agiliza sua adaptação ao fluxo diário do hospital em 200%.

### 2.2 Habilidades Técnicas Premium para a Radiologia (Técnico em Radiologia)
*   **Reconstrução Tridimensional de Imagem Diagnóstica:** Saber manipular softwares de processamento digital para gerar renderizações 3D de exames anatômicos.
*   **Proteção de Fontes de Radiação e Normas do CNEN:** Domínio absoluto das portarias e legislações de proteção para diminuir a dose de radiação ambiental e técnica do setor de diagnóstico por imagem.

---

## Capítulo 3: Habilidades Comportamentais (Soft Skills) no Ambiente de Plantão

Nenhum profissional sobrevive no mercado de trabalho técnico apenas com conhecimentos de livros. O ambiente de trabalho em saúde é caracterizado por longas jornadas, estresse e constante interação humana.

### 3.1 Gestão de Crises e Inteligência Emocional
*   Em um hospital, você lidará diariamente com dor física, perdas humanas e familiares em pânico. Manter o equilíbrio emocional, a calma e a empatia é fundamental para tomar decisões técnicas seguras.
*   **Técnica de Descompressão Mental:** Desenvolva hobbies, pratique esportes e tenha momentos de lazer fora da jornada hospitalar para evitar o esgotamento profissional (Síndrome de Burnout).

### 3.2 Trabalho em Equipe e Cooperação Ativa
*   Na área da saúde, ninguém trabalha sozinho. O técnico depende da prescrição médica, da supervisão do enfermeiro, do apoio do fisioterapeuta e do setor de farmácia. 
*   Seja o profissional que simplifica o trabalho dos seus colegas, sendo transparente nas passagens de plantão técnico e reportando precisamente as alterações dos pacientes.

---

## Capítulo 4: A Importância dos Cursos Complementares e Certificações

O diploma do curso técnico é o seu passaporte de entrada, mas são as **certificações complementares** que vão te destacar na pilha de currículos dos recrutadores.

### 4.1 Certificações Recomendadas para turbinar o seu perfil:
1.  **Suporte Avançado de Vida em Cardiologia (ACLS) ou Suporte Básico (BLS):** Certificação internacional crucial para técnicos que querem trabalhar em salas de emergência ou UTI de hospitais.
2.  **Curso de Coleta de Sangue a Vácuo:** Indispensável para quem quer trabalhar em grandes laboratórios de análises clínicas como Fleury, Sabin ou Delboni.
3.  **Biossegurança Hospitalar e NR-32 Avançada:** Demonstra domínio das melhores práticas de prevenção e proteção do trabalhador de saúde.`,
  }
];

export class LocalDB {
  // Get all registered users from local storage
  private static getUsers(): any[] {
    const data = localStorage.getItem("oc_users");
    return data ? JSON.parse(data) : [];
  }

  // Save users array to local storage
  private static saveUsers(users: any[]): void {
    localStorage.setItem("oc_users", JSON.stringify(users));
  }

  // Get active session
  public static getSessionUser(): User | null {
    const data = localStorage.getItem("oc_active_session");
    return data ? JSON.parse(data) : null;
  }

  // Set active session
  public static setSessionUser(user: User | null): void {
    if (user) {
      localStorage.setItem("oc_active_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("oc_active_session");
    }
  }

  // Sign Up a new user
  public static signUp(name: string, email: string, course: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    
    // Check if email already registered
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }

    const newUser: any = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      course,
      password, // Simple password storage for mockup purposes
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    this.setSessionUser(userWithoutPassword);
    
    return { success: true, message: "Cadastro realizado com sucesso!", user: userWithoutPassword };
  }

  // Sign In existing user
  public static signIn(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: "Usuário não encontrado." };
    }

    if (user.password !== password) {
      return { success: false, message: "Senha incorreta." };
    }

    const { password: _, ...userWithoutPassword } = user;
    this.setSessionUser(userWithoutPassword);

    return { success: true, message: "Login realizado com sucesso!", user: userWithoutPassword };
  }

  // Reset password simulation
  public static requestPasswordReset(email: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: "E-mail não cadastrado." };
    }

    // In a real environment, this would send an email. Here we simulate it.
    localStorage.setItem("reset_pending_email", email.toLowerCase());
    return { success: true, message: "Código de redefinição enviado para o seu e-mail!" };
  }

  // Set new password
  public static resetPassword(password: string): { success: boolean; message: string } {
    const email = localStorage.getItem("reset_pending_email");
    if (!email) {
      return { success: false, message: "Nenhum fluxo de redefinição de senha pendente." };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email);

    if (userIndex === -1) {
      return { success: false, message: "Usuário correspondente não encontrado." };
    }

    users[userIndex].password = password;
    this.saveUsers(users);
    
    // Auto login
    const { password: _, ...userWithoutPassword } = users[userIndex];
    this.setSessionUser(userWithoutPassword);
    localStorage.removeItem("reset_pending_email");

    return { success: true, message: "Senha atualizada com sucesso!" };
  }

  // Update User Profile
  public static updateProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      this.setSessionUser(userWithoutPassword);
      return userWithoutPassword;
    }

    // Fallback if user is guest or not in list
    const active = this.getSessionUser();
    if (active && active.id === userId) {
      const updated = { ...active, ...updates };
      this.setSessionUser(updated);
      return updated;
    }

    throw new Error("Usuário não encontrado.");
  }

  // Calculate Profile Completion %
  public static getProfileCompletion(user: User): number {
    const fields = [
      user.name,
      user.email,
      user.course,
      user.phone,
      user.city,
      user.objective,
      user.skills,
      user.courses,
      user.experience,
      user.languages
    ];
    const filled = fields.filter(f => f && f.toString().trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }

  // ---------------- CHAT HISTORY PERSISTENCE ----------------
  public static getChats(userId: string): ChatHistoryItem[] {
    const data = localStorage.getItem(`chats_${userId}`);
    if (!data) {
      // Create initial chat
      const initialChat: ChatHistoryItem = {
        id: "default_chat",
        title: "Orientação de Carreira",
        messages: [
          {
            id: "m_init",
            role: "assistant",
            text: "Olá! Sou seu Assistente de Carreira. Posso ajudar com currículo, entrevistas, mercado de trabalho e planejamento profissional.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        updatedAt: new Date().toISOString()
      };
      this.saveChats(userId, [initialChat]);
      return [initialChat];
    }
    return JSON.parse(data);
  }

  public static saveChats(userId: string, chats: ChatHistoryItem[]): void {
    localStorage.setItem(`chats_${userId}`, JSON.stringify(chats));
  }

  public static addMessageToChat(userId: string, chatId: string, message: Omit<Message, 'id' | 'timestamp'>): ChatHistoryItem[] {
    const chats = this.getChats(userId);
    const chatIndex = chats.findIndex(c => c.id === chatId);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullMessage: Message = {
      ...message,
      id: generateId(),
      timestamp
    };

    if (chatIndex !== -1) {
      chats[chatIndex].messages.push(fullMessage);
      chats[chatIndex].updatedAt = new Date().toISOString();
      // Update title based on first user message if title is default or short
      if (chats[chatIndex].title === "Orientação de Carreira" && message.role === "user") {
        chats[chatIndex].title = message.text.slice(0, 25) + (message.text.length > 25 ? "..." : "");
      }
    } else {
      // Create new chat
      const newChat: ChatHistoryItem = {
        id: chatId,
        title: message.role === "user" ? (message.text.slice(0, 25) + (message.text.length > 25 ? "..." : "")) : "Conversa de Carreira",
        messages: [fullMessage],
        updatedAt: new Date().toISOString()
      };
      chats.unshift(newChat);
    }

    this.saveChats(userId, chats);
    return chats;
  }

  public static deleteChat(userId: string, chatId: string): ChatHistoryItem[] {
    const chats = this.getChats(userId);
    const filtered = chats.filter(c => c.id !== chatId);
    this.saveChats(userId, filtered);
    return filtered;
  }

  public static createNewChat(userId: string): ChatHistoryItem {
    const chats = this.getChats(userId);
    const newChat: ChatHistoryItem = {
      id: generateId(),
      title: "Nova Conversa",
      messages: [
        {
          id: generateId(),
          role: "assistant",
          text: "Olá! Sou seu Assistente de Carreira. Posso ajudar com currículo, entrevistas, mercado de trabalho e planejamento profissional.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      updatedAt: new Date().toISOString()
    };
    chats.unshift(newChat);
    this.saveChats(userId, chats);
    return newChat;
  }

  // ---------------- RESUME PERSISTENCE ----------------
  public static getSavedResume(userId: string): ResumeData | null {
    const data = localStorage.getItem(`resume_${userId}`);
    return data ? JSON.parse(data) : null;
  }

  public static saveResume(userId: string, resume: ResumeData): void {
    localStorage.setItem(`resume_${userId}`, JSON.stringify(resume));
  }

  // ---------------- INTERVIEW SESSIONS PERSISTENCE ----------------
  public static getInterviewHistory(userId: string): InterviewSession[] {
    const data = localStorage.getItem(`interviews_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  public static saveInterviewHistory(userId: string, sessions: InterviewSession[]): void {
    localStorage.setItem(`interviews_${userId}`, JSON.stringify(sessions));
  }

  public static saveInterviewSession(userId: string, session: InterviewSession): void {
    const history = this.getInterviewHistory(userId);
    const index = history.findIndex(s => s.id === session.id);
    if (index !== -1) {
      history[index] = session;
    } else {
      history.unshift(session);
    }
    this.saveInterviewHistory(userId, history);
  }

  // ---------------- KNOWLEDGE BASE (KB) PERSISTENCE ----------------
  public static getKBDocuments(userId: string): KBDocument[] {
    const data = localStorage.getItem(`kb_docs_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  public static saveKBDocuments(userId: string, docs: KBDocument[]): void {
    localStorage.setItem(`kb_docs_${userId}`, JSON.stringify(docs));
  }

  public static addKBDocument(userId: string, doc: KBDocument): KBDocument[] {
    const docs = this.getKBDocuments(userId);
    docs.unshift(doc);
    this.saveKBDocuments(userId, docs);
    return docs;
  }

  public static deleteKBDocument(userId: string, docId: string): KBDocument[] {
    const docs = this.getKBDocuments(userId);
    const filtered = docs.filter(d => d.id !== docId);
    this.saveKBDocuments(userId, filtered);
    return filtered;
  }

  // ---------------- OC SCORE ENGINE ----------------
  public static getOCScore(user: User): {
    score: number;
    profilePoints: number;
    resumePoints: number;
    interviewPoints: number;
    level: "Iniciante" | "Intermediário" | "Avançado" | "Pronto para o Mercado";
    tips: string[];
  } {
    // 1. Profile Completion Points (Max 300)
    const profilePercent = this.getProfileCompletion(user);
    const profilePoints = Math.round((profilePercent / 100) * 300);

    // 2. Resume points (Max 300)
    let resumePoints = 0;
    const resume = this.getSavedResume(user.id);
    if (resume || user.objective || user.skills) {
      // Base score for entering details
      resumePoints += 150;
      if (user.courses || (resume && resume.courses)) resumePoints += 50;
      if (user.experience || (resume && resume.experience)) resumePoints += 50;
      if (resume && resume.summary) resumePoints += 50; // Optimized bonus!
    }

    // 3. Interview Points (Max 400)
    let interviewPoints = 0;
    const interviews = this.getInterviewHistory(user.id);
    const completedInterviews = interviews.filter(i => i.completed);
    if (completedInterviews.length > 0) {
      // Get average score from completed questions
      let totalScores = 0;
      let qCount = 0;
      completedInterviews.forEach(session => {
        session.questions.forEach(q => {
          if (q.evaluation) {
            totalScores += q.evaluation.score;
            qCount++;
          }
        });
      });
      const avgScore = qCount > 0 ? totalScores / qCount : 0;
      interviewPoints = Math.round((avgScore / 100) * 400);
    }

    const totalScore = profilePoints + resumePoints + interviewPoints;

    let level: "Iniciante" | "Intermediário" | "Avançado" | "Pronto para o Mercado" = "Iniciante";
    if (totalScore >= 850) {
      level = "Pronto para o Mercado";
    } else if (totalScore >= 650) {
      level = "Avançado";
    } else if (totalScore >= 400) {
      level = "Intermediário";
    }

    // Generate smart tips
    const tips: string[] = [];
    if (profilePercent < 100) {
      tips.push("📝 Preencha 100% do seu perfil profissional para resgatar até 300 pontos de OC Score.");
    }
    if (!resume || !resume.summary) {
      tips.push("✨ Use a Inteligência Artificial para otimizar seu currículo e ganhar o bônus de currículo estruturado (+50 pontos).");
    }
    if (completedInterviews.length === 0) {
      tips.push("🎯 Faça sua primeira Simulação de Entrevista IA para testar sua oratória e liberar até 400 pontos!");
    } else if (interviewPoints < 320) {
      tips.push("🔄 Refaça a simulação de entrevista focado em dar respostas mais ricas e completas para subir sua nota média.");
    }
    if (this.getKBDocuments(user.id).length === 0) {
      tips.push("📚 Suba um PDF ou notas de estudo no Centro de Conhecimento IA para turbinar seu aprendizado.");
    }

    // Default tip if everything is great
    if (tips.length === 0) {
      tips.push("🚀 Parabéns! Seu OC Score está excelente. Você está pronto para os processos seletivos do Colégio!");
    }

    return {
      score: totalScore,
      profilePoints,
      resumePoints,
      interviewPoints,
      level,
      tips
    };
  }
}
