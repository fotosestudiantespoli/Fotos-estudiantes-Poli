import { UserProfile } from '../types';

export const INITIAL_CURRENT_USER: UserProfile = {
  id: 'user-alex',
  name: 'Alex Rivera',
  handle: '@alex_tattoo_3d',
  email: 'alex.tattoo.cr@atelier.studio',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  banner: '/src/assets/images/hero_tattoo_3d_studio_1791969191222.jpg',
  bio: 'Tatuador e ilustrador 3D en San José. Diseño modelos anatómicos y referencias volumétricas para mapear stencils y pintar en Procreate 5.2+ en iPad.',
  specialty: 'Tatuaje 3D & Referencias Anatómicas',
  location: 'San José, Costa Rica',
  joinedDate: 'Enero 2026',
  verified: true,
  followersCount: 684,
  walletBalance: 345000,
  pendingBalance: 65000,
  totalEarnings: 1420000,
  salesCount: 92,
  affiliateEarnings: 84000,
  affiliatedProductIds: ['prod-2', 'prod-4'], // Selling Dial and Shinwa Caliper as an affiliate
  purchasedDownloads: [
    {
      id: 'dl-1',
      productId: 'prod-1',
      title: 'Pack 3D Antebrazo & Mano Anatómica para Stencils',
      coverImage: '/src/assets/images/model_forearm_anatomy_1791969191843.jpg',
      fileName: 'Antebrazo_Anatomico_Procreate_3D_Pack.zip',
      formats: ['OBJ', 'USDZ', 'GLTF', 'PNG UV 4K'],
      purchaseDate: '12 de Octubre 2026',
      meshPreset: 'forearm'
    },
    {
      id: 'dl-2',
      productId: 'prod-3',
      title: 'Master Pack Pinceles de Tinta Japonesa & Puntillismo',
      coverImage: '/src/assets/images/prod_procreate_brushset_1791969307936.jpg',
      fileName: 'Sumi_Master_Ink_Brushset.zip',
      formats: ['.BRUSHSET', '.ABR', '.PNG Swatches'],
      purchaseDate: '28 de Septiembre 2026'
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      date: '14 Octubre 2026',
      type: 'sale',
      description: 'Venta de activo digital: Antebrazo 3D Procreate',
      amount: 11250,
      status: 'completado'
    },
    {
      id: 'tx-2',
      date: '13 Octubre 2026',
      type: 'sale',
      description: 'Comisión de afiliado (12%): Workspace Dial CNC (@kraft_atelier)',
      amount: 5040,
      status: 'completado'
    },
    {
      id: 'tx-3',
      date: '10 Octubre 2026',
      type: 'withdrawal',
      description: 'Retiro por SINPE Móvil a teléfono 8842-**** (Banco de Costa Rica)',
      amount: -180000,
      status: 'completado'
    },
    {
      id: 'tx-4',
      date: '08 Octubre 2026',
      type: 'sale',
      description: 'Venta de activo digital: Máscara Hannya 3D',
      amount: 13500,
      status: 'completado'
    }
  ]
};

export const INITIAL_CREATORS_MAP: Record<string, UserProfile> = {
  '@vexel_3d': {
    id: 'creator-vexel',
    name: 'Dr. Marco Vexel',
    handle: '@vexel_3d',
    email: 'marco.vexel@studio3d.cr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    banner: '/src/assets/images/hero_designer_studio_workspace_1791969305571.jpg',
    bio: 'Médico anatomista y escultor 3D. Creando mallas en quads de máxima precisión para artistas digitales y tatuadores en Costa Rica y Latinoamérica.',
    specialty: 'Escultura Médica & Topología Quads',
    location: 'San José, Costa Rica',
    joinedDate: 'Noviembre 2025',
    verified: true,
    followersCount: 1420,
    walletBalance: 640000,
    pendingBalance: 125000,
    totalEarnings: 4580000,
    salesCount: 418,
    purchasedDownloads: [],
    transactions: []
  },
  '@kraft_atelier': {
    id: 'creator-kraft',
    name: 'KRAFT Atelier Lab',
    handle: '@kraft_atelier',
    email: 'hardware@kraftwerk-atelier.cr',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    banner: '/src/assets/images/prod_macro_dial_controller_1791969306402.jpg',
    bio: 'Laboratorio de diseño industrial e ingeniería CNC en Heredia. Dials mecánicos de precisión y teclados táctiles para flujos de trabajo en Figma y Procreate.',
    specialty: 'Hardware CNC & Periféricos para Diseñadores',
    location: 'Heredia, Costa Rica',
    joinedDate: 'Agosto 2025',
    verified: true,
    followersCount: 930,
    walletBalance: 1100000,
    pendingBalance: 210000,
    totalEarnings: 7300000,
    salesCount: 189,
    purchasedDownloads: [],
    transactions: []
  },
  '@sumi_inkworks': {
    id: 'creator-sumi',
    name: 'Sumi Studio',
    handle: '@sumi_inkworks',
    email: 'contact@sumi-ink.cr',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    banner: '/src/assets/images/prod_procreate_brushset_1791969307936.jpg',
    bio: 'Taller de caligrafía, tintas tradicionales y desarrollo de pinceles para Apple Pencil con textura estocástica y dinámica real para tatuadores.',
    specialty: 'Pinceles de Tinta Sumi & Texturas',
    location: 'San José / Kioto',
    joinedDate: 'Mayo 2025',
    verified: true,
    followersCount: 2310,
    walletBalance: 980000,
    pendingBalance: 95000,
    totalEarnings: 8800000,
    salesCount: 960,
    purchasedDownloads: [],
    transactions: []
  }
};
