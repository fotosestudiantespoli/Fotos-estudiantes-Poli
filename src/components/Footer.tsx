import React from 'react';

interface FooterProps {
  onOpenProcreateGuide: () => void;
  onOpenUpload: () => void;
  onSelectFilter: (filter: 'all' | 'digital' | 'fisico') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenProcreateGuide,
  onOpenUpload,
  onSelectFilter
}) => {
  return (
    <footer className="bg-[#08090d] border-t border-white/10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
              KRAFTWERK <span className="text-zinc-500 font-normal">STUDIO</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Plataforma y tienda de diseño donde creadores profesionales compran y venden
              herramientas digitales (modelos 3D anatómicos, brushes para Procreate, tipografías) e
              instrumentos físicos de precisión para taller.
            </p>
            <div className="text-[11px] text-zinc-500">
              Compatible con Procreate 5.2+, Nomad Sculpt, Blender, ZBrush, Photoshop y Figma.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Catálogo
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectFilter('digital')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Modelos 3D & Anatomía
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFilter('digital')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pinceles & Brushes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFilter('fisico')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Dials CNC & Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFilter('fisico')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Instrumentos de Medición
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Comunidad & Creadores
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenUpload} className="hover:text-amber-400 transition-colors">
                  Vender mis herramientas
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProcreateGuide}
                  className="hover:text-amber-400 transition-colors"
                >
                  Guía de importación iPad
                </button>
              </li>
              <li>
                <span className="text-zinc-500">Licencias Comerciales Extendidas</span>
              </li>
              <li>
                <span className="text-zinc-500">Control de Calidad Quad UV</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>© {new Date().getFullYear()} KRAFTWERK Studio. Todos los derechos reservados.</div>
          <div className="flex items-center gap-4">
            <span>Privacidad</span>
            <span>·</span>
            <span>Términos de Licencia</span>
            <span>·</span>
            <span>Garantía de Descarga</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
