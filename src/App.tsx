import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StoriesBar } from './components/StoriesBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ThreeCanvasViewer } from './components/ThreeCanvasViewer';
import { UploadProductModal } from './components/UploadProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProcreateGuideModal } from './components/ProcreateGuideModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CreatorStoreView } from './components/CreatorStoreView';
import { EditProductModal } from './components/EditProductModal';
import { CommunityView } from './components/CommunityView';
import { NewQuestionModal } from './components/NewQuestionModal';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { INITIAL_CURRENT_USER, INITIAL_CREATORS_MAP } from './data/initialUsers';
import { INITIAL_COMMUNITY_QUESTIONS } from './data/initialCommunity';
import {
  ProductItem,
  CartItem,
  UserProfile,
  OrderRecord,
  PurchasedDownload,
  WalletTransaction,
  CommunityQuestion,
  CommunityAnswer
} from './types';
import { formatCRC } from './utils/currency';
import {
  Box,
  Layers,
  Store,
  ChevronDown,
  Check,
  X,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  PlusCircle,
  MessageSquare
} from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'kraftwerk_studio_products_v3';
const STORAGE_KEY_CART = 'kraftwerk_studio_cart_v3';
const STORAGE_KEY_USER = 'kraftwerk_studio_user_v3';
const STORAGE_KEY_COMMUNITY = 'kraftwerk_community_questions_v1';

export default function App() {
  // 1. Persistent Products
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore
    }
  }, [products]);

  // 2. Persistent Current User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_CURRENT_USER;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // Ignore
    }
  }, [currentUser]);

  // 3. Persistent Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // 4. Persistent Community Questions
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMUNITY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_COMMUNITY_QUESTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(communityQuestions));
    } catch {
      // Ignore
    }
  }, [communityQuestions]);

  // 5. Filters, Search & View Modes
  const [viewMode, setViewMode] = useState<'feed' | 'grid' | 'community'>('feed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'digital' | 'fisico'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoryCreator, setActiveStoryCreator] = useState<string | null>(null);

  // Sorting state & dropdown
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'popular' | 'affiliate'>('recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideSort = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideSort);
    return () => document.removeEventListener('mousedown', handleOutsideSort);
  }, []);

  // 6. Modals State
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);
  const [active3DPreviewProduct, setActive3DPreviewProduct] = useState<ProductItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcreateGuideOpen, setIsProcreateGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'wallet' | 'analytics' | 'downloads' | 'settings'>('wallet');
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 7. Creator Storefront state
  const [activeStoreHandle, setActiveStoreHandle] = useState<string | null>(null);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`"${product.title}" agregado al carrito.`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Publish new product from user
  const handlePublishProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);

    // Update user's store stats
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              salesCount: prev.salesCount
            }
          : prev
      );
    }

    showToast('¡Herramienta publicada con éxito en tu tienda!');
  };

  // Edit existing product published by user
  const handleSaveEditedProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProductDetail?.id === updated.id) {
      setSelectedProductDetail(updated);
    }
    setProductToEdit(null);
    showToast('¡Publicación actualizada correctamente!');
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProductDetail?.id === productId) {
      setSelectedProductDetail(null);
    }
    setProductToEdit(null);
    showToast('Publicación eliminada del catálogo.');
  };

  // Toggle selling other users' products as an affiliate in user's storefront
  const handleToggleAffiliate = (productId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const currentList = currentUser.affiliatedProductIds || [];
    const isAlreadyAffiliated = currentList.includes(productId);
    const updatedList = isAlreadyAffiliated
      ? currentList.filter((id) => id !== productId)
      : [...currentList, productId];

    const updatedUser: UserProfile = {
      ...currentUser,
      affiliatedProductIds: updatedList
    };
    setCurrentUser(updatedUser);

    const prod = products.find((p) => p.id === productId);
    if (!isAlreadyAffiliated && prod) {
      const commRate = prod.affiliateCommissionPercent || 15;
      const earning = (prod.price * commRate) / 100;
      showToast(
        `¡"${prod.title}" añadido a tu tienda! Ganarás ${formatCRC(earning)} (${commRate}%) por venta.`
      );
    } else {
      showToast('Producto retirado de tu escaparate de afiliados.');
    }
  };

  // Order completed handler: add purchased downloads to user library & credit sellers + affiliate commissions
  const handleOrderCompleted = (order: OrderRecord, purchasedItems: CartItem[]) => {
    setCart([]);

    if (currentUser) {
      // 1. Add purchased digital items to the user's downloads library
      const newDownloads: PurchasedDownload[] = purchasedItems
        .filter((i) => i.product.kind === 'digital')
        .map((i) => ({
          id: `dl-${Date.now()}-${i.product.id}`,
          productId: i.product.id,
          title: i.product.title,
          coverImage: i.product.coverImage,
          fileName: i.product.digitalSpecs?.downloadFileName || `${i.product.title}.zip`,
          formats: i.product.digitalSpecs?.fileFormats || ['OBJ', 'USDZ'],
          purchaseDate: new Date().toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          meshPreset: i.product.digitalSpecs?.meshPreset
        }));

      // 2. Check sales revenue for products owned by current user
      let addedRevenue = 0;
      let addedAffiliateRevenue = 0;
      const newTransactions: WalletTransaction[] = [];

      purchasedItems.forEach((item) => {
        // Own product sale
        if (item.product.creator.handle.toLowerCase() === currentUser.handle.toLowerCase()) {
          const itemRev = item.product.price * item.quantity;
          addedRevenue += itemRev;
          newTransactions.push({
            id: `tx-sale-${Date.now()}-${item.product.id}`,
            date: new Date().toLocaleDateString('es-CR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            type: 'sale' as const,
            description: `Venta en tu tienda: ${item.product.title} (${item.quantity} ud.)`,
            amount: itemRev * 0.9,
            status: 'completado' as const
          });
        }

        // Affiliate commission earned (selling other creator's product)
        if (
          currentUser.affiliatedProductIds?.includes(item.product.id) &&
          item.product.creator.handle.toLowerCase() !== currentUser.handle.toLowerCase()
        ) {
          const commPercent = item.product.affiliateCommissionPercent || 15;
          const commEarned = (item.product.price * item.quantity * commPercent) / 100;
          addedAffiliateRevenue += commEarned;
          newTransactions.push({
            id: `tx-aff-${Date.now()}-${item.product.id}`,
            date: new Date().toLocaleDateString('es-CR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            type: 'sale' as const,
            description: `Comisión de afiliado (${commPercent}%): ${item.product.title} (${item.product.creator.handle})`,
            amount: commEarned,
            status: 'completado' as const
          });
        }
      });

      const totalNewBalance = addedRevenue + addedAffiliateRevenue;

      const updatedUser: UserProfile = {
        ...currentUser,
        purchasedDownloads: [...newDownloads, ...currentUser.purchasedDownloads],
        walletBalance: currentUser.walletBalance + totalNewBalance,
        totalEarnings: currentUser.totalEarnings + totalNewBalance,
        affiliateEarnings: (currentUser.affiliateEarnings || 0) + addedAffiliateRevenue,
        salesCount: currentUser.salesCount + (addedRevenue > 0 ? 1 : 0),
        transactions: [...newTransactions, ...currentUser.transactions]
      };

      setCurrentUser(updatedUser);
      showToast('¡Compra confirmada! Archivos 3D listos en tu perfil.');
    }
  };

  // Community Operations (Q&A blog helpers)
  const handleCreateQuestion = (
    newQData: Omit<CommunityQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers' | 'isSolved'>
  ) => {
    const newQuestion: CommunityQuestion = {
      ...newQData,
      id: `q-${Date.now()}`,
      createdAt: 'Hace unos momentos',
      upvotes: 1,
      answers: [],
      isSolved: false
    };
    setCommunityQuestions((prev) => [newQuestion, ...prev]);
    showToast('¡Pregunta publicada en la comunidad! Los creadores te responderán pronto.');
  };

  const handleUpvoteQuestion = (questionId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const handleUpvoteAnswer = (questionId: string, answerId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
              )
            }
          : q
      )
    );
  };

  const handleAddAnswer = (questionId: string, content: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const newAnswer: CommunityAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      author: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        location: currentUser.location || 'San José, Costa Rica',
        rating: 5.0,
        salesTotal: currentUser.salesCount || 0,
        verified: currentUser.verified
      },
      content,
      createdAt: 'Hace un momento',
      upvotes: 1
    };

    setCommunityQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
    showToast('¡Gracias por ayudar! Tu respuesta ha sido publicada en la duda.');
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isSolved: true,
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === answerId
              }))
            }
          : q
      )
    );
    showToast('¡Duda marcada como resuelta con la solución aceptada!');
  };

  // Categories list
  const availableCategories = useMemo(() => {
    return [
      { id: 'all', label: 'Todas las categorías' },
      { id: '3d_models', label: 'Modelos 3D Anatómicos (Procreate)', kind: 'digital' },
      { id: 'brushes', label: 'Pinceles & Brushes', kind: 'digital' },
      { id: 'hardware_dials', label: 'Hardware Dials CNC', kind: 'fisico' },
      { id: 'measuring_tools', label: 'Calibradores Shinwa', kind: 'fisico' },
      { id: 'paper_sketchbooks', label: 'Cuadernos 160g', kind: 'fisico' }
    ];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Stories filter
      if (activeStoryCreator && p.creator.handle.toLowerCase() !== activeStoryCreator.toLowerCase()) {
        return false;
      }
      if (activeFilter !== 'all' && p.kind !== activeFilter) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCreator = p.creator.name.toLowerCase().includes(q);
        const matchesFormats = p.digitalSpecs?.fileFormats.some((f) => f.toLowerCase().includes(q));
        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesTags &&
          !matchesCreator &&
          !matchesFormats
        ) {
          return false;
        }
      }
      return true;
    });
  }, [products, activeFilter, selectedCategory, searchQuery, activeStoryCreator]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'affiliate') {
      list.sort(
        (a, b) =>
          (b.affiliateCommissionPercent || 15) - (a.affiliateCommissionPercent || 15)
      );
    }
    return list;
  }, [filteredProducts, sortBy]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to resolve creator data for activeStoreHandle
  const activeCreatorProfile = useMemo(() => {
    if (!activeStoreHandle) return undefined;
    if (currentUser && currentUser.handle.toLowerCase() === activeStoreHandle.toLowerCase()) {
      return currentUser;
    }
    return INITIAL_CREATORS_MAP[activeStoreHandle];
  }, [activeStoreHandle, currentUser]);

  const resetAllFilters = () => {
    setActiveFilter('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveStoryCreator(null);
  };

  const hasActiveFilters =
    activeFilter !== 'all' ||
    selectedCategory !== 'all' ||
    Boolean(searchQuery.trim()) ||
    Boolean(activeStoryCreator);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price_asc':
        return 'Precio: Menor a Mayor';
      case 'price_desc':
        return 'Precio: Mayor a Menor';
      case 'popular':
        return 'Más Populares';
      case 'affiliate':
        return 'Mayor Comisión';
      default:
        return 'Más Recientes';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2eb] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Modern Clean Navbar with Dropdowns (Instagram/Facebook aesthetic + Community Mode) */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenNewQuestion={() => setIsNewQuestionModalOpen(true)}
        activeFilter={activeFilter}
        onSelectFilter={(filter) => {
          setActiveFilter(filter);
          setSelectedCategory('all');
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        onOpenProcreateGuide={() => setIsProcreateGuideOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={(tab) => {
          if (tab) setProfileInitialTab(tab);
          setIsProfileModalOpen(true);
        }}
        onOpenMyStore={() => {
          if (currentUser) {
            setActiveStoreHandle(currentUser.handle);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        availableCategories={availableCategories}
      />

      {/* 2. Instagram Stories Bar (Diseñadores y Creadores) - shown in Feed and Grid modes */}
      {viewMode !== 'community' && (
        <StoriesBar
          currentUser={currentUser}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onSelectCreator={(handle) => setActiveStoryCreator(handle)}
          activeCreatorFilter={activeStoryCreator}
        />
      )}

      {/* 3. Main Content: Community Q&A Blog OR Feed / Explore Catalog */}
      {viewMode === 'community' ? (
        <CommunityView
          questions={communityQuestions}
          currentUser={currentUser}
          onOpenNewQuestion={() => setIsNewQuestionModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenStore={(handle) => setActiveStoreHandle(handle)}
          onUpvoteQuestion={handleUpvoteQuestion}
          onUpvoteAnswer={handleUpvoteAnswer}
          onAddAnswer={handleAddAnswer}
          onAcceptAnswer={handleAcceptAnswer}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
          {/* Streamlined Sub-Header with Sorting Dropdown & Active Filter Indicators */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5 text-xs">
            {/* Left: Active Filters or Title */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {activeStoryCreator && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-300 font-medium whitespace-nowrap">
                  <span>Historias de {activeStoryCreator}</span>
                  <button
                    type="button"
                    onClick={() => setActiveStoryCreator(null)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-zinc-200 whitespace-nowrap">
                  <span>
                    {availableCategories.find((c) => c.id === selectedCategory)?.label ||
                      selectedCategory}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-zinc-200 whitespace-nowrap">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-amber-400 hover:text-amber-300 hover:underline text-[11px] font-medium whitespace-nowrap"
                >
                  Limpiar todo
                </button>
              )}

              {!hasActiveFilters && (
                <span className="text-zinc-400 font-medium">
                  {viewMode === 'feed' ? 'Feed de Publicaciones' : 'Explorar Herramientas'} (
                  {sortedProducts.length})
                </span>
              )}
            </div>

            {/* Right: Dropdown Menu para Ordenar (Sort) */}
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 hover:text-white transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>{getSortLabel()}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isSortDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-[#161926] border border-white/15 rounded-xl shadow-2xl py-1.5 z-30 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('recent');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Más Recientes</span>
                    {sortBy === 'recent' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('price_asc');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Precio: Menor a Mayor (₡)</span>
                    {sortBy === 'price_asc' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('price_desc');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Precio: Mayor a Menor (₡)</span>
                    {sortBy === 'price_desc' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('popular');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Más Populares</span>
                    {sortBy === 'popular' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('affiliate');
                      setIsSortDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between"
                  >
                    <span>Mayor % de Comisión</span>
                    {sortBy === 'affiliate' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Render: Feed View or Grid View */}
          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">
                No se encontraron publicaciones
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Prueba cambiando los filtros desplegables o la búsqueda.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                Ver todas las publicaciones
              </button>
            </div>
          ) : viewMode === 'feed' ? (
            /* Instagram / Facebook Clean Centered Feed */
            <div className="max-w-xl sm:max-w-2xl mx-auto">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout="feed"
                  onOpenDetail={(prod) => setSelectedProductDetail(prod)}
                  onOpen3DViewer={(prod) => setActive3DPreviewProduct(prod)}
                  onAddToCart={(prod) => handleAddToCart(prod)}
                  isInCart={cart.some((item) => item.product.id === product.id)}
                  onOpenStore={(handle) => setActiveStoreHandle(handle)}
                  isOwner={
                    currentUser
                      ? currentUser.handle.toLowerCase() === product.creator.handle.toLowerCase()
                      : false
                  }
                  onEditProduct={(prod) => setProductToEdit(prod)}
                  onDeleteProduct={handleDeleteProduct}
                  isAffiliated={currentUser?.affiliatedProductIds?.includes(product.id) || false}
                  onToggleAffiliate={handleToggleAffiliate}
                />
              ))}
            </div>
          ) : (
            /* Instagram Explore Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout="grid"
                  onOpenDetail={(prod) => setSelectedProductDetail(prod)}
                  onOpen3DViewer={(prod) => setActive3DPreviewProduct(prod)}
                  onAddToCart={(prod) => handleAddToCart(prod)}
                  isInCart={cart.some((item) => item.product.id === product.id)}
                  onOpenStore={(handle) => setActiveStoreHandle(handle)}
                  isOwner={
                    currentUser
                      ? currentUser.handle.toLowerCase() === product.creator.handle.toLowerCase()
                      : false
                  }
                  onEditProduct={(prod) => setProductToEdit(prod)}
                  onDeleteProduct={handleDeleteProduct}
                  isAffiliated={currentUser?.affiliatedProductIds?.includes(product.id) || false}
                  onToggleAffiliate={handleToggleAffiliate}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#181b29] text-white border border-amber-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* New Question Modal (Community Q&A Blog) */}
      <NewQuestionModal
        isOpen={isNewQuestionModalOpen}
        onClose={() => setIsNewQuestionModalOpen(false)}
        onSubmit={handleCreateQuestion}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Product Detail Modal with 3D Viewer */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        isInCart={
          selectedProductDetail
            ? cart.some((item) => item.product.id === selectedProductDetail.id)
            : false
        }
        onOpenProcreateGuide={() => setIsProcreateGuideOpen(true)}
        onOpenStore={(handle) => {
          setSelectedProductDetail(null);
          setActiveStoreHandle(handle);
        }}
        isOwner={
          currentUser && selectedProductDetail
            ? currentUser.handle.toLowerCase() === selectedProductDetail.creator.handle.toLowerCase()
            : false
        }
        onEditProduct={(prod) => {
          setSelectedProductDetail(null);
          setProductToEdit(prod);
        }}
        isAffiliated={
          selectedProductDetail && currentUser?.affiliatedProductIds
            ? currentUser.affiliatedProductIds.includes(selectedProductDetail.id)
            : false
        }
        onToggleAffiliate={handleToggleAffiliate}
      />

      {/* Edit Product Modal (When user edits photos, price, desc, etc.) */}
      <EditProductModal
        isOpen={Boolean(productToEdit)}
        product={productToEdit}
        onClose={() => setProductToEdit(null)}
        onSave={handleSaveEditedProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Creator Store View Modal */}
      {activeStoreHandle && (
        <CreatorStoreView
          creatorHandle={activeStoreHandle}
          creatorData={activeCreatorProfile}
          products={products}
          currentUser={currentUser}
          onClose={() => setActiveStoreHandle(null)}
          onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
          onOpen3DViewer={(prod) => setActive3DPreviewProduct(prod)}
          onAddToCart={handleAddToCart}
          cartProductIds={cart.map((i) => i.product.id)}
          onOpenUploadForThisStore={() => {
            setActiveStoreHandle(null);
            setIsUploadModalOpen(true);
          }}
        />
      )}

      {/* Standalone 3D Viewer Fullscreen Modal */}
      {active3DPreviewProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0e1017]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Box className="w-4 h-4 text-amber-400" />
              <span>Visor 3D 360° · {active3DPreviewProduct.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedProductDetail(active3DPreviewProduct);
                  setActive3DPreviewProduct(null);
                }}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                Ver Ficha de Producto
              </button>
              <button
                type="button"
                onClick={() => setActive3DPreviewProduct(null)}
                className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full h-full relative">
            <ThreeCanvasViewer
              meshPreset={
                active3DPreviewProduct.digitalSpecs?.meshPreset ||
                active3DPreviewProduct.physicalSpecs?.meshPreset ||
                'forearm'
              }
              modelTitle={active3DPreviewProduct.title}
            />
          </div>
        </div>
      )}

      {/* User Profile, Wallet & Metrics Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onOpenStore={(handle) => setActiveStoreHandle(handle)}
          onOpenProcreateGuide={() => setIsProcreateGuideOpen(true)}
          initialTab={profileInitialTab}
        />
      )}

      {/* Authentication & Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Upload/Sell Product Modal */}
      <UploadProductModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPublishProduct={handlePublishProduct}
        currentUser={currentUser}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={() => setIsCheckoutModalOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={cart}
        onOrderCompleted={handleOrderCompleted}
        onOpenProcreateGuide={() => setIsProcreateGuideOpen(true)}
      />

      {/* Procreate 3D Guide Modal */}
      <ProcreateGuideModal
        isOpen={isProcreateGuideOpen}
        onClose={() => setIsProcreateGuideOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <Footer
        onOpenProcreateGuide={() => setIsProcreateGuideOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onSelectFilter={(filter) => {
          setActiveFilter(filter);
          setSelectedCategory('all');
        }}
      />
    </div>
  );
}
