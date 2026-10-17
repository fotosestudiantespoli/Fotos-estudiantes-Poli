import * as THREE from 'three';

/**
 * Creates custom high-fidelity 3D meshes with clean UV mapping
 * for tattoo anatomy references, sculptures, and designer instruments.
 */

export function buildForearmMesh(): THREE.Group {
  const group = new THREE.Group();

  // Forearm sculpted with LatheGeometry for smooth organic tapering
  const points: THREE.Vector2[] = [];
  const segments = 40;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 = elbow/base, 1 = wrist
    const y = (t - 0.5) * 3.6;

    // Muscular silhouette: wider at forearm belly (brachioradialis), narrow at wrist
    let radius = 0.52 - t * 0.22;
    // Muscular bulge around upper 1/3
    radius += Math.sin(t * Math.PI) * 0.14 * (1 - t * 0.4);

    points.push(new THREE.Vector2(radius, y));
  }

  const forearmGeo = new THREE.LatheGeometry(points, 48);

  // Deform slightly to mimic oval/anatomical cross-section (not perfectly circular)
  const pos = forearmGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    // Flatten anterior-posterior plane slightly
    pos.setZ(i, z * 0.82);
    // Add subtle muscular curve
    const y = pos.getY(i);
    if (y > 0) {
      pos.setX(i, x * 1.08);
    }
  }
  forearmGeo.computeVertexNormals();

  const baseMat = new THREE.MeshStandardMaterial({
    roughness: 0.45,
    metalness: 0.1,
    color: 0x9fa4b2
  });

  const forearmMesh = new THREE.Mesh(forearmGeo, baseMat);
  forearmMesh.castShadow = true;
  forearmMesh.receiveShadow = true;
  group.add(forearmMesh);

  // Stylized Hand / Palm Reference attached to the wrist
  const palmGeo = new THREE.BoxGeometry(0.55, 0.7, 0.22, 4, 4, 2);
  const palmMat = baseMat.clone();
  const palmMesh = new THREE.Mesh(palmGeo, palmMat);
  palmMesh.position.set(0, 2.05, 0);
  palmMesh.castShadow = true;
  group.add(palmMesh);

  // Fingers reference (curved gesture)
  const fingerMat = baseMat.clone();
  const fingers = [-0.18, -0.06, 0.06, 0.18];
  fingers.forEach((fx, idx) => {
    const fLen = 0.55 - Math.abs(idx - 1.5) * 0.08;
    const fGeo = new THREE.CylinderGeometry(0.045, 0.055, fLen, 16);
    const fMesh = new THREE.Mesh(fGeo, fingerMat);
    fMesh.position.set(fx, 2.45 + fLen / 2, 0.02 * idx);
    fMesh.rotation.x = 0.15;
    fMesh.castShadow = true;
    group.add(fMesh);
  });

  // Thumb
  const thumbGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.45, 16);
  const thumbMesh = new THREE.Mesh(thumbGeo, fingerMat);
  thumbMesh.position.set(-0.32, 1.95, 0.08);
  thumbMesh.rotation.z = 0.6;
  thumbMesh.rotation.x = -0.3;
  thumbMesh.castShadow = true;
  group.add(thumbMesh);

  // Minimal anatomical stand/pedestal
  const standGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.25, 32);
  const standMat = new THREE.MeshStandardMaterial({
    roughness: 0.25,
    metalness: 0.85,
    color: 0x1f232e
  });
  const standMesh = new THREE.Mesh(standGeo, standMat);
  standMesh.position.set(0, -1.95, 0);
  standMesh.receiveShadow = true;
  group.add(standMesh);

  return group;
}

export function buildSkullMesh(): THREE.Group {
  const group = new THREE.Group();

  // Cranium main dome
  const craniumGeo = new THREE.SphereGeometry(1.0, 36, 28);
  // Flatten temples & elongate posterior
  const pos = craniumGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    if (y < 0.2) {
      x *= 0.88; // temples
    }
    if (z < 0) {
      z *= 1.25; // occipital protrusion
    }
    pos.setXYZ(i, x, y * 1.05, z);
  }
  craniumGeo.computeVertexNormals();

  const skullMat = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.05,
    color: 0xe5dfcf
  });

  const craniumMesh = new THREE.Mesh(craniumGeo, skullMat);
  craniumMesh.position.set(0, 0.35, 0);
  craniumMesh.castShadow = true;
  group.add(craniumMesh);

  // Facial / Maxilla block
  const maxillaGeo = new THREE.BoxGeometry(0.9, 0.75, 0.85, 8, 8, 8);
  const mPos = maxillaGeo.attributes.position;
  for (let i = 0; i < mPos.count; i++) {
    const y = mPos.getY(i);
    if (y < 0) {
      mPos.setX(i, mPos.getX(i) * 0.75); // taper to dental arch
    }
  }
  maxillaGeo.computeVertexNormals();
  const maxillaMesh = new THREE.Mesh(maxillaGeo, skullMat);
  maxillaMesh.position.set(0, -0.25, 0.55);
  maxillaMesh.castShadow = true;
  group.add(maxillaMesh);

  // Mandible (Jawbone)
  const jawGeo = new THREE.CylinderGeometry(0.5, 0.65, 0.5, 18, 1, false, 0, Math.PI);
  const jawMesh = new THREE.Mesh(jawGeo, skullMat);
  jawMesh.position.set(0, -0.65, 0.45);
  jawMesh.rotation.y = -Math.PI / 2;
  jawMesh.castShadow = true;
  group.add(jawMesh);

  // Eye sockets (deep orbits)
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x11131a });
  const orbitGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.3, 16);
  orbitGeo.rotateX(Math.PI / 2);

  const leftOrbit = new THREE.Mesh(orbitGeo, orbitMat);
  leftOrbit.position.set(0.32, 0.15, 0.96);
  group.add(leftOrbit);

  const rightOrbit = new THREE.Mesh(orbitGeo, orbitMat);
  rightOrbit.position.set(-0.32, 0.15, 0.96);
  group.add(rightOrbit);

  // Nasal cavity (inverted pear)
  const nasalGeo = new THREE.ConeGeometry(0.12, 0.32, 8);
  nasalGeo.rotateX(-Math.PI / 2);
  const nasalMesh = new THREE.Mesh(nasalGeo, orbitMat);
  nasalMesh.position.set(0, -0.05, 0.98);
  group.add(nasalMesh);

  // Zygomatic arches (Cheekbones)
  const cheekMat = skullMat.clone();
  [-0.65, 0.65].forEach((cx) => {
    const cheekGeo = new THREE.BoxGeometry(0.18, 0.15, 0.65);
    const cheekMesh = new THREE.Mesh(cheekGeo, cheekMat);
    cheekMesh.position.set(cx, 0.05, 0.35);
    cheekMesh.rotation.y = cx > 0 ? 0.3 : -0.3;
    group.add(cheekMesh);
  });

  return group;
}

export function buildHannyaMesh(): THREE.Group {
  const group = new THREE.Group();

  // Face mask core
  const faceGeo = new THREE.SphereGeometry(1.0, 36, 28);
  const pos = faceGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Flatten back (it's a theatrical Noh mask)
    if (z < -0.2) z = -0.2;
    // Angular jaw
    if (y < -0.2) {
      x *= 0.85;
      z += 0.25;
    }
    // Angry furrowed brow ridge
    if (y > 0.2 && y < 0.5 && z > 0.6) {
      z += 0.28;
    }
    pos.setXYZ(i, x, y * 1.15, z);
  }
  faceGeo.computeVertexNormals();

  const hannyaMat = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.15,
    color: 0x272b36
  });

  const faceMesh = new THREE.Mesh(faceGeo, hannyaMat);
  faceMesh.castShadow = true;
  group.add(faceMesh);

  // Two iconic Hannya demon horns
  const hornMat = new THREE.MeshStandardMaterial({
    roughness: 0.25,
    metalness: 0.2,
    color: 0x1b1d24
  });

  [-0.6, 0.6].forEach((hx) => {
    // Curved horn using Lathe/Cylinder segments
    const hornGeo = new THREE.ConeGeometry(0.18, 1.2, 24);
    hornGeo.translate(0, 0.6, 0);
    const hPos = hornGeo.attributes.position;
    for (let i = 0; i < hPos.count; i++) {
      const y = hPos.getY(i);
      // Curve outward and backward
      hPos.setX(i, hPos.getX(i) + (y * y * 0.12 * (hx > 0 ? 1 : -1)));
      hPos.setZ(i, hPos.getZ(i) - y * y * 0.08);
    }
    hornGeo.computeVertexNormals();

    const hornMesh = new THREE.Mesh(hornGeo, hornMat);
    hornMesh.position.set(hx, 0.85, 0.2);
    hornMesh.rotation.z = hx > 0 ? -0.35 : 0.35;
    hornMesh.rotation.x = -0.25;
    hornMesh.castShadow = true;
    group.add(hornMesh);
  });

  // Grinning open mouth with fangs
  const mouthGeo = new THREE.BoxGeometry(0.7, 0.28, 0.25);
  const darkInteriorMat = new THREE.MeshBasicMaterial({ color: 0x0a0c10 });
  const mouthMesh = new THREE.Mesh(mouthGeo, darkInteriorMat);
  mouthMesh.position.set(0, -0.45, 0.95);
  group.add(mouthMesh);

  // Upper & lower golden fangs
  const fangMat = new THREE.MeshStandardMaterial({
    roughness: 0.2,
    metalness: 0.8,
    color: 0xd97706 // Gold accent
  });

  [-0.22, 0.22].forEach((fx) => {
    // Top fangs pointing down
    const topFang = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 12), fangMat);
    topFang.rotation.x = Math.PI;
    topFang.position.set(fx, -0.36, 1.05);
    group.add(topFang);

    // Bottom fangs pointing up
    const btmFang = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 12), fangMat);
    btmFang.position.set(fx * 0.75, -0.52, 1.05);
    group.add(btmFang);
  });

  // Sharp demonic ears
  [-0.98, 0.98].forEach((ex) => {
    const earGeo = new THREE.ConeGeometry(0.2, 0.65, 12);
    const earMesh = new THREE.Mesh(earGeo, hannyaMat);
    earMesh.position.set(ex, 0.1, 0.05);
    earMesh.rotation.z = ex > 0 ? -1.1 : 1.1;
    earMesh.rotation.x = -0.2;
    group.add(earMesh);
  });

  return group;
}

export function buildTorsoMesh(): THREE.Group {
  const group = new THREE.Group();

  // Muscular male torso with Lathe & shape
  const points: THREE.Vector2[] = [];
  const segments = 36;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 = pelvis, 1 = clavicle/shoulders
    const y = (t - 0.5) * 3.4;
    // Athletic V-taper: waist ~0.65, chest ~1.1
    let radius = 0.65 + t * 0.45;
    if (t > 0.8) {
      radius -= (t - 0.8) * 0.5; // neck collar narrowing
    }
    points.push(new THREE.Vector2(radius, y));
  }

  const torsoGeo = new THREE.LatheGeometry(points, 48);
  const pos = torsoGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    let z = pos.getZ(i);
    let x = pos.getX(i);

    // Flatten front-back for human torso proportion (wider in X than Z)
    z *= 0.68;

    // Pectorals bulge
    if (y > 0.4 && y < 1.2 && z > 0) {
      z += Math.sin((y - 0.4) * Math.PI) * 0.22;
    }
    // Six-pack abdomen indentations
    if (y < 0.4 && y > -0.8 && z > 0) {
      // Linea alba central groove
      if (Math.abs(x) < 0.08) {
        z -= 0.06;
      }
    }
    pos.setXYZ(i, x, y, z);
  }
  torsoGeo.computeVertexNormals();

  const torsoMat = new THREE.MeshStandardMaterial({
    roughness: 0.4,
    metalness: 0.1,
    color: 0x8a90a2
  });

  const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
  torsoMesh.castShadow = true;
  group.add(torsoMesh);

  return group;
}

export function buildDialHardwareMesh(): THREE.Group {
  const group = new THREE.Group();

  // CNC Base casing
  const baseGeo = new THREE.BoxGeometry(2.2, 0.45, 2.2);
  const baseMat = new THREE.MeshStandardMaterial({
    roughness: 0.25,
    metalness: 0.9,
    color: 0x1a1d26
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.22;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Rotating central knurled dial knob
  const knobGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 48);
  const knobMat = new THREE.MeshStandardMaterial({
    roughness: 0.2,
    metalness: 0.95,
    color: 0x2d3240
  });
  const knobMesh = new THREE.Mesh(knobGeo, knobMat);
  knobMesh.position.y = 0.32;
  knobMesh.castShadow = true;
  group.add(knobMesh);

  // Top dial tactile indicator
  const indicatorGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.05, 32);
  const indMat = new THREE.MeshStandardMaterial({
    roughness: 0.15,
    metalness: 0.8,
    color: 0x12141a
  });
  const indMesh = new THREE.Mesh(indicatorGeo, indMat);
  indMesh.position.y = 0.66;
  group.add(indMesh);

  // Gold laser dot
  const dotGeo = new THREE.SphereGeometry(0.05, 12, 12);
  const dotMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.1
  });
  const dotMesh = new THREE.Mesh(dotGeo, dotMat);
  dotMesh.position.set(0, 0.69, 0.5);
  group.add(dotMesh);

  // Keypad row buttons on side
  const keyMat = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.4,
    color: 0x222633
  });
  const keyPositions = [
    [-0.7, 0.05, 1.3],
    [-0.25, 0.05, 1.3],
    [0.25, 0.05, 1.3],
    [0.7, 0.05, 1.3]
  ];
  keyPositions.forEach(([kx, ky, kz]) => {
    const keyGeo = new THREE.BoxGeometry(0.38, 0.18, 0.38);
    const keyMesh = new THREE.Mesh(keyGeo, keyMat);
    keyMesh.position.set(kx, ky, kz);
    keyMesh.castShadow = true;
    group.add(keyMesh);
  });

  return group;
}

export function buildCaliperMesh(): THREE.Group {
  const group = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({
    roughness: 0.22,
    metalness: 0.92,
    color: 0xc8cdd8
  });

  // Long ruler beam
  const beamGeo = new THREE.BoxGeometry(0.32, 4.2, 0.08);
  const beamMesh = new THREE.Mesh(beamGeo, steelMat);
  beamMesh.position.set(0, 0, 0);
  beamMesh.castShadow = true;
  group.add(beamMesh);

  // Fixed top jaw (outside measurement)
  const fixedJawGeo = new THREE.BoxGeometry(1.2, 0.4, 0.08);
  const fixedJawMesh = new THREE.Mesh(fixedJawGeo, steelMat);
  fixedJawMesh.position.set(0.48, 1.9, 0);
  group.add(fixedJawMesh);

  // Sliding digital gauge housing
  const gaugeGeo = new THREE.BoxGeometry(0.9, 1.1, 0.28);
  const gaugeMat = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.5,
    color: 0x1e222d
  });
  const gaugeMesh = new THREE.Mesh(gaugeGeo, gaugeMat);
  gaugeMesh.position.set(0.15, 0.6, 0.1);
  gaugeMesh.castShadow = true;
  group.add(gaugeMesh);

  // LCD screen
  const lcdGeo = new THREE.PlaneGeometry(0.65, 0.45);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
  const lcdMesh = new THREE.Mesh(lcdGeo, lcdMat);
  lcdMesh.position.set(0.15, 0.72, 0.25);
  group.add(lcdMesh);

  // Moving slider jaw
  const slideJawGeo = new THREE.BoxGeometry(1.15, 0.35, 0.08);
  const slideJawMesh = new THREE.Mesh(slideJawGeo, steelMat);
  slideJawMesh.position.set(0.52, 0.15, 0);
  group.add(slideJawMesh);

  return group;
}
