export interface Hotspot {
  id: string;
  title: string;
  text: string;
}

export interface CaseStudy {
  title: string;
  text: string;
}

export interface ModuleContent {
  hotspots: Hotspot[];
  caseStudy: CaseStudy;
}

// Complete realistic content mapping for all 6 courses x 6 modules
const CONTENT_MAP: Record<string, Record<number, ModuleContent>> = {
  "lms-c1": {
    0: {
      hotspots: [
        { id: "h1", title: "Identificadores Recomendados", text: "Utilize nome completo e data de nascimento. Nunca use o número do quarto, enfermaria ou leito do paciente para identificar." },
        { id: "h2", title: "Momento Crítico da Checagem", text: "Sempre verifique a pulseira do paciente antes de administrar medicamentos, coletar exames, transfundir sangue ou realizar procedimentos." },
        { id: "h3", title: "Envolvimento Ativo do Paciente", text: "Peça ao paciente para verbalizar seu próprio nome completo e data de nascimento se ele estiver consciente e orientado." }
      ],
      caseStudy: {
        title: "Cenário de Dupla Checagem na Enfermaria",
        text: "No início do plantão, o técnico de enfermagem nota que há dois pacientes com o nome 'José Silva' na mesma enfermaria. Ao invés de confiar na posição do leito, ele realiza a dupla checagem conferindo a pulseira e a data de nascimento no prontuário de cada um, evitando um erro gravíssimo de infusão."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Leitura e Retorno (Read-back)", text: "Para ordens verbais de emergência, anote a prescrição, leia-a de volta para quem a prescreveu e peça confirmação verbal expressa." },
        { id: "h2", title: "Transição de Plantão Estruturada", text: "Utilize ferramentas de comunicação padronizadas como o protocolo SBAR (Situação, Background, Avaliação e Recomendação)." },
        { id: "h3", title: "Resultados Críticos de Exame", text: "Laboratórios de diagnóstico devem reportar resultados de exames em faixas críticas diretamente e de imediato para a equipe assistencial." }
      ],
      caseStudy: {
        title: "Comunicação Eficiente em Situação de Emergência",
        text: "Durante um plantão agitado na UTI, um médico solicita verbalmente a administração imediata de uma dosagem de eletrólitos. O técnico anota o valor, repete em voz alta: 'Confirmando, 10ml de Gluconato de Cálcio 10%, correto?', recebendo o 'Sim, correto!' do médico antes de aspirar o medicamento."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Dupla Checagem Obrigatória", text: "Dois profissionais de enfermagem qualificados devem validar a dosagem e taxa de infusão de medicamentos de alta vigilância." },
        { id: "h2", title: "Identificação Especial de Alerta", text: "Medicamentos como insulina, heparina, quimioterápicos e eletrólitos concentrados devem possuir etiquetas de alerta visual colorido." },
        { id: "h3", title: "Armazenamento sob Chave", text: "Eletrólitos concentrados (como KCl 19,2%) devem ser mantidos em locais de acesso controlado, nunca dispersos nas enfermarias." }
      ],
      caseStudy: {
        title: "Evitando Superdosagem de Insulina na Pediatria",
        text: "Um paciente necessita de infusão contínua de Insulina Regular. A técnica de enfermagem prepara a dose e solicita que o enfermeiro do setor realize a dupla checagem na bomba de infusão. Ambos assinam a prescrição física/eletrônica, garantindo a dose precisa e segura."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Demarcação de Lateralidade", text: "O cirurgião responsável deve demarcar fisicamente o sítio cirúrgico enquanto o paciente está acordado e antes do encaminhamento ao bloco." },
        { id: "h2", title: "Checklist de 3 Etapas da OMS", text: "Realize a conferência obrigatória no Sign-In (antes da anestesia), Time-Out (imediatamente antes do corte) e Sign-Out (antes de sair da sala)." },
        { id: "h3", title: "Verificação de Mesa Estéril", text: "Confirmação da esterilidade dos instrumentais cirúrgicos e integridade de caixas cirúrgicas pelo instrumentador e circulante." }
      ],
      caseStudy: {
        title: "Time-Out no Bloco de Ortopedia",
        text: "Antes de realizar uma artropastia de joelho, o cirurgião assinala com marcador cirúrgico o joelho esquerdo. Na sala de cirurgia, durante o 'Time-Out', a equipe inteira interrompe o que está fazendo para confirmar em voz alta o nome do paciente, o procedimento e a lateralidade esquerda correta."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Os 5 Momentos de Higiene", text: "1. Antes do contato; 2. Antes de procedimento limpo; 3. Após risco de fluidos; 4. Após contato com o paciente; 5. Após tocar o entorno do leito." },
        { id: "h2", title: "Fricção Antisséptica com Álcool", text: "A fricção com álcool gel 70% deve durar de 20 a 30 segundos, cobrindo todas as faces das mãos, unhas e punhos." },
        { id: "h3", title: "Água e Sabão Líquido", text: "Lave as mãos com sabonete líquido e água quando as mãos estiverem visivelmente sujas ou após exposição a patógenos esporulados." }
      ],
      caseStudy: {
        title: "Barreira de Infecção na Troca de Acesso Venoso",
        text: "O enfermeiro entra no quarto para trocar o curativo de um paciente. Ele higieniza as mãos com álcool gel antes de tocar o paciente, realiza o procedimento estéril, limpa as mãos novamente após o risco de fluidos e uma última vez antes de sair do quarto, protegendo a si e a toda a ala."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Grades de Proteção Elevadas", text: "Mantenha sempre as grades da cama e maca elevadas e as rodas dos equipamentos devidamente travadas para evitar deslocamento involuntário." },
        { id: "h2", title: "Mudança de Decúbito Sistemática", text: "Realize o reposicionamento de pacientes acamados a cada 2 horas para aliviar a compressão tecidual e evitar isquemia local." },
        { id: "h3", title: "Escalas de Braden e Morse", text: "Use a escala de Morse para classificar o risco de quedas e a escala de Braden para avaliar e mitigar o risco de lesão por pressão (LPP)." }
      ],
      caseStudy: {
        title: "Aplicação do Protocolo de Prevenção de Quedas",
        text: "Uma idosa debilitada é classificada como Alto Risco na Escala de Morse. O técnico de enfermagem coloca uma pulseira amarela de identificação de risco de queda, orienta a família sobre o repouso no leito, mantém as grades erguidas e agenda a mudança de decúbito a cada 2 horas no prontuário eletrônico."
      }
    }
  },
  "lms-c2": {
    0: {
      hotspots: [
        { id: "h1", title: "Direitos e Obrigações", text: "A NR-32 estabelece que o empregador deve fornecer EPIs, vacinação gratuita e exames, enquanto o trabalhador tem o dever de seguir os POPs de segurança." },
        { id: "h2", title: "Abrangência das Normas", text: "Aplica-se a qualquer edificação destinada à prestação de assistência à saúde em todos os níveis de complexidade (hospital, clínicas, laboratórios)." },
        { id: "h3", title: "Zelo Preventivo de Acidentes", text: "Exige análise sistemática de acidentes de trabalho com materiais de risco biológico para propor ações corretivas imediatas." }
      ],
      caseStudy: {
        title: "Onboarding sobre Biossegurança Ocupacional",
        text: "No primeiro dia de treinamento prático no hospital, a coordenação de segurança apresenta aos técnicos as proibições da NR-32, incluindo o consumo de alimentos em postos de trabalho e o uso inadequado de jalecos fora da área assistencial."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Imunização Gratuita Completa", text: "O hospital deve fornecer gratuitamente vacinas contra Hepatite B, Tétano, Difteria, Influenza, Tríplice Viral e outras necessárias." },
        { id: "h2", title: "Prontuário de Vacinação Ocupacional", text: "Manutenção obrigatória do registro vacinal atualizado de todos os colaboradores sob risco de exposição biológica direta." },
        { id: "h3", title: "Notificação Imediata (CAT)", text: "Qualquer exposição acidental a fluidos biológicos exige notificação imediata à chefia e emissão da Comunicação de Acidente de Trabalho em 24h." }
      ],
      caseStudy: {
        title: "Bloqueio Imunológico de Colaborador",
        text: "Uma nova técnica é admitida para a UTI adulta. No exame admissional de saúde ocupacional, detecta-se que seu esquema vacinal para hepatite B está incompleto. O hospital agenda as doses pendentes no próprio ambulatório ocupacional antes do início de seus plantões."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Reencape Manual Expressamente Proibido", text: "É terminantemente proibido reencapar agulhas usadas manualmente ou desconectá-las das seringas utilizando as próprias mãos." },
        { id: "h2", title: "Descarte Limite de 2/3", text: "As caixas coletoras amarelas de papelão rígido para perfurocortantes devem ser fechadas e substituídas ao atingirem 2/3 de sua capacidade." },
        { id: "h3", title: "Regra do Adorno Zero", text: "É proibido o uso de alianças, anéis, pulseiras, relógios de pulso, brincos grandes e colares no posto assistencial devido ao acúmulo microbiano." }
      ],
      caseStudy: {
        title: "Fluxo de Punção Venosa Segura",
        text: "Após puncionar o acesso venoso de um paciente cardíaco, o técnico em enfermagem descarta a seringa acoplada com a agulha diretamente na caixa coletora de perfurocortantes fixada ao lado da cama, sem reencapar, eliminando o risco de acidentes com agulha."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Acesso às Fichas FISPQ", text: "Toda unidade que armazena ou manipula saneantes, medicamentos químicos ou reagentes deve possuir as fichas de segurança química (FISPQ) acessíveis." },
        { id: "h2", title: "Cabines de Fluxo Laminar", text: "A manipulação de quimioterápicos e medicamentos antineoplásicos deve ocorrer exclusivamente em cabines de segurança de Classe II B2 com exaustão externa." },
        { id: "h3", title: "Kit de Emergência de Derramamento", text: "O setor deve conter kits de neutralização química contendo respiradores faciais específicos, serragem absorvente, luvas grossas e sacos vedados." }
      ],
      caseStudy: {
        title: "Controle de Vazamento de Reagente na Farmácia",
        text: "Durante a passagem de estoque na farmácia satélite, um frasco de antisséptico concentrado se quebra. O farmacêutico isola a área assistencial, veste os óculos de ampla visão do kit e aplica o absorvente químico específico para remover a substância sem inalação de vapores tóxicos."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Uso Obrigatório de Dosímetro", text: "O dosímetro de tórax deve ser usado de forma contínua durante a jornada do trabalhador e armazenado na placa padrão de controle ao fim do turno." },
        { id: "h2", title: "Avental de Chumbo (Plumbífero)", text: "Utilização indispensável de avental e protetor de tireoide de chumbo de equivalência mínima de 0,25mm ou 0,50mm de Pb em exames de raio-X." },
        { id: "h3", title: "Sinal luminoso de Alerta Ativo", text: "As portas das salas de exames radiológicos devem conter lâmpada de aviso vermelha externa e placa alertando 'Raio-X: Entrada Proibida'." }
      ],
      caseStudy: {
        title: "Radiografia Pulmonar Segura no Leito da UTI",
        text: "Para realizar um raio-X pulmonar de urgência em um paciente intubado, o técnico em radiologia orienta a equipe de enfermagem a se afastar além da distância de segurança (2 metros), posiciona biombos protetores ao redor dos leitos vizinhos e faz o disparo protegido."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Grupo A - Infectantes (Biológico)", text: "Descarte obrigatório em saco plástico branco leitoso identificado com o símbolo de risco biológico internacional (ex: gazes com sangue, drenos)." },
        { id: "h2", title: "Grupo B - Resíduos Químicos", text: "Medicamentos vencidos, reagentes de laboratório e reveladores radiológicos devem ser segregados em bombonas rígidas laranja específicas." },
        { id: "h3", title: "Grupo D - Resíduos Comuns", text: "Papéis de embalagem estéril, copos descartáveis de água e resíduos de escritório devem ir para sacos pretos ou cinzas para fins de reciclagem." }
      ],
      caseStudy: {
        title: "Separação de Resíduos no Centro de Trauma",
        text: "No expurgo da emergência, o técnico joga as embalagens de papel das seringas e agulhas no saco de lixo comum reciclável (Grupo D) e o cateter sujo de sangue no saco branco biológico (Grupo A), reduzindo o volume de lixo contaminado de alto custo de incineração."
      }
    }
  },
  "lms-c3": {
    0: {
      hotspots: [
        { id: "h1", title: "Natureza Física dos Raios X", text: "Raios X são fótons eletromagnéticos de alta frequência e energia, com capacidade de ionizar átomos, quebrando ligações moleculares." },
        { id: "h2", title: "Formação de Radiação Espalhada", text: "O espalhamento Compton ocorre quando os raios X colidem com o corpo do paciente, espalhando radiação secundária de menor energia pela sala." },
        { id: "h3", title: "Atenuação de Fótons por Massa", text: "Materiais pesados e densos, como o chumbo (Z=82) e argamassa baritada, absorvem e atenuam a radiação através do efeito fotoelétrico." }
      ],
      caseStudy: {
        title: "Análise Físico-Química de Espalhamento Compton",
        text: "Um físico de radioproteção demonstra à equipe médica do arco cirúrgico como a posição do operador em relação ao tubo influencia na absorção de radiação espalhada do paciente, ensinando que ficar do lado do detector reduz a exposição em até 5 vezes."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Efeitos Determinísticos", text: "Efeitos somáticos que possuem limiar de dose estabelecido. Acima dele, a gravidade do dano aumenta proporcionalmente (ex: eritema cutâneo, catarata)." },
        { id: "h2", title: "Efeitos Estocásticos (Probabilísticos)", text: "Não possuem limiar de dose mínima. A probabilidade de ocorrência (câncer, mutações gênicas) aumenta com a dose acumulada ao longo da vida." },
        { id: "h3", title: "Graus de Radiossensibilidade", text: "Células com alta atividade mitótica e pouca diferenciação, como células precursoras da medula óssea, linfócitos e gônadas, são as mais sensíveis." }
      ],
      caseStudy: {
        title: "Educação sobre Radiodermites na Hemodinâmica",
        text: "Durante uma mesa redonda, o radiologista intervencionista discute estudos de caso de radiodermites surgidas em pacientes submetidos a longos tempos de fluoroscopia, destacando a importância de monitorar o tempo de pedal ativo e o produto dose-área."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Fator Tempo de Disparo", text: "Planeje e configure os parâmetros técnicos de KV e mAs de forma precisa antes do exame para evitar repetições desnecessárias de imagens." },
        { id: "h2", title: "Lei do Quadrado da Distância", text: "A intensidade da radiação decai inversamente com o quadrado da distância da fonte. Dobre a distância do paciente e reduza a dose a 1/4 da original." },
        { id: "h3", title: "Blindagens Coletivas e EPIs", text: "Mantenha-se sempre atrás do biombo protetor baritado da cabine e utilize aventais e protetores de tireoide de chumbo íntegros." }
      ],
      caseStudy: {
        title: "Aplicação Prática do Princípio ALARA",
        text: "Um técnico em radiologia necessita realizar um exame de bacia em um jovem. Ele colima rigorosamente o feixe de radiação para expor apenas a área óssea de interesse, reduzindo o volume de tecido saudável exposto e minimizando a dose estocástica das gônadas."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Posicionamento do Dosímetro", text: "O dosímetro de tórax do IOE deve ser usado fixado sob o uniforme ou, quando de avental de chumbo, posicionado sobre o protetor de tireoide na gola." },
        { id: "h2", title: "Cuidados Físicos com o Cristal", text: "Nunca exponha o dosímetro a calor extremo, umidade ou raios solares diretos, pois isso pode distorcer a leitura de radiação termoluminescente." },
        { id: "h3", title: "Auditoria Mensal de Doses", text: "Os relatórios de leitura dosimétrica devem ser arquivados por pelo menos 30 anos após o término da atividade profissional do colaborador." }
      ],
      caseStudy: {
        title: "Monitoramento de Dose na Sala de Tomografia",
        text: "O coordenador de radiologia recebe os laudos de dosimetria mensal emitidos pelo laboratório homologado pelo CNEN. Ele observa que todas as doses da equipe de técnicos de raio-X e tomografia estão abaixo do nível de registro legal, confirmando a eficácia da cabine blindada."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Zonamento de Segurança", text: "Divisão física clara do setor em áreas livres, áreas supervisionadas e áreas controladas (onde o risco de radiação exige barreiras)." },
        { id: "h2", title: "Vidros e Visores Plumbíferos", text: "Visores das cabines de controle de tomografia e raio-X devem possuir espessura plumbífera equivalente para permitir visualização constante do paciente." },
        { id: "h3", title: "Sinalizações e Luz de Aviso", text: "A luz vermelha deve acender automaticamente na porta quando o tubo de raios X estiver energizado para o disparo do feixe." }
      ],
      caseStudy: {
        title: "Projeto Arquitetônico de Blindagem de Nova Sala",
        text: "Uma nova clínica de imagem Lynx EDU projeta sua sala de tomografia computadorizada multislice. O físico calcula a blindagem necessária de chumbo nas paredes de gesso acartonado para garantir que o setor de recepção adjacente atenda ao limite de dose para público geral (1 mSv/ano)."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Requisitos da RDC 330/2019", text: "Regulamento técnico sanitário da ANVISA para serviços de radiologia diagnóstica, estabelecendo padrões para controle de qualidade e radioproteção." },
        { id: "h2", title: "Testes Anuais de Qualidade", text: "Verificação periódica obrigatória da reprodutibilidade de rendimento do tubo, linearidade de taxa de dose e integridade física de aventais." },
        { id: "h3", title: "Livro de Registro de Qualidade", text: "Documento oficial do setor contendo todas as manutenções corretivas, preventivas e testes de calibração dos equipamentos de raio-X." }
      ],
      caseStudy: {
        title: "Inspeção Sanitária de Rotina e Conformidade Legal",
        text: "Durante a visita técnica dos fiscais da Vigilância Sanitária estadual, o coordenador de radiodiagnóstico apresenta os laudos de testes de controle de qualidade física realizados nos aparelhos de mamografia e raio-X, bem como os certificados de calibração vigentes, conquistando renovação imediata da licença."
      }
    }
  },
  "lms-c4": {
    0: {
      hotspots: [
        { id: "h1", title: "Degermação Cirúrgica de Mãos", text: "Escovação rigorosa com escova descartável estéril e Clorexidina Degermante a 4% ou PVPI por 3 a 5 minutos, do punho aos cotovelos." },
        { id: "h2", title: "Secagem com Compressas Estéreis", text: "Seque a pele iniciando pelas pontas dos dedos e descendo em movimentos rotativos de cima para baixo. Nunca retorne a compressa à mão após tocar o cotovelo." },
        { id: "h3", title: "Técnica de Paramentação do Avental", text: "Desdobre o avental estéril tocando apenas na sua face interna e calce as luvas cirúrgicas estéreis pela técnica fechada, sem expor as mãos fora da manga." }
      ],
      caseStudy: {
        title: "Paramentação Rígida no Bloco Cirúrgico",
        text: "O instrumentador cirúrgico realiza a escovação das mãos de forma calma e concentrada. Ao entrar na sala de cirurgia estéril, abre o pacote do avental descartável na mesa satélite, paramenta-se sozinho e calça as luvas de látex de punho alto, mantendo os braços acima da cintura."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Setores da Mesa de Instrumentação", text: "Organização lógica dos instrumentos em quadrantes: diérese (corte), hemostasia (pinçamento), exérese (retirada) e síntese (fechamento)." },
        { id: "h2", title: "Checagem de Artigos Críticos", text: "Validação visual e física dos integradores químicos das embalagens estéreis provenientes da CME para atestar integridade bacteriana." },
        { id: "h3", title: "Manuseio Técnico das Pinças", text: "As pinças cirúrgicas devem ser empilhadas por tamanhos e tipos, com as pontas e travas protegidas, garantindo fluxo seguro e rápido ao cirurgião." }
      ],
      caseStudy: {
        title: "Organização Milimétrica da Mesa do Instrumentador",
        text: "Para uma cirurgia de colecistectomia aberta, a instrumentadora organiza sua mesa auxiliar dispondo cabos de bisturi e tesouras de Metzenbaum na esquerda, pinças hemostáticas de Kelly ao centro e os fios cirúrgicos de categut e nylon na extremidade direita, minimizando tempos de busca durante o ato cirúrgico."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Tempo de Diérese (Incisão)", text: "Uso de bisturis frios (lâminas de aço descartáveis), bisturis elétricos monopolares/bipolares e tesouras cirúrgicas para secção de tecidos." },
        { id: "h2", title: "Tempo de Hemostasia (Bloqueio)", text: "Uso de pinças de preensão hemostática (Kelly, Halsted, Rochester) ou ligadura térmica por eletrocautério para ocluir vasos sangrantes." },
        { id: "h3", title: "Tempo de Síntese (Fechamento)", text: "Aproximação de bordas teciduais por meio de suturas de fios absorvíveis (poliglactina) ou inabsorvíveis (nylon, seda), usando porta-agulhas de Mayo." }
      ],
      caseStudy: {
        title: "Sincronia nos Tempos de Laparotomia Exploradora",
        text: "O cirurgião realiza a diérese da pele e plano aponeurótico. À medida que pequenos vasos sangram, a instrumentadora entrega de forma reflexa as pinças hemostáticas Kelly, passando depois as tesouras de fio e compressas cirúrgicas estéreis, garantindo uma cirurgia fluida e limpa."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Antissepsia Cutânea Ativa", text: "Fricção vigorosa de Clorexidina Alcoólica 2% na pele do sítio cirúrgico em movimentos concêntricos de dentro para fora, esperando secagem espontânea." },
        { id: "h2", title: "Campos Cirúrgicos de Barreira", text: "Disposição de campos de tecido ou TNT estéreis sobre o corpo do paciente, deixando exposta apenas a pequena janela da incisão cirúrgica." },
        { id: "h3", title: "Manutenção do Campo Estéril", text: "Toda a equipe assistencial paramentada deve permanecer de frente para o campo estéril e acima do nível da mesa, sem baixar os braços abaixo da cintura." }
      ],
      caseStudy: {
        title: "Antissepsia e Barreira na Cirurgia Ortopédica",
        text: "O assistente cirúrgico realiza a antissepsia de pele da coxa e joelho do paciente com PVPI alcoólico em três demãos sucessivas. Em seguida, a equipe aplica o campo impermeável estéril autoadesivo aderido ao sítio cirúrgico, impedindo que bactérias da pele migrem para a incisão profunda de prótese."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Contagem de Compressas e Gases", text: "Conferência matemática rigorosa de todas as compressas cirúrgicas presentes na sala antes da abertura e antes do fechamento da cavidade abdominal." },
        { id: "h2", title: "Suturas e Agulhas Controladas", text: "Controle físico de cada agulha de sutura entregue ao cirurgião. O instrumentador deve receber de volta a agulha usada antes de fornecer a próxima." },
        { id: "h3", title: "Materiais com Fio Radiopaco", text: "Uso obrigatório de compressas com marcadores radiopacos visíveis sob raio-X para prevenir esquecimento acidental de corpos estranhos na cavidade." }
      ],
      caseStudy: {
        title: "Fechamento Seguro de Cavidade Abdominal",
        text: "Ao finalizar uma ressecção intestinal de urgência, o cirurgião avisa que iniciará a sutura de fechamento. O circulante e a instrumentadora realizam a dupla contagem física das compressas e agulhas. '15 compressas iniciadas, 15 contadas na mesa e baldes. Tudo limpo'. O cirurgião inicia a síntese com segurança."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Umectação e Pré-Limpeza Imediata", text: "Borrifar detergente enzimático sobre as pinças usadas imediatamente após a cirurgia para evitar que sangue e tecidos sequem nas ranhuras das travas." },
        { id: "h2", title: "Termodesinfecção Mecânica", text: "Envio dos materiais em contêiner fechado para o expurgo da CME, passando por lavadoras automáticas de termodesinfecção física a 90°C." },
        { id: "h3", title: "Validação Térmica em Autoclave", text: "Esterilização final por autoclave a vapor de alta pressão, validada por testes de barreira física, integradores classe 5 e esporos biológicos." }
      ],
      caseStudy: {
        title: "Fluxo de Materiais do Bloco Cirúrgico ao CME",
        text: "Após o término da colecistectomia, a instrumentadora limpa grosseiramente os excessos orgânicos dos instrumentais cirúrgicos com água destilada, borrifa espuma enzimática protetora, fecha o contêiner de transporte vedado e o envia ao expurgo da CME por montacargas específico do bloco."
      }
    }
  },
  "lms-c5": {
    0: {
      hotspots: [
        { id: "h1", title: "Diretriz da Transversalidade", text: "A humanização deve ser uma política transversal que norteia e conecta todas as categorias profissionais e fluxos operacionais do hospital." },
        { id: "h2", title: "Conceito de Co-Gestão", text: "Incentivo à gestão participativa e democrática, integrando trabalhadores de saúde e usuários do SUS nas tomadas de decisão da unidade." },
        { id: "h3", title: "Valorização do Trabalhador", text: "Promover a saúde física, mental e bem-estar ergonômico dos profissionais, pois quem cuida também precisa de suporte e acolhimento ético." }
      ],
      caseStudy: {
        title: "Formação de Comitê Multidisciplinar de Humanização",
        text: "O Hospital Lynx EDU implanta uma comissão transversal de humanização integrada por recepcionistas, enfermeiros, médicos e representantes de pacientes. A primeira pauta aprovada é a ampliação e flexibilização do horário de visitas das alas de internação geral."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Escuta Qualificada de Demandas", text: "Escutar não apenas a queixa do sintoma biológico de dor, mas compreender a angústia emocional, social e receios do paciente na recepção." },
        { id: "h2", title: "Protocolo Manchester de Manchester", text: "Uso de cores de gravidade clínica (Vermelho, Laranja, Amarelo, Verde, Azul) para organizar e priorizar o tempo de espera de atendimento." },
        { id: "h3", title: "Ambiência de Recepção Acolhedora", text: "Criação de espaços de espera adequadamente climatizados, confortáveis, com informações claras sobre fluxos de exames e painéis visíveis." }
      ],
      caseStudy: {
        title: "Acolhimento de Mãe e Criança Febril na Triagem",
        text: "Uma mãe aflita chega com o filho no colo queixando-se de febre alta. A técnica da recepção acolhe a mãe com voz mansa e compassiva, encaminha-a de imediato à sala de triagem onde o enfermeiro avalia os sinais vitais, classifica-a como prioridade Amarela e esclarece os tempos de espera."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Comunicação Humana Clara", text: "Evite o uso abusivo de termos técnicos ou jargões médicos difíceis. Explique o diagnóstico e exames com termos simples e empáticos." },
        { id: "h2", title: "Respeito à Identidade e Crenças", text: "Acolha e respeite as preferências espirituais, hábitos alimentares seguros e apelidos preferidos de pacientes hospitalizados na unidade." },
        { id: "h3", title: "Canais de Ouvidoria Ativa", text: "Disponibilizar canais de ouvidoria transparentes de fácil acesso na ala para registrar queixas, sugestões e reconhecimentos da equipe." }
      ],
      caseStudy: {
        title: "Adaptação de Dieta Assistida na Ala de Geriatria",
        text: "Uma paciente idosa internada recusa-se a se alimentar da bandeja padrão do hospital devido a hábitos rurais. A equipe de nutrição clínica visita o leito, ouve suas preferências familiares e adapta as sopas com ingredientes e texturas de sua rotina, restabelecendo sua nutrição."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Privacidade e Sala Reservada", text: "Notícias de óbito ou diagnósticos graves de câncer devem ser comunicados exclusivamente em salas reservadas e silenciosas, sem bipes ativos." },
        { id: "h2", title: "Passo a Passo do SPIKES", text: "Siga o protocolo internacional SPIKES: avalie o que o familiar já sabe, convide à informação, dê notícias de forma gradual e acolha as emoções." },
        { id: "h3", title: "Suporte Emocional Integrado", text: "Apoio presencial de psicólogos assistenciais e assistentes sociais para amparar a família nos momentos agudos de luto e dor." }
      ],
      caseStudy: {
        title: "Aplicação de SPIKES em Notícia de UTI Geral",
        text: "O médico intensivista convida a esposa de um paciente crítico para uma sala privativa silenciosa do hospital. Ele senta-se na mesma altura dos olhos, pergunta sobre seu entendimento, passa as informações do laudo neurológico de forma clara, segura suas mãos durante o choro e oferece suporte da psicologia."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Postura e Linguagem Corporal", text: "Sente-se ao lado do paciente no leito, faça contato visual direto e demonstre presença total na conversa, evitando olhar constantemente para relógios." },
        { id: "h2", title: "Validação Empática Ativa", text: "Use falas acolhedoras como 'Compreendo que este momento seja difícil e assustador para o senhor' para validar e aliviar dores emocionais." },
        { id: "h3", title: "Atitude Isenta de Julgamentos", text: "Foque na compreensão das vulnerabilidades humanas e histórico social do paciente, oferecendo amparo técnico estrito de saúde." }
      ],
      caseStudy: {
        title: "Escuta Ativa no Leito de Oncologia",
        text: "Um paciente idoso chora em silêncio antes de iniciar a sessão de quimioterapia. A técnica de enfermagem desliga o monitor barulhento, senta-se na poltrona do leito, ouve seus medos sobre os efeitos colaterais e explica carinhosamente como a medicação de suporte combaterá as náuseas, acalmando-o."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Desescalada com Voz Branda", text: "Fale de forma mansa, pausada, assertiva e compassiva perante acompanhantes agressivos ou impacientes com atrasos de consultas." },
        { id: "h2", title: "Validação dos Sentimentos do Outro", text: "Diga 'Entendo perfeitamente sua preocupação com o bem-estar do seu familiar' para quebrar a reatividade verbal agressiva imediata." },
        { id: "h3", title: "Foco em Soluções Transparentes", text: "Esclareça objetivamente quais ações práticas estão sendo tomadas para resolver o gargalo de atendimento, dando previsões realistas." }
      ],
      caseStudy: {
        title: "Resolução de Conflito na Recepção do Pronto Atendimento",
        text: "Um pai nervoso grita na recepção devido à espera por raio-X do filho. A supervisora de atendimento intervém com calma, convida-o para um balcão reservado, valida sua dor paterna, explica que a equipe atende um caso grave de parada cardíaca no momento, e dá prioridade ao filho dele na sequência imediata."
      }
    }
  },
  "lms-c6": {
    0: {
      hotspots: [
        { id: "h1", title: "Adoção de Metas SMART", text: "Mapeie metas de carreira que sejam Específicas, Mensuráveis, Atingíveis, Relevantes e com Tempo determinado (ex: especialização)." },
        { id: "h2", title: "Análise SWOT Profissional", text: "Faça uma autoavaliação identificando suas forças (pontos técnicos fortes), fraquezas (gaps de conhecimento), oportunidades e ameaças." },
        { id: "h3", title: "Planejamento de Carreira com Mentor", text: "Identifique lideranças, enfermeiros seniores ou supervisores para servirem de mentores orientando seus passos de ascensão técnica." }
      ],
      caseStudy: {
        title: "Construção de PDI para Promoção de Ala",
        text: "Uma técnica em enfermagem sênior reúne-se com a coordenação de RH e desenha seu Plano de Desenvolvimento Individual. Sua meta SMART é obter a certificação de especialização de Centro Cirúrgico em 12 meses para se qualificar para a vaga de instrumentadora titular."
      }
    },
    1: {
      hotspots: [
        { id: "h1", title: "Domínio Absoluto dos POPs", text: "Estude as rotinas e POPs operacionais técnicos vigentes no hospital Lynx EDU e torne-se a referência técnica procurada pela equipe." },
        { id: "h2", title: "Integridade e Ética Profissional", text: "Seja exemplar nas condutas de biossegurança, evite boatos de vestiário e guarde absoluto sigilo ético de dados de prontuário de pacientes." },
        { id: "h3", title: "Atitude Colaborativa Ativa", text: "Auxilie proativamente seus colegas em tarefas de grande esforço físico ou de triagem nos momentos de sobrecarga crítica de leitos." }
      ],
      caseStudy: {
        title: "Construção de Liderança Informal no Plantão de Radiologia",
        text: "Um técnico em radiodiagnóstico dedica-se a estudar os manuais de novos softwares de reconstrução 3D da tomografia. Ele cria um pequeno roteiro rápido para ajudar os colegas de plantão, tornando-se o assessor de tecnologia preferido do setor."
      }
    },
    2: {
      hotspots: [
        { id: "h1", title: "Atuação em Comissões Internas", text: "Candidate-se de forma voluntária para comissões como CIPA, CCIH ou Núcleo de Segurança do Paciente para construir networking." },
        { id: "h2", title: "Compreensão de Custos e Qualidade", text: "Participar de comissões ensina como o hospital opera a nível gerencial, incluindo impactos financeiros e riscos de glosas médicas." },
        { id: "h3", title: "Proposta Prática com Resultados", text: "Apresente ideias práticas de economia e melhoria de processos assistenciais durante os comitês, chamando atenção positiva das diretorias." }
      ],
      caseStudy: {
        title: "Projeto de Prevenção de Acidentes da CIPA Hospitalar",
        text: "O instrumentador cirúrgico une-se à equipe da CIPA do hospital Lynx EDU. Ele ajuda a desenhar uma nova rotina física de coleta de agulhas e bisturis usados na sala cirúrgica, reduzindo a incidência de acidentes biológicos de perfurocortantes no bloco em 80%."
      }
    },
    3: {
      hotspots: [
        { id: "h1", title: "Desenvolvimento de Fala Assertiva", text: "Aprimore sua habilidade de comunicação firme, elegante e clara para passar diretrizes e feedbacks técnicos de forma construtiva." },
        { id: "h2", title: "Gestão Situacional de Equipes", text: "Entenda o nível de maturidade e autonomia de cada colaborador para calibrar seu estilo de supervisão (apoiar, instruir ou delegar)." },
        { id: "h3", title: "Responsabilidade Financeira do Líder", text: "Aprenda a mapear horas extras de plantões, escalas de folga e desperdício de insumos, zelando pela saúde econômica do hospital." }
      ],
      caseStudy: {
        title: "Supervisão de Escalas Técnicas na Hemodinâmica",
        text: "Com a promoção da antiga enfermeira chefe, a coordenação técnica nomeia a supervisora substituta baseando-se em seu perfil de liderança situacional. Ela reorganiza as escalas de repouso, reduz em 15% as despesas com horas extras e eleva a harmonia dos técnicos de plantão."
      }
    },
    4: {
      hotspots: [
        { id: "h1", title: "Mapeamento Estruturado de Gargalo", text: "Defina o problema do setor com clareza matemática (ex: perda de contraste ou agulhas) e trace soluções viáveis de processos." },
        { id: "h2", title: "Indicadores Claros de Melhoria (ROI)", text: "Demonstre formalmente o retorno do investimento do projeto de melhoria em custos economizados ou segurança do paciente qualificada." },
        { id: "h3", title: "Design de Apresentação Gerencial", text: "Monte slides limpos, curtos e com gráficos de impacto visual baseados nos padrões de marcas profissionais (sem poluição visual)." }
      ],
      caseStudy: {
        title: "Apresentação de Projeto de Painéis Digitais no CME",
        text: "Um instrumentador cria um projeto de controle digital de fluxo de caixas cirúrgicas. Ele apresenta o projeto em 4 slides rápidos para a diretoria, provando que o novo software reduzirá o tempo de rastreamento de pinças e gerará economia anual expressiva."
      }
    },
    5: {
      hotspots: [
        { id: "h1", title: "Compostura e Respostas Claras", text: "Ao ser entrevistado pelo auditor ONA/JCI, mantenha a calma, responda estritamente o questionado e baseie-se nos POPs e cartilhas de rotina." },
        { id: "h2", title: "Rastreabilidade e Ordem de Fichas", text: "Mantenha todas as checagens diárias, livros de ocorrências e registros em prontuários eletrônicos rigorosamente preenchidos e organizados." },
        { id: "h3", title: "Consciência de Cultura de Segurança", text: "Entenda as auditorias de qualidade não como repressão técnica, mas como aliadas valiosas na mitigação de riscos à vida de pacientes." }
      ],
      caseStudy: {
        title: "Excelente Desempenho em Auditoria ONA de Nível 3",
        text: "Os avaliadores da ONA visitam o setor de isolamento infeccioso e entrevistam a técnica de plantão sobre o descarte de EPIs. Ela demonstra com segurança o descarte correto no lixo do Grupo A, aponta a ficha de controle de biossegurança atualizada e conquista nota máxima para o setor."
      }
    }
  }
};

// Return custom specific content for a course + module, with safe smart fallback
export function getModuleContent(courseId: string, moduleIndex: number, courseTitle: string, moduleName: string): ModuleContent {
  const courseData = CONTENT_MAP[courseId];
  if (courseData && courseData[moduleIndex]) {
    return courseData[moduleIndex];
  }

  // Smart default generator in case of newly created courses or index discrepancies
  return {
    hotspots: [
      { 
        id: "h1", 
        title: `Conceito Fundamental de ${moduleName.substring(0, 30)}`, 
        text: `Neste módulo estudamos as bases fundamentais do tópico ${moduleName}. É imprescindível aplicar os protocolos técnicos Lynx EDU para garantir a segurança no atendimento.` 
      },
      { 
        id: "h2", 
        title: "Procedimentos e Práticas Recomendadas", 
        text: "Sempre execute as diretrizes passo a passo descritas no POP institucional, conferindo insumos e registrando todas as intercorrências no prontuário do paciente." 
      },
      { 
        id: "h3", 
        title: "Mitigação Ativa de Riscos Técnicos", 
        text: "Prevenir erros exige atenção redobrada, uso correto de EPIs adequados para o setor de atuação e higienização das mãos frequente nos momentos recomendados." 
      }
    ],
    caseStudy: {
      title: `Estudo de Caso Prático em ${courseTitle}`,
      text: `Durante um procedimento de rotina no setor de ${courseTitle}, a equipe identificou uma pequena divergência de processo em relação a ${moduleName}. Aplicando prontamente a barreira de dupla checagem em equipe, a desconformidade foi resolvida com sucesso absoluto, reforçando a cultura de qualidade Lynx EDU.`
    }
  };
}
