import React from 'react';
import { Search, Sparkles, Box, Wrench, Download, Truck } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'digital' | 'fisico';
  onFilterChange: (filter: 'all' | 'digital' | 'fisico') => void;
  totalProductsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  totalProductsCount
}) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0e1017]">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_designer_studio_workspace_1791969305571.jpg"
          alt="Estudio de diseño con herramientas físicas y digitales"
          className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-3xl">
          {/* Unboxed natural kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wider uppercase font-display">
            <span>Marketplace Oficial de Creadores</span>
            <span aria-hidden="true">·</span>
            <span>Digital & Físico</span>
            <span aria-hidden="true">·</span>
            <span>Procreate 5.2+ Compatible</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display text-balance leading-tight">
            Herramientas de Precisión para Diseñadores y Tatuadores
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl text-pretty">
            Descubre modelos 3D anatómicos listos para probar stencils y pintar en Procreate, packs
            de brushes profesionales, e instrumentos físicos de taller como dials de atajos CNC,
            calibradores y cuadernos técnicos.
          </p>

          {/* Search bar & Interactive Segmented Controls */}
          <div className="mt-8 space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por antebrazo, 3D, dial CNC, pinceles, calibrador, cráneo..."
                className="w-full pl-10 pr-4 py-3 bg-[#131622]/90 border border-white/15 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-1.5 py-0.5 rounded"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Segmented Filter Buttons (Allowed per skill constitution: functional button elements) */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'all'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>Todos los Productos</span>
                <span className="text-[11px] opacity-75 font-mono">({totalProductsCount})</span>
              </button>

              <button
                onClick={() => onFilterChange('digital')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'digital'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Herramientas Digitales (Descarga Inmediata)</span>
              </button>

              <button
                onClick={() => onFilterChange('fisico')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'fisico'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Herramientas Físicas (Envíos a Domicilio)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
