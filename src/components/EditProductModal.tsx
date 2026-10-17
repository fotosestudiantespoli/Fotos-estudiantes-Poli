import React, { useState } from 'react';
import {
  X,
  Upload,
  Box,
  Truck,
  Check,
  Download,
  Trash2,
  Sparkles,
  Percent,
  AlertCircle
} from 'lucide-react';
import { ProductItem, ProductKind, ProductCategory } from '../types';
import { formatCRC } from '../utils/currency';

interface EditProductModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProductItem) => void;
  onDelete?: (productId: string) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen || !product) return null;

  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState<ProductCategory>(product.category);
  const [price, setPrice] = useState<number>(product.price);
  const [originalPrice, setOriginalPrice] = useState<number>(product.originalPrice || Math.round(product.price * 1.25));
  const [affiliateCommission, setAffiliateCommission] = useState<number>(product.affiliateCommissionPercent || 15);
  const [description, setDescription] = useState(product.description);
  const [highlightsText, setHighlightsText] = useState(product.highlights.join('\n'));
  const [coverImageUrl, setCoverImageUrl] = useState(product.coverImage);

  // Digital
  const [formatsText, setFormatsText] = useState(
    product.digitalSpecs?.fileFormats.join(', ') || 'OBJ, USDZ, GLTF'
  );
  const [fileSize, setFileSize] = useState(product.digitalSpecs?.fileSize || '85 MB');
  const [meshPreset, setMeshPreset] = useState<
    'forearm' | 'skull' | 'hannya' | 'torso' | 'dial' | 'caliper'
  >(
    (product.digitalSpecs?.meshPreset as 'forearm' | 'skull' | 'hannya' | 'torso' | 'dial' | 'caliper') ||
      'forearm'
  );

  // Physical
  const [stock, setStock] = useState<number>(product.physicalSpecs?.stock || 10);
  const [dimensions, setDimensions] = useState(product.physicalSpecs?.dimensions || '100 x 50 x 20 mm');
  const [weight, setWeight] = useState(product.physicalSpecs?.weight || '250g');
  const [shippingDays, setShippingDays] = useState(
    product.physicalSpecs?.shippingDays || '1 a 2 días hábiles (GAM)'
  );

  const [isSaved, setIsSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const availableImagePresets = [
    { name: 'Antebrazo 3D', url: '/src/assets/images/model_forearm_anatomy_1791969191843.jpg' },
    { name: 'Hannya 3D', url: '/src/assets/images/model_hannya_sculpt_1791969192321.jpg' },
    { name: 'Cráneo 3D', url: '/src/assets/images/model_skull_anatomy_1791969193309.jpg' },
    { name: 'Torso 3D', url: '/src/assets/images/model_torso_mannequin_1791969192564.jpg' },
    { name: 'Dial CNC', url: '/src/assets/images/prod_macro_dial_controller_1791969306402.jpg' },
    { name: 'Calibrador', url: '/src/assets/images/prod_precision_caliper_gauge_1791969306774.jpg' },
    { name: 'Pinceles', url: '/src/assets/images/prod_procreate_brushset_1791969307936.jpg' },
    { name: 'Cuaderno', url: '/src/assets/images/prod_dotgrid_sketchbook_1791969308108.jpg' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCoverImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const updatedProduct: ProductItem = {
      ...product,
      title: title.trim(),
      category,
      categoryLabel:
        product.kind === 'digital'
          ? category === '3d_models'
            ? 'Modelos 3D'
            : 'Pinceles & Assets'
          : category === 'hardware_dials'
          ? 'Hardware & Dials'
          : 'Medición & Dibujo',
      price: Math.max(100, price),
      originalPrice: originalPrice > price ? originalPrice : undefined,
      affiliateCommissionPercent: affiliateCommission,
      description: description.trim(),
      highlights: highlights.length > 0 ? highlights : product.highlights,
      coverImage: coverImageUrl,
      ...(product.kind === 'digital'
        ? {
            digitalSpecs: {
              fileFormats: formatsText.split(',').map((f) => f.trim().toUpperCase()),
              fileSize: fileSize,
              compatibility: product.digitalSpecs?.compatibility || ['Procreate 5.2+', 'Blender'],
              meshPreset: meshPreset,
              license: product.digitalSpecs?.license || 'Comercial Extendido',
              downloadFileName: product.digitalSpecs?.downloadFileName || `${title.replace(/\s+/g, '_')}.zip`
            }
          }
        : {
            physicalSpecs: {
              stock: stock,
              weight: weight,
              dimensions: dimensions,
              materials: product.physicalSpecs?.materials || 'Materiales de taller',
              shippingDays: shippingDays,
              originCountry: product.physicalSpecs?.originCountry || 'Costa Rica',
              meshPreset: product.physicalSpecs?.meshPreset
            }
          })
    };

    onSave(updatedProduct);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              Editar Publicación · {product.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Modifica fotos, descripción, precio en Colones (₡) y porcentaje de afiliados
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Title */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">
              Título del Producto
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pricing & Affiliates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Precio de Venta (Colones ₡) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">
                  ₡
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Equivale a {formatCRC(price)}
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Precio Anterior / Oferta (₡)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">
                  ₡
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Comisión de Afiliados (%)
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-xs">
                  %
                </span>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={affiliateCommission}
                  onChange={(e) => setAffiliateCommission(parseInt(e.target.value, 10) || 15)}
                  className="w-full px-3 pr-7 py-2 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-amber-400 mt-1 block">
                Revendedores ganan {formatCRC((price * affiliateCommission) / 100)}
              </span>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Descripción</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Puntos Destacados (un punto por línea)
              </label>
              <textarea
                rows={4}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Type Specific Fields */}
          {product.kind === 'digital' ? (
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
              <span className="text-xs font-semibold text-amber-400 block">
                Ajustes 3D & Archivos Digitales
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Modelo 3D Interactivo</label>
                  <select
                    value={meshPreset}
                    onChange={(e) =>
                      setMeshPreset(
                        e.target.value as 'forearm' | 'skull' | 'hannya' | 'torso' | 'dial' | 'caliper'
                      )
                    }
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  >
                    <option value="forearm">Antebrazo & Mano Anatómica</option>
                    <option value="hannya">Máscara Hannya 3D</option>
                    <option value="skull">Cráneo Óseo 3D</option>
                    <option value="torso">Torso Masculino 3D</option>
                    <option value="dial">Dial CNC</option>
                    <option value="caliper">Calibrador Shinwa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Formatos de Archivo</label>
                  <input
                    type="text"
                    value={formatsText}
                    onChange={(e) => setFormatsText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
              <span className="text-xs font-semibold text-emerald-400 block">
                Stock Físico & Envíos en Costa Rica
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Unidades Disponibles</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Tiempo de Entrega</label>
                  <input
                    type="text"
                    value={shippingDays}
                    onChange={(e) => setShippingDays(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Dimensiones</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cover Photo Changer */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 block">
              Cambiar Foto de Portada
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {availableImagePresets.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCoverImageUrl(img.url)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    coverImageUrl === img.url
                      ? 'border-amber-500 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </button>
              ))}

              <label className="w-20 h-16 rounded-lg border-2 border-dashed border-white/20 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer shrink-0 text-zinc-400 hover:text-white transition-colors">
                <Upload className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">Subir foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Actions & Delete Confirmation */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              {onDelete && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Publicación</span>
                </button>
              )}

              {confirmDelete && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 font-semibold">¿Seguro de borrar?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded"
                  >
                    Sí, borrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-zinc-400 hover:text-white text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-colors"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Cambios Guardados!</span>
                  </>
                ) : (
                  <span>Guardar Cambios</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
