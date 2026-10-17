import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Star,
  ShoppingBag,
  Box,
  Truck,
  Download,
  PlusCircle,
  Share2,
  Check,
  MapPin,
  Users,
  Percent,
  Sparkles,
  Edit3
} from 'lucide-react';
import { ProductItem, UserProfile, Creator } from '../types';
import { ProductCard } from './ProductCard';
import { formatCRC } from '../utils/currency';

interface CreatorStoreViewProps {
  creatorHandle: string;
  creatorData?: Creator | UserProfile;
  products: ProductItem[];
  currentUser: UserProfile | null;
  onClose: () => void;
  onOpenProductDetail: (product: ProductItem) => void;
  onOpen3DViewer: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  cartProductIds: string[];
  onOpenUploadForThisStore: () => void;
  onEditProduct?: (product: ProductItem) => void;
  onToggleAffiliate?: (productId: string) => void;
}

export const CreatorStoreView: React.FC<CreatorStoreViewProps> = ({
  creatorHandle,
  creatorData,
  products,
  currentUser,
  onClose,
  onOpenProductDetail,
  onOpen3DViewer,
  onAddToCart,
  cartProductIds,
  onOpenUploadForThisStore,
  onEditProduct,
  onToggleAffiliate
}) => {
  const [activeTab, setActiveTab] = useState<'own' | 'affiliated' | 'digital' | 'fisico'>('own');
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Own products created by this creator
  const ownProducts = products.filter(
    (p) => p.creator.handle.toLowerCase() === creatorHandle.toLowerCase()
  );

  // Affiliated products curated by this user (if this store is a UserProfile with affiliatedProductIds)
  const userProfile = creatorData as UserProfile | undefined;
  const affiliatedIds = userProfile?.affiliatedProductIds || [];
  const affiliatedProducts = products.filter(
    (p) =>
      affiliatedIds.includes(p.id) &&
      p.creator.handle.toLowerCase() !== creatorHandle.toLowerCase()
  );

  const displayedProducts = products.filter((p) => {
    if (activeTab === 'own') {
      return p.creator.handle.toLowerCase() === creatorHandle.toLowerCase();
    }
    if (activeTab === 'affiliated') {
      return affiliatedIds.includes(p.id) && p.creator.handle.toLowerCase() !== creatorHandle.toLowerCase();
    }
    if (activeTab === 'digital') {
      return (
        (p.creator.handle.toLowerCase() === creatorHandle.toLowerCase() || affiliatedIds.includes(p.id)) &&
        p.kind === 'digital'
      );
    }
    if (activeTab === 'fisico') {
      return (
        (p.creator.handle.toLowerCase() === creatorHandle.toLowerCase() || affiliatedIds.includes(p.id)) &&
        p.kind === 'fisico'
      );
    }
    return true;
  });

  const isOwner = currentUser?.handle.toLowerCase() === creatorHandle.toLowerCase();

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const name = creatorData?.name || ownProducts[0]?.creator.name || 'Tienda Oficial';
  const avatar = creatorData?.avatar || ownProducts[0]?.creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const location = creatorData?.location || ownProducts[0]?.creator.location || 'Costa Rica';
  const rating = creatorData?.rating || ownProducts[0]?.creator.rating || 4.95;
  const salesTotal = creatorData?.salesTotal || ownProducts[0]?.creator.salesTotal || ownProducts.length * 28;
  const bio =
    ('bio' in (creatorData || {}) ? (creatorData as UserProfile).bio : undefined) ||
    'Estudio de diseño costarricense especializado en modelos 3D para Procreate y herramientas profesionales de precisión.';
  const followersCount = (creatorData?.followersCount || 420) + (isFollowing ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-6xl bg-[#10121a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Store Top Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-[#0d0f16]">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-white font-semibold">Tienda Oficial de Creador</span>
            <span>/</span>
            <span className="text-amber-400 font-mono">{creatorHandle}</span>
            <span className="hidden sm:inline text-zinc-500">· Costa Rica</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs rounded-lg transition-colors border border-white/10"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Enlace Copiado' : 'Compartir Tienda'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store Header Banner & Profile */}
        <div className="relative bg-[#141724] border-b border-white/10">
          <div className="h-36 sm:h-48 w-full overflow-hidden relative">
            <img
              src="/src/assets/images/hero_designer_studio_workspace_1791969305571.jpg"
              alt="Banner de tienda"
              className="w-full h-full object-cover opacity-35 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-[#10121a]/60 to-transparent" />
          </div>

          {/* Profile Row */}
          <div className="px-6 pb-6 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[#10121a] bg-[#1a1d2b] shadow-xl shrink-0">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white font-display">{name}</h1>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                  <span className="text-amber-400 font-mono">{creatorHandle}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {rating} de valoración
                  </span>
                </div>
              </div>
            </div>

            {/* Actions for Store Owner or Visitors */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isOwner ? (
                <button
                  onClick={onOpenUploadForThisStore}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Nuevo Producto</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    isFollowing
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{isFollowing ? 'Siguiendo Tienda' : 'Seguir Tienda'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Store Bio & Metric Counters */}
          <div className="px-6 pb-6 pt-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <p className="md:col-span-8 text-xs text-zinc-300 leading-relaxed">{bio}</p>
            <div className="md:col-span-4 flex items-center justify-between sm:justify-end gap-6 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-white/5 font-mono">
              <div>
                <span className="text-zinc-500 block text-[11px]">Propios</span>
                <span className="text-sm font-bold text-white">{ownProducts.length}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Ventas</span>
                <span className="text-sm font-bold text-white">{salesTotal}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Seguidores</span>
                <span className="text-sm font-bold text-amber-400">{followersCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Segmented Filter */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('own')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'own'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Creaciones Propias ({ownProducts.length})
              </button>

              <button
                onClick={() => setActiveTab('affiliated')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'affiliated'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Productos Recomendados / Afiliado ({affiliatedProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('digital')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'digital'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Download className="w-3 h-3" />
                <span>Digitales 3D</span>
              </button>

              <button
                onClick={() => setActiveTab('fisico')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'fisico'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>Físicos</span>
              </button>
            </div>

            <span className="text-xs text-zinc-500 font-mono">
              Mostrando {displayedProducts.length} productos
            </span>
          </div>

          {/* Product Cards Grid */}
          {displayedProducts.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              {activeTab === 'affiliated'
                ? 'Esta tienda aún no ha añadido productos de otros creadores para revender. Explora el catálogo general y haz clic en "Revender" para agregarlos.'
                : 'No hay productos disponibles en esta pestaña.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((prod) => {
                const isProductOwner =
                  currentUser?.handle.toLowerCase() === prod.creator.handle.toLowerCase();
                const isAffiliatedToUser =
                  currentUser?.affiliatedProductIds?.includes(prod.id) || false;

                return (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={onOpenProductDetail}
                    onOpen3DViewer={onOpen3DViewer}
                    onAddToCart={onAddToCart}
                    isInCart={cartProductIds.includes(prod.id)}
                    isOwner={isProductOwner}
                    onEditProduct={onEditProduct}
                    isAffiliated={isAffiliatedToUser}
                    onToggleAffiliate={onToggleAffiliate}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
