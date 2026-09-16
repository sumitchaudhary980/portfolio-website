import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as Three from "three";
import { chooseQuality, qualityLevels } from "../utils/worldQuality.mjs";

// Exercise the real scene and event lifecycle with a renderer double, without a GPU.
const source = readFileSync(new URL("../utils/portfolioWorld.js", import.meta.url), "utf8")
  .replace(/^import .*;$/gm, "")
  .replace("export function createPortfolioWorld", "function createPortfolioWorld");

function environment({ reduced = false, webgl = true } = {}) {
  class Element extends EventTarget {
    constructor(id = "") { super(); this.id = id; this.dataset = {}; this.style = {}; this.children = []; this.offsetHeight = 900; }
    append(child) { this.children.push(child); }
    remove() { this.removed = true; }
    removeAttribute(key) { delete this.dataset[key.slice(5)]; }
    getBoundingClientRect() { const top = ids.indexOf(this.id) * 900 - win.scrollY; return { top, bottom: top + 900, width: 500, height: 470, left: 800 }; }
    querySelectorAll() { return []; }
    contains() { return false; }
  }
  const ids = ["home", "terminal", "about", "skills", "experience", "projects", "github-activity", "vscode-live", "education", "certificates", "contact"];
  const root = new Element();
  const main = new Element();
  const canvas = new Element();
  canvas.getContext = () => webgl ? {} : null;
  const nodes = Object.fromEntries(ids.map((id) => [id, new Element(id)]));
  const win = new EventTarget();
  Object.assign(win, { innerWidth: 1440, innerHeight: 900, devicePixelRatio: 3, scrollY: 0 });
  const media = new EventTarget(); media.matches = reduced;
  win.matchMedia = () => media;
  const doc = new EventTarget();
  Object.assign(doc, { documentElement: root, hidden: false, activeElement: null, createElement: () => canvas, getElementById: (id) => nodes[id] || null, querySelector: () => main });
  const callbacks = new Map(); let nextId = 0; let time = 1000;
  const raf = (fn) => { callbacks.set(++nextId, fn); return nextId; };
  const flush = () => { const batch = [...callbacks.values()]; callbacks.clear(); batch.forEach((fn) => fn(time += 20)); };
  const observers = [];
  class Observer { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} disconnect() { this.disconnected = true; } }
  let renderer;
  let geometryDisposals = 0;
  let materialDisposals = 0;
  const watched = new Set();
  class Renderer {
    constructor() { renderer = this; this.renders = 0; }
    setClearColor() {}
    setPixelRatio(ratio) { this.ratio = ratio; }
    setSize() {}
    setAnimationLoop(loop) { this.loop = loop; }
    render(scene) {
      this.renders++;
      scene.traverse((item) => {
        if (item.geometry && !watched.has(item.geometry)) { watched.add(item.geometry); item.geometry.addEventListener("dispose", () => geometryDisposals++); }
        if (item.material && !watched.has(item.material)) { watched.add(item.material); item.material.addEventListener("dispose", () => materialDisposals++); }
      });
    }
    dispose() { this.disposed = true; }
    forceContextLoss() { this.contextReleased = true; }
  }
  const factory = new Function("THREE", "chooseQuality", "qualityLevels", "document", "window", "navigator", "ResizeObserver", "IntersectionObserver", "MutationObserver", "requestAnimationFrame", "cancelAnimationFrame", source + "; return createPortfolioWorld;");
  const create = factory({ ...Three, WebGLRenderer: Renderer }, chooseQuality, qualityLevels, doc, win, { hardwareConcurrency: 12, deviceMemory: 8 }, Observer, Observer, Observer, raf, (id) => callbacks.delete(id));
  const host = new Element();
  const cleanup = create(host);
  return { host, cleanup, canvas, root, win, doc, media, observers, flush, get renderer() { return renderer; }, get disposals() { return [geometryDisposals, materialDisposals]; } };
}

test("quality follows capability as well as viewport", () => {
  assert.equal(chooseQuality({ width: 1440, cores: 12, memory: 8 }), "high");
  assert.equal(chooseQuality({ width: 390, cores: 8, memory: 8 }), "medium");
  assert.equal(chooseQuality({ width: 390, cores: 4, memory: 4 }), "low");
  assert.equal(chooseQuality({ width: 1440, cores: 2, memory: 8 }), "low");
  assert.equal(chooseQuality({ width: 1440, cores: 12, memory: 8, saveData: true }), "low");
});
test("unavailable WebGL leaves the HTML fallback alone", () => {
  const env = environment({ webgl: false });
  assert.equal(env.host.children.length, 0);
  assert.equal(env.root.dataset.webgl, undefined);
  assert.doesNotThrow(env.cleanup);
});
test("one renderer caps DPR and releases every observed resource", () => {
  const env = environment();
  assert.equal(env.host.children.length, 1);
  assert.equal(env.renderer.ratio, 1.6);
  assert.equal(typeof env.renderer.loop, "function");
  env.cleanup();
  assert.equal(env.renderer.loop, null);
  assert.equal(env.renderer.disposed, true);
  assert.equal(env.renderer.contextReleased, true);
  assert.ok(env.disposals[0] > 10 && env.disposals[1] >= 6);
  assert.ok(env.observers.every((observer) => observer.disconnected));
});
test("reduced motion renders on demand and still follows navigation", () => {
  const env = environment({ reduced: true });
  env.flush();
  assert.equal(env.renderer.loop, null);
  const renders = env.renderer.renders;
  env.flush(); assert.equal(env.renderer.renders, renders);
  env.win.scrollY = 7400;
  env.win.dispatchEvent(new Event("scroll")); env.flush(); env.flush();
  assert.equal(env.host.dataset.section, "education");
  assert.ok(env.renderer.renders > renders);
  env.cleanup();
});
test("hidden documents stop rendering and resume when visible", () => {
  const env = environment();
  env.doc.hidden = true; env.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(env.renderer.loop, null);
  env.doc.hidden = false; env.doc.dispatchEvent(new Event("visibilitychange"));
  assert.equal(typeof env.renderer.loop, "function");
  env.cleanup();
});
test("context loss restores fallback, and restoration resumes one loop", () => {
  const env = environment();
  env.canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  assert.equal(env.root.dataset.webgl, undefined);
  assert.equal(env.renderer.loop, null);
  env.canvas.dispatchEvent(new Event("webglcontextrestored"));
  assert.equal(env.root.dataset.webgl, "ready");
  assert.equal(typeof env.renderer.loop, "function");
  env.cleanup();
});
test("sustained slow frames lower quality without removing WebGL", () => {
  const env = environment();
  for (let index = 1; index <= 190; index++) env.renderer.loop(performance.now() + index * 45);
  assert.equal(env.host.dataset.quality, "low");
  assert.equal(env.host.children.length, 1);
  assert.equal(env.renderer.ratio, 1);
  env.cleanup();
});
