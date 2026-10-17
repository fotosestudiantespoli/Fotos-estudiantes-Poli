import React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_CREATORS_MAP } from '../data/initialUsers';

interface StoriesBarProps {
  currentUser: UserProfile | null;
  onOpenUpload: () => void;
  onSelectCreator: (handle: string | null) => void;
  activeCreatorFilter: string | null;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  currentUser,
  onOpenUpload,
  onSelectCreator,
  activeCreatorFilter
}) => {
  const creators = Object.values(INITIAL_CREATORS_MAP);

  return (
    <div className="py-4 border-b border-white/10 bg-[#0d0f17]/60 backdrop-blur-sm overflow-x-auto no-scrollbar select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 sm:gap-6 min-w-max">
        {/* Your Story / Quick Upload */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={onOpenUpload}>
          <div className="relative">
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 group-hover:scale-105 transition-transform shadow-md">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt="Tu historia"
                className="w-full h-full rounded-full object-cover border-2 border-[#0b0c10]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-black border-2 border-[#0b0c10] shadow-sm">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-zinc-300 group-hover:text-amber-400 max-w-[64px] truncate text-center">
            {currentUser ? 'Tu Tienda' : 'Vender'}
          </span>
        </div>

        {/* All Stories Filter button */}
        <div
          className="flex flex-col items-center gap-1.5 cursor-pointer group"
          onClick={() => onSelectCreator(null)}
        >
          <div
            className={`w-14 h-14 rounded-full p-[2px] transition-all flex items-center justify-center ${
              activeCreatorFilter === null
                ? 'bg-amber-500 ring-2 ring-amber-400/50'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#151824] flex items-center justify-center text-xs font-bold text-white border-2 border-[#0b0c10]">
              Todos
            </div>
          </div>
          <span
            className={`text-[11px] font-medium max-w-[64px] truncate text-center ${
              activeCreatorFilter === null ? 'text-amber-400 font-semibold' : 'text-zinc-400 group-hover:text-white'
            }`}
          >
            Explorar
          </span>
        </div>

        {/* Creator Stories */}
        {creators.map((creator) => {
          const isActive = activeCreatorFilter?.toLowerCase() === creator.handle.toLowerCase();
          return (
            <div
              key={creator.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
              onClick={() => onSelectCreator(isActive ? null : creator.handle)}
            >
              <div
                className={`w-14 h-14 rounded-full p-[2px] transition-all group-hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 ring-2 ring-amber-400/60 shadow-lg'
                    : 'bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-300 opacity-90 group-hover:opacity-100'
                }`}
              >
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0b0c10]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span
                className={`text-[11px] font-medium max-w-[70px] truncate text-center ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-zinc-300 group-hover:text-white'
                }`}
              >
                {creator.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
