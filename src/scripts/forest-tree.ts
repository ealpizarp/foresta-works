/**
 * A single tree, built once from a seeded grammar, lit like late afternoon
 * under a canopy. Bark and roots are one merged mesh; foliage is one
 * instanced mesh. The loop runs only while the canvas is on screen, and
 * never under reduced motion, where a single frame is drawn instead.
 */
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Box3,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Fog,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';

export interface ForestTreeOptions {
  /** Draw one finished frame and stop. No growth, breeze, or parallax. */
  reduceMotion: boolean;
  /** Same seed, same tree. Change it for a different individual. */
  seed?: number;
}

export interface ForestTreeHandle {
  destroy(): void;
}

/* ---------- Seeded randomness ---------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number): number => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ---------- Bark: tapered tubes merged into one geometry ---------- */

const BARK_DEEP = new Color('#2d2119');
const BARK_WARM = new Color('#4b3627');
const BARK_MOSS = new Color('#4a5b3a');

interface TubeSpec {
  points: Vector3[];
  /** Radius along the limb, t from 0 (base) to 1 (tip). */
  profile: (t: number) => number;
  /** Fake occlusion: 1 is open air, lower is tucked under something. */
  shade: (point: Vector3, t: number) => number;
  wobble: number;
  radial: number;
}

class BarkBuilder {
  private readonly positions: number[] = [];
  private readonly normals: number[] = [];
  private readonly colors: number[] = [];
  private readonly indices: number[] = [];
  private readonly scratch = new Vector3();
  private readonly color = new Color();

  addTube(spec: TubeSpec): CatmullRomCurve3 {
    const curve = new CatmullRomCurve3(spec.points, false, 'centripetal');
    const length = curve.getLength();
    const segments = Math.min(44, Math.max(8, Math.round(length * 16)));
    const frames = curve.computeFrenetFrames(segments, false);
    const base = this.positions.length / 3;
    const radial = spec.radial;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const center = curve.getPointAt(t);
      const normal = frames.normals[i] ?? frames.normals[frames.normals.length - 1];
      const binormal = frames.binormals[i] ?? frames.binormals[frames.binormals.length - 1];
      if (!normal || !binormal) continue;
      const radius = spec.profile(t);
      const occlusion = spec.shade(center, t);
      const mossy = smooth(0.55, 0.05, center.y) * 0.55;

      for (let j = 0; j <= radial; j += 1) {
        const angle = (j / radial) * Math.PI * 2;
        const ridge = 1 + 0.07 * Math.sin(angle * 3 + spec.wobble + t * 6) + 0.035 * Math.sin(angle * 7 - t * 11);
        const r = radius * ridge;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.scratch.set(
          normal.x * cos + binormal.x * sin,
          normal.y * cos + binormal.y * sin,
          normal.z * cos + binormal.z * sin,
        );
        this.normals.push(this.scratch.x, this.scratch.y, this.scratch.z);
        this.positions.push(center.x + this.scratch.x * r, center.y + this.scratch.y * r, center.z + this.scratch.z * r);

        // Warm face toward the sun side, cooler moss creeping up from the ground.
        const sunFacing = 0.5 + 0.5 * (this.scratch.x * 0.6 + this.scratch.y * 0.8);
        this.color.lerpColors(BARK_DEEP, BARK_WARM, sunFacing * 0.85);
        this.color.lerp(BARK_MOSS, mossy * (0.4 + 0.6 * clamp01(this.scratch.y + 0.3)));
        this.color.multiplyScalar(occlusion);
        this.colors.push(this.color.r, this.color.g, this.color.b);
      }
    }

    for (let i = 0; i < segments; i += 1) {
      for (let j = 0; j < radial; j += 1) {
        const a = base + i * (radial + 1) + j;
        const b = a + radial + 1;
        this.indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    return curve;
  }

  build(): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.positions), 3));
    geometry.setAttribute('normal', new BufferAttribute(new Float32Array(this.normals), 3));
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(this.colors), 3));
    geometry.setIndex(this.indices);
    return geometry;
  }
}

/* ---------- Grammar: trunk, roots, limbs, and where leaves gather ---------- */

interface Cluster {
  center: Vector3;
  radius: number;
  /** Light reaching the cluster, 1 at the crown. */
  light: number;
}

const UP = new Vector3(0, 1, 0);

function buildTree(seed: number): { bark: BufferGeometry; clusters: Cluster[] } {
  const rng = mulberry32(seed);
  const rand = (min: number, max: number): number => min + (max - min) * rng();
  const bark = new BarkBuilder();
  const clusters: Cluster[] = [];

  const groundShade = (point: Vector3): number => 0.58 + 0.42 * smooth(-0.05, 0.75, point.y);

  // Trunk. A slow lean, a buttress at the ground, a thinner stem near the crown.
  const lean = new Vector3(rand(-0.08, 0.08), 0, rand(-0.06, 0.06));
  const trunkTop = 2.25;
  const trunkPoints = [
    new Vector3(0, -0.1, 0),
    new Vector3(lean.x * 0.3, 0.55, lean.z * 0.3),
    new Vector3(-lean.x * 0.6 + rand(-0.04, 0.04), 1.15, lean.z + rand(-0.03, 0.03)),
    new Vector3(lean.x * 1.4, 1.75, -lean.z * 0.8),
    new Vector3(lean.x * 1.1, trunkTop, lean.z * 0.4),
  ];
  const trunk = bark.addTube({
    points: trunkPoints,
    profile: (t) => (0.165 + (0.062 - 0.165) * t ** 0.85) * (1 + 1.05 * (1 - t) ** 8),
    shade: (point, t) => groundShade(point) * (0.86 + 0.14 * t),
    wobble: rand(0, 6),
    radial: 12,
  });

  // Roots. Seven angles, one left empty so the base does not read as a star.
  const rootCount = 7;
  const skipped = Math.floor(rand(0, rootCount));
  for (let i = 0; i < rootCount; i += 1) {
    if (i === skipped) continue;
    const angle = (i / rootCount) * Math.PI * 2 + rand(-0.32, 0.32);
    const length = rand(0.72, 1.3);
    const drift = rand(-0.45, 0.45);
    const arched = rng() < 0.3;
    const dir = (a: number): Vector3 => new Vector3(Math.cos(a), 0, Math.sin(a));

    const p0 = dir(angle).multiplyScalar(0.13).setY(0.17);
    const p1 = dir(angle + drift * 0.2).multiplyScalar(0.42).setY(arched ? 0.15 : 0.07);
    const p2 = dir(angle + drift * 0.6).multiplyScalar(length * 0.72).setY(arched ? 0.08 : 0.025);
    const p3 = dir(angle + drift).multiplyScalar(length).setY(-0.015);
    const points = [p0, p1, p2, p3];
    const root = bark.addTube({
      points,
      profile: (t) => 0.095 + (0.016 - 0.095) * t ** 0.9,
      shade: (point, t) => (0.62 + 0.38 * t) * (0.8 + 0.2 * smooth(-0.05, 0.2, point.y)),
      wobble: rand(0, 6),
      radial: 9,
    });

    if (rng() < 0.65) {
      const at = rand(0.35, 0.6);
      const origin = root.getPointAt(at);
      const tangent = root.getTangentAt(at).setY(0).normalize();
      const side = rng() < 0.5 ? 1 : -1;
      const branchDir = tangent.clone().applyAxisAngle(UP, side * rand(0.55, 0.95));
      const forkLength = rand(0.32, 0.58);
      bark.addTube({
        points: [
          origin.clone(),
          origin.clone().addScaledVector(branchDir, forkLength * 0.45).setY(Math.max(0.01, origin.y * 0.7)),
          origin.clone().addScaledVector(branchDir, forkLength).setY(-0.01),
        ],
        profile: (t) => 0.034 + (0.009 - 0.034) * t,
        shade: () => 0.74,
        wobble: rand(0, 6),
        radial: 7,
      });
    }
  }

  // Limbs. Primary limbs leave the upper trunk in an uneven spiral.
  const limbCount = 5;
  const gap = Math.floor(rand(0, limbCount));
  let spiral = rand(0, Math.PI * 2);
  for (let i = 0; i < limbCount; i += 1) {
    spiral += (Math.PI * 2) / limbCount + rand(-0.45, 0.45);
    if (i === gap) continue;
    const at = 0.46 + (i / limbCount) * 0.46 + rand(-0.03, 0.03);
    const origin = trunk.getPointAt(Math.min(0.96, at));
    const outward = new Vector3(Math.cos(spiral), 0, Math.sin(spiral));
    const rise = 0.42 + at * 0.5 + rand(-0.08, 0.08);
    const length = rand(0.95, 1.35) * (1.12 - at * 0.35);
    const limbDir = outward.clone().addScaledVector(UP, rise).normalize();

    const points = [
      origin.clone(),
      origin.clone().addScaledVector(limbDir, length * 0.33).addScaledVector(UP, -0.03),
      origin
        .clone()
        .addScaledVector(limbDir, length * 0.68)
        .add(new Vector3(rand(-0.08, 0.08), rand(0.02, 0.1), rand(-0.08, 0.08))),
      origin.clone().addScaledVector(limbDir, length).addScaledVector(UP, 0.08),
    ];
    const limb = bark.addTube({
      points,
      profile: (t) => 0.062 + (0.02 - 0.062) * t ** 0.9,
      shade: (_point, t) => 0.8 + 0.2 * t,
      wobble: rand(0, 6),
      radial: 8,
    });
    const tip = points[points.length - 1];
    if (tip) clusters.push({ center: tip.clone(), radius: rand(0.3, 0.4), light: 0.82 + at * 0.18 });

    // Secondary limbs fan from the outer half, each carrying its own cluster.
    const secondaryCount = 2 + (rng() < 0.5 ? 1 : 0);
    for (let s = 0; s < secondaryCount; s += 1) {
      const sAt = 0.42 + (s / secondaryCount) * 0.42 + rand(0, 0.08);
      const sOrigin = limb.getPointAt(Math.min(0.95, sAt));
      const tangent = limb.getTangentAt(Math.min(0.95, sAt));
      const side = s % 2 === 0 ? 1 : -1;
      const sDir = tangent
        .clone()
        .applyAxisAngle(UP, side * rand(0.55, 1.0))
        .addScaledVector(UP, rand(0.15, 0.45))
        .normalize();
      const sLength = rand(0.42, 0.7);
      const sPoints = [
        sOrigin.clone(),
        sOrigin.clone().addScaledVector(sDir, sLength * 0.5).addScaledVector(UP, -0.02),
        sOrigin.clone().addScaledVector(sDir, sLength).addScaledVector(UP, 0.05),
      ];
      const secondary = bark.addTube({
        points: sPoints,
        profile: (t) => 0.028 + (0.009 - 0.028) * t,
        shade: () => 0.9,
        wobble: rand(0, 6),
        radial: 7,
      });
      const sTip = sPoints[sPoints.length - 1];
      if (sTip) clusters.push({ center: sTip.clone(), radius: rand(0.26, 0.36), light: 0.78 + at * 0.2 });

      if (rng() < 0.7) {
        const tAt = rand(0.5, 0.75);
        const tOrigin = secondary.getPointAt(tAt);
        const tDir = secondary
          .getTangentAt(tAt)
          .applyAxisAngle(UP, -side * rand(0.5, 0.9))
          .addScaledVector(UP, rand(0.2, 0.5))
          .normalize();
        const tLength = rand(0.22, 0.36);
        const tTip = tOrigin.clone().addScaledVector(tDir, tLength);
        bark.addTube({
          points: [tOrigin.clone(), tOrigin.clone().addScaledVector(tDir, tLength * 0.55), tTip],
          profile: (t) => 0.013 + (0.006 - 0.013) * t,
          shade: () => 0.95,
          wobble: rand(0, 6),
          radial: 6,
        });
        clusters.push({ center: tTip.clone(), radius: rand(0.2, 0.28), light: 0.8 + at * 0.2 });
      }
    }
  }

  // Crown above the trunk, and a low cluster or two to soften the inner canopy.
  const crown = trunkPoints[trunkPoints.length - 1];
  if (crown) {
    clusters.push({ center: crown.clone().addScaledVector(UP, 0.18), radius: rand(0.38, 0.46), light: 1 });
  }
  clusters.push({
    center: trunk.getPointAt(0.78).add(new Vector3(rand(-0.3, 0.3), 0.1, rand(-0.3, 0.3))),
    radius: rand(0.26, 0.32),
    light: 0.62,
  });

  return { bark: bark.build(), clusters };
}

/* ---------- Foliage: one instanced mesh, coloured per leaf mass ---------- */

const LEAF_PALETTE = [
  new Color('#1f4a35'),
  new Color('#2d6342'),
  new Color('#3f7d49'),
  new Color('#57904d'),
  new Color('#7f9f55'),
];
const LEAF_MOSS = new Color('#9fb06a');

function buildFoliage(clusters: Cluster[], seed: number): InstancedMesh {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  const rand = (min: number, max: number): number => min + (max - min) * rng();

  const placements: Array<{ matrix: Matrix4; color: Color }> = [];
  const dummy = new Object3D();
  const offset = new Vector3();
  const color = new Color();
  const quaternion = new Quaternion();

  for (const cluster of clusters) {
    const count = Math.round(cluster.radius * cluster.radius * 170 + 8);
    for (let i = 0; i < count; i += 1) {
      do {
        offset.set(rand(-1, 1), rand(-1, 1), rand(-1, 1));
      } while (offset.lengthSq() > 1);
      const depth = offset.length();
      offset.multiply(new Vector3(cluster.radius, cluster.radius * 0.72, cluster.radius));
      dummy.position.copy(cluster.center).add(offset);

      const size = cluster.radius * rand(0.36, 0.6) * (1.08 - depth * 0.3);
      dummy.scale.set(size, size * rand(0.7, 0.9), size);
      quaternion.setFromAxisAngle(new Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(), rand(0, Math.PI));
      dummy.quaternion.copy(quaternion);
      dummy.updateMatrix();

      const a = LEAF_PALETTE[Math.floor(rng() * LEAF_PALETTE.length)] ?? LEAF_PALETTE[0];
      const b = LEAF_PALETTE[Math.floor(rng() * LEAF_PALETTE.length)] ?? LEAF_PALETTE[0];
      if (!a || !b) continue;
      color.lerpColors(a, b, rng());
      if (rng() < 0.1) color.lerp(LEAF_MOSS, rand(0.3, 0.6));

      // Occlusion: darker low inside the mass, brighter at the sunlit upper edge.
      const inner = 1 - depth;
      const under = 1 - clamp01(0.5 + offset.y / (cluster.radius * 0.72) * 0.5);
      const shade = (0.52 + 0.48 * (1 - inner * 0.75)) * (0.68 + 0.32 * (1 - under)) * (0.72 + 0.28 * cluster.light);
      color.multiplyScalar(shade);

      placements.push({ matrix: dummy.matrix.clone(), color: color.clone() });
    }
  }

  const geometry = new IcosahedronGeometry(1, 1);
  const material = new MeshStandardMaterial({ roughness: 0.94, metalness: 0 });
  const uniforms = { uTime: { value: 0 }, uBreeze: { value: 0 } };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uBreeze = uniforms.uBreeze;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uBreeze;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 leafAnchor = instanceMatrix[3].xyz;
  float leafPhase = dot(leafAnchor, vec3(1.7, 2.3, 1.1));
  float gust = sin(uTime * 0.85 + leafPhase) * 0.6 + sin(uTime * 1.55 + leafPhase * 1.7) * 0.4;
  float reach = 0.55 + 0.45 * clamp(leafAnchor.y / 3.0, 0.0, 1.0);
  transformed += vec3(gust * 0.14, gust * 0.05, gust * 0.09) * uBreeze * reach;
  transformed *= 1.0 + 0.018 * uBreeze * sin(uTime * 0.6 + leafPhase * 0.5);
#endif`,
      );
  };
  material.customProgramCacheKey = () => 'foresta-foliage';
  material.userData.uniforms = uniforms;

  const mesh = new InstancedMesh(geometry, material, placements.length);
  placements.forEach((placement, index) => {
    mesh.setMatrixAt(index, placement.matrix);
    mesh.setColorAt(index, placement.color);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ---------- Scene ---------- */

function readFogColor(root: HTMLElement): Color {
  const raw = getComputedStyle(root).getPropertyValue('--tree-fog').trim();
  const color = new Color('#f4efe6');
  if (raw) {
    try {
      color.set(raw);
    } catch {
      /* keep the paper default */
    }
  }
  return color;
}

export function mountForestTree(root: HTMLElement, options: ForestTreeOptions): ForestTreeHandle | null {
  const canvas = root.querySelector('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return null;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  if (renderer.getContext() === null) {
    renderer.dispose();
    return null;
  }

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const fogColor = readFogColor(root);
  scene.fog = new Fog(fogColor, 7, 13);

  const camera = new PerspectiveCamera(28, 1, 0.1, 60);
  scene.add(camera);

  const sun = new DirectionalLight(0xffeedb, 2.5);
  sun.position.set(3.2, 5.6, 2.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -2.6;
  sun.shadow.camera.right = 2.6;
  sun.shadow.camera.top = 3.8;
  sun.shadow.camera.bottom = -0.8;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 14;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.035;
  scene.add(sun, sun.target);

  const sky = new HemisphereLight(0xdfe9ef, 0xcdbf9d, 0.78);
  scene.add(sky);

  const rim = new DirectionalLight(0xa9dcd1, 1.0);
  rim.position.set(-3.6, 2.6, -3.4);
  scene.add(rim);

  const tree = new Group();
  const seed = options.seed ?? 20261014;
  const { bark, clusters } = buildTree(seed);
  const barkMaterial = new MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0, side: DoubleSide });
  const barkMesh = new Mesh(bark, barkMaterial);
  barkMesh.castShadow = true;
  barkMesh.receiveShadow = true;
  tree.add(barkMesh);

  const foliage = buildFoliage(clusters, seed);
  tree.add(foliage);
  const foliageUniforms = (foliage.material as MeshStandardMaterial).userData.uniforms as {
    uTime: { value: number };
    uBreeze: { value: number };
  };

  const groundGeometry = new PlaneGeometry(16, 16);
  const groundMaterial = new ShadowMaterial({ color: 0x1a2420, opacity: 0.2 });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground, tree);

  // Framing. Fit the whole tree, then stand slightly right and above the ground.
  const bounds = new Box3().setFromObject(tree);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const look = new Vector3(center.x, center.y - size.y * 0.06, center.z);
  const viewDir = new Vector3(0.3, 0.19, 1).normalize();
  const basePosition = new Vector3();
  const right = new Vector3();
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  let distance = 7;

  function fit(): void {
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distV = (size.y * 0.56) / Math.tan(vFov / 2);
    const distH = (size.x * 0.56) / Math.tan(hFov / 2);
    distance = Math.max(distV, distH) + size.z * 0.5;
    basePosition.copy(look).addScaledVector(viewDir, distance);
    right.crossVectors(viewDir, UP).normalize();
    if (scene.fog instanceof Fog) {
      scene.fog.near = distance + 0.4;
      scene.fog.far = distance + 6.5;
    }
    placeCamera();
    publishGround();
  }

  function placeCamera(): void {
    camera.position.copy(basePosition).addScaledVector(right, parallax.x).addScaledVector(UP, parallax.y);
    camera.lookAt(look);
  }

  /** Where the ground meets the trunk on screen, so a drawn root line can meet it. */
  function publishGround(): void {
    const projected = new Vector3(0, 0, 0).project(camera);
    const y = ((1 - projected.y) / 2) * 100;
    root.style.setProperty('--tree-ground', `${y.toFixed(2)}%`);
  }

  let width = 0;
  let height = 0;
  function resize(): void {
    const box = root.getBoundingClientRect();
    width = Math.max(1, Math.round(box.width));
    height = Math.max(1, Math.round(box.height));
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const budget = 2_200_000;
    if (width * height * dpr * dpr > budget) dpr = Math.sqrt(budget / (width * height));
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fit();
  }

  /* ---------- Motion ---------- */

  let frame = 0;
  let visible = false;
  let destroyed = false;
  let startedAt = 0;
  const growDuration = 1900;

  function easeOutCubic(t: number): number {
    return 1 - (1 - t) ** 3;
  }

  function render(now: number): void {
    const elapsed = startedAt === 0 ? growDuration : now - startedAt;
    const grow = options.reduceMotion ? 1 : easeOutCubic(clamp01(elapsed / growDuration));
    tree.scale.setScalar(0.02 + 0.98 * grow);
    foliageUniforms.uTime.value = now / 1000;
    foliageUniforms.uBreeze.value = options.reduceMotion ? 0 : grow;

    parallax.x += (parallax.tx - parallax.x) * 0.06;
    parallax.y += (parallax.ty - parallax.y) * 0.06;
    tree.rotation.y = parallax.x * 0.22;
    placeCamera();
    renderer.render(scene, camera);
  }

  function loop(now: number): void {
    if (destroyed || !visible) {
      frame = 0;
      return;
    }
    render(now);
    frame = window.requestAnimationFrame(loop);
  }

  function start(): void {
    if (destroyed || frame !== 0 || !visible || document.hidden) return;
    if (startedAt === 0) startedAt = performance.now();
    frame = window.requestAnimationFrame(loop);
  }

  function stop(): void {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    frame = 0;
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onPointer = (event: PointerEvent): void => {
    parallax.tx = (event.clientX / window.innerWidth - 0.5) * 0.42;
    parallax.ty = (0.5 - event.clientY / window.innerHeight) * 0.2;
  };
  const onVisibility = (): void => {
    if (document.hidden) stop();
    else start();
  };

  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) {
        stop();
        return;
      }
      if (options.reduceMotion) {
        render(performance.now());
        return;
      }
      start();
    },
    { threshold: 0.02 },
  );

  const resizeObserver = new ResizeObserver(() => {
    if (destroyed) return;
    resize();
    if (options.reduceMotion || frame === 0) render(performance.now());
  });

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    stop();
    intersection.disconnect();
    resizeObserver.disconnect();
    if (finePointer && !options.reduceMotion) window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('astro:before-swap', destroy);
    window.removeEventListener('pagehide', destroy);
    bark.dispose();
    barkMaterial.dispose();
    foliage.geometry.dispose();
    (foliage.material as MeshStandardMaterial).dispose();
    foliage.dispose();
    groundGeometry.dispose();
    groundMaterial.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    root.classList.remove('is-ready');
  }

  resize();
  render(performance.now());
  root.classList.add('is-ready');

  intersection.observe(root);
  resizeObserver.observe(root);
  if (finePointer && !options.reduceMotion) window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('astro:before-swap', destroy, { once: true });
  window.addEventListener('pagehide', destroy, { once: true });

  return { destroy };
}
