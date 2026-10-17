import React, { useState } from 'react';
import {
  X,
  Box,
  Image as ImageIcon,
  ShoppingBag,
  Download,
  Truck,
  Check,
  ShieldCheck,
  Star,
  Layers,
  HelpCircle,
  Edit3,
  Percent,
  Share2
} from 'lucide-react';
import { ProductItem } from '../types';
import { ThreeCanvasViewer } from './ThreeCanvasViewer';
import { formatCRC } from '../utils/currency';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  isInCart: boolean;
  onOpenProcreateGuide: () => void;
  onOpenStore?: (handle: string) => void;
  isOwner?: boolean;
  onEditProduct?: (product: ProductItem) => void;
  isAffiliated?: boolean;
  onToggleAffiliate?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart,
  onOpenProcreateGuide,
  onOpenStore,
  isOwner = false,
  onEditProduct,
  isAffiliated = false,
  onToggleAffiliate
}) => {
  if (!product) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'image'>(
    product.digitalSpecs?.meshPreset || product.physicalSpecs?.meshPreset ? '3d' : 'image'
  );
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);

  const has3DPreset = Boolean(
    product.digitalSpecs?.meshPreset || product.physicalSpecs?.meshPreset
  );
  const meshPreset =
    product.digitalSpecs?.meshPreset || product.physicalSpecs?.meshPreset || 'forearm';

  const commissionPercent = product.affiliateCommissionPercent || 15;
  const affiliateEarning = (product.price * commissionPercent) / 100;

  const handleCopyAffiliate = () => {
    if (onToggleAffiliate) {
      onToggleAffiliate(product.id);
    }
    navigator.clipboard?.writeText(
      `${window.location.origin}?prod=${product.id}&ref=afiliado`
    );
    setCopiedAffiliate(true);
    setTimeout(() => setCopiedAffiliate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
      <div
        className="relative w-full max-w-6xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-display">
              {product.categoryLabel}
            </span>
            <span className="text-white/20">/</span>
            <span className="text-xs text-zinc-400">
              {product.kind === 'digital' ? 'Herramienta Digital' : 'Herramienta Física (Costa Rica)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && onEditProduct && (
              <button
                onClick={() => {
                  onEditProduct(product);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Publicación</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2-Column Desktop Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column (7 cols): Integrated Interactive 3D Viewer & Media Showcase */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-[#090b11] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col gap-4">
            {/* Media Selector Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
                {has3DPreset && (
                  <button
                    onClick={() => setActiveMediaTab('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      activeMediaTab === '3d'
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Vista 3D Interactiva 360°</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveMediaTab('image')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeMediaTab === 'image' || !has3DPreset
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Fotografía de Estudio</span>
                </button>
              </div>

              {activeMediaTab === '3d' && (
                <div className="text-[11px] text-zinc-400 hidden sm:flex items-center gap-1">
                  <span>Arrastra para rotar · Rueda para zoom</span>
                </div>
              )}
            </div>

            {/* Media Display Container */}
            <div className="relative w-full aspect-[4/3] min-h-[380px] sm:min-h-[440px] rounded-xl overflow-hidden bg-[#0d0f17] border border-white/10">
              {activeMediaTab === '3d' && has3DPreset ? (
                <ThreeCanvasViewer
                  meshPreset={meshPreset}
                  modelTitle={product.title}
                  onExpandFullscreen={() => setIsFullscreen3D(true)}
                />
              ) : (
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Procreate / 3D Trust Banner */}
            {product.kind === 'digital' && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <Layers className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-amber-200">
                    Garantía de Compatibilidad con Procreate 5.2+ & Nomad
                  </div>
                  <p className="text-zinc-300 mt-0.5 leading-relaxed">
                    Este modelo contiene topología limpia de quads y mapeo UV optimizado sin
                    estiramiento. Permite pintar en capas 3D con Apple Pencil directamente en el
                    iPad.
                  </p>
                  <button
                    onClick={onOpenProcreateGuide}
                    className="mt-2 text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ver cómo importar en iPad paso a paso</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Contiguous Purchase & Specification Module */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 bg-[#11131c]">
            <div className="space-y-4">
              {/* Creator Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenStore) {
                      onOpenStore(product.creator.handle);
                    }
                  }}
                  className="flex items-center gap-3 text-left group hover:opacity-90 transition-opacity"
                >
                  <img
                    src={product.creator.avatar}
                    alt={product.creator.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20 group-hover:border-amber-400 transition-colors"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      <span>{product.creator.name}</span>
                      {product.creator.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {product.creator.handle} · Ver Tienda →
                    </div>
                  </div>
                </button>

                <div className="text-right">
                  <div className="text-xs font-semibold text-white flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-mono tabular-nums">{product.rating}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    ({product.reviewsCount} reseñas)
                  </div>
                </div>
              </div>

              {/* Title & Price in Colones (₡) */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
                  {product.title}
                </h2>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    {formatCRC(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-500 line-through font-mono tabular-nums">
                      {formatCRC(product.originalPrice)}
                    </span>
                  )}
                  {product.kind === 'digital' ? (
                    <span className="text-xs text-emerald-400 font-medium">
                      Descarga Inmediata
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium">
                      En Stock ({product.physicalSpecs?.stock} unidades)
                    </span>
                  )}
                </div>
              </div>

              {/* Affiliate Reseller Program Box */}
              {!isOwner && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Percent className="w-4 h-4 text-amber-400" />
                      <span>Programa de Afiliados / Revendedor</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      Gana {formatCRC(affiliateEarning)} por venta
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Puedes vender este producto en tu propia tienda o compartir tu enlace. Recibirás
                    el <strong className="text-amber-400 font-mono">{commissionPercent}%</strong> de
                    comisión directo a tu cartera con cada venta.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAffiliate}
                      className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {copiedAffiliate ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Enlace de Afiliado Copiado!</span>
                        </>
                      ) : isAffiliated ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Activo en tu Tienda (Copiar Link)</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Vender en mi Tienda / Obtener Enlace</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {product.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Características Destacadas:
                </span>
                <ul className="space-y-1 text-xs text-zinc-300">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-2 text-xs">
                {product.kind === 'digital' && product.digitalSpecs && (
                  <>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Formatos incluidos:</span>
                      <span className="text-white font-mono font-medium">
                        {product.digitalSpecs.fileFormats.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Tamaño del archivo:</span>
                      <span className="text-white font-mono">
                        {product.digitalSpecs.fileSize}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Compatibilidad:</span>
                      <span className="text-amber-400">
                        {product.digitalSpecs.compatibility.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Licencia:</span>
                      <span className="text-white">{product.digitalSpecs.license}</span>
                    </div>
                  </>
                )}

                {product.kind === 'fisico' && product.physicalSpecs && (
                  <>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Materiales:</span>
                      <span className="text-white">{product.physicalSpecs.materials}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Dimensiones:</span>
                      <span className="text-white font-mono">
                        {product.physicalSpecs.dimensions}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Peso:</span>
                      <span className="text-white font-mono">{product.physicalSpecs.weight}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Entrega en Costa Rica:</span>
                      <span className="text-emerald-400 font-medium">
                        {product.physicalSpecs.shippingDays}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sticky Buy Module */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => onAddToCart(product)}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isInCart
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-[0.99]'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Artículo Añadido al Carrito</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {product.kind === 'digital'
                        ? `Comprar por ${formatCRC(product.price)} · Descarga Inmediata`
                        : `Comprar por ${formatCRC(product.price)} · Enviar a Taller`}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Garantía de satisfacción
                </span>
                <span>·</span>
                <span>Pago SINPE Móvil o Tarjeta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen 3D Overlay Modal */}
      {isFullscreen3D && (
        <div className="fixed inset-0 z-60 bg-[#090b11] flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0e1017]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Box className="w-4 h-4 text-amber-400" />
              <span>Modo Estudio 360° · {product.title}</span>
            </div>
            <button
              onClick={() => setIsFullscreen3D(false)}
              className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full h-full relative">
            <ThreeCanvasViewer meshPreset={meshPreset} modelTitle={product.title} />
          </div>
        </div>
      )}
    </div>
  );
};
