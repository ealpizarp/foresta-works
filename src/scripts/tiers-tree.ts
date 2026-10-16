/**
 * A root for the billing and scope notes. One primary root runs the
 * center gutter; a lateral peels off to the first line of each note and
 * stops before the words. The renderer then stops.
 */
import {
  AmbientLight,
  CatmullRomCurve3,
  CubicBezierCurve3,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

type Tip = { x: number; y: number };

type Branch = {
  curve: CubicBezierCurve3;
  radius: number;
  start: number;
  end: number;
  bud: 'clay' | 'moss' | 'none';
};

const MOSS = 0x2a4a3c;
const CLAY = 0x8f4532;

export function mountTiersTree(root: HTMLElement, options: { reduce: boolean }): void {
  if (root.dataset.treeReady === '1') return;

  const canvas = root.querySelector('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (renderer.getContext() === null) {
    renderer.dispose();
    return;
  }

  root.dataset.treeReady = '1';
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 4000);
  scene.add(camera);

  const ambient = new AmbientLight(0xfff6ea, 0.72);
  const key = new DirectionalLight(0xfff8ef, 1.35);
  key.position.set(-80, 160, 220);
  const fill = new DirectionalLight(0xc5d4c4, 0.45);
  fill.position.set(120, -40, 80);
  scene.add(ambient, key, fill);

  const moss = new MeshStandardMaterial({ color: MOSS, roughness: 0.62, metalness: 0 });
  const clay = new MeshStandardMaterial({ color: CLAY, roughness: 0.48, metalness: 0 });
  const budGeometry = new SphereGeometry(1, 12, 10);

  const held: Mesh[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let settled = options.reduce;

  function toWorld(x: number, y: number, z = 0): Vector3 {
    return new Vector3(x - width / 2, height / 2 - y, z);
  }

  /** Bezier stays inside the hull of its four points, so a branch can stop at the text. */
  function arc(
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    d: [number, number, number],
  ): CubicBezierCurve3 {
    return new CubicBezierCurve3(toWorld(...a), toWorld(...b), toWorld(...c), toWorld(...d));
  }

  function tipOf(el: HTMLElement, narrow: boolean): Tip {
    const rootBox = root.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const line = Math.min(box.height, 26);
    const y = box.top - rootBox.top + line / 2;
    if (narrow) return { x: box.left - rootBox.left - 14, y };
    const onLeft = box.left + box.width / 2 < rootBox.left + rootBox.width / 2;
    return onLeft
      ? { x: box.right - rootBox.left + 6, y }
      : { x: box.left - rootBox.left - 6, y };
  }

  function branches(): Branch[] {
    const narrow = window.matchMedia('(max-width: 800px)').matches;
    const limbs = [...root.querySelectorAll<HTMLElement>('[data-limb]')];
    const out: Branch[] = [];
    const bow = narrow ? 16 : 26;
    const trunkX = narrow ? 14 : width / 2;

    const tips: Array<{ tip: Tip; heading: boolean }> = [];
    for (const limb of limbs) {
      const nodes = [
        limb.querySelector<HTMLElement>('[data-tip="limb"]'),
        ...limb.querySelectorAll<HTMLElement>('[data-tip="leaf"]'),
      ].filter((node): node is HTMLElement => node !== null);
      for (const node of nodes) {
        tips.push({ tip: tipOf(node, narrow), heading: node.dataset.tip === 'limb' });
      }
    }
    if (tips.length === 0) return out;

    const first = tips[0];
    const last = tips[tips.length - 1];
    if (!first || !last) return out;
    const crownY = Math.max(6, first.tip.y - 18);
    const footY = Math.min(height - 8, last.tip.y + 22);
    const span = Math.max(1, footY - crownY);

    // Primary root, thicker under the headings and finer as it runs down.
    out.push({
      curve: arc(
        [trunkX, crownY, 0],
        [trunkX - 8, crownY + span * 0.38, bow],
        [trunkX + 6, crownY + span * 0.72, bow * 0.4],
        [trunkX - 2, footY, 0],
      ),
      radius: narrow ? 3.6 : 5.4,
      start: 0,
      end: 0.34,
      bud: 'moss',
    });

    // Two short forks stay in the gutter. They do not reach either column.
    [0.28, 0.62].forEach((t, index) => {
      const y = crownY + span * t;
      const dir = index === 0 ? -1 : 1;
      if (narrow && dir < 0) return;
      out.push({
        curve: arc(
          [trunkX, y, 4],
          [trunkX + dir * 10, y + 8, bow],
          [trunkX + dir * 18, y + 16, 10],
          [trunkX + dir * 26, y + 22, 0],
        ),
        radius: 1.6,
        start: 0.2 + index * 0.08,
        end: 0.55,
        bud: 'none',
      });
    });

    tips.forEach(({ tip, heading }, order) => {
      const toward = tip.x < trunkX ? 1 : -1;
      const sag = 16;
      out.push({
        curve: arc(
          [trunkX, tip.y - 4, 0],
          [trunkX + (tip.x - trunkX) * 0.28, tip.y + sag, bow],
          [tip.x + toward * 34, tip.y + 5, 8],
          [tip.x, tip.y, 0],
        ),
        radius: heading ? (narrow ? 2.6 : 3.3) : narrow ? 1.8 : 2.15,
        start: Math.min(0.5, 0.16 + order * 0.03),
        end: 1,
        bud: heading ? 'none' : 'clay',
      });
    });

    return out;
  }

  function clearHeld(): void {
    for (const mesh of held) {
      scene.remove(mesh);
      if (mesh.geometry !== budGeometry) mesh.geometry.dispose();
    }
    held.length = 0;
  }

  function addTube(branch: Branch, fraction: number): void {
    const steps = 36;
    const points = branch.curve.getPoints(steps);
    const count = Math.max(2, Math.round((points.length - 1) * fraction) + 1);
    const slice = points.slice(0, count);
    const first = slice[0];
    const last = slice[slice.length - 1];
    if (!first || !last || first.distanceTo(last) < 4) return;

    const geometry = new TubeGeometry(new CatmullRomCurve3(slice), Math.max(8, count), branch.radius, 6, false);
    const mesh = new Mesh(geometry, moss);
    scene.add(mesh);
    held.push(mesh);

    if (branch.bud !== 'none' && fraction > 0.94) {
      const bud = new Mesh(budGeometry, branch.bud === 'clay' ? clay : moss);
      const scale = branch.bud === 'clay' ? 4.4 : 6.2;
      bud.scale.setScalar(scale);
      bud.position.copy(last);
      scene.add(bud);
      held.push(bud);
    }
  }

  function draw(grow: number): void {
    const box = root.getBoundingClientRect();
    width = box.width;
    height = box.height;
    if (width < 8 || height < 8) return;

    renderer.setSize(width, height, false);
    const distance = height / 2 / Math.tan((camera.fov * Math.PI) / 360);
    camera.aspect = width / height;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    clearHeld();
    const built = branches();
    for (const branch of built) {
      const span = branch.end - branch.start;
      const fraction = span <= 0 ? 1 : Math.min(1, Math.max(0, (grow - branch.start) / span));
      if (fraction <= 0) continue;
      addTube(branch, fraction);
    }
    renderer.render(scene, camera);
  }

  function finish(): void {
    settled = true;
    draw(1);
    root.classList.add('is-ready');
  }

  root.classList.add('is-ready');
  if (options.reduce) {
    finish();
  } else {
    const started = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const grow = 1 - (1 - t) ** 3;
      draw(grow);
      if (t < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      frame = 0;
      finish();
    };
    frame = window.requestAnimationFrame(tick);
  }

  const observer = new ResizeObserver(() => {
    if (!settled) return;
    draw(1);
  });
  observer.observe(root);
}
