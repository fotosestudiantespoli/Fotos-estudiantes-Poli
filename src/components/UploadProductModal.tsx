import React, { useState } from 'react';
import {
  X,
  Upload,
  Box,
  Truck,
  Check,
  Download,
  AlertCircle,
  Sparkles,
  Layers,
  Percent
} from 'lucide-react';
import { ProductItem, ProductKind, ProductCategory, UserProfile } from '../types';
import { formatCRC } from '../utils/currency';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishProduct: (product: ProductItem) => void;
  currentUser?: UserProfile | null;
}

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  onPublishProduct,
  currentUser
}) => {
  if (!isOpen) return null;

  const [kind, setKind] = useState<ProductKind>('digital');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('3d_models');
  const [price, setPrice] = useState<number>(15000);
  const [affiliateCommissionPercent, setAffiliateCommissionPercent] = useState<number>(15);
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState(
    'Topología limpia en quads\nMallado optimizado para Procreate\nTexturas 4K incluidas'
  );

  // Digital fields
  const [formatsText, setFormatsText] = useState('OBJ, USDZ, GLTF');
  const [fileSize, setFileSize] = useState('95 MB');
  const [meshPreset, setMeshPreset] = useState<
    'forearm' | 'skull' | 'hannya' | 'torso' | 'dial' | 'caliper'
  >('forearm');

  // Physical fields
  const [stock, setStock] = useState<number>(20);
  const [weight, setWeight] = useState('250g');
  const [dimensions, setDimensions] = useState('120 x 80 x 25 mm');
  const [materials, setMaterials] = useState('Aluminio anodizado CNC / Acero inoxidable');
  const [shippingDays, setShippingDays] = useState('2 a 4 días hábiles');

  // Image preview state
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    '/src/assets/images/model_forearm_anatomy_1791969191843.jpg'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>('modelo_3d_procreate.obj');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const availableImagePresets = [
    {
      name: 'Antebrazo 3D',
      url: '/src/assets/images/model_forearm_anatomy_1791969191843.jpg',
      preset: 'forearm' as const
    },
    {
      name: 'Hannya 3D',
      url: '/src/assets/images/model_hannya_sculpt_1791969192321.jpg',
      preset: 'hannya' as const
    },
    {
      name: 'Cráneo 3D',
      url: '/src/assets/images/model_skull_anatomy_1791969193309.jpg',
      preset: 'skull' as const
    },
    {
      name: 'Torso 3D',
      url: '/src/assets/images/model_torso_mannequin_1791969192564.jpg',
      preset: 'torso' as const
    },
    {
      name: 'Dial CNC Físico',
      url: '/src/assets/images/prod_macro_dial_controller_1791969306402.jpg',
      preset: 'dial' as const
    },
    {
      name: 'Calibrador Shinwa',
      url: '/src/assets/images/prod_precision_caliper_gauge_1791969306774.jpg',
      preset: 'caliper' as const
    },
    {
      name: 'Pinceles Procreate',
      url: '/src/assets/images/prod_procreate_brushset_1791969307936.jpg',
      preset: 'forearm' as const
    },
    {
      name: 'Cuaderno Dot-Grid',
      url: '/src/assets/images/prod_dotgrid_sketchbook_1791969308108.jpg',
      preset: 'forearm' as const
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const newProduct: ProductItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      kind,
      category,
      categoryLabel:
        kind === 'digital'
          ? category === '3d_models'
            ? 'Modelos 3D'
            : 'Pinceles & Assets'
          : category === 'hardware_dials'
          ? 'Hardware & Dials'
          : 'Medición & Dibujo',
      price: Math.max(500, price),
      originalPrice: Math.round(price * 1.25),
      affiliateCommissionPercent: affiliateCommissionPercent,
      creator: {
        name: currentUser ? currentUser.name : 'Alex Rivera',
        handle: currentUser ? currentUser.handle : '@alex_tattoo_3d',
        avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        location: currentUser ? currentUser.location : 'San José, Costa Rica',
        rating: 5.0,
        salesTotal: currentUser ? currentUser.salesCount : 1,
        verified: true
      },
      description: description.trim() || 'Herramienta profesional diseñada y probada en taller.',
      highlights: highlights.length > 0 ? highlights : ['Calidad verificada por diseñadores'],
      coverImage: coverImageUrl,
      tags: [kind === 'digital' ? 'Descarga Digital' : 'Envío Físico', 'Procreate', 'Diseño'],
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...(kind === 'digital'
        ? {
            digitalSpecs: {
              fileFormats: formatsText.split(',').map((f) => f.trim().toUpperCase()),
              fileSize: fileSize || '85 MB',
              compatibility: ['Procreate 5.2+', 'Nomad Sculpt', 'Blender'],
              meshPreset: meshPreset,
              license: 'Comercial Extendido',
              downloadFileName: uploadedFileName || `${title.replace(/\s+/g, '_')}.zip`
            }
          }
        : {
            physicalSpecs: {
              stock: stock,
              weight: weight,
              dimensions: dimensions,
              materials: materials,
              shippingDays: shippingDays,
              originCountry: 'Taller Oficial',
              meshPreset: meshPreset === 'dial' || meshPreset === 'caliper' ? meshPreset : undefined
            }
          })
    };

    setTimeout(() => {
      onPublishProduct(newProduct);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Publicar Herramienta para Diseñadores
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Pon a la venta modelos 3D, brushes, tipografías o instrumentos físicos de taller
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Select Type (Digital vs Physical) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              1. Tipo de Herramienta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setKind('digital');
                  setCategory('3d_models');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  kind === 'digital'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Herramienta Digital</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Modelos 3D (.OBJ, .USDZ), pinceles Procreate, fuentes, mockups
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setKind('fisico');
                  setCategory('hardware_dials');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  kind === 'fisico'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Herramienta Física</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Dials CNC, calibradores, cuadernos de dibujo, equipo de taller
                </p>
              </button>
            </div>
          </div>

          {/* Step 2: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Título del Producto *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Pack 3D Escultura Muscular de Brazo para Procreate"
                className="w-full px-3.5 py-2.5 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {kind === 'digital' ? (
                  <>
                    <option value="3d_models">Modelos 3D (Procreate & Nomad)</option>
                    <option value="brushes">Pinceles & Brushes</option>
                    <option value="typography">Tipografía & Fuentes</option>
                    <option value="ui_kits">Kits UI & Diseño</option>
                  </>
                ) : (
                  <>
                    <option value="hardware_dials">Hardware & Dials de Atajos</option>
                    <option value="measuring_tools">Medición & Calibradores</option>
                    <option value="paper_sketchbooks">Papelería & Cuadernos</option>
                    <option value="drawing_tools">Herramientas de Dibujo</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Precio de Venta (Colones ₡) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">
                  ₡
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Equivale a {formatCRC(price)}
              </span>
            </div>

            <div className="sm:col-span-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  <span>Comisión para Revendedores / Afiliados (%)</span>
                </label>
                <span className="text-xs font-mono font-bold text-white">
                  {formatCRC((price * affiliateCommissionPercent) / 100)} de ganancia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={affiliateCommissionPercent}
                  onChange={(e) => setAffiliateCommissionPercent(parseInt(e.target.value, 10) || 15)}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-xs font-mono font-bold text-amber-400 w-12 text-right">
                  {affiliateCommissionPercent}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Permite que otros diseñadores promocionen tu herramienta en sus tiendas. Ganarán un {affiliateCommissionPercent}% por venta referida.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-zinc-300 block mb-1">
                Descripción para Diseñadores
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla cómo se usa este activo en Procreate, software compatible o características de los materiales físicos..."
                className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Step 3: Type Specific Technical Configuration */}
          {kind === 'digital' ? (
            <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Box className="w-4 h-4" />
                <span>Configuración de Modelo 3D & Archivos Digitales</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Preset de Visor 3D Interactivo
                  </label>
                  <select
                    value={meshPreset}
                    onChange={(e) =>
                      setMeshPreset(
                        e.target.value as 'forearm' | 'skull' | 'hannya' | 'torso' | 'dial' | 'caliper'
                      )
                    }
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  >
                    <option value="forearm">Antebrazo & Mano Anatómica (Tatuajes)</option>
                    <option value="hannya">Máscara Hannya Tradicional</option>
                    <option value="skull">Cráneo Anatómico de Referencia</option>
                    <option value="torso">Torso Muscular Masculino</option>
                    <option value="dial">Dial Mecánico / Knob</option>
                    <option value="caliper">Calibrador Digital</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Formatos incluidos
                  </label>
                  <input
                    type="text"
                    value={formatsText}
                    onChange={(e) => setFormatsText(e.target.value)}
                    placeholder="OBJ, USDZ, GLTF, BRUSHSET"
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Cargar Archivo 3D / Paquete (.OBJ, .USDZ, .ZIP)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded-lg cursor-pointer border border-white/10">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Seleccionar Archivo Local</span>
                      <input
                        type="file"
                        accept=".obj,.usdz,.gltf,.glb,.zip,.brushset"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-zinc-400 font-mono">
                      {uploadedFileName} ({fileSize})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Truck className="w-4 h-4" />
                <span>Configuración de Envío & Stock Físico</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Stock Disponible (Unidades)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Dimensiones
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="85 x 65 x 30 mm"
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">
                    Tiempo de Envío
                  </label>
                  <input
                    type="text"
                    value={shippingDays}
                    onChange={(e) => setShippingDays(e.target.value)}
                    placeholder="2 a 4 días hábiles"
                    className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Cover Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Foto de Portada del Producto
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {availableImagePresets.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCoverImageUrl(img.url);
                    setMeshPreset(img.preset);
                  }}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    coverImageUrl === img.url
                      ? 'border-amber-500 scale-105'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Custom Image Upload */}
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

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publicando en el Marketplace...</span>
              ) : submitSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Publicado con Éxito!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publicar Producto para la Venta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
