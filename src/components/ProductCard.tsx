import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  ShoppingBag,
  Check,
  Truck,
  Download,
  Edit3,
  Share2,
  Percent,
  Heart,
  Bookmark,
  MoreHorizontal,
  Store,
  Trash2,
  Eye,
  Maximize2
} from 'lucide-react';
import { ProductItem } from '../types';
import { formatCRC } from '../utils/currency';
import { ThreeCanvasViewer } from './ThreeCanvasViewer';

interface ProductCardProps {
  product: ProductItem;
  onOpenDetail: (product: ProductItem) => void;
  onOpen3DViewer: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  isInCart: boolean;
  onOpenStore?: (handle: string) => void;
  isOwner?: boolean;
  onEditProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (productId: string) => void;
  isAffiliated?: boolean;
  onToggleAffiliate?: (productId: string) => void;
  layout?: 'feed' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onOpen3DViewer,
  onAddToCart,
  isInCart,
  onOpenStore,
  isOwner = false,
  onEditProduct,
  onDeleteProduct,
  isAffiliated = false,
  onToggleAffiliate,
  layout = 'feed'
}) => {
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() => Math.floor(product.reviewsCount * 2.8) + 24);
  const [isSaved, setIsSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInline3D, setShowInline3D] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const has3DPreset =
    Boolean(product.digitalSpecs?.meshPreset) || Boolean(product.physicalSpecs?.meshPreset);
  const meshPreset =
    product.digitalSpecs?.meshPreset || product.physicalSpecs?.meshPreset || 'forearm';

  const commissionPercent = product.affiliateCommissionPercent || 15;
  const affiliateEarning = (product.price * commissionPercent) / 100;

  const handleCopyAffiliate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onToggleAffiliate) {
      onToggleAffiliate(product.id);
    }
    navigator.clipboard?.writeText(
      `${window.location.origin}?prod=${product.id}&ref=afiliado`
    );
    setCopiedAffiliate(true);
    setTimeout(() => setCopiedAffiliate(false), 2000);
    setIsMenuOpen(false);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  // -------------------------------------------------------------
  // GRID VIEW (Instagram Explore Grid)
  // -------------------------------------------------------------
  if (layout === 'grid') {
    return (
      <div className="group relative aspect-square bg-[#12141d] rounded-xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer">
        <img
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onClick={() => onOpenDetail(product)}
        />

        {/* Quiet Top Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white">
          {product.kind === 'digital' ? (
            <Download className="w-3 h-3 text-amber-400" />
          ) : (
            <Truck className="w-3 h-3 text-emerald-400" />
          )}
          <span>{formatCRC(product.price)}</span>
        </div>

        {has3DPreset && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md p-1 rounded text-amber-400">
            <Box className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Hover Overlay with Instagram style stats */}
        <div
          onClick={() => onOpenDetail(product)}
          className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3"
        >
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span className="truncate font-medium">{product.creator.name}</span>
            {isOwner && onEditProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product);
                }}
                className="p-1 bg-amber-500 text-black rounded hover:bg-amber-400"
                title="Editar publicación"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-center">
            <h4 className="text-xs font-semibold text-white line-clamp-2">{product.title}</h4>
            <div className="mt-1 text-sm font-bold text-amber-400 font-mono">
              {formatCRC(product.price)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (has3DPreset) onOpen3DViewer(product);
                else onOpenDetail(product);
              }}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold rounded"
            >
              3D / Vista
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded flex items-center gap-1 ${
                isInCart ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-black hover:bg-amber-400'
              }`}
            >
              {isInCart ? <Check className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
              <span>{isInCart ? 'En Carrito' : 'Comprar'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FEED VIEW (Instagram / Facebook Post)
  // -------------------------------------------------------------
  return (
    <article className="bg-[#12141e] border border-white/10 rounded-2xl overflow-hidden shadow-lg mb-8 transition-colors">
      {/* Post Header (Creator avatar, Name, Location & 3-dots Dropdown Menu) */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onOpenStore && onOpenStore(product.creator.handle)}
        >
          <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 to-amber-200">
            <img
              src={product.creator.avatar}
              alt={product.creator.name}
              className="w-full h-full rounded-full object-cover border border-[#0e1017]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                {product.creator.name}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {product.creator.handle}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>{product.creator.location || 'San José, Costa Rica'}</span>
              <span>·</span>
              <span className="text-amber-400/90">{product.categoryLabel}</span>
            </div>
          </div>
        </div>

        {/* Three Dots Dropdown Menu (Menu Desplegable) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Opciones de publicación"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-[#161926] border border-white/15 rounded-xl shadow-2xl py-1.5 z-30 animate-fadeIn">
              {onOpenStore && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenStore(product.creator.handle);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Store className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Ver tienda de {product.creator.name.split(' ')[0]}</span>
                </button>
              )}

              {has3DPreset && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpen3DViewer(product);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Box className="w-3.5 h-3.5 text-amber-400" />
                  <span>Abrir Visor 3D 360° Completo</span>
                </button>
              )}

              {!isOwner && (
                <button
                  type="button"
                  onClick={() => handleCopyAffiliate()}
                  className="w-full px-3.5 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {isAffiliated ? 'Copiar enlace de afiliado' : `Revender y ganar ${commissionPercent}%`}
                  </span>
                </button>
              )}

              {/* Owner Edit and Delete options */}
              {isOwner && onEditProduct && (
                <>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEditProduct(product);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-2 font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Editar publicación</span>
                  </button>
                </>
              )}

              {isOwner && onDeleteProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (window.confirm(`¿Eliminar la publicación "${product.title}"?`)) {
                      onDeleteProduct(product.id);
                    }
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar publicación</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Media (Image or Inline 3D Viewer) */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#0b0c10] overflow-hidden">
        {showInline3D && has3DPreset ? (
          <div className="w-full h-full relative">
            <ThreeCanvasViewer
              meshPreset={meshPreset}
              modelTitle={product.title}
              onExpandFullscreen={() => onOpen3DViewer(product)}
            />
            <button
              type="button"
              onClick={() => setShowInline3D(false)}
              className="absolute top-3 right-3 px-2 py-1 bg-black/80 hover:bg-black text-white text-xs font-medium rounded-lg backdrop-blur-md border border-white/10"
            >
              Volver a foto
            </button>
          </div>
        ) : (
          <div
            className="w-full h-full cursor-pointer group/media relative"
            onClick={() => onOpenDetail(product)}
          >
            <img
              src={product.coverImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-102"
              referrerPolicy="no-referrer"
            />

            {/* Quick 3D Toggle Overlay Button */}
            {has3DPreset && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInline3D(true);
                }}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-amber-500 hover:text-black text-white font-semibold text-xs rounded-lg backdrop-blur-md border border-white/15 transition-all shadow-md active:scale-95"
              >
                <Box className="w-3.5 h-3.5 text-amber-400 group-hover:text-black" />
                <span>Interactuar en 3D 360°</span>
              </button>
            )}

            {/* Kind badge */}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1 border border-white/10">
              {product.kind === 'digital' ? (
                <>
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Procreate 3D · OBJ</span>
                </>
              ) : (
                <>
                  <Truck className="w-3 h-3 text-emerald-400" />
                  <span>Envío Costa Rica</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Instagram / Facebook Style: Like, 3D, Share/Affiliate, Save & Buy) */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`p-1 transition-transform active:scale-125 ${
              isLiked ? 'text-rose-500' : 'text-zinc-300 hover:text-white'
            }`}
            title="Me gusta"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>

          {has3DPreset && (
            <button
              type="button"
              onClick={() => onOpen3DViewer(product)}
              className="p-1 text-zinc-300 hover:text-amber-400 transition-colors"
              title="Abrir visor 3D 360°"
            >
              <Box className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => handleCopyAffiliate(e)}
            className={`p-1 transition-colors ${
              copiedAffiliate ? 'text-emerald-400' : 'text-zinc-300 hover:text-white'
            }`}
            title="Compartir / Revender con comisión"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleToggleSave}
            className={`p-1 transition-colors ${
              isSaved ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
            }`}
            title="Guardar"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Price & Buy Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm sm:text-base font-bold text-white font-mono">
              {formatCRC(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
              isInCart
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-sm'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{isInCart ? 'En Carrito' : 'Comprar'}</span>
          </button>
        </div>
      </div>

      {/* Caption & Post Details */}
      <div className="px-4 py-3 text-xs space-y-2">
        {/* Likes Count */}
        <div className="font-semibold text-white">
          {likesCount} Me gusta
        </div>

        {/* Title & Description */}
        <div>
          <span
            className="font-bold text-white cursor-pointer hover:underline mr-1.5"
            onClick={() => onOpenStore && onOpenStore(product.creator.handle)}
          >
            {product.creator.handle}
          </span>
          <span className="text-zinc-300 leading-relaxed">{product.description}</span>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-amber-400/80 font-mono">
          {product.tags.map((tag) => (
            <span key={tag} className="hover:underline cursor-pointer">
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>

        {/* Affiliate Opportunity (Reseller callout) */}
        {!isOwner && (
          <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between gap-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Comisión de reventa:{' '}
                <strong className="text-amber-300 font-mono">
                  {formatCRC(affiliateEarning)}
                </strong>{' '}
                ({commissionPercent}%)
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => handleCopyAffiliate(e)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                isAffiliated || copiedAffiliate
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-200'
              }`}
            >
              {copiedAffiliate
                ? '¡Enlace Copiado!'
                : isAffiliated
                ? 'En tu Tienda'
                : 'Añadir a mi Tienda'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
