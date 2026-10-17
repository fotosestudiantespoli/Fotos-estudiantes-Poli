import React from 'react';
import { X, Trash2, ShoppingBag, Download, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { formatCRC } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasPhysical = items.some((item) => item.product.kind === 'fisico');
  const shipping = hasPhysical ? 2500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#10121a] h-full shadow-2xl flex flex-col border-l border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f16]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-display">
              Bolsa de Compras ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-white">Tu bolsa está vacía</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Explora el catálogo de modelos 3D para Procreate, pinceles de diseño o herramientas
                físicas de taller.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                <img
                  src={item.product.coverImage}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-zinc-800 shrink-0 border border-white/10"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white truncate leading-tight">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      {item.product.kind === 'digital' ? (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Download className="w-3 h-3" />
                          Descarga Inmediata (.OBJ / Pack)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Truck className="w-3 h-3" />
                          Envío Físico ({item.product.physicalSpecs?.shippingDays})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <div className="flex items-center gap-2 bg-white/5 rounded px-2 py-0.5 border border-white/5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="text-xs text-zinc-400 hover:text-white px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs text-white font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="text-xs text-zinc-400 hover:text-white px-1 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-white font-mono tabular-nums">
                      {formatCRC(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0d0f16] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">{formatCRC(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Envío (Costa Rica)</span>
                <span className="font-mono text-white tabular-nums">
                  {hasPhysical ? formatCRC(shipping) : 'Gratis (Descarga Digital)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>Total</span>
                <span className="font-mono text-amber-400 tabular-nums">{formatCRC(total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
            >
              <span>Completar Pedido & Obtener Archivos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Garantía de archivos 3D compatibles con Procreate</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
