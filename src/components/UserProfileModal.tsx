import React, { useState, useEffect } from 'react';
import {
  X,
  Wallet,
  TrendingUp,
  Download,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Box,
  FileCode,
  DollarSign,
  HelpCircle,
  Eye,
  Store,
  Percent
} from 'lucide-react';
import { UserProfile, PurchasedDownload } from '../types';
import { exportToOBJ, triggerDownload, generateProcreateReadme } from '../utils/objExporter';
import { formatCRC } from '../utils/currency';
import {
  buildForearmMesh,
  buildSkullMesh,
  buildHannyaMesh,
  buildTorsoMesh
} from '../utils/proceduralGeometries';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenStore: (handle: string) => void;
  onOpenProcreateGuide: () => void;
  initialTab?: 'wallet' | 'analytics' | 'downloads' | 'settings';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenStore,
  onOpenProcreateGuide,
  initialTab = 'wallet'
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'wallet' | 'analytics' | 'downloads' | 'settings'>(
    initialTab
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Withdrawal modal simulator state (Costa Rica SINPE Móvil & IBAN)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50000);
  const [withdrawMethod, setWithdrawMethod] = useState<'sinpe' | 'iban'>('sinpe');
  const [accountInfo, setAccountInfo] = useState('8842-1903 (BAC Credomatic)');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [specialty, setSpecialty] = useState(currentUser.specialty);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Download real 3D file on demand from user library
  const handleDownloadAsset = (download: PurchasedDownload) => {
    let group = buildForearmMesh();
    if (download.meshPreset === 'skull') group = buildSkullMesh();
    else if (download.meshPreset === 'hannya') group = buildHannyaMesh();
    else if (download.meshPreset === 'torso') group = buildTorsoMesh();

    const objContent = exportToOBJ(group, download.title);
    const filename = `${download.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_procreate.obj`;
    triggerDownload(objContent, filename, 'model/obj');

    const readme = generateProcreateReadme(download.title);
    triggerDownload(readme, `GUIA_PROCREATE_${download.title.replace(/\s+/g, '_')}.txt`, 'text/plain');
  };

  // Withdraw money handler in Colones
  const handleWithdrawFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > currentUser.walletBalance) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      type: 'withdrawal' as const,
      description: `Retiro de fondos por ${
        withdrawMethod === 'sinpe' ? 'SINPE Móvil' : 'IBAN BCR/BAC'
      } a ${accountInfo}`,
      amount: -withdrawAmount,
      status: 'completado' as const
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - withdrawAmount,
      transactions: [newTx, ...currentUser.transactions]
    };

    onUpdateUser(updatedUser);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawOpen(false);
    }, 1200);
  };

  // Save profile settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      bio,
      location,
      specialty
    };
    onUpdateUser(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f16]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
            />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                <span>{currentUser.name}</span>
                <span className="text-[11px] text-amber-400 font-mono font-normal">
                  {currentUser.handle}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Panel de Creador · {currentUser.specialty}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenStore(currentUser.handle);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/30 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ver Mi Tienda Pública</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 bg-[#0f111a] overflow-x-auto">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Mi Cartera & Fondos ({formatCRC(currentUser.walletBalance)})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Métricas de Ventas</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Mis Descargas ({currentUser.purchasedDownloads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ajustes de Tienda</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: WALLET / CARTERA */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Financial KPI Cards in Colones (₡) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-1">
                      <span>Saldo Disponible</span>
                      <Wallet className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
                      {formatCRC(currentUser.walletBalance)}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="mt-3 w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Retirar (SINPE Móvil)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
                    <span>Saldo en Liquidación</span>
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-zinc-200 font-mono tabular-nums">
                    {formatCRC(currentUser.pendingBalance)}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-2">
                    Disponible tras 24h de garantía
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mb-1">
                    <span>Ganancias Totales</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
                    {formatCRC(currentUser.totalEarnings)}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-2">
                    {currentUser.salesCount} ventas procesadas
                  </div>
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-1">
                    <span>Comisiones por Afiliado</span>
                    <Percent className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono tabular-nums">
                    {formatCRC(currentUser.affiliateEarnings || 0)}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-2">
                    Por revender productos de otros creadores
                  </div>
                </div>
              </div>

              {/* Transactions Log */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Historial de Movimientos de Cartera (Colones ₡)
                  </h3>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {currentUser.transactions.length} registros
                  </span>
                </div>

                <div className="bg-black/40 rounded-xl border border-white/5 divide-y divide-white/5">
                  {currentUser.transactions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      Aún no tienes movimientos registrados en tu cartera.
                    </div>
                  ) : (
                    currentUser.transactions.map((tx) => (
                      <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              tx.amount > 0
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {tx.amount > 0 ? '+' : '-'}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-white">{tx.description}</div>
                            <div className="text-[11px] text-zinc-500 font-mono">
                              {tx.date} · Estado: {tx.status}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`font-mono font-bold tabular-nums text-sm ${
                            tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-200'
                          }`}
                        >
                          {tx.amount > 0 ? `+${formatCRC(tx.amount)}` : `-${formatCRC(Math.abs(tx.amount))}`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS & METRICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* High Level Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">Ventas de Activos 3D</span>
                  <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                    {Math.round(currentUser.salesCount * 0.72)} u.
                  </span>
                  <span className="text-[10px] text-emerald-400">+18% este mes</span>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">Herramientas Físicas</span>
                  <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                    {Math.round(currentUser.salesCount * 0.28)} u.
                  </span>
                  <span className="text-[10px] text-amber-400">+12% este mes</span>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">Tasa de Conversión</span>
                  <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                    4.2%
                  </span>
                  <span className="text-[10px] text-zinc-500">De visitas a compra</span>
                </div>

                <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[11px] text-zinc-400 block">Ticket Medio</span>
                  <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                    {formatCRC(16500)}
                  </span>
                  <span className="text-[10px] text-emerald-400">Excelente margen</span>
                </div>
              </div>

              {/* Weekly Earnings Visual Simulator */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Ingresos Semanales (Colones ₡)</span>
                  <span className="text-zinc-400 font-mono">Últimas 6 semanas</span>
                </div>

                <div className="h-28 flex items-end justify-between gap-3 pt-4 px-2">
                  {[
                    { label: 'Sem 1', val: 140000, h: '45%' },
                    { label: 'Sem 2', val: 220000, h: '60%' },
                    { label: 'Sem 3', val: 125000, h: '35%' },
                    { label: 'Sem 4', val: 285000, h: '75%' },
                    { label: 'Sem 5', val: 245000, h: '65%' },
                    { label: 'Sem 6', val: 380000, h: '95%' }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] text-amber-400 font-mono">₡{(bar.val / 1000).toFixed(0)}k</span>
                      <div
                        style={{ height: bar.h }}
                        className="w-full max-w-[42px] bg-amber-500/80 hover:bg-amber-400 rounded-t transition-all"
                      />
                      <span className="text-[10px] text-zinc-500 font-mono">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top performing product */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-amber-400 font-semibold uppercase">
                    Producto Más Vendido en Tu Tienda
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Pack 3D Antebrazo & Mano Anatómica para Procreate
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    84 descargas · {formatCRC(1050000)} brutos generados
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenStore(currentUser.handle);
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Ver en Tienda
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MY DOWNLOADS / MIS DESCARGAS */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Biblioteca de Activos Digitales Comprados
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Descarga tus archivos cuantas veces quieras y envíalos por AirDrop a tu iPad.
                  </p>
                </div>

                <button
                  onClick={onOpenProcreateGuide}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Guía iPad Procreate</span>
                </button>
              </div>

              {currentUser.purchasedDownloads.length === 0 ? (
                <div className="p-8 text-center bg-black/40 rounded-xl border border-white/5">
                  <Download className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">Aún no tienes activos descargables</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Cuando compres modelos 3D o pinceles en la tienda, aparecerán aquí para siempre.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {currentUser.purchasedDownloads.map((dl) => (
                    <div
                      key={dl.id}
                      className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={dl.coverImage}
                          alt={dl.title}
                          className="w-14 h-14 rounded-lg object-cover bg-zinc-800 shrink-0 border border-white/10"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{dl.title}</h4>
                          <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                            Archivo: {dl.fileName}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            Comprado el {dl.purchaseDate} · Formatos: {dl.formats.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDownloadAsset(dl)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar .OBJ & Guía</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STORE SETTINGS / AJUSTES */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Nombre Público de Creador / Tienda
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">
                    Ubicación / Taller
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Biografía de Tienda
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors"
                >
                  Guardar Cambios
                </button>
                {settingsSaved && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Cambios guardados con éxito
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Withdrawal Modal Simulator */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-[#131622] rounded-2xl border border-white/15 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display">
                Retirar Fondos de Tu Cartera
              </h3>
              <button
                onClick={() => setIsWithdrawOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdrawFunds} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  Monto a Retirar (Disponible: <strong className="text-white font-mono">{formatCRC(currentUser.walletBalance)}</strong>)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">
                    ₡
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    max={currentUser.walletBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-sm text-white font-mono"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Retiro directo sin comisión bancaria adicional
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Método de Transferencia (Costa Rica)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawMethod('sinpe');
                      setAccountInfo('8842-1903 (BAC Credomatic)');
                    }}
                    className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition-colors ${
                      withdrawMethod === 'sinpe'
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-amber-300">SINPE Móvil</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Depósito Inmediato</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawMethod('iban');
                      setAccountInfo('CR05015202001026284066 (BCR)');
                    }}
                    className={`p-2.5 rounded-lg text-xs font-semibold border text-left transition-colors ${
                      withdrawMethod === 'iban'
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-zinc-200">Cuenta IBAN (CR)</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">BCR / BAC / BNCR</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">
                  {withdrawMethod === 'sinpe'
                    ? 'Teléfono Celular SINPE & Entidad'
                    : 'Cuenta Cliente IBAN (22 dígitos)'}
                </label>
                <input
                  type="text"
                  required
                  value={accountInfo}
                  onChange={(e) => setAccountInfo(e.target.value)}
                  placeholder={
                    withdrawMethod === 'sinpe'
                      ? 'Ej: 8842-1903 (Banco Nacional)'
                      : 'Ej: CR05015202001026284066'
                  }
                  className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={withdrawSuccess || withdrawAmount <= 0 || withdrawAmount > currentUser.walletBalance}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  {withdrawSuccess ? '¡Retiro Procesado con Éxito!' : `Transferir ${formatCRC(withdrawAmount)} por ${withdrawMethod === 'sinpe' ? 'SINPE Móvil' : 'IBAN'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
