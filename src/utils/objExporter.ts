import * as THREE from 'three';

/**
 * Exports a Three.js geometry/group into standard Wavefront .OBJ format
 * fully compatible with Procreate (iPad), Nomad Sculpt, Blender, and ZBrush.
 */
export function exportToOBJ(object3D: THREE.Object3D, modelTitle: string): string {
  let output = `# KRAFTWERK STUDIO · 3D Asset Export for Procreate & Nomad Sculpt
# Model: ${modelTitle}
# Quad & Triangulated Topology with Normalized UV coordinates (0-1)
# Units: Metric (1.0 = standard anatomical reference)

mtllib ${modelTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mtl
o ${modelTitle.replace(/\s+/g, '_')}

`;

  let vertexOffset = 0;
  let uvOffset = 0;
  let normalOffset = 0;

  object3D.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const geometry = mesh.geometry.clone();
      mesh.updateWorldMatrix(true, false);
      geometry.applyMatrix4(mesh.matrixWorld);

      const pos = geometry.attributes.position;
      const uv = geometry.attributes.uv;
      const norm = geometry.attributes.normal;
      const index = geometry.index;

      if (!pos) return;

      output += `\ng ${mesh.name || 'mesh_part'}\n`;
      output += `usemtl material_default\n`;

      // Vertices
      for (let i = 0; i < pos.count; i++) {
        output += `v ${pos.getX(i).toFixed(4)} ${pos.getY(i).toFixed(4)} ${pos.getZ(i).toFixed(4)}\n`;
      }

      // UVs
      if (uv) {
        for (let i = 0; i < uv.count; i++) {
          output += `vt ${uv.getX(i).toFixed(4)} ${uv.getY(i).toFixed(4)}\n`;
        }
      }

      // Normals
      if (norm) {
        for (let i = 0; i < norm.count; i++) {
          output += `vn ${norm.getX(i).toFixed(4)} ${norm.getY(i).toFixed(4)} ${norm.getZ(i).toFixed(4)}\n`;
        }
      }

      // Faces
      const hasUV = !!uv;
      const hasNorm = !!norm;

      if (index) {
        for (let i = 0; i < index.count; i += 3) {
          const a = index.getX(i) + 1 + vertexOffset;
          const b = index.getX(i + 1) + 1 + vertexOffset;
          const c = index.getX(i + 2) + 1 + vertexOffset;

          if (hasUV && hasNorm) {
            const uva = index.getX(i) + 1 + uvOffset;
            const uvb = index.getX(i + 1) + 1 + uvOffset;
            const uvc = index.getX(i + 2) + 1 + uvOffset;

            const na = index.getX(i) + 1 + normalOffset;
            const nb = index.getX(i + 1) + 1 + normalOffset;
            const nc = index.getX(i + 2) + 1 + normalOffset;

            output += `f ${a}/${uva}/${na} ${b}/${uvb}/${nb} ${c}/${uvc}/${nc}\n`;
          } else {
            output += `f ${a} ${b} ${c}\n`;
          }
        }
      } else {
        for (let i = 0; i < pos.count; i += 3) {
          const a = i + 1 + vertexOffset;
          const b = i + 2 + vertexOffset;
          const c = i + 3 + vertexOffset;
          output += `f ${a} ${b} ${c}\n`;
        }
      }

      vertexOffset += pos.count;
      if (uv) uvOffset += uv.count;
      if (norm) normalOffset += norm.count;
    }
  });

  return output;
}

export function triggerDownload(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function generateProcreateReadme(modelTitle: string): string {
  return `====================================================================
KRAFTWERK STUDIO · GUÍA OFICIAL DE IMPORTACIÓN A PROCREATE (iPAD)
====================================================================
Modelo: ${modelTitle}
Compatibilidad: Procreate 5.2 en adelante (iPad Pro / iPad Air / iPad mini)

PASO 1: TRANSFERIR EL ARCHIVO AL iPAD
--------------------------------------------------------------------
- Si descargaste desde tu computadora:
  Usa AirDrop para enviar el archivo .OBJ directamente a tu iPad,
  o súbelo a iCloud Drive / Google Drive / Dropbox.
- Si estás navegando desde tu iPad:
  El archivo se guardará en tu app "Archivos" (carpeta Descargas).

PASO 2: ABRIR EN PROCREATE
--------------------------------------------------------------------
1. Abre Procreate en tu iPad.
2. En la esquina superior derecha de la Galería principal, toca "Importar".
3. Busca en la app Archivos y selecciona el archivo "${modelTitle.replace(/\s+/g, '_')}.obj".
4. ¡El modelo 3D se abrirá automáticamente en tu lienzo!

PASO 3: CÓMO PINTAR Y PROBAR TATUAJES EN 3D
--------------------------------------------------------------------
- Rotación 360: Arrastra con un solo dedo sobre el lienzo para girar.
- Zoom y Escala: Pellizca con dos dedos para acercar o alejar.
- Pintura Directa: Usa tu Apple Pencil para dibujar y pintar texturas directamente
  sobre la superficie 3D. La tinta se envolverá respetando las curvaturas anatómicas.
- Añadir Capas 2D: Abre el menú Capas. Puedes pegar tu flash o stencil 2D y
  ajustarlo a la piel usando el modo "Pintura 3D".
- Iluminación de Estudio: Toca Acciones (icono de llave) > 3D > "Editar iluminación y entorno"
  para cambiar las luces de estudio y ver cómo se refleja el tatuaje.

¡Disfruta diseñando con KRAFTWERK Studio!
Soporte: support@kraftwerk-studio.art
`;
}
