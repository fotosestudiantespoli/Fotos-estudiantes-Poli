import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Download,
  Truck,
  ShieldCheck,
  CreditCard,
  Smartphone,
  HelpCircle,
  Package,
  Percent
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types';
import { exportToOBJ, triggerDownload, generateProcreateReadme } from '../utils/objExporter';
import {
  buildForearmMesh,
  buildSkullMesh,
  buildHannyaMesh,
  buildTorsoMesh,
  buildDialHardwareMesh,
  buildCaliperMesh
} from '../utils/proceduralGeometries';
import { formatCRC } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: OrderRecord, items: CartItem[]) => void;
  onOpenProcreateGuide: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
  onOpenProcreateGuide
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.tattoo.cr@atelier.studio');
  const [address, setAddress] = useState('San José, Barrio Escalante, Calle 33, Costa Rica');
  const [paymentMethod, setPaymentMethod] = useState<'sinpe' | 'card'>('sinpe');
  const [sinpePhone, setSinpePhone] = useState('8842-1903');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasPhysical = items.some((item) => item.product.kind === 'fisico');
  const shipping = hasPhysical ? 2500 : 0; // ₡2.500 Correos de Costa Rica
  const total = subtotal + shipping;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ORD-CR-${Math.floor(100000 + Math.random() * 900000)}`;

      const digitalDownloads = items
        .filter((item) => item.product.kind === 'digital')
        .map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          fileName: item.product.digitalSpecs?.downloadFileName || `${item.product.title}.zip`,
          format: item.product.digitalSpecs?.fileFormats.join(', ') || 'OBJ, USDZ',
          downloadUrl: '#'
        }));

      const record: OrderRecord = {
        orderId,
        createdAt: new Date().toLocaleDateString('es-CR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: [...items],
        subtotal,
        shipping,
        total,
        customerName: name,
        customerEmail: email,
        shippingAddress: hasPhysical ? address : undefined,
        downloadsReady: digitalDownloads,
        physicalShipment: hasPhysical
          ? {
              trackingNumber: `CR-CCR-${Math.floor(10000000 + Math.random() * 90000000)}`,
              courier: 'Correos de Costa Rica (Servicio Express)',
              estimatedDelivery: '1 a 3 días hábiles en Costa Rica'
            }
          : undefined
      };

      setCompletedOrder(record);
      setIsProcessing(false);
      onOrderCompleted(record, items);
    }, 1000);
  };

  // Generate & download real OBJ file on user demand
  const handleDownloadModel = (title: string, preset?: string) => {
    let group = buildForearmMesh();
    if (preset === 'skull') group = buildSkullMesh();
    else if (preset === 'hannya') group = buildHannyaMesh();
    else if (preset === 'torso') group = buildTorsoMesh();
    else if (preset === 'dial') group = buildDialHardwareMesh();
    else if (preset === 'caliper') group = buildCaliperMesh();

    const obj = exportToOBJ(group, title);
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_procreate.obj`;
    triggerDownload(obj, filename, 'model/obj');

    const guide = generateProcreateReadme(title);
    triggerDownload(guide, `GUIA_PROCREATE_${title.replace(/\s+/g, '_')}.txt`, 'text/plain');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              {completedOrder ? '¡Compra Exitosa y Archivos Listos!' : 'Checkout Seguro · Costa Rica'}
            </h2>
            <span className="text-[11px] text-zinc-400">
              Pagos en Colones (₡) · SINPE Móvil & Tarjetas
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!completedOrder ? (
            <form onSubmit={handlePay} className="space-y-6">
              {/* Order items preview strip */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Resumen de tu pedido ({items.length} artículos)
                </div>
                {items.map((i) => (
                  <div key={i.product.id} className="flex justify-between text-xs py-1">
                    <span className="text-zinc-200 truncate pr-2">
                      {i.quantity}x {i.product.title}
                    </span>
                    <span className="text-white font-mono shrink-0">
                      {formatCRC(i.product.price * i.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-zinc-400 pt-1">
                  <span>Envío (Costa Rica)</span>
                  <span className="font-mono text-zinc-300">
                    {hasPhysical ? formatCRC(shipping) : 'Gratis (Descarga)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between text-sm font-bold text-white">
                  <span>Total a Pagar</span>
                  <span className="text-amber-400 font-mono">{formatCRC(total)}</span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Datos de Contacto y Envío en Costa Rica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Email (para licencias y descargas)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                  {hasPhysical && (
                    <div className="sm:col-span-2">
                      <label className="text-xs text-zinc-400 block mb-1">
                        Dirección de Entrega en Costa Rica (Provincia, Cantón y Señas)
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: San José, Montes de Oca, 200m este de la rotonda..."
                        className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods Costa Rica: SINPE Móvil & Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Método de Pago en Costa Rica
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sinpe')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'sinpe'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>SINPE Móvil</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Pago instantáneo por número telefónico
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Tarjeta Débito / Crédito</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Visa / Mastercard / BAC / BCR
                    </span>
                  </button>
                </div>

                {paymentMethod === 'sinpe' ? (
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <label className="text-xs text-zinc-400 block">
                      Número Telefónico para Comprobante SINPE Móvil:
                    </label>
                    <input
                      type="text"
                      required
                      value={sinpePhone}
                      onChange={(e) => setSinpePhone(e.target.value)}
                      placeholder="8888-8888"
                      className="w-full px-3 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white font-mono"
                    />
                    <p className="text-[11px] text-emerald-400">
                      ✓ Confirmación automática en Colones al número central KRAFTWERK Costa Rica
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#171a25] border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Tarjeta Nacional / Internacional</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{cardNumber}</span>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Procesando pago seguro en Colones...</span>
                ) : (
                  <span>Confirmar Pago de {formatCRC(total)} & Obtener Archivos</span>
                )}
              </button>
            </form>
          ) : (
            /* Post-purchase Instant Download Center */
            <div className="space-y-6">
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white font-display">
                  ¡Gracias por tu compra en Costa Rica, {completedOrder.customerName}!
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Número de orden: <span className="font-mono text-white">{completedOrder.orderId}</span>
                </p>
                <p className="text-xs text-zinc-400">
                  Hemos enviado una copia de tus licencias a{' '}
                  <span className="text-amber-400">{completedOrder.customerEmail}</span>
                </p>
              </div>

              {/* Digital Downloads Section */}
              {completedOrder.downloadsReady.length > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>CENTRO DE DESCARGAS INMEDIATAS (3D & DIGITAL)</span>
                    </div>
                    <button
                      onClick={onOpenProcreateGuide}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline"
                    >
                      Ver Guía iPad Procreate
                    </button>
                  </div>

                  <div className="divide-y divide-white/10">
                    {completedOrder.downloadsReady.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-white">{item.title}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {item.fileName} · Formato {item.format}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadModel(item.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar .OBJ</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Physical Shipment Section (Correos de Costa Rica) */}
              {completedOrder.physicalShipment && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Truck className="w-4 h-4" />
                    <span>SEGUIMIENTO DE ENVÍO CORREOS DE COSTA RICA</span>
                  </div>
                  <div className="text-xs text-zinc-300">
                    <div>
                      Transportista:{' '}
                      <span className="font-semibold text-white">
                        {completedOrder.physicalShipment.courier}
                      </span>
                    </div>
                    <div>
                      Número de guía:{' '}
                      <span className="font-mono text-emerald-400">
                        {completedOrder.physicalShipment.trackingNumber}
                      </span>
                    </div>
                    <div>
                      Entrega estimada:{' '}
                      <span className="text-white">
                        {completedOrder.physicalShipment.estimatedDelivery}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      Destino: {completedOrder.shippingAddress}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Cerrar y Seguir Explorando Tienda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
