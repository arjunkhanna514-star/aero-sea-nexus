import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '../node_modules/three')
const threePkgPath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(threePkgPath, 'utf8'))

// ── WebGPU ──────────────────────────────────────────────────────────────────
const webgpuCandidates = ['./build/three.webgpu.js', './build/three.webgpu.mjs', './webgpu.js']
let webgpuExport = webgpuCandidates.find(c => existsSync(resolve(root, c.slice(2))))

if (!webgpuExport) {
  const stubFile = resolve(root, 'build/three-webgpu-stub.js')
  writeFileSync(stubFile, `
export * from './three.module.js';
export class WebGPURenderer { constructor(){} setSize(){} setPixelRatio(){} setAnimationLoop(){} render(){} dispose(){} }
export class StorageInstancedBufferAttribute {}
export default {};
`.trim())
  webgpuExport = './build/three-webgpu-stub.js'
}

// ── TSL ─────────────────────────────────────────────────────────────────────
const tslCandidates = ['./build/three.tsl.js', './tsl.js', './build/three.tsl.mjs']
let tslExport = tslCandidates.find(c => existsSync(resolve(root, c.slice(2))))

if (!tslExport) {
  const stubFile = resolve(root, 'build/three-tsl-stub.js')
  writeFileSync(stubFile, `
const noop = (...a) => a[0] ?? {};
const noopNode = () => ({ toVar: noop, assign: noop });
export const Fn = f => f;
export const If = noop; export const uniform = noopNode; export const storage = noopNode;
export const float = noopNode; export const vec2 = noopNode; export const vec3 = noopNode;
export const vec4 = noopNode; export const int = noopNode; export const uint = noopNode;
export const instanceIndex = noopNode(); export const vertexIndex = noopNode();
export const Loop = noop; export const Break = noop; export const Continue = noop;
export const sqrt = noop; export const sin = noop; export const cos = noop;
export const asin = noop; export const acos = noop; export const atan = noop;
export const exp = noop; export const exp2 = noop; export const log = noop;
export const negate = noop; export const abs = noop; export const sign = noop;
export const floor = noop; export const ceil = noop; export const fract = noop;
export const clamp = noop; export const min = noop; export const max = noop;
export const mix = noop; export const step = noop; export const smoothstep = noop;
export const dot = noop; export const cross = noop; export const normalize = noop;
export const length = noop; export const distance = noop; export const reflect = noop;
export const refract = noop; export const pow = noop; export const mod = noop;
export const select = noop; export const cond = noop;
export default {};
`.trim())
  tslExport = './build/three-tsl-stub.js'
}

// ── addons ───────────────────────────────────────────────────────────────────
const addonsCandidates = ['./examples/jsm/Addons.js', './examples/jsm/addons.js']
const addonsExport = addonsCandidates.find(c => existsSync(resolve(root, c.slice(2)))) ?? webgpuExport

// ── patch exports ────────────────────────────────────────────────────────────
pkg.exports['./webgpu'] = webgpuExport
pkg.exports['./tsl']    = tslExport
pkg.exports['./addons'] = addonsExport

writeFileSync(threePkgPath, JSON.stringify(pkg, null, 2))
console.log('✅ three patched →', { webgpu: webgpuExport, tsl: tslExport, addons: addonsExport })
