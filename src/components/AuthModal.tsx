import React, { useState } from 'react';
import { X, UserPlus, LogIn, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_CURRENT_USER, INITIAL_CREATORS_MAP } from '../data/initialUsers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Register form state
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('Tatuaje 3D & Ilustración');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  // Quick switch avatars
  const avatarChoices = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const formattedHandle = handle.startsWith('@') ? handle : `@${handle || name.toLowerCase().replace(/\s+/g, '_')}`;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      handle: formattedHandle,
      email: email.trim(),
      avatar: avatarUrl,
      banner: '/src/assets/images/hero_designer_studio_workspace_1791969305571.jpg',
      bio: bio.trim() || 'Diseñador y creador en KRAFTWERK Studio.',
      specialty,
      location: 'España',
      joinedDate: 'Octubre 2026',
      verified: true,
      followersCount: 1,
      walletBalance: 0.0,
      pendingBalance: 0.0,
      totalEarnings: 0.0,
      salesCount: 0,
      purchasedDownloads: [],
      transactions: []
    };

    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#11131c] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
            <h2 className="text-sm font-bold text-white font-display">
              {currentUser ? 'Cuenta de Diseñador Activa' : 'Acceso & Registro de Creadores'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {currentUser ? (
            /* Logged in state info */
            <div className="space-y-5 text-center">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 p-1 bg-amber-500 rounded-full text-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center justify-center gap-1.5">
                  <span>{currentUser.name}</span>
                </h3>
                <p className="text-xs text-amber-400 font-mono">{currentUser.handle}</p>
                <p className="text-xs text-zinc-400 mt-1">{currentUser.email}</p>
                <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto">{currentUser.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-black/40 rounded-xl border border-white/5 text-left text-xs">
                <div>
                  <span className="text-zinc-500 text-[11px] block">Cartera Disponible:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    ${currentUser.walletBalance.toFixed(2)} USD
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Ventas Realizadas:</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {currentUser.salesCount} ventas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onLogout();
                    setActiveTab('login');
                  }}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-colors"
                >
                  Continuar a mi Tienda
                </button>
              </div>
            </div>
          ) : (
            /* Auth forms: Tab switcher */
            <div className="space-y-5">
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión / Cuentas Demo</span>
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Crear Nueva Tienda</span>
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Fast demo accounts switcher + manual login */
                <div className="space-y-4">
                  <div className="text-xs text-zinc-400">
                    Selecciona una cuenta de creador para acceder al instante con tienda y cartera
                    activas:
                  </div>

                  <div className="space-y-2">
                    {/* Demo 1: Alex Rivera */}
                    <button
                      type="button"
                      onClick={() => {
                        onLogin(INITIAL_CURRENT_USER);
                        onClose();
                      }}
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={INITIAL_CURRENT_USER.avatar}
                          alt={INITIAL_CURRENT_USER.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/50"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                            <span>{INITIAL_CURRENT_USER.name}</span>
                            <span className="text-[10px] text-amber-400 font-normal">
                              (Tatuador 3D)
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {INITIAL_CURRENT_USER.handle} · Cartera: ${INITIAL_CURRENT_USER.walletBalance} USD
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                        Entrar →
                      </span>
                    </button>

                    {/* Demo 2: Dr. Marco Vexel */}
                    <button
                      type="button"
                      onClick={() => {
                        onLogin(INITIAL_CREATORS_MAP['@vexel_3d']);
                        onClose();
                      }}
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={INITIAL_CREATORS_MAP['@vexel_3d'].avatar}
                          alt={INITIAL_CREATORS_MAP['@vexel_3d'].name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                            <span>{INITIAL_CREATORS_MAP['@vexel_3d'].name}</span>
                            <span className="text-[10px] text-amber-400 font-normal">
                              (Anatomista 3D)
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            @vexel_3d · Cartera: ${INITIAL_CREATORS_MAP['@vexel_3d'].walletBalance} USD
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                        Entrar →
                      </span>
                    </button>

                    {/* Demo 3: KRAFT Atelier Lab */}
                    <button
                      type="button"
                      onClick={() => {
                        onLogin(INITIAL_CREATORS_MAP['@kraft_atelier']);
                        onClose();
                      }}
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={INITIAL_CREATORS_MAP['@kraft_atelier'].avatar}
                          alt={INITIAL_CREATORS_MAP['@kraft_atelier'].name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
                            <span>{INITIAL_CREATORS_MAP['@kraft_atelier'].name}</span>
                            <span className="text-[10px] text-amber-400 font-normal">
                              (Hardware CNC)
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            @kraft_atelier · Cartera: ${INITIAL_CREATORS_MAP['@kraft_atelier'].walletBalance} USD
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                        Entrar →
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">
                      Nombre o Nombre del Estudio *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Blackwork Studio"
                      className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">
                        Handle de Tienda *
                      </label>
                      <input
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="@tu_estudio"
                        className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contacto@estudio.com"
                        className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">
                      Especialidad de Diseño
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tatuaje 3D & Ilustración">Tatuaje 3D & Ilustración</option>
                      <option value="Escultura Digital & Topología">
                        Escultura Digital & Topología
                      </option>
                      <option value="Pinceles Procreate & Caligrafía">
                        Pinceles Procreate & Caligrafía
                      </option>
                      <option value="Hardware CNC & Herramientas Físicas">
                        Hardware CNC & Herramientas Físicas
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">
                      Breve Biografía para tu Tienda
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Cuéntale a la comunidad qué herramientas o activos diseñas..."
                      className="w-full px-3.5 py-2 bg-[#171a25] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">
                      Elige tu Foto de Perfil
                    </label>
                    <div className="flex items-center gap-3">
                      {avatarChoices.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(av)}
                          className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                            avatarUrl === av ? 'border-amber-500 scale-110' : 'border-white/10 opacity-70'
                          }`}
                        >
                          <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-[0.99] mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Crear Cuenta & Abrir Mi Tienda</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
