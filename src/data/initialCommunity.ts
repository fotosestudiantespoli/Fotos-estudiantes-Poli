import { CommunityQuestion } from '../types';

export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q-1',
    title: '¿Cómo exportar modelos 3D (.OBJ) de Nomad Sculpt a Procreate manteniendo las coordenadas UV intactas?',
    content:
      'Hola a todos. Estoy esculpiendo un antebrazo con musculatura para pruebas de stencils en Nomad Sculpt en el iPad, pero al importarlo en Procreate 5.2 las costuras de la textura se distorsionan en la muñeca. ¿Alguien sabe cuál es la mejor configuración de Unwrap UV antes de pintar con Apple Pencil?',
    category: 'procreate_3d',
    categoryLabel: 'Modelos 3D & Procreate',
    author: {
      name: 'Diego Montero',
      handle: '@diego_sculpt_cr',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      location: 'Heredia, Costa Rica',
      rating: 4.8,
      salesTotal: 34,
      verified: true
    },
    createdAt: 'Hace 3 horas',
    upvotes: 18,
    tags: ['NomadSculpt', 'Procreate5.2', 'UVUnwrap', 'iPadPro'],
    isSolved: true,
    answers: [
      {
        id: 'ans-1',
        questionId: 'q-1',
        author: {
          name: 'Alex Rivera',
          handle: '@alex_tattoo_3d',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          location: 'San José, Costa Rica',
          rating: 4.9,
          salesTotal: 92,
          verified: true
        },
        content:
          '¡Hola Diego! El secreto está en hacer un "Decimate" previo en Nomad para dejar la malla por debajo de 80.000 polígonos. Luego al hacer el UV automático, asegúrate de activar "Keep Seams" y exportar con normales suaves. En Procreate 5.2 abre la textura y verifica que el mapa de rugosidad esté en formato PNG de 2048x2048 o 4096x4096px. Si descargas el pack de antebrazo de mi tienda verás exactamente cómo viene estructurado el UV sin cortes en el pliegue.',
        createdAt: 'Hace 2 horas',
        upvotes: 24,
        isAccepted: true
      },
      {
        id: 'ans-2',
        questionId: 'q-1',
        author: {
          name: 'Elena Solís',
          handle: '@atelier_solis',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          location: 'San José, Costa Rica',
          rating: 4.95,
          salesTotal: 156,
          verified: true
        },
        content:
          'Confirmo lo de Alex. Además, en los ajustes de Nomad Sculpt desactiva "Vertex Colors" al exportar el archivo .OBJ para que Procreate no sobreescriba tu mapa base con el tinte de sombreado de la escena.',
        createdAt: 'Hace 1 hora',
        upvotes: 9
      }
    ]
  },
  {
    id: 'q-2',
    title: '¿Qué tipo de calibrador recomiendan para medir curvaturas anatómicas antes de transferir stencils grandes?',
    content:
      'Estoy haciendo piezas de manga completa y a veces al transferir el stencil plano en el deltoides y bíceps se desajusta el tamaño en 1 o 2 centímetros. ¿Usan calibradores vernier metálicos Shinwa o calibradores de contorno flexible?',
    category: 'stencils_tatuaje',
    categoryLabel: 'Stencils & Tatuaje',
    author: {
      name: 'Valeria Castro',
      handle: '@valeria_ink_cr',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      location: 'Alajuela, Costa Rica',
      rating: 4.7,
      salesTotal: 28,
      verified: true
    },
    createdAt: 'Hace 6 horas',
    upvotes: 12,
    tags: ['Calibrador', 'Anatomía', 'MangaCompleta', 'Taller'],
    isSolved: true,
    answers: [
      {
        id: 'ans-3',
        questionId: 'q-2',
        author: {
          name: 'Marco Rojas',
          handle: '@kraft_atelier',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          location: 'Cartago, Costa Rica',
          rating: 4.92,
          salesTotal: 78,
          verified: true
        },
        content:
          'Hola Valeria. Para curvaturas cilíndricas lo mejor es combinar un calibrador Shinwa de 150mm para los puntos óseos de referencia (epicóndilo y muñeca) y una cinta métrica de acero flexible con revestimiento de teflón. Si mides en línea recta con un pie de rey rígido sobre el músculo contraído pierdes el arco real de la piel. En nuestro catálogo tenemos el Shinwa japonés con escala en milímetros grabada al láser que aguanta desinfección con alcohol isopropílico.',
        createdAt: 'Hace 4 horas',
        upvotes: 15,
        isAccepted: true
      }
    ]
  },
  {
    id: 'q-3',
    title: '¿Cómo funciona el retiro de comisiones por SINPE Móvil y cuánto tarda el banco en Costa Rica?',
    content:
      'Acabo de vender dos modelos 3D y una comisión de afiliado de otro usuario en mi tienda. Solicité el retiro a mi número telefónico BAC Credomatic. ¿Los retiros se procesan de inmediato o hay horario bancario?',
    category: 'ventas_sinpe',
    categoryLabel: 'SINPE Móvil & Ventas',
    author: {
      name: 'Carlos Navarro',
      handle: '@carlos_cr_design',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      location: 'San José, Costa Rica',
      rating: 4.6,
      salesTotal: 19,
      verified: false
    },
    createdAt: 'Ayer',
    upvotes: 14,
    tags: ['SINPEMóvil', 'Retiros', 'Finanzas', 'CostaRica'],
    isSolved: true,
    answers: [
      {
        id: 'ans-4',
        questionId: 'q-3',
        author: {
          name: 'Alex Rivera',
          handle: '@alex_tattoo_3d',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          location: 'San José, Costa Rica',
          rating: 4.9,
          salesTotal: 92,
          verified: true
        },
        content:
          '¡Hola Carlos! Los retiros por SINPE Móvil en la plataforma se acreditan en tu cuenta bancaria casi instantáneamente (usualmente en menos de 5 minutos) las 24 horas del día hacia cualquier banco de Costa Rica (BAC, BCR, BNCR, Promerica). Puedes verificar el registro y el comprobante en tu sección "Mi Cartera" en tu perfil.',
        createdAt: 'Ayer',
        upvotes: 21,
        isAccepted: true
      }
    ]
  },
  {
    id: 'q-4',
    title: '¿Cuál es el mejor controlador / dial físico para rotar el modelo 3D con una mano mientras pinto con Apple Pencil?',
    content:
      'Tengo la costumbre de rotar constantemente el lienzo o el modelo 3D en Procreate mientras sombreo con la otra mano. ¿El Workspace Dial CNC con Bluetooth se sincroniza bien con los atajos de rotación y zoom?',
    category: 'hardware_tools',
    categoryLabel: 'Hardware & Dials',
    author: {
      name: 'Mariana Chaves',
      handle: '@marian_ink_studio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      location: 'Puntarenas, Costa Rica',
      rating: 4.85,
      salesTotal: 42,
      verified: true
    },
    createdAt: 'Hace 2 días',
    upvotes: 16,
    tags: ['HardwareDial', 'Atajos', 'Ergonomía', 'iPadPro'],
    isSolved: false,
    answers: [
      {
        id: 'ans-5',
        questionId: 'q-4',
        author: {
          name: 'Marco Rojas',
          handle: '@kraft_atelier',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          location: 'Cartago, Costa Rica',
          rating: 4.92,
          salesTotal: 78,
          verified: true
        },
        content:
          'Hola Mariana. Sí, el Dial de aluminio 6061 tiene firmware compatible con el protocolo HID de iPadOS. Puedes configurar el giro en sentido horario para rotación fina de 5° en 3D y el pulsador central para cambiar a control de tamaño de pincel o deshacer. La base tiene silicona de grado taller que no se desliza aunque la mesa de trabajo tenga inclinación.',
        createdAt: 'Hace 1 día',
        upvotes: 11
      }
    ]
  }
];
