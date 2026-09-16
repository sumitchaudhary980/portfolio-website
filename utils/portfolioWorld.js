import * as THREE from "three";
import { chooseQuality, qualityLevels } from "./worldQuality.mjs";

// A single scene, camera, and renderer follow the document. All information and
// interaction targets live in HTML; only their decorative spatial positions change.
export function createPortfolioWorld(host) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
  if (!context) return () => {};
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false }); }
  catch { return () => {}; }
  host.append(canvas);
  renderer.setClearColor(0x000000, 0);
  const root = document.documentElement;
  const initialQuality = qualityLevels[chooseQuality({ width: window.innerWidth, cores: navigator.hardwareConcurrency, memory: navigator.deviceMemory, saveData: navigator.connection?.saveData })];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.z = 12;
  const world = new THREE.Group();
  scene.add(world);
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const light = new THREE.DirectionalLight(0xb5eaff, 3);
  light.position.set(3, 4, 5);
  scene.add(light);

  const geometries = new Set();
  const materials = new Set();
  const geometry = (value) => { geometries.add(value); return value; };
  const material = (value) => { materials.add(value); return value; };
  const lineMaterial = material(new THREE.LineBasicMaterial({ color: 0x4fbeda, transparent: true, opacity: 0.5 }));
  const violetMaterial = material(new THREE.LineBasicMaterial({ color: 0x9b7de0, transparent: true, opacity: 0.42 }));
  const coreMaterial = material(new THREE.MeshStandardMaterial({ color: 0x17323e, roughness: 0.4, metalness: 0.45, transparent: true, opacity: 0.9 }));
  const dotMaterial = material(new THREE.MeshBasicMaterial({ color: 0x7fd9e8 }));
  const nodeMaterial = material(new THREE.MeshStandardMaterial({ color: 0x98d9e2, metalness: 0.35, roughness: 0.45 }));
  const core = new THREE.Mesh(geometry(new THREE.IcosahedronGeometry(0.8, 0)), coreMaterial);
  const cage = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(geometry(new THREE.IcosahedronGeometry(1.18, initialQuality === qualityLevels.high ? 1 : 0)))), lineMaterial);
  world.add(core, cage);
  const rings = [];
  for (let index = 0; index < 3; index++) {
    const points = Array.from({ length: initialQuality.segments }, (_, point) => {
      const angle = point / initialQuality.segments * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * (1.95 + index * 0.23), Math.sin(angle) * (1.95 + index * 0.23), 0);
    });
    const ring = new THREE.LineLoop(geometry(new THREE.BufferGeometry().setFromPoints(points)), index === 1 ? violetMaterial : lineMaterial);
    ring.rotation.set(0.6 + index * 0.65, index * 0.5, index * 0.3);
    world.add(ring); rings.push(ring);
  }
  const nodeGeometry = geometry(new THREE.IcosahedronGeometry(0.105, 0));
  const nodes = Array.from({ length: 6 }, () => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    world.add(node); return node;
  });
  const fragments = Array.from({ length: 10 }, (_, index) => {
    const fragment = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(geometry(new THREE.OctahedronGeometry(0.12 + index % 3 * 0.05)))), index % 2 ? violetMaterial : lineMaterial);
    const angle = index * 2.4;
    fragment.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 2.8, Math.sin(index) * 1.3 - 1);
    fragment.rotation.set(index, index * 0.4, 0);
    world.add(fragment); return fragment;
  });
  const particlePositions = new Float32Array(64 * 3);
  for (let index = 0; index < 64; index++) {
    particlePositions[index * 3] = Math.sin(index * 127.1) * 4.5;
    particlePositions[index * 3 + 1] = Math.cos(index * 311.7) * 3.8;
    particlePositions[index * 3 + 2] = Math.sin(index * 71.7) * 2 - 2;
  }
  const particleGeometry = geometry(new THREE.BufferGeometry());
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = material(new THREE.PointsMaterial({ color: 0x9fced8, size: 0.025, transparent: true, opacity: 0.4 }));
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  world.add(particles);

  const frames = new THREE.Group();
  for (let index = 0; index < 3; index++) {
    const frame = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(geometry(new THREE.BoxGeometry(2.8, 1.8, 0.15)))), index % 2 ? violetMaterial : lineMaterial);
    frame.position.set(index * 0.35 - 0.35, index * 0.3 - 0.3, -index * 0.65);
    frames.add(frame);
  }
  world.add(frames);
  const timeline = new THREE.Group();
  const path = [new THREE.Vector3(-0.45, 2, 0), new THREE.Vector3(0.35, 0, 0.6), new THREE.Vector3(-0.25, -2, 0)];
  const curve = new THREE.CatmullRomCurve3(path);
  timeline.add(new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48))), lineMaterial));
  const timelineNodes = path.map((point) => { const node = new THREE.Mesh(nodeGeometry, dotMaterial); node.position.copy(point); timeline.add(node); return node; });
  world.add(timeline);

  const ids = ["home", "terminal", "about", "skills", "experience", "projects", "github-activity", "vscode-live", "education", "certificates", "contact"];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const hero = document.getElementById("hero-world-anchor");
  const orbit = document.getElementById("skills-world-anchor");
  let offsets = [];
  let heroRect;
  let orbitRect;
  let labels = [];
  let width = 0;
  let height = 0;
  let active = "home";
  let sectionProgress = 0;
  let progress = 0;
  let selectedIndex = 3;
  let hovered = -1;
  let pointerX = 0;
  let pointerY = 0;
  let dragStart = null;
  let dragAngle = 0;
  let angle = 0;
  let qualityName;
  let quality;
  let downgraded = false;
  let visible = true;
  let lost = false;
  let disposed = false;
  let previous = 0;
  let lastRender = 0;
  let slowFrames = 0;
  let sampleFrames = 0;
  let demandFrame = 0;
  let scrollFrame = 0;
  let staticMotion = motionQuery.matches || root.dataset.motion === "paused";
  const projected = new THREE.Vector3();
  const target = new THREE.Vector3();
  const lerp = THREE.MathUtils.lerp;

  function applyQuality() {
    qualityName = downgraded ? "low" : chooseQuality({ width, cores: navigator.hardwareConcurrency, memory: navigator.deviceMemory, saveData: navigator.connection?.saveData });
    quality = qualityLevels[qualityName];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.pixelRatio));
    renderer.setSize(width, height, false);
    particleGeometry.setDrawRange(0, quality.particles);
    fragments.forEach((fragment, index) => { fragment.visible = index < quality.fragments; });
    host.dataset.quality = qualityName;
  }
  function measure() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    offsets = sections.map((section) => ({ id: section.id, top: section.getBoundingClientRect().top + window.scrollY, height: section.offsetHeight }));
    applyQuality();
    updateScroll();
  }
  function updateScroll() {
    heroRect = hero?.getBoundingClientRect();
    orbitRect = orbit?.getBoundingClientRect();
    const position = window.scrollY + height * 0.45;
    const index = Math.max(0, offsets.findLastIndex((section) => section.top <= position));
    active = offsets[index]?.id || "home";
    sectionProgress = THREE.MathUtils.clamp((position - offsets[index].top) / offsets[index].height, 0, 1);
    progress = index + sectionProgress;
    host.dataset.section = active;
    invalidate();
  }
  function readLabels() {
    labels = Array.from(orbit?.querySelectorAll("[data-orbit-label]") || []);
    selectedIndex = labels.findIndex((label) => label.getAttribute("aria-pressed") === "true");
    invalidate();
  }
  function draw(now = performance.now()) {
    if (disposed || lost || !visible || document.hidden) return;
    const elapsed = previous ? now - previous : 16;
    previous = now;
    if (!staticMotion) {
      sampleFrames++;
      if (elapsed > 30) slowFrames++;
      if (sampleFrames >= 180) {
        if (slowFrames / sampleFrames > 0.35 && qualityName !== "low") { downgraded = true; applyQuality(); }
        sampleFrames = 0; slowFrames = 0;
      }
      if (now - lastRender < 1000 / quality.fps - 1) return;
    }
    const dt = Math.min((now - lastRender) / 1000 || 0.016, 0.05);
    lastRender = now;
    const ease = staticMotion ? 1 : 1 - Math.exp(-dt * 7);
    const orbitVisible = orbitRect && orbitRect.bottom > 80 && orbitRect.top < height - 40;
    const heroVisible = heroRect && heroRect.bottom > 80 && active === "home";
    const anchor = orbitVisible ? orbitRect : heroVisible ? heroRect : null;
    const isEducation = active === "education";
    const isProjects = active === "projects" || active === "github-activity" || active === "certificates";
    const calm = active === "contact";
    // Camera depth and object orientation connect every section of the document.
    camera.position.z = staticMotion ? 12 : lerp(camera.position.z, 12 + Math.sin(progress * 0.7) * 0.6, ease);
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const unit = viewHeight / height;
    const screenX = anchor ? anchor.left + anchor.width / 2 : width * (width < 700 ? 0.84 : 0.86);
    const screenY = anchor ? anchor.top + anchor.height / 2 : height * 0.5;
    target.set((screenX - width / 2) * unit, (height / 2 - screenY) * unit, 0);
    world.position.lerp(target, ease);
    const scale = anchor ? Math.min(anchor.width, anchor.height) * unit / 6.5 : (width < 700 ? 0.72 : 1.12);
    world.scale.setScalar(lerp(world.scale.x, scale, ease));
    if (!staticMotion && !orbit?.contains(document.activeElement) && hovered < 0 && !dragStart) angle += dt * (calm ? 0.035 : 0.085);
    world.rotation.y = lerp(world.rotation.y, staticMotion ? 0 : (orbitVisible ? 0 : Math.sin(progress * 0.65) * 0.45) + pointerX * 0.1, ease);
    world.rotation.x = lerp(world.rotation.x, staticMotion ? 0 : pointerY * 0.07, ease);
    core.rotation.set(angle * 0.5 + 0.3, angle * 0.7, 0.15);
    cage.rotation.set(-angle * 0.2, angle * 0.3, 0);
    rings.forEach((ring, index) => { ring.rotation.z = angle * (index % 2 ? -0.18 : 0.2) + index * 0.6; });
    particles.rotation.y = angle * 0.12;
    core.visible = !isEducation && !isProjects;
    cage.visible = !isEducation && !isProjects;
    rings.forEach((ring) => { ring.visible = !isEducation && !isProjects; });
    frames.visible = isProjects;
    frames.rotation.y = angle * 0.1 + 0.35;
    timeline.visible = isEducation;
    timelineNodes.forEach((node, index) => { node.scale.setScalar(sectionProgress >= index / 3 ? 1.8 : 0.8); });
    const prominence = anchor ? 1 : calm ? 0.38 : 0.25;
    host.style.opacity = String(lerp(Number(host.style.opacity) || 0, prominence, ease));
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const count = orbitVisible ? labels.length : 6;
      const a = index / count * Math.PI * 2 + angle + dragAngle;
      const focused = orbitVisible && (index === selectedIndex || index === hovered);
      node.visible = index < count && !isEducation && !isProjects;
      node.position.set(Math.cos(a) * 2.15, Math.sin(a) * 1.75, Math.sin(a * 2) * 0.65 + (focused ? 0.35 : 0));
      node.scale.setScalar(focused ? 1.6 : 1);
    }
    world.updateMatrixWorld(true);
    camera.updateMatrixWorld();
    if (orbitVisible) {
      for (let index = 0; index < labels.length; index++) {
        nodes[index].getWorldPosition(projected);
        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * width - orbitRect.left;
        const y = (-projected.y * 0.5 + 0.5) * height - orbitRect.top;
        labels[index].style.left = "0px";
        labels[index].style.top = "0px";
        labels[index].style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translate(-50%,-50%)";
        labels[index].style.zIndex = String(10 + Math.round(nodes[index].position.z * 3));
      }
    }
    renderer.render(scene, camera);
  }
  function invalidate() {
    if (staticMotion && !demandFrame) demandFrame = requestAnimationFrame((time) => { demandFrame = 0; draw(time); });
  }
  function syncLoop() {
    staticMotion = motionQuery.matches || root.dataset.motion === "paused";
    previous = 0;
    renderer.setAnimationLoop(!staticMotion && visible && !document.hidden && !lost ? draw : null);
    invalidate();
  }
  function theme() {
    const lightTheme = root.dataset.theme === "light";
    lineMaterial.color.set(lightTheme ? 0x16748e : 0x4fbeda);
    violetMaterial.color.set(lightTheme ? 0x7050ad : 0x9b7de0);
    coreMaterial.color.set(lightTheme ? 0xa7c9d8 : 0x17323e);
    nodeMaterial.color.set(lightTheme ? 0x16748e : 0x98d9e2);
    syncLoop();
  }
  const onScroll = () => { cancelAnimationFrame(scrollFrame); scrollFrame = requestAnimationFrame(updateScroll); };
  const move = (event) => {
    if (staticMotion) return;
    if (event.pointerType === "mouse") { pointerX = event.clientX / width - 0.5; pointerY = event.clientY / height - 0.5; }
    if (dragStart && event.pointerId === dragStart.id) dragAngle = dragStart.angle + (event.clientX - dragStart.x) * 0.008;
  };
  const down = (event) => {
    if (staticMotion || event.target.closest("button")) return;
    dragStart = { id: event.pointerId, x: event.clientX, angle: dragAngle };
  };
  const up = () => { dragStart = null; };
  const hover = (event) => { hovered = event.detail; invalidate(); };
  function resetLabels() {
    labels.forEach((label, index) => {
      const a = index / labels.length * Math.PI * 2;
      label.style.left = (50 + Math.cos(a) * 33) + "%";
      label.style.top = (50 + Math.sin(a) * 35) + "%";
      label.style.transform = "translate(-50%,-50%)";
    });
  }
  const contextLost = (event) => { event.preventDefault(); lost = true; root.removeAttribute("data-webgl"); host.style.opacity = "0"; resetLabels(); syncLoop(); };
  const contextRestored = () => { lost = false; root.dataset.webgl = "ready"; measure(); syncLoop(); };
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(document.querySelector("main"));
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); });
  visibilityObserver.observe(document.querySelector("main"));
  const themeObserver = new MutationObserver(theme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-motion"] });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  window.addEventListener("portfolio:skills", readLabels);
  window.addEventListener("portfolio:hover", hover);
  orbit?.addEventListener("pointerdown", down, { passive: true });
  document.addEventListener("visibilitychange", syncLoop);
  motionQuery.addEventListener("change", syncLoop);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  readLabels(); measure(); theme();
  root.dataset.webgl = "ready";
  draw(); syncLoop();

  return () => {
    disposed = true;
    renderer.setAnimationLoop(null);
    cancelAnimationFrame(demandFrame); cancelAnimationFrame(scrollFrame);
    resizeObserver.disconnect(); visibilityObserver.disconnect(); themeObserver.disconnect();
    window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure);
    window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
    window.removeEventListener("portfolio:skills", readLabels); window.removeEventListener("portfolio:hover", hover);
    orbit?.removeEventListener("pointerdown", down);
    document.removeEventListener("visibilitychange", syncLoop); motionQuery.removeEventListener("change", syncLoop);
    canvas.removeEventListener("webglcontextlost", contextLost); canvas.removeEventListener("webglcontextrestored", contextRestored);
    resetLabels(); root.removeAttribute("data-webgl");
    geometries.forEach((item) => item.dispose()); materials.forEach((item) => item.dispose());
    renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  };
}
