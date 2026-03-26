/* ================================================================
   DramaLuxe — avatars.js
   Banco de personagens para seleção de avatar de perfil
   
   Papéis disponíveis:
   - protagonist    : protagonista principal
   - love_interest  : interesse amoroso / par romântico
   - villain        : vilão / antagonista principal
   - secondary      : personagens secundários importantes
   
   Sobre as fotos (photoUrl):
   - Use URLs públicas de sites como MDL, Wikipedia ou IMDb
   - Ou coloque os arquivos em assets/avatars/DRAMA/nome.jpg
   - Se photoUrl estiver vazio, gera avatar com iniciais automaticamente
   ================================================================ */

window.AVATARS = {

  /* ── Avatares temáticos (sempre disponíveis) ─────────────── */
  themed: [
    { id:'th-dragon',   emoji:'🐉', label:'Dragão C-Drama',    bg:'#1a0a2e', color:'#a855f7' },
    { id:'th-star',     emoji:'⭐', label:'Estrela K-Drama',   bg:'#0a1628', color:'#3b82f6' },
    { id:'th-sakura',   emoji:'🌸', label:'Sakura J-Drama',    bg:'#2a0a1a', color:'#ec4899' },
    { id:'th-lotus',    emoji:'🌴', label:'Lotus Thai-Drama',  bg:'#0a2a1a', color:'#22c55e' },
    { id:'th-moon',     emoji:'🌙', label:'Lua Cheia',         bg:'#0a0a2a', color:'#818cf8' },
    { id:'th-fire',     emoji:'🔥', label:'Espírito de Fogo',  bg:'#2a0a00', color:'#f97316' },
    { id:'th-sword',    emoji:'⚔️', label:'Guerreiro',         bg:'#1a1a0a', color:'#eab308' },
    { id:'th-heart',    emoji:'💜', label:'Amor Eterno',        bg:'#1a0a1a', color:'#c084fc' },
    { id:'th-mask',     emoji:'🎭', label:'Drama',              bg:'#0a0a0a', color:'#94a3b8' },
    { id:'th-crown',    emoji:'👑', label:'Realeza',            bg:'#1a1000', color:'#fbbf24' },
    { id:'th-ghost',    emoji:'👻', label:'Espírito',           bg:'#0a1a1a', color:'#67e8f9' },
    { id:'th-phoenix',  emoji:'🦅', label:'Fênix',             bg:'#1a0800', color:'#fb923c' },
  ],

  /* ── Personagens por drama ───────────────────────────────── */
  byDrama: {

    /* ════════════════════════════════════════
       SÓ POR AMOR (C-Drama, 2023)
       非你不可 / Just For Love
    ════════════════════════════════════════ */
    'so-por-amor': {
      label: 'Só Por Amor',
      region: 'c-drama',
      characters: [
        {
          id: 'spa-01',
          role: 'protagonist',
          actorName: 'Hu Yi Tian',
          characterName: 'Mo Yanchen',
          desc: 'Protagonista masculino. CEO frio e distante que esconde um passado doloroso.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hu_Yitian_at_2019_SIFF.jpg/240px-Hu_Yitian_at_2019_SIFF.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'spa-02',
          role: 'love_interest',
          actorName: 'Liang Jie',
          characterName: 'Qin Xiao Bei',
          desc: 'Protagonista feminina. Jovem simples, determinada e de coração grande.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Liang_Jie_at_2022_China_Golden_Eagle_TV_Art_Festival.jpg/240px-Liang_Jie_at_2022_China_Golden_Eagle_TV_Art_Festival.jpg',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'spa-03',
          role: 'villain',
          actorName: 'Wang Zi Xuan',
          characterName: 'Tang Meng Na',
          desc: 'Vilã principal. Ex-namorada do CEO que conspira para separar o casal.',
          photoUrl: '',
          roleBadge: '😈 Vilã',
          roleColor: '#ef4444',
        },
        {
          id: 'spa-04',
          role: 'secondary',
          actorName: 'Wang Hao Xuan',
          characterName: 'Zhou Pei Pei',
          desc: 'Melhor amiga da protagonista. Bem-humorada e leal, sempre pronta para apoiar.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
        {
          id: 'spa-05',
          role: 'secondary',
          actorName: 'Chen Jing Ke',
          characterName: 'Luo Chen',
          desc: 'Melhor amigo do CEO. Descontraído e divertido, contrasta com a seriedade do protagonista.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       NAMORO NA COZINHA (C-Drama, 2022)
       爱情料理 / Love in the Kitchen
    ════════════════════════════════════════ */
    'namoro-na-cozinha': {
      label: 'Namoro na Cozinha',
      region: 'c-drama',
      characters: [
        {
          id: 'nnc-01',
          role: 'protagonist',
          actorName: 'Ou Hao',
          characterName: 'Gu Jing Cheng',
          desc: 'CEO arrogante de um grupo empresarial. Aprende a amar através da culinária.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Ou_Hao_in_2017.jpg/240px-Ou_Hao_in_2017.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'nnc-02',
          role: 'love_interest',
          actorName: 'Zheng He Hui Zi',
          characterName: 'Xia Ke',
          desc: 'Chef talentosa e independente. Enfrenta os preconceitos do mundo culinário masculino.',
          photoUrl: '',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'nnc-03',
          role: 'villain',
          actorName: 'Tian Jia Rui',
          characterName: 'Liu Yi Yang',
          desc: 'Rival de negócios que usa meios escusos para sabotar o projeto do casal protagonista.',
          photoUrl: '',
          roleBadge: '😈 Vilão',
          roleColor: '#ef4444',
        },
        {
          id: 'nnc-04',
          role: 'secondary',
          actorName: 'Liu Yi Hao',
          characterName: 'Da Kang',
          desc: 'Assistente fiel do CEO. Cômico e dedicado, sempre causando situações constrangedoras.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       DOCE PRIMEIRO AMOR (C-Drama, 2021)
       甜了青梅配竹马 / Sweet First Love
    ════════════════════════════════════════ */
    'doce-primeiro-amor': {
      label: 'Doce Primeiro Amor',
      region: 'c-drama',
      characters: [
        {
          id: 'dpa-01',
          role: 'protagonist',
          actorName: 'Ryan Jiang (Jiang Rui Chen)',
          characterName: 'Su Mu Han',
          desc: 'Prodígio acadêmico, frio e perfeccionista. Esconde carinho profundo pela amiga de infância.',
          photoUrl: '',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'dpa-02',
          role: 'love_interest',
          actorName: 'Xing Fei',
          characterName: 'Su Nian Qin',
          desc: 'Jovem espontânea e alegre que nunca desiste de mostrar ao protagonista o valor do amor.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Xing_Fei_in_2021.jpg/240px-Xing_Fei_in_2021.jpg',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'dpa-03',
          role: 'villain',
          actorName: 'Bai Xue',
          characterName: 'Gu Xiao Xiao',
          desc: 'Rival amorosa da protagonista. Usa sua família rica para tentar roubar o protagonista.',
          photoUrl: '',
          roleBadge: '😈 Vilã',
          roleColor: '#ef4444',
        },
        {
          id: 'dpa-04',
          role: 'secondary',
          actorName: 'Huang Yi',
          characterName: 'Wei Wei',
          desc: 'Melhor amiga da protagonista. Romântica e dramática, ela comenta cada desenvolvimento do romance.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
        {
          id: 'dpa-05',
          role: 'secondary',
          actorName: 'Liu Zhe Yi',
          characterName: 'Jiang Yi Fan',
          desc: 'Amigo do protagonista que também nutre sentimentos pela heroína. Triângulo amoroso gentil.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       LOVE IN TIME (C-Drama, 2023)
       恋爱吧食梦君
    ════════════════════════════════════════ */
    'love-in-time': {
      label: 'Love in Time',
      region: 'c-drama',
      characters: [
        {
          id: 'lit-01',
          role: 'protagonist',
          actorName: 'Huang Jing Yu',
          characterName: 'Shi Ming Yu',
          desc: 'Protagonista masculino misterioso ligado ao passado esquecido da heroína.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Huang_Jingyu_in_2018.jpg/240px-Huang_Jingyu_in_2018.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'lit-02',
          role: 'love_interest',
          actorName: 'Hu Bing Qing',
          characterName: 'Xiao Tan',
          desc: 'Designer que perdeu suas memórias afetivas. Busca entender o amor que um dia sentiu.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Hu_Bingqing_at_2022.jpg/240px-Hu_Bingqing_at_2022.jpg',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'lit-03',
          role: 'villain',
          actorName: 'Guo Jia Ming',
          characterName: 'Chen Hao',
          desc: 'Vilão que manipulou os eventos do passado para apagar as memórias da protagonista.',
          photoUrl: '',
          roleBadge: '😈 Vilão',
          roleColor: '#ef4444',
        },
        {
          id: 'lit-04',
          role: 'secondary',
          actorName: 'An Yue Xi',
          characterName: 'Bai Lu',
          desc: 'Melhor amiga da protagonista que conhece os segredos do passado mas luta para protegê-la.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       CASHERO 2025 (K-Drama)
       캐셔로
    ════════════════════════════════════════ */
    'cashero-2025': {
      label: 'Cashero (2025)',
      region: 'k-drama',
      characters: [
        {
          id: 'cas-01',
          role: 'protagonist',
          actorName: 'Song Seung Heon',
          characterName: 'Kang I Soo',
          desc: 'Ex-agente de elite disfarçado de caixa de supermercado para uma missão secreta de alto risco.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Song_Seung-heon.jpg/240px-Song_Seung-heon.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'cas-02',
          role: 'love_interest',
          actorName: 'Im Ji Yeon',
          characterName: 'Yoon Se Ah',
          desc: 'Gerente do supermercado que descobre aos poucos a verdadeira identidade do novo caixa.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Im_Ji-yeon_in_2023.jpg/240px-Im_Ji-yeon_in_2023.jpg',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'cas-03',
          role: 'villain',
          actorName: 'Park Sung Hoon',
          characterName: 'Director Jang',
          desc: 'Antagonista principal que dirige a organização criminosa investigada pelo protagonista.',
          photoUrl: '',
          roleBadge: '😈 Vilão',
          roleColor: '#ef4444',
        },
        {
          id: 'cas-04',
          role: 'secondary',
          actorName: 'Lee Jae Wook',
          characterName: 'Choi Min Jun',
          desc: 'Parceiro de missão do protagonista. Entra disfarçado como funcionário do depósito.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Lee_Jae-wook_in_2023.jpg/240px-Lee_Jae-wook_in_2023.jpg',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
        {
          id: 'cas-05',
          role: 'secondary',
          actorName: 'Go Ah Ra',
          characterName: 'Park Ji Soo',
          desc: 'Agente de suporte que coordena a operação do lado de fora e mantém comunicação com o grupo.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       GIRL FROM NOWHERE (Thai-Drama, 2018)
       เด็กใหม่
    ════════════════════════════════════════ */
    'girl-from-nowhere': {
      label: 'Girl From Nowhere',
      region: 'thai-drama',
      characters: [
        {
          id: 'gfn-01',
          role: 'protagonist',
          actorName: 'Chicha Amatayakul',
          characterName: 'Nanno',
          desc: 'A garota misteriosa de lugar nenhum. Entidade sobrenatural que pune hipócritas nas escolas.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chicha_Amatayakul_2022.jpg/240px-Chicha_Amatayakul_2022.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'gfn-02',
          role: 'villain',
          actorName: 'Chanya McClory',
          characterName: 'Yuri',
          desc: 'Antagonista da 2ª temporada. Garota que absorveu parte do poder de Nanno e a desafia.',
          photoUrl: '',
          roleBadge: '😈 Vilã',
          roleColor: '#ef4444',
        },
        {
          id: 'gfn-03',
          role: 'secondary',
          actorName: 'Tarika Tidatid',
          characterName: 'Minnie',
          desc: 'Aluna que parece doce mas esconde uma crueldade calculada contra colegas vulneráveis.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
        {
          id: 'gfn-04',
          role: 'secondary',
          actorName: 'Natchapong Chatreeworakulchai',
          characterName: 'TK',
          desc: 'O valentão favorito da escola que aprende que suas ações têm consequências inevitáveis.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       O MELHOR DE TUDO (C-Drama, 2025)
       The Best Thing
    ════════════════════════════════════════ */
    'the-best-thing': {
      label: 'O Melhor de Tudo',
      region: 'c-drama',
      characters: [
        {
          id: 'tbt-01',
          role: 'protagonist',
          actorName: 'Zhang Linghe',
          characterName: 'He Suye',
          desc: 'Médico de medicina tradicional, gentil e refinado. Seu relacionamento com a paciente vira amor.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Zhang_Linghe_in_2023.jpg/240px-Zhang_Linghe_in_2023.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'tbt-02',
          role: 'love_interest',
          actorName: 'Xu Ruohan',
          characterName: 'Shen Xifan',
          desc: 'Gerente workaholic que sofre de insônia. Busca cura médica e encontra amor inesperado.',
          photoUrl: '',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'tbt-03',
          role: 'villain',
          actorName: 'Ling Mei',
          characterName: 'Lin Mu',
          desc: 'Ex-namorada de He Suye que retorna e tenta reacender o relacionamento antigo.',
          photoUrl: '',
          roleBadge: '😈 Vilã',
          roleColor: '#ef4444',
        },
        {
          id: 'tbt-04',
          role: 'secondary',
          actorName: 'Bu Guan Jin',
          characterName: 'Tao Zi',
          desc: 'Colega de trabalho e confidente da protagonista. Apoia o casal nos momentos difíceis.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       A OLIVEIRA BRANCA (C-Drama, 2023)
       The White Olive Tree
    ════════════════════════════════════════ */
    'oliveira-branca': {
      label: 'A Oliveira Branca',
      region: 'c-drama',
      characters: [
        {
          id: 'ob-01',
          role: 'protagonist',
          actorName: 'Chen Zheyuan',
          characterName: 'Qiao Yi Fan',
          desc: 'Médico voluntário em zona de conflito. Seu encontro com a fotojornalista muda sua vida.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Chen_Zheyuan_in_2022.jpg/240px-Chen_Zheyuan_in_2022.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'ob-02',
          role: 'love_interest',
          actorName: 'Liang Jie',
          characterName: 'Zou Zi Shu',
          desc: 'Fotojornalista corajosa que documenta conflitos. A oliveira branca une seu destino ao protagonista.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Liang_Jie_at_2022_China_Golden_Eagle_TV_Art_Festival.jpg/240px-Liang_Jie_at_2022_China_Golden_Eagle_TV_Art_Festival.jpg',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'ob-03',
          role: 'villain',
          actorName: 'Li Bao Tian',
          characterName: 'General Rashid',
          desc: 'Comandante da facção armada que controla a região e ameaça os protagonistas.',
          photoUrl: '',
          roleBadge: '😈 Vilão',
          roleColor: '#ef4444',
        },
        {
          id: 'ob-04',
          role: 'secondary',
          actorName: 'Huang Yi',
          characterName: 'Xiao Man',
          desc: 'Intérprete e guia local que ajuda os protagonistas a sobreviver na zona de conflito.',
          photoUrl: '',
          roleBadge: '🌟 Secundária',
          roleColor: '#f59e0b',
        },
        {
          id: 'ob-05',
          role: 'secondary',
          actorName: 'Li Cheng Ru',
          characterName: 'Dr. Wang',
          desc: 'Mentor do protagonista médico. Figura paterna que o inspira a servir nas regiões mais perigosas.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

    /* ════════════════════════════════════════
       SU-KI-DA: EU TE AMO (J-Drama, 2006)
    ════════════════════════════════════════ */
    'suki-da-serie': {
      label: 'Su-Ki-Da: Eu Te Amo',
      region: 'j-drama',
      characters: [
        {
          id: 'skd-01',
          role: 'protagonist',
          actorName: 'Hayashi Kento',
          characterName: 'Yano Motoharu',
          desc: 'Rapaz popular e magnético que carrega uma sombra do passado. Seu amor é intenso e complicado.',
          photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hayashi_Kento_2019.jpg/240px-Hayashi_Kento_2019.jpg',
          roleBadge: '👑 Protagonista',
          roleColor: '#a855f7',
        },
        {
          id: 'skd-02',
          role: 'love_interest',
          actorName: 'Haru',
          characterName: 'Tanaka Nanami',
          desc: 'Garota introvertida que se abre para o amor pela primeira vez com o rapaz mais popular da escola.',
          photoUrl: '',
          roleBadge: '💕 Par Romântico',
          roleColor: '#ec4899',
        },
        {
          id: 'skd-03',
          role: 'villain',
          actorName: 'Kimura Fumino',
          characterName: 'Nana',
          desc: 'A sombra do passado do protagonista. Sua presença ameaça constantemente o novo romance.',
          photoUrl: '',
          roleBadge: '😈 Rival',
          roleColor: '#ef4444',
        },
        {
          id: 'skd-04',
          role: 'secondary',
          actorName: 'Nakajima Yuto',
          characterName: 'Yamamoto',
          desc: 'Melhor amigo do protagonista e confidente que tenta manter o grupo unido.',
          photoUrl: '',
          roleBadge: '🌟 Secundário',
          roleColor: '#f59e0b',
        },
      ],
    },

  }, // fim byDrama

  /* ── Mapa de filmes → drama key para reuso ──────────────── */
  movieMap: {
    'AuLdrZbjLi8': null,   // drama curto sem cast expandido
    'rT1O8P8Ru0U': 'the-best-thing',
    'E1LTggMI4l0': 'oliveira-branca',
    '0Z8ZsFIiOzc': 'suki-da-serie',
  },

};

/* ================================================================
   Helpers do banco de avatares
================================================================ */

/**
 * Retorna todos os avatares disponíveis para seleção de perfil,
 * agrupados por categoria.
 */
window.AVATARS.getAllGroups = function() {
  const groups = [];

  // Grupo 1: Temáticos (sempre disponíveis)
  groups.push({
    label: '✨ Temáticos',
    items: AVATARS.themed.map(t => ({
      id: t.id,
      type: 'themed',
      displayName: t.label,
      emoji: t.emoji,
      bg: t.bg,
      color: t.color,
      roleBadge: '🎭 Temático',
      roleColor: t.color,
    })),
  });

  // Grupos por drama
  const roles = [
    { key:'protagonist',   label:'👑 Protagonistas',  },
    { key:'love_interest', label:'💕 Par Romântico',  },
    { key:'villain',       label:'😈 Vilões',         },
    { key:'secondary',     label:'🌟 Secundários',    },
  ];

  // Por drama
  for (const [dramaKey, drama] of Object.entries(AVATARS.byDrama)) {
    const allChars = drama.characters || [];
    if (!allChars.length) continue;

    groups.push({
      label: `${_regionIcon(drama.region)} ${drama.label}`,
      dramaKey,
      items: allChars.map(c => ({
        id: c.id,
        type: 'character',
        dramaKey,
        dramaLabel: drama.label,
        actorName: c.actorName,
        characterName: c.characterName,
        displayName: c.characterName,
        desc: c.desc,
        photoUrl: c.photoUrl || '',
        roleBadge: c.roleBadge,
        roleColor: c.roleColor,
        role: c.role,
      })),
    });
  }

  // Por papel (cross-drama)
  for (const role of roles) {
    const items = [];
    for (const drama of Object.values(AVATARS.byDrama)) {
      for (const c of drama.characters.filter(ch => ch.role === role.key)) {
        items.push({
          id: c.id,
          type: 'character',
          dramaLabel: drama.label,
          actorName: c.actorName,
          characterName: c.characterName,
          displayName: c.characterName,
          desc: c.desc,
          photoUrl: c.photoUrl || '',
          roleBadge: c.roleBadge,
          roleColor: c.roleColor,
          role: c.role,
        });
      }
    }
    if (items.length) groups.push({ label: role.label, roleFilter: role.key, items });
  }

  return groups;
};

/**
 * Retorna a URL da imagem do avatar ou gera uma com iniciais.
 */
window.AVATARS.getAvatarUrl = function(avatar) {
  if (!avatar) return _initialsUrl('DL', '#a855f7');
  if (avatar.type === 'themed') return null; // renderiza emoji
  if (avatar.photoUrl) return avatar.photoUrl;
  // Gera avatar com iniciais via ui-avatars.com
  const name = (avatar.characterName || avatar.actorName || avatar.displayName || '?').replace(/\s+/g, '+');
  const color = (avatar.roleColor || '#a855f7').replace('#', '');
  return `https://ui-avatars.com/api/?name=${name}&size=256&background=1a1a2e&color=${color}&bold=true&format=svg`;
};

function _initialsUrl(name, color) {
  const c = (color || '#a855f7').replace('#', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a1a2e&color=${c}&bold=true&format=svg`;
}

function _regionIcon(region) {
  return {'c-drama':'🐉','k-drama':'⭐','j-drama':'🌸','thai-drama':'🌴'}[region] || '🎬';
}
