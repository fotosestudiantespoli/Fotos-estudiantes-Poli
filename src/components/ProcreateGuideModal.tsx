import React from 'react';
import { X, Tablet, Download, Sparkles, HelpCircle, ArrowRight, Printer } from 'lucide-react';

interface ProcreateGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcreateGuideModal: React.FC<ProcreateGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div className="flex items-center gap-2">
            <Tablet className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-display">
              Guía Oficial: Cómo usar Modelos 3D en Procreate (iPad)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
            <div className="font-semibold text-sm mb-1">
              Requisitos: Procreate 5.2 o superior en iPad Pro, iPad Air o iPad estándar
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Todos los modelos 3D disponibles en KRAFTWERK Studio incluyen topología limpia en quads
              y texturas UV 4K desempaquetadas, listas para pintar con Apple Pencil sin necesidad de
              Blender ni configuraciones complejas.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Descargar el archivo .OBJ al iPad</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Al completar tu compra o pulsar &quot;Exportar .OBJ&quot;, el archivo se descargará en
                  la app <strong className="text-white">Archivos</strong> de tu iPad (carpeta
                  Descargas). También puedes transferirlo por AirDrop desde tu Mac o PC.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Importar directamente a Procreate</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Abre Procreate. En la pantalla principal de la Galería, toca el botón{' '}
                  <strong className="text-white">&quot;Importar&quot;</strong> en la esquina superior
                  derecha y selecciona el archivo <code className="text-amber-400">.obj</code>. ¡El
                  modelo 3D se abrirá al instante en un lienzo tridimensional!
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Pintar y probar stencils con Apple Pencil
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Gira el modelo con un dedo y pellizca con dos dedos para hacer zoom. Usa tus pinceles
                  habituales de tatuaje para pintar líneas o sombreados; Procreate adaptará
                  automáticamente los trazos a las curvas anatómicas del brazo o torso.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Imprimir el Stencil 2D Plano para tu Termocopiadora</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Una vez que estés satisfecho con cómo se ve el diseño en 3D, ve a{' '}
                  <strong className="text-white">Acciones &gt; Compartir &gt; Texturas 2D</strong>.
                  Procreate aplanará el mapa UV con tu tatuaje en alta resolución (PNG), listo para
                  enviar a tu impresora térmica Brother PocketJet u Ozer Stencil.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors"
            >
              Entendido, volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
