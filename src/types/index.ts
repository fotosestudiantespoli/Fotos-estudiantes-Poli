export type ProductKind = 'digital' | 'fisico';

export type ProductCategory =
  | '3d_models'
  | 'brushes'
  | 'typography'
  | 'ui_kits'
  | 'hardware_dials'
  | 'drawing_tools'
  | 'paper_sketchbooks'
  | 'measuring_tools';

export interface Creator {
  id?: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio?: string;
  location: string;
  rating: number;
  salesTotal: number;
  verified: boolean;
  followersCount?: number;
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  kind: ProductKind;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  creator: Creator;
  description: string;
  highlights: string[];
  coverImage: string;
  galleryImages?: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  salesCount: number;
  createdAt: string;

  // Digital-specific fields
  digitalSpecs?: {
    fileFormats: string[]; // e.g. ['OBJ', 'USDZ', 'BRUSHSET', 'FIG']
    fileSize: string; // e.g. '128 MB'
    compatibility: string[]; // e.g. ['Procreate', 'Blender', 'Nomad Sculpt', 'Photoshop']
    meshPreset?: 'forearm' | 'skull' | 'hannya' | 'torso' | 'snake' | 'dial' | 'caliper';
    license: 'Personal' | 'Comercial Extendido';
    downloadFileName: string;
  };

  // Physical-specific fields
  physicalSpecs?: {
    stock: number;
    weight: string; // e.g. '340g'
    dimensions: string; // e.g. '85 x 65 x 30 mm'
    materials: string; // e.g. 'Aluminio anodizado CNC 6061'
    shippingDays: string; // e.g. '2 a 4 días hábiles'
    originCountry: string; // e.g. 'Japón', 'Alemania', 'Costa Rica'
    meshPreset?: 'dial' | 'caliper';
  };

  // Affiliate reseller program
  affiliateCommissionPercent?: number; // e.g. 15 for 15% commission
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  referrerHandle?: string; // If bought through an affiliate reseller
}

export interface PurchasedDownload {
  id: string;
  productId: string;
  title: string;
  coverImage: string;
  fileName: string;
  formats: string[];
  purchaseDate: string;
  meshPreset?: 'forearm' | 'skull' | 'hannya' | 'torso' | 'snake' | 'dial' | 'caliper';
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'sale' | 'withdrawal' | 'purchase';
  description: string;
  amount: number;
  status: 'completado' | 'procesando';
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  banner: string;
  bio: string;
  specialty: string;
  location: string;
  joinedDate: string;
  verified: boolean;
  followersCount: number;
  walletBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  salesCount: number;
  rating?: number;
  salesTotal?: number;
  affiliateEarnings?: number;
  affiliatedProductIds?: string[]; // IDs of products from other creators added to this user's affiliate store
  purchasedDownloads: PurchasedDownload[];
  transactions: WalletTransaction[];
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress?: string;
  downloadsReady: {
    productId: string;
    title: string;
    fileName: string;
    format: string;
    downloadUrl: string;
  }[];
  physicalShipment?: {
    trackingNumber: string;
    courier: string;
    estimatedDelivery: string;
  };
}

export interface StencilPreset {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

export type CommunityCategory =
  | 'procreate_3d'
  | 'stencils_tatuaje'
  | 'hardware_tools'
  | 'ventas_sinpe'
  | 'general';

export interface CommunityAnswer {
  id: string;
  questionId: string;
  author: Creator;
  content: string;
  createdAt: string;
  upvotes: number;
  isAccepted?: boolean;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  categoryLabel: string;
  author: Creator;
  createdAt: string;
  upvotes: number;
  tags: string[];
  answers: CommunityAnswer[];
  isSolved: boolean;
}
