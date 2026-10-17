import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Wallet,
  User,
  Store,
  Download,
  Search,
  ChevronDown,
  Check,
  Grid,
  Layers,
  BookOpen,
  LogOut,
  SlidersHorizontal,
  Box,
  Truck,
  Sparkles,
  X,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatCRC } from '../utils/currency';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenUpload: () => void;
  onOpenNewQuestion: () => void;
  activeFilter: 'all' | 'digital' | 'fisico';
  onSelectFilter: (filter: 'all' | 'digital' | 'fisico') => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenProcreateGuide: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: (tab?: 'downloads' | 'wallet' | 'analytics' | 'settings') => void;
  onOpenMyStore: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'feed' | 'grid' | 'community';
  onToggleViewMode: (mode: 'feed' | 'grid' | 'community') => void;
  availableCategories: { id: string; label: string; kind?: string }[];
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenUpload,
  onOpenNewQuestion,
  activeFilter,
  onSelectFilter,
  selectedCategory,
  onSelectCategory,
  onOpenProcreateGuide,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenMyStore,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  availableCategories
}) => {
  // Dropdown states
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setIsCreateDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveFilterLabel = () => {
    if (viewMode === 'community') return 'Comunidad Q&A';
    if (selectedCategory !== 'all') {
      const match = availableCategories.find((c) => c.id === selectedCategory);
      if (match) return match.label;
    }
    if (activeFilter === 'digital') return 'Solo 3D & Digital';
    if (activeFilter === 'fisico') return 'Solo Físico (CR)';
    return 'Explorar';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0b10]/95 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & View Mode Switcher (Instagram style + Community Q&A) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onToggleViewMode('feed');
              onSelectFilter('all');
              onSelectCategory('all');
              onSearchChange('');
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center text-black font-bold text-xs shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              KW
            </div>
            <span className="text-base font-bold tracking-tight text-white font-display hidden xl:inline">
              KRAFTWERK <span className="text-zinc-500 text-xs font-normal">CR</span>
            </span>
          </a>

          {/* Clean View Mode Toggle (Feed vs Grid vs Comunidad) */}
          <div className="flex items-center p-0.5 bg-white/5 rounded-lg border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => onToggleViewMode('feed')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'feed'
                  ? 'bg-amber-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Vista de Feed de Publicaciones"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Feed</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Vista de Cuadrícula / Explorar"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Explorar</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleViewMode('community')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === 'community'
                  ? 'bg-amber-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-amber-300'
              }`}
              title="Comunidad de Ayuda & Blog Q&A"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Comunidad Q&A</span>
            </button>
          </div>
        </div>

        {/* Center: Sleek Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                viewMode === 'community'
                  ? 'Buscar preguntas y respuestas de la comunidad...'
                  : 'Buscar modelos 3D, stencils, brushes...'
              }
              className="w-full pl-8 pr-7 py-1.5 bg-white/5 hover:bg-white/10 focus:bg-black/60 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Zone: Dropdown Menus & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dropdown 1: Categorías & Filtros */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
                setIsCreateDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedCategory !== 'all' || activeFilter !== 'all'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline max-w-[120px] truncate">
                {getActiveFilterLabel()}
              </span>
              <span className="lg:hidden text-xs">Filtros</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isFilterDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141620] border border-white/15 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-white/5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Filtrar por Categoría
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (viewMode === 'community') onToggleViewMode('feed');
                      onSelectFilter('all');
                      onSelectCategory('all');
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Todo el Catálogo</span>
                    {activeFilter === 'all' && selectedCategory === 'all' && viewMode !== 'community' && (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>

                  {availableCategories
                    .filter((c) => c.id !== 'all')
                    .map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (viewMode === 'community') onToggleViewMode('feed');
                          onSelectCategory(cat.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                      >
                        <span className="truncate">{cat.label}</span>
                        {selectedCategory === cat.id && viewMode !== 'community' && (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}
                </div>

                <div className="border-t border-white/10 my-1 pt-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Tipo de Herramienta
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (viewMode === 'community') onToggleViewMode('feed');
                      onSelectFilter('digital');
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-amber-400" />
                      Modelos 3D & Digitales (Procreate)
                    </span>
                    {activeFilter === 'digital' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (viewMode === 'community') onToggleViewMode('feed');
                      onSelectFilter('fisico');
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      Herramientas Físicas (Costa Rica)
                    </span>
                    {activeFilter === 'fisico' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>

                {/* Direct shortcut to Community */}
                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleViewMode('community');
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:bg-amber-500/10 flex items-center gap-2 font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ir a Comunidad de Dudas & Blog</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown 2: Publicar / Crear (Instagram style "+") */}
          <div className="relative" ref={createRef}>
            <button
              type="button"
              onClick={() => {
                setIsCreateDropdownOpen(!isCreateDropdownOpen);
                setIsFilterDropdownOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publicar</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isCreateDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCreateDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141620] border border-white/15 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateDropdownOpen(false);
                    onOpenUpload();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                      Subir Nueva Herramienta
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Modelos 3D, brushes o producto físico
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreateDropdownOpen(false);
                    onOpenNewQuestion();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      Hacer Pregunta a la Comunidad
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Pide ayuda sobre 3D, stencils o ventas
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreateDropdownOpen(false);
                    onOpenProcreateGuide();
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-300">
                      Guía Procreate 3D
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Cómo pintar stencils en iPad 5.2+
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Carrito de compras"
            className="relative p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dropdown 3: User Account / Profile Menu (Instagram & Facebook style) */}
          <div className="relative" ref={userRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsFilterDropdownOpen(false);
                  setIsCreateDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/70"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0b10]" />
                </div>
                <span className="text-xs font-medium text-white hidden lg:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            {/* Instagram / Facebook Account Dropdown Menu */}
            {isUserDropdownOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-72 bg-[#141620] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                {/* User Header Card */}
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                        <span>{currentUser.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">🇨🇷</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate font-mono">
                        {currentUser.handle}
                      </div>
                    </div>
                  </div>

                  {/* Wallet Balance Widget */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Saldo en Colones</span>
                      <span className="text-xs font-bold text-white font-mono text-emerald-400">
                        {formatCRC(currentUser.walletBalance)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onOpenProfile('wallet');
                      }}
                      className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      SINPE Móvil
                    </button>
                  </div>
                </div>

                {/* Menu items */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenProfile('settings');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Mi Perfil & Ajustes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenMyStore();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-300">Mi Tienda Pública</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenProfile('downloads');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-zinc-400" />
                      <span>Mis Descargas 3D</span>
                    </div>
                    {currentUser.purchasedDownloads.length > 0 && (
                      <span className="px-1.5 py-0.2 bg-white/10 text-white rounded text-[10px] font-mono">
                        {currentUser.purchasedDownloads.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenProfile('analytics');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-zinc-400" />
                    <span>Cartera, Métricas & Afiliados</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onToggleViewMode('community');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span className="font-medium">Comunidad & Blog de Ayuda</span>
                  </button>
                </div>

                <div className="border-t border-white/10 my-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-zinc-500" />
                    <span>Cambiar de cuenta / Salir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
