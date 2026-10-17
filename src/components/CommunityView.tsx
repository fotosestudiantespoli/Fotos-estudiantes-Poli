import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  HelpCircle,
  Search,
  Plus,
  Send,
  User,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  Tag,
  Store,
  Filter,
  Check
} from 'lucide-react';
import { CommunityQuestion, CommunityAnswer, CommunityCategory, UserProfile } from '../types';

interface CommunityViewProps {
  questions: CommunityQuestion[];
  currentUser: UserProfile | null;
  onOpenNewQuestion: () => void;
  onOpenAuth: () => void;
  onOpenStore?: (handle: string) => void;
  onUpvoteQuestion: (questionId: string) => void;
  onUpvoteAnswer: (questionId: string, answerId: string) => void;
  onAddAnswer: (questionId: string, content: string) => void;
  onAcceptAnswer: (questionId: string, answerId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  questions,
  currentUser,
  onOpenNewQuestion,
  onOpenAuth,
  onOpenStore,
  onUpvoteQuestion,
  onUpvoteAnswer,
  onAddAnswer,
  onAcceptAnswer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSolved, setFilterSolved] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todas las Dudas' },
    { id: 'procreate_3d', label: 'Modelos 3D & Procreate' },
    { id: 'stencils_tatuaje', label: 'Stencils & Tatuaje' },
    { id: 'hardware_tools', label: 'Hardware & Dials' },
    { id: 'ventas_sinpe', label: 'SINPE Móvil & Ventas' },
    { id: 'general', label: 'General' }
  ];

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (filterSolved === 'solved' && !q.isSolved) return false;
    if (filterSolved === 'unsolved' && q.isSolved) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const inTitle = q.title.toLowerCase().includes(query);
      const inContent = q.content.toLowerCase().includes(query);
      const inAuthor = q.author.name.toLowerCase().includes(query) || q.author.handle.toLowerCase().includes(query);
      const inTags = q.tags.some((t) => t.toLowerCase().includes(query));
      if (!inTitle && !inContent && !inAuthor && !inTags) return false;
    }
    return true;
  });

  const handleSendAnswer = (questionId: string) => {
    const text = (answerDrafts[questionId] || '').trim();
    if (!text) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onAddAnswer(questionId, text);
    setAnswerDrafts((prev) => ({ ...prev, [questionId]: '' }));
  };

  const handleShareQuestion = (q: CommunityQuestion) => {
    navigator.clipboard?.writeText(
      `${window.location.origin}?communityQ=${q.id}`
    );
    setCopiedShareId(q.id);
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 animate-fadeIn">
      {/* Community Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#141624] via-[#12141f] to-[#171a2b] rounded-2xl border border-white/10 mb-8 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider font-mono">
            <MessageSquare className="w-4 h-4" />
            <span>Comunidad de Creadores & Ayuda Mutua · Costa Rica 🇨🇷</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Preguntas, Respuestas & Consejos Técnicos
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Un espacio donde diseñadores, tatuadores y artistas 3D se ayudan entre sí a resolver dudas
            sobre modelos 3D en Procreate, calibración de stencils, hardware de taller y ventas por SINPE Móvil.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenNewQuestion}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Hacer una Pregunta</span>
            </button>
            <span className="text-xs text-zinc-400 font-mono">
              {questions.length} dudas registradas · {questions.filter((q) => q.isSolved).length} resueltas
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas y respuestas por palabra clave..."
              className="w-full pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          {/* Solved status filter buttons */}
          <div className="flex items-center p-0.5 bg-white/5 rounded-xl border border-white/10 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setFilterSolved('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filterSolved === 'all' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFilterSolved('solved')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                filterSolved === 'solved' ? 'bg-emerald-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              <span>Resueltas</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterSolved('unsolved')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filterSolved === 'unsolved' ? 'bg-white/15 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sin resolver
            </button>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="py-16 text-center bg-[#12141f] rounded-2xl border border-white/10">
            <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">No hay preguntas que coincidan</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Prueba cambiando la búsqueda o sé el primero en hacer una pregunta sobre este tema.
            </p>
            <button
              type="button"
              onClick={onOpenNewQuestion}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-xl"
            >
              Hacer una Pregunta
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const isAuthor = currentUser?.handle.toLowerCase() === q.author.handle.toLowerCase();

            return (
              <div
                key={q.id}
                className="bg-[#12141e] border border-white/10 rounded-2xl overflow-hidden shadow-md transition-all hover:border-white/20"
              >
                {/* Question Summary Bar */}
                <div className="p-4 sm:p-5">
                  {/* Author Header */}
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div
                      className="flex items-center gap-2.5 cursor-pointer group"
                      onClick={() => onOpenStore && onOpenStore(q.author.handle)}
                    >
                      <img
                        src={q.author.avatar}
                        alt={q.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-300">
                            {q.author.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {q.author.handle}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <span>{q.author.location}</span>
                          <span>·</span>
                          <span>{q.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {q.categoryLabel}
                      </span>
                      {q.isSolved && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Resuelta</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Title & Content */}
                  <h3
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors cursor-pointer leading-snug"
                  >
                    {q.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                    {q.content}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Question Actions */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {/* Upvote Question */}
                      <button
                        type="button"
                        onClick={() => onUpvoteQuestion(q.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-amber-300 rounded-lg transition-colors font-medium active:scale-95"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{q.upvotes} votos útiles</span>
                      </button>

                      {/* Expand / View Answers */}
                      <button
                        type="button"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-zinc-300 hover:text-white transition-colors font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>{q.answers.length} {q.answers.length === 1 ? 'respuesta' : 'respuestas'}</span>
                      </button>

                      {/* Share Question */}
                      <button
                        type="button"
                        onClick={() => handleShareQuestion(q)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                        title="Copiar enlace de esta duda"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      {copiedShareId === q.id && (
                        <span className="text-[10px] text-emerald-400 font-medium">¡Copiado!</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <span>{isExpanded ? 'Ocultar respuestas' : 'Ver y responder'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answers Section */}
                {isExpanded && (
                  <div className="bg-[#0e1017] border-t border-white/10 p-4 sm:p-5 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Respuestas de la Comunidad ({q.answers.length})
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {q.isSolved ? '✓ Esta duda ya tiene solución verificada' : 'Aporta tu experiencia'}
                      </span>
                    </div>

                    {/* Answers List */}
                    {q.answers.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-400">
                        Aún no hay respuestas para esta duda. ¡Sé el primero en ayudar a este creador!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {q.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              ans.isAccepted
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div
                                className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => onOpenStore && onOpenStore(ans.author.handle)}
                              >
                                <img
                                  src={ans.author.avatar}
                                  alt={ans.author.name}
                                  className="w-7 h-7 rounded-full object-cover border border-amber-500/60"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white group-hover:text-amber-300">
                                      {ans.author.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                      {ans.author.handle}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-zinc-400">{ans.createdAt}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {ans.isAccepted && (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                                    <Check className="w-3 h-3" />
                                    <span>Solución Aceptada</span>
                                  </span>
                                )}

                                {isAuthor && !ans.isAccepted && (
                                  <button
                                    type="button"
                                    onClick={() => onAcceptAnswer(q.id, ans.id)}
                                    className="text-[11px] text-zinc-400 hover:text-emerald-400 underline font-medium"
                                  >
                                    Marcar como solución
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-zinc-200 leading-relaxed pl-9">
                              {ans.content}
                            </p>

                            <div className="mt-2.5 pl-9 flex items-center justify-between text-[11px]">
                              <button
                                type="button"
                                onClick={() => onUpvoteAnswer(q.id, ans.id)}
                                className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{ans.upvotes} personas les sirvió esta respuesta</span>
                              </button>

                              {onOpenStore && (
                                <button
                                  type="button"
                                  onClick={() => onOpenStore(ans.author.handle)}
                                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                                >
                                  <Store className="w-3 h-3" />
                                  <span>Ver tienda de {ans.author.name.split(' ')[0]}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Answer Form */}
                    <div className="pt-3 border-t border-white/5">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={
                            currentUser?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          alt="Tu avatar"
                          className="w-8 h-8 rounded-full object-cover border border-amber-500/50 shrink-0 mt-1"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-2">
                          <textarea
                            rows={3}
                            value={answerDrafts[q.id] || ''}
                            onChange={(e) =>
                              setAnswerDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder={
                              currentUser
                                ? 'Escribe tu respuesta o experiencia para ayudar a este creador...'
                                : 'Inicia sesión para responder a esta duda...'
                            }
                            className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-zinc-500">
                              Consejo: Sé claro y comparte técnicas comprobadas en iPad, Procreate o taller.
                            </span>

                            <button
                              type="button"
                              onClick={() => handleSendAnswer(q.id)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
                            >
                              <Send className="w-3 h-3" />
                              <span>Responder y Ayudar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
