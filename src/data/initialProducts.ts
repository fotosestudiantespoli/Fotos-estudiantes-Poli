import { ProductItem } from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'Pack 3D Antebrazo & Mano Anatómica para Stencils',
    slug: 'antebrazo-mano-anatomica-3d-procreate',
    kind: 'digital',
    category: '3d_models',
    categoryLabel: 'Modelos 3D',
    price: 12500,
    originalPrice: 16500,
    creator: {
      name: 'Dr. Marco Vexel',
      handle: '@vexel_3d',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      location: 'San José, Costa Rica',
      rating: 4.96,
      salesTotal: 418,
      verified: true
    },
    description:
      'Modelo 3D meticulosamente esculpido con topología en quads y mapas UV sin estiramiento. Diseñado específicamente para que ilustradores y tatuadores prueben envoltura de stencils y pinten directamente en Procreate 5.2+ o Nomad Sculpt.',
    highlights: [
      'Topología 100% quads para deformación anatómica limpia',
      'Despliegue UV optimizado sin costuras visibles en zonas clave',
      'Listo para importar en iPad con un toque (.OBJ y .USDZ)',
      'Incluye texturas 4K de referencia anatómica y cuadrícula milimétrica'
    ],
    coverImage: '/src/assets/images/model_forearm_anatomy_1791969191843.jpg',
    tags: ['Procreate 3D', 'Anatomía', 'OBJ', 'USDZ', 'Tatuaje', 'Nomad Sculpt'],
    rating: 4.9,
    reviewsCount: 84,
    salesCount: 312,
    createdAt: '2026-02-18',
    affiliateCommissionPercent: 15,
    digitalSpecs: {
      fileFormats: ['OBJ', 'USDZ', 'GLTF', 'PNG UV 4K'],
      fileSize: '84 MB',
      compatibility: ['Procreate 5.2+', 'Nomad Sculpt', 'Blender', 'ZBrush'],
      meshPreset: 'forearm',
      license: 'Comercial Extendido',
      downloadFileName: 'Antebrazo_Anatomico_Procreate_3D_Pack.zip'
    }
  },
  {
    id: 'prod-2',
    title: 'Workspace Dial CNC & Macro Pad Mecánico para Diseñadores',
    slug: 'workspace-dial-cnc-macropad',
    kind: 'fisico',
    category: 'hardware_dials',
    categoryLabel: 'Hardware & Dials',
    price: 42000,
    originalPrice: 49000,
    creator: {
      name: 'KRAFT Atelier Lab',
      handle: '@kraft_atelier',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      location: 'Heredia, Costa Rica',
      rating: 5.0,
      salesTotal: 189,
      verified: true
    },
    description:
      'Dial giratorio háptico de precisión mecanizado en un solo bloque de aluminio 6061 y pad de 8 teclas mecánicas programables. Asigna zoom continuo, tamaño de pincel en Procreate/Photoshop, rotación de lienzo y atajos de Figma.',
    highlights: [
      'Cuerpo unibody en aluminio anodizado negro mate con acabado micro-chorreado',
      'Encoder rotativo magnético industrial sin desgaste mecánico',
      'Switches silenciosos lineales lubricados de fábrica (Gateron Pro Yellow)',
      'Conexión USB-C desmontable y perfil compatible con iPadOS, macOS y Windows'
    ],
    coverImage: '/src/assets/images/prod_macro_dial_controller_1791969306402.jpg',
    tags: ['Hardware', 'Figma', 'Procreate', 'CNC', 'Atajos', 'Productividad'],
    rating: 5.0,
    reviewsCount: 42,
    salesCount: 156,
    createdAt: '2026-03-02',
    affiliateCommissionPercent: 12,
    physicalSpecs: {
      stock: 14,
      weight: '310 gramos',
      dimensions: '88 x 82 x 30 mm',
      materials: 'Aluminio anodizado CNC 6061, base de fieltro de lana densa',
      shippingDays: '1 a 3 días hábiles (Correos de Costa Rica / GAM)',
      originCountry: 'Costa Rica / Alemania',
      meshPreset: 'dial'
    }
  },
  {
    id: 'prod-3',
    title: 'Master Pack Pinceles de Tinta Japonesa & Puntillismo',
    slug: 'master-pack-pinceles-tinta-puntillismo',
    kind: 'digital',
    category: 'brushes',
    categoryLabel: 'Pinceles & Brushes',
    price: 9500,
    originalPrice: 13000,
    creator: {
      name: 'Sumi Studio',
      handle: '@sumi_inkworks',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      location: 'San José / Kioto',
      rating: 4.94,
      salesTotal: 960,
      verified: true
    },
    description:
      '45 pinceles digitales ultra calibrados para emular el flujo natural de la tinta sumi y el sombreado de agujas de tatuaje. Curvas de presión optimizadas para Apple Pencil con sensibilidad milimétrica en trazos finos y gradientes.',
    highlights: [
      '18 lineworkers con textura granulada auténtica',
      '15 shaders de puntillismo estocástico (stipple) progresivo',
      '12 texturizadores de aguada y lavado orgánico',
      'Incluye paletas de muestras tonales y guía de configuración'
    ],
    coverImage: '/src/assets/images/prod_procreate_brushset_1791969307936.jpg',
    tags: ['Procreate', 'Brushes', 'Apple Pencil', 'Stipple', 'Tinta', 'Photoshop'],
    rating: 4.9,
    reviewsCount: 198,
    salesCount: 840,
    createdAt: '2026-02-11',
    affiliateCommissionPercent: 20,
    digitalSpecs: {
      fileFormats: ['.BRUSHSET', '.ABR', '.PNG Swatches'],
      fileSize: '145 MB',
      compatibility: ['Procreate 5.0+', 'Adobe Photoshop', 'Clip Studio Paint'],
      license: 'Comercial Extendido',
      downloadFileName: 'Sumi_Master_Ink_Brushset.zip'
    }
  },
  {
    id: 'prod-4',
    title: 'Calibrador Digital de Precisión & Regla Tipográfica Shinwa',
    slug: 'calibrador-precision-regla-tipografica-shinwa',
    kind: 'fisico',
    category: 'measuring_tools',
    categoryLabel: 'Medición & Dibujo',
    price: 26000,
    originalPrice: 32000,
    creator: {
      name: 'Shinwa Measurement Tools',
      handle: '@shinwa_tools',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      location: 'Distribución Costa Rica / Japón',
      rating: 4.98,
      salesTotal: 340,
      verified: true
    },
    description:
      'Set instrumental de taller para diseñadores gráficos, editoriales e industriales. Incluye un calibrador digital micrómetro de acero templado con pantalla LCD de alto contraste y regla tipográfica con escalas en puntos (pt), picas, milímetros y pulgadas.',
    highlights: [
      'Acero inoxidable SUS420J2 endurecido con rectificado fino',
      'Precisión verificada de ±0.02 mm con cero flotante',
      'Escalas de tipografía grabadas por láser de fibra (no serigrafiadas)',
      'Estuche rígido acolchado de protección incluido'
    ],
    coverImage: '/src/assets/images/prod_precision_caliper_gauge_1791969306774.jpg',
    tags: ['Tipografía', 'Herramienta Física', 'Medición', 'Acero', 'Diseño Editorial'],
    rating: 5.0,
    reviewsCount: 38,
    salesCount: 165,
    createdAt: '2026-03-08',
    affiliateCommissionPercent: 15,
    physicalSpecs: {
      stock: 22,
      weight: '210 gramos',
      dimensions: '235 x 75 x 16 mm',
      materials: 'Acero inoxidable templado SUS420J2',
      shippingDays: '1 a 2 días hábiles en GAM, 3 días resto de Costa Rica',
      originCountry: 'Japón / Costa Rica',
      meshPreset: 'caliper'
    }
  },
  {
    id: 'prod-5',
    title: 'Máscara Hannya Neotradicional 3D Esculpida',
    slug: 'mascara-hannya-3d-esculpida',
    kind: 'digital',
    category: '3d_models',
    categoryLabel: 'Modelos 3D',
    price: 15000,
    originalPrice: 19500,
    creator: {
      name: 'Ryoko Sculpt',
      handle: '@ryoko_sculpts',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      location: 'Alajuela, Costa Rica',
      rating: 4.97,
      salesTotal: 512,
      verified: true
    },
    description:
      'Escultura digital 3D de alta fidelidad inspirada en la iconografía clásica del teatro Noh y el tatuaje japonés Irezumi. Optimizado para encajar stencils en cualquier perspectiva y visualización en tiempo real.',
    highlights: [
      'Relieve anatómico agresivo en cuernos, ceño y colmillos',
      'Mapeo UV sin costuras en el rostro para dibujo digital',
      'Compatible con Procreate 3D paint (pintura en capas directas)',
      'Incluye versión de alta densidad (1.2M polys) y optimizada (65K polys)'
    ],
    coverImage: '/src/assets/images/model_hannya_sculpt_1791969192321.jpg',
    tags: ['Procreate', 'Hannya', 'Japonés', 'Escultura 3D', 'Nomad Sculpt'],
    rating: 5.0,
    reviewsCount: 96,
    salesCount: 420,
    createdAt: '2026-02-25',
    affiliateCommissionPercent: 18,
    digitalSpecs: {
      fileFormats: ['OBJ', 'USDZ', 'GLTF', 'FBX'],
      fileSize: '112 MB',
      compatibility: ['Procreate', 'Nomad Sculpt', 'Blender', 'Cinema4D'],
      meshPreset: 'hannya',
      license: 'Comercial Extendido',
      downloadFileName: 'Hannya_Mask_3D_Sculpt_Pack.zip'
    }
  },
  {
    id: 'prod-6',
    title: 'Cuaderno Técnico Linen Dot-Grid 160g Anti-Sangrado',
    slug: 'cuaderno-tecnico-linen-dotgrid-160g',
    kind: 'fisico',
    category: 'paper_sketchbooks',
    categoryLabel: 'Papelería & Libretas',
    price: 16500,
    creator: {
      name: 'Papercraft Atelier',
      handle: '@papercraft_co',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      location: 'Cartago, Costa Rica',
      rating: 4.91,
      salesTotal: 620,
      verified: true
    },
    description:
      'Cuaderno de dibujo profesional encuadernado en lino natural belga. Papel marfil japonés de 160 g/m² libre de ácido que soporta tinta china, pluma estilográfica, rotuladores de alcohol y acuarela ligera sin traspasar.',
    highlights: [
      'Papel japonés liso de 160 g/m² con cuadrícula de puntos gris neutro 5 mm',
      'Apertura plana de 180 grados (costura suiza expuesta duradera)',
      'Bolsillo trasero expandible para muestras y soporte de lápiz integrado',
      '192 páginas numeradas con índice técnico para proyectos'
    ],
    coverImage: '/src/assets/images/prod_dotgrid_sketchbook_1791969308108.jpg',
    tags: ['Papelería', 'Bocetos', '160g', 'Pluma', 'Dot Grid', 'Diseño'],
    rating: 4.9,
    reviewsCount: 71,
    salesCount: 388,
    createdAt: '2026-03-01',
    affiliateCommissionPercent: 15,
    physicalSpecs: {
      stock: 35,
      weight: '440 gramos',
      dimensions: '148 x 210 mm (Formato A5)',
      materials: 'Lino belga crudo, papel japonés marfil 160 g/m²',
      shippingDays: '1 a 3 días hábiles en Costa Rica',
      originCountry: 'Costa Rica / Italia',
      meshPreset: undefined
    }
  },
  {
    id: 'prod-7',
    title: 'Cráneo Humano Anatómico de Referencia Ósea 3D',
    slug: 'craneo-humano-anatomico-3d-referencia',
    kind: 'digital',
    category: '3d_models',
    categoryLabel: 'Modelos 3D',
    price: 11500,
    originalPrice: 15000,
    creator: {
      name: 'Dr. Marco Vexel',
      handle: '@vexel_3d',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      location: 'San José, Costa Rica',
      rating: 4.96,
      salesTotal: 418,
      verified: true
    },
    description:
      'Referencia ósea tridimensional con suturas craneales, órbitas y mandíbula separada. Ideal para estudiar perspectiva y escorzo antes de ilustrar o tatuar.',
    highlights: [
      'Mandíbula en sub-malla separada para posar abierta o cerrada',
      'Topología ligera lista para Procreate 3D',
      'Textura en resina mate que responde con exactitud a la luz direccional',
      'Escala real 1:1 médica estandarizada'
    ],
    coverImage: '/src/assets/images/model_skull_anatomy_1791969193309.jpg',
    tags: ['Cráneo', 'Procreate', 'Anatomía', 'Ilustración', '3D Asset'],
    rating: 4.88,
    reviewsCount: 65,
    salesCount: 290,
    createdAt: '2026-02-14',
    affiliateCommissionPercent: 15,
    digitalSpecs: {
      fileFormats: ['OBJ', 'USDZ', 'GLTF'],
      fileSize: '76 MB',
      compatibility: ['Procreate', 'Blender', 'Nomad Sculpt'],
      meshPreset: 'skull',
      license: 'Comercial Extendido',
      downloadFileName: 'Craneo_Anatomico_Procreate_Pack.zip'
    }
  },
  {
    id: 'prod-8',
    title: 'Torso Atlético 3D (Pecho, Clavículas & Costillas)',
    slug: 'torso-atletico-3d-pecho-costillas',
    kind: 'digital',
    category: '3d_models',
    categoryLabel: 'Modelos 3D',
    price: 14000,
    creator: {
      name: 'Dr. Marco Vexel',
      handle: '@vexel_3d',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      location: 'San José, Costa Rica',
      rating: 4.96,
      salesTotal: 418,
      verified: true
    },
    description:
      'Maniquí volumétrico de torso masculino atlético. Proporciona las curvaturas corporales exactas para comprobar cómo se deforman las piezas de tatuaje y estampados en pecho, esternón y abdomen.',
    highlights: [
      'Líneas de tensión muscular acentuadas para lectura visual limpia',
      'Superficie continua sin costuras en el plano central frontal',
      'Archivos optimizados para iPad Pro con carga instantánea',
      'Incluye mapas de oclusión ambiental y normals 4K'
    ],
    coverImage: '/src/assets/images/model_torso_mannequin_1791969192564.jpg',
    tags: ['Torso', 'Maniquí', 'Procreate', 'Anatomía', 'OBJ'],
    rating: 4.93,
    reviewsCount: 52,
    salesCount: 235,
    createdAt: '2026-02-28',
    affiliateCommissionPercent: 15,
    digitalSpecs: {
      fileFormats: ['OBJ', 'USDZ', 'GLTF'],
      fileSize: '95 MB',
      compatibility: ['Procreate', 'Nomad Sculpt', 'Blender', 'Maya'],
      meshPreset: 'torso',
      license: 'Comercial Extendido',
      downloadFileName: 'Torso_Atletico_Procreate_3D.zip'
    }
  }
];
