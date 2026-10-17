import React, { useState } from 'react';
import { X, HelpCircle, Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { CommunityCategory, CommunityQuestion, UserProfile } from '../types';

interface NewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Omit<CommunityQuestion, 'id' | 'createdAt' | 'upvotes' | 'answers' | 'isSolved'>) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const NewQuestionModal: React.FC<NewQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  onOpenAuth
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('procreate_3d');
  const [tagsInput, setTagsInput] = useState('Procreate, 3D, Stencils');
  const [error, setError] = useState('');

  const categoryLabels: Record<CommunityCategory, string> = {
    procreate_3d: 'Modelos 3D & Procreate',
    stencils_tatuaje: 'Stencils & Tatuaje',
    hardware_tools: 'Hardware & Dials',
    ventas_sinpe: 'SINPE Móvil & Ventas',
    general: 'Diseño General'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (title.trim().length < 10) {
      setError('El título de la pregunta debe tener al menos 10 caracteres.');
      return;
    }
    if (content.trim().length < 20) {
      setError('Por favor explica tu duda con al menos 20 caracteres para que la comunidad pueda ayudarte.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      categoryLabel: categoryLabels[category],
      tags: tags.length > 0 ? tags : ['Comunidad', 'Ayuda'],
      author: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        location: currentUser.location || 'Costa Rica',
        rating: 5.0,
        salesTotal: currentUser.salesCount || 0,
        verified: currentUser.verified
      }
    });

    setTitle('');
    setContent('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#141622] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Hacer una Pregunta a la Comunidad</h2>
              <p className="text-[11px] text-zinc-400">
                Diseñadores, tatuadores y artistas 3D de Costa Rica te ayudarán
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {!currentUser && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
              <span>Debes iniciar sesión para publicar preguntas.</span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-2.5 py-1 bg-amber-500 text-black font-semibold rounded-lg text-[11px]"
              >
                Iniciar Sesión
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Título de tu pregunta o duda *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: ¿Cómo exportar texturas 4K sin pérdida en Procreate 5.2?"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Categoría del Tema
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityCategory)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-zinc-200 focus:outline-none"
            >
              <option value="procreate_3d">Modelos 3D & Procreate</option>
              <option value="stencils_tatuaje">Stencils & Tatuaje</option>
              <option value="hardware_tools">Hardware, Dials & Instrumentos</option>
              <option value="ventas_sinpe">SINPE Móvil, Comisiones & Ventas</option>
              <option value="general">Diseño General & Software</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Detalles de tu pregunta (Explica qué has probado o tu contexto) *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe con claridad tu duda, modelo de iPad, app utilizada (Procreate, Nomad Sculpt, Blender) o técnica..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Procreate, iPad, Stencils, Anatomía"
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Pregunta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
