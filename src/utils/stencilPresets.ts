import { StencilPreset } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const STENCIL_PRESETS: StencilPreset[] = [
  {
    id: 'mandala',
    name: 'Mandala Sagrada',
    category: 'Geométrico',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <rect width="100%" height="100%" fill="transparent"/>
        <g stroke="#ffffff" stroke-width="3" fill="none" transform="translate(250, 250)">
          <circle r="220" stroke-width="2" stroke-dasharray="8 6"/>
          <circle r="190" stroke-width="3"/>
          <circle r="140"/>
          <circle r="90" stroke-width="4"/>
          <circle r="40" fill="#ffffff" fill-opacity="0.1"/>
          ${Array.from({ length: 12 })
            .map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = Math.cos(angle) * 190;
              const y = Math.sin(angle) * 190;
              return `<path d="M 0 0 Q ${x * 0.5} ${y * 0.5 + 40} ${x} ${y} Q ${x * 0.5 + 40} ${y * 0.5} 0 0" stroke="#ffffff" stroke-width="2.5" fill="rgba(255,255,255,0.05)"/>`;
            })
            .join('')}
          ${Array.from({ length: 8 })
            .map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x = Math.cos(angle) * 140;
              const y = Math.sin(angle) * 140;
              return `<circle cx="${x}" cy="${y}" r="22" stroke="#ffffff" stroke-width="2"/>`;
            })
            .join('')}
          <polygon points="0,-80 56,56 -80,0 56,-56 0,80 -56,-56 80,0 -56,56" stroke="#ffffff" stroke-width="2.5"/>
        </g>
      </svg>
    `)
  },
  {
    id: 'neotrad_rose',
    name: 'Rosa Neotradicional',
    category: 'Neotradicional',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <rect width="100%" height="100%" fill="transparent"/>
        <g stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="translate(250, 250)">
          <!-- Leaves -->
          <path d="M-80,40 Q-160,80 -180,140 Q-110,130 -80,70 Z" fill="rgba(255,255,255,0.08)"/>
          <path d="M-130,110 L-100,60" stroke-width="2"/>
          <path d="M70,50 Q160,90 190,150 Q110,140 70,80 Z" fill="rgba(255,255,255,0.08)"/>
          <path d="M120,115 L90,65" stroke-width="2"/>
          <!-- Rose Petals -->
          <path d="M-120,-30 C-140,70 140,80 120,-30 C90,-110 -90,-110 -120,-30 Z" stroke-width="5" fill="rgba(255,255,255,0.06)"/>
          <path d="M-90,-10 C-100,50 100,60 90,-10 C70,-70 -70,-70 -90,-10 Z" stroke-width="4"/>
          <path d="M-60,0 C-70,40 70,40 60,0 C50,-40 -50,-40 -60,0 Z" stroke-width="3.5"/>
          <path d="M-30,5 C-30,25 30,25 30,5 C20,-20 -20,-20 -30,5 Z" fill="#ffffff" fill-opacity="0.2"/>
          <path d="M0,25 Q-30,120 -10,190 Q10,190 5,120" stroke-width="6"/>
          <!-- Thorns -->
          <polygon points="-12,90 -45,105 -15,115" fill="#ffffff"/>
          <polygon points="8,135 40,145 10,160" fill="#ffffff"/>
        </g>
      </svg>
    `)
  },
  {
    id: 'snake_flash',
    name: 'Serpiente Japonesa',
    category: 'Japonés',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <rect width="100%" height="100%" fill="transparent"/>
        <g stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="translate(250, 250)">
          <!-- Serpentine S Curve -->
          <path d="M-40,-190 C60,-190 120,-110 70,-40 C10,30 -120,60 -70,140 C-30,200 40,210 80,180" stroke-width="18" stroke="#1f2433"/>
          <path d="M-40,-190 C60,-190 120,-110 70,-40 C10,30 -120,60 -70,140 C-30,200 40,210 80,180" stroke-width="4"/>
          <!-- Scale ridges -->
          ${Array.from({ length: 16 })
            .map((_, i) => {
              const y = -160 + i * 22;
              const x = Math.sin(i * 0.45) * 50;
              return `<path d="M${x - 14},${y} Q${x},${y - 8} ${x + 14},${y}" stroke-width="2.5"/>`;
            })
            .join('')}
          <!-- Snake Head -->
          <path d="M-40,-190 C-80,-210 -40,-240 -10,-225 C20,-215 0,-185 -40,-190 Z" fill="rgba(255,255,255,0.15)" stroke-width="4"/>
          <!-- Eye & Fang -->
          <circle cx="-25" cy="-215" r="4" fill="#ffffff"/>
          <path d="M-5,-215 L5,-200 L-2,-202" fill="#ffffff"/>
          <path d="M-8,-205 Q20,-200 35,-190" stroke-width="3"/>
          <!-- Forked tongue -->
          <path d="M0,-210 Q25,-210 45,-215 M45,-215 L60,-225 M45,-215 L60,-208" stroke="#ffffff" stroke-width="2.5"/>
        </g>
      </svg>
    `)
  },
  {
    id: 'cyber_tribal',
    name: 'Cyber Sigilism / Ornamental',
    category: 'Dark Ornamental',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <rect width="100%" height="100%" fill="transparent"/>
        <g stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" transform="translate(250, 250)">
          <path d="M0,-220 Q40,-100 120,-60 Q30,-20 180,40 Q60,30 80,160 Q10,70 0,220" stroke-width="4"/>
          <path d="M0,-220 Q-40,-100 -120,-60 Q-30,-20 -180,40 Q-60,30 -80,160 Q-10,70 0,220" stroke-width="4"/>
          <path d="M-80,-60 L80,-60" stroke-width="2"/>
          <path d="M-110,20 L110,20" stroke-width="2"/>
          <circle cx="0" cy="-60" r="14" fill="#ffffff" fill-opacity="0.2"/>
          <circle cx="0" cy="20" r="20" stroke-dasharray="4 4"/>
          <polygon points="0,-15 15,20 0,55 -15,20" fill="#ffffff"/>
          <!-- Barbs -->
          <path d="M70,-50 L110,-70 M-70,-50 L-110,-70" stroke-width="3"/>
          <path d="M120,40 L160,20 M-120,40 L-160,20" stroke-width="3"/>
        </g>
      </svg>
    `)
  }
];
