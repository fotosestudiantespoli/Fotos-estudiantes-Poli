import * as THREE from 'three';

/**
 * Generates high-resolution procedural textures (2048x2048)
 * for tattoo artists, 3D sculptors, and product designers.
 */

export function createHighResUVGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Background dark carbon
  ctx.fillStyle = '#161923';
  ctx.fillRect(0, 0, 2048, 2048);

  // Sub-grid lines (16x16 major squares, 64x64 minor lines)
  const minorStep = 2048 / 64;
  const majorStep = 2048 / 16;

  // Minor lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 2048; i += minorStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 2048);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(2048, i);
    ctx.stroke();
  }

  // Major lines
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)'; // Amber gold accents
  ctx.lineWidth = 2;
  for (let i = 0; i <= 2048; i += majorStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 2048);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(2048, i);
    ctx.stroke();
  }

  // UV coordinates & anatomical landmark texts in each cell
  ctx.font = 'bold 22px "Space Grotesk", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  const letters = 'ABCDEFGHJKLMNOPQ';

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const x = col * majorStep;
      const y = row * majorStep;
      const coord = `${letters[row]}${col + 1}`;

      // Little crosshair at corner
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 15);
      ctx.lineTo(x + 20, y + 15);
      ctx.moveTo(x + 15, y + 10);
      ctx.lineTo(x + 15, y + 20);
      ctx.stroke();

      ctx.fillText(coord, x + 28, y + 36);

      // Scale in mm
      ctx.font = '14px monospace';
      ctx.fillStyle = 'rgba(217, 119, 6, 0.6)';
      ctx.fillText(`${(col * 6.25).toFixed(0)}mm`, x + 30, y + 54);
      ctx.font = 'bold 22px "Space Grotesk", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    }
  }

  // Watermark/badge
  ctx.font = '600 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillText('PROCREATE 3D · UV MAPPING GUIDE 2048x2048', 80, 100);
  ctx.fillText('KRAFTWERK STUDIO · QUAD TOPOLOGY VERIFIED', 80, 2000);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createDarkClayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#22252e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-noise for realistic matte clay feel
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createIvoryBoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dfd8c8';
  ctx.fillRect(0, 0, 1024, 1024);

  // Fine bone texture lines & grain
  ctx.strokeStyle = 'rgba(160, 140, 120, 0.12)';
  for (let i = 0; i < 300; i++) {
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 80);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTattooOverlayTexture(
  stencilImage: HTMLImageElement | null,
  scale: number = 1.0,
  rotation: number = 0,
  opacity: number = 0.95
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Skin/neutral substrate base
  ctx.fillStyle = '#1c1f2b';
  ctx.fillRect(0, 0, 2048, 2048);

  // Very subtle UV guides underneath
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 2048; i += 128) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 2048);
    ctx.moveTo(0, i);
    ctx.lineTo(2048, i);
    ctx.stroke();
  }

  if (stencilImage) {
    ctx.save();
    ctx.translate(1024, 1024);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = opacity;

    const baseSize = 1200 * scale;
    const aspect = stencilImage.width / (stencilImage.height || 1);
    const drawW = aspect >= 1 ? baseSize : baseSize * aspect;
    const drawH = aspect >= 1 ? baseSize / aspect : baseSize;

    ctx.drawImage(stencilImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
