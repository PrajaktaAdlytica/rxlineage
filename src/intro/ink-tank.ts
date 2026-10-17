// Adapted from the user-supplied DyeWhorl component. Navier–Stokes pressure
// projection and MacCormack dye transport are retained; no pointer tracking.
// All advances use a fixed step, so replay and Studio seeking reproduce a frame.
const SPLATS = 12;
const VERT_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Velocity is stored in GRID CELLS PER SECOND, never in uv/s. The sim grid is
// cut to the container's aspect, so a cell is very nearly square in screen
// space and the metric is isotropic — curl, divergence and the pressure
// Laplacian are all written with dx = 1 and a vortex comes out round. In uv
// units every one of those operators would be silently anisotropic and the
// whorls would come out as ellipses stretched with the window.
const SPLAT_UNIFORMS = `
uniform vec4 u_sp[${SPLATS}];  // xy = uv centre, z = radius (uv-x units), w = dye amount
uniform vec4 u_sf[${SPLATS}];  // xy = force (cells/s), z = accent amount, w = unused
uniform float u_aspect;

float splatFall(vec2 uv, vec2 c, float r) {
  vec2 d = (uv - c) * vec2(u_aspect, 1.0);
  return exp(-dot(d, d) / max(1e-5, r * r));
}`;

const ADVECT_VEL_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_vel;
uniform vec2 u_texel;
uniform float u_dt;
uniform float u_diss;
void main() {
  vec2 v = texture(u_vel, v_uv).xy;
  vec2 src = v_uv - u_dt * v * u_texel;
  fragColor = vec4(texture(u_vel, src).xy * u_diss, 0.0, 1.0);
}`;

// One pass carrying every body force, so the sim never pays a program switch
// for a term that costs four taps. Vorticity confinement is computed inline
// from the velocity field rather than through a separate curl target: at this
// grid size the twenty extra fetches are far cheaper than two more full-screen
// passes plus their FBO binds.
const FORCE_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_vel;
uniform sampler2D u_dye;
uniform vec2 u_texel;
uniform float u_dt;
uniform float u_time;
uniform float u_curlAmt;
uniform float u_buoy;
uniform float u_ambient;
${SPLAT_UNIFORMS}

float curlAt(vec2 uv) {
  float r = texture(u_vel, uv + vec2(u_texel.x, 0.0)).y;
  float l = texture(u_vel, uv - vec2(u_texel.x, 0.0)).y;
  float t = texture(u_vel, uv + vec2(0.0, u_texel.y)).x;
  float b = texture(u_vel, uv - vec2(0.0, u_texel.y)).x;
  return 0.5 * ((r - l) - (t - b));
}

float hash21(vec2 p) {
  p = fract(p * vec2(287.13, 419.71));
  p += dot(p, p + 27.31);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  return vnoise(p) * 0.62 + vnoise(p * 2.13 + 7.3) * 0.28;
}

void main() {
  vec2 v = texture(u_vel, v_uv).xy;

  // --- vorticity confinement: push energy back into the whorls the advection
  // step numerically bled away, which is what keeps tendrils curling instead
  // of straightening out into sheets
  float c = curlAt(v_uv);
  float cr = abs(curlAt(v_uv + vec2(u_texel.x, 0.0)));
  float cl = abs(curlAt(v_uv - vec2(u_texel.x, 0.0)));
  float ct = abs(curlAt(v_uv + vec2(0.0, u_texel.y)));
  float cb = abs(curlAt(v_uv - vec2(0.0, u_texel.y)));
  vec2 g = vec2(cr - cl, ct - cb) * 0.5;
  float gl = length(g);
  if (gl > 1e-5) {
    vec2 n = g / gl;
    v += vec2(n.y, -n.x) * c * u_curlAmt * u_dt;
  }

  // --- buoyancy against a LOCAL mean. Ink is denser than the fluid, so the
  // excess sinks; taken against a wide neighbourhood average the force is zero
  // inside a uniform patch and non-zero only across an interface, which grows
  // fingers off the underside of a plume rather than dragging the whole field
  // to the floor. Against a fixed zero the tank sediments in ~30s.
  float wide = 6.0;
  float d0 = texture(u_dye, v_uv).x;
  float dAvg = 0.25 * (
    texture(u_dye, v_uv + vec2(u_texel.x * wide, 0.0)).x +
    texture(u_dye, v_uv - vec2(u_texel.x * wide, 0.0)).x +
    texture(u_dye, v_uv + vec2(0.0, u_texel.y * wide)).x +
    texture(u_dye, v_uv - vec2(0.0, u_texel.y * wide)).x
  );
  float excess = d0 - dAvg;
  // the lateral term is the symmetry break: a perfectly horizontal interface
  // is a stable equilibrium under a purely vertical force and would never
  // finger at all
  v.y -= excess * u_buoy * u_dt;
  v.x += excess * u_buoy * 0.22 * u_dt * (vnoise(v_uv * 9.0 + u_time * 0.15) - 0.5);

  // --- divergence-free curl-noise stirring, from the analytic perpendicular
  // gradient of a scalar potential, so it cannot fight the projection step
  vec2 q = v_uv * vec2(u_aspect, 1.0) * 1.7 + vec2(u_time * 0.031, -u_time * 0.024);
  float e = 0.035;
  float px = fbm(q + vec2(e, 0.0)) - fbm(q - vec2(e, 0.0));
  float py = fbm(q + vec2(0.0, e)) - fbm(q - vec2(0.0, e));
  v += vec2(py, -px) / (2.0 * e) * u_ambient * u_dt;

  // --- injectors, drop, pointer
  for (int i = 0; i < ${SPLATS}; i++) {
    if (u_sp[i].z <= 0.0) continue;
    v += u_sf[i].xy * splatFall(v_uv, u_sp[i].xy, u_sp[i].z) * u_dt;
  }

  // --- soft walls. Full-bleed means the frame edge is a crop, not a boundary,
  // but without this the tank empties itself into the margins and the ambient
  // stirring has nothing left to stir.
  vec2 e2 = min(v_uv, 1.0 - v_uv);
  float wall = smoothstep(0.0, 0.045, min(e2.x, e2.y));
  v *= mix(0.86, 1.0, wall);

  fragColor = vec4(v, 0.0, 1.0);
}`;

const DIVERGENCE_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_vel;
uniform vec2 u_texel;
void main() {
  float r = texture(u_vel, v_uv + vec2(u_texel.x, 0.0)).x;
  float l = texture(u_vel, v_uv - vec2(u_texel.x, 0.0)).x;
  float t = texture(u_vel, v_uv + vec2(0.0, u_texel.y)).y;
  float b = texture(u_vel, v_uv - vec2(0.0, u_texel.y)).y;
  fragColor = vec4(0.5 * ((r - l) + (t - b)), 0.0, 0.0, 1.0);
}`;

const JACOBI_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_pressure;
uniform sampler2D u_div;
uniform vec2 u_texel;
void main() {
  float r = texture(u_pressure, v_uv + vec2(u_texel.x, 0.0)).x;
  float l = texture(u_pressure, v_uv - vec2(u_texel.x, 0.0)).x;
  float t = texture(u_pressure, v_uv + vec2(0.0, u_texel.y)).x;
  float b = texture(u_pressure, v_uv - vec2(0.0, u_texel.y)).x;
  float d = texture(u_div, v_uv).x;
  fragColor = vec4((l + r + b + t - d) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADSUB_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_pressure;
uniform sampler2D u_vel;
uniform vec2 u_texel;
void main() {
  float r = texture(u_pressure, v_uv + vec2(u_texel.x, 0.0)).x;
  float l = texture(u_pressure, v_uv - vec2(u_texel.x, 0.0)).x;
  float t = texture(u_pressure, v_uv + vec2(0.0, u_texel.y)).x;
  float b = texture(u_pressure, v_uv - vec2(0.0, u_texel.y)).x;
  vec2 v = texture(u_vel, v_uv).xy - 0.5 * vec2(r - l, t - b);
  fragColor = vec4(v, 0.0, 1.0);
}`;

// Half of the MacCormack pair: a plain semi-Lagrangian step, run once forward
// and once backward. u_dir flips the sign so one program serves both.
const DYE_ADVECT_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_src;
uniform sampler2D u_vel;
uniform vec2 u_simTexel;
uniform float u_dt;
uniform float u_dir;
void main() {
  vec2 v = texture(u_vel, v_uv).xy;
  vec2 src = v_uv - u_dir * u_dt * v * u_simTexel;
  fragColor = vec4(texture(u_src, src).xy, 0.0, 1.0);
}`;

// The MacCormack correction plus every dye source, in one pass.
//
// phi_new = phi_fwd + 0.5 * (phi - phi_back), clamped to the min/max of the
// four cells the backtrace actually landed between. The clamp is not optional:
// unclamped, the correction is an antidiffusion term and it manufactures new
// extrema at every sharp interface — the filament edges ring, then go negative,
// then the ringing advects and the whole field speckles. Clamped, the same term
// buys back most of the detail plain advection throws away, which is the entire
// reason a filament here stays a filament for ten seconds instead of blurring
// into fog in two.
const DYE_RESOLVE_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;
uniform sampler2D u_src;    // phi at t
uniform sampler2D u_fwd;    // advect(phi, +dt)
uniform sampler2D u_back;   // advect(fwd, -dt)
uniform sampler2D u_vel;
uniform vec2 u_texel;
uniform vec2 u_simTexel;
uniform float u_dt;
uniform float u_diss;
uniform float u_accentDiss;
uniform float u_correct;
${SPLAT_UNIFORMS}

void main() {
  vec2 fwd = texture(u_fwd, v_uv).xy;
  vec2 phi = texture(u_src, v_uv).xy;
  vec2 back = texture(u_back, v_uv).xy;
  vec2 outv = fwd + 0.5 * (phi - back) * u_correct;

  // clamp against the neighbourhood the backtrace sampled
  vec2 v = texture(u_vel, v_uv).xy;
  vec2 src = v_uv - u_dt * v * u_simTexel;
  vec2 a = texture(u_src, src + vec2(u_texel.x, u_texel.y)).xy;
  vec2 b = texture(u_src, src + vec2(-u_texel.x, u_texel.y)).xy;
  vec2 c = texture(u_src, src + vec2(u_texel.x, -u_texel.y)).xy;
  vec2 d = texture(u_src, src + vec2(-u_texel.x, -u_texel.y)).xy;
  vec2 lo = min(min(a, b), min(c, d));
  vec2 hi = max(max(a, b), max(c, d));
  outv = clamp(outv, lo, hi);

  outv.x *= u_diss;
  outv.y *= u_accentDiss;

  for (int i = 0; i < ${SPLATS}; i++) {
    if (u_sp[i].z <= 0.0) continue;
    float f = splatFall(v_uv, u_sp[i].xy, u_sp[i].z);
    outv.x += u_sp[i].w * f;
    outv.y += u_sf[i].z * f;
  }

  // A ceiling on density, which is a compositional constraint and not a
  // physical one. Without it a source sitting in slow water piles up an
  // unbounded pool that renders as a flat black hole with no internal
  // structure — the opposite of ink, which is legible precisely because even
  // its dense core stays modulated. Capping just above the top ramp stop lets
  // the core saturate while the structure around it keeps reading.
  fragColor = vec4(clamp(outv, vec2(0.0), vec2(1.05, 1.0)), 0.0, 1.0);
}`;

// Display-resolution pass. The only thing that runs per screen pixel.
const RENDER_SRC = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fragColor;
uniform sampler2D u_dye;
uniform vec2 u_dyeTexel;
void main() {
 vec2 d = texture(u_dye,v_uv).xy;
 vec3 bg=vec3(0.15686,0.11373,0.20392);
 float right=clamp(d.y/max(d.x,0.0001),0.,1.);
 vec3 mid=mix(vec3(.40,.31,.49),vec3(.57,.44,.36),right);
 vec3 light=mix(vec3(.7255,.6667,.7922),vec3(.9569,.9451,.9176),right);
 float cov=pow(1.-exp(-d.x*2.8),1.12);
 // The two sources stop short of the brand's central reading space.
 float corridor=smoothstep(.16,.38,abs(v_uv.x-.5));
 cov*=corridor;
 vec3 col=mix(bg,mid,smoothstep(.01,.40,cov));
 col=mix(col,light,smoothstep(.26,.94,cov));
 float n=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
 fragColor=vec4(col+(n-.5)*.003,1.);
}`;

type RGB = [number, number, number];

type FBO = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
  texel: [number, number];
};

type Double = { read: FBO; write: FBO; swap: () => void };

// ---------------------------------------------------------------------------
// Solver — the GL host. It owns the context, the programs, the ping-pong
// targets and the fullscreen blit, and knows nothing about ink: the component
// drives it one pass at a time. Kept inside this file rather than shared, so
// the component stays a single-folder drop-in.
// ---------------------------------------------------------------------------
class Solver {
  gl: WebGL2RenderingContext | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private buffer: WebGLBuffer | null = null;
  private programs: WebGLProgram[] = [];
  private locs = new WeakMap<
    WebGLProgram,
    Map<string, WebGLUniformLocation | null>
  >();
  private fbos: FBO[] = [];
  private active: WebGLProgram | null = null;
  constructor(private canvas: HTMLCanvasElement) {}

  init(): boolean {
    const gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;
    // R16F/RG16F are only colour-renderable behind one of these. Nothing here
    // works without it, and the encode-into-RGBA8 alternative costs more than
    // it is worth for the handful of drivers that would need it — so the
    // component renders nothing and the caller's children sit on --background.
    const ext =
      gl.getExtension("EXT_color_buffer_float") ??
      gl.getExtension("EXT_color_buffer_half_float");
    if (!ext) return false;
    gl.getExtension("OES_texture_float_linear");

    this.buffer = gl.createBuffer();
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    return true;
  }

  program(frag: string): WebGLProgram | null {
    const gl = this.gl;
    if (!gl) return null;
    const vs = this.compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = this.compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    // location 0 is what the single VAO is wired to, for every program
    gl.bindAttribLocation(p, 0, "a_pos");
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      gl.deleteProgram(p);
      return null;
    }
    this.programs.push(p);
    this.locs.set(p, new Map());
    return p;
  }

  private compile(type: number, src: string): WebGLShader | null {
    const gl = this.gl!;
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  use(p: WebGLProgram) {
    this.gl?.useProgram(p);
    this.active = p;
  }

  private loc(name: string): WebGLUniformLocation | null {
    const p = this.active;
    if (!p || !this.gl) return null;
    const map = this.locs.get(p)!;
    if (!map.has(name)) map.set(name, this.gl.getUniformLocation(p, name));
    return map.get(name) ?? null;
  }

  f(n: string, x: number) {
    this.gl?.uniform1f(this.loc(n), x);
  }
  v2(n: string, x: number, y: number) {
    this.gl?.uniform2f(this.loc(n), x, y);
  }
  v3(n: string, c: RGB) {
    this.gl?.uniform3f(this.loc(n), c[0], c[1], c[2]);
  }
  v4a(n: string, data: Float32Array) {
    this.gl?.uniform4fv(this.loc(n), data);
  }
  tex(n: string, unit: number, t: WebGLTexture) {
    const gl = this.gl;
    if (!gl) return;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.uniform1i(this.loc(n), unit);
  }

  makeFBO(w: number, h: number, internal: number, format: number): FBO | null {
    const gl = this.gl!;
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internal,
      w,
      h,
      0,
      format,
      gl.HALF_FLOAT,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteTexture(tex);
      gl.deleteFramebuffer(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return null;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const f: FBO = { tex, fbo, w, h, texel: [1 / w, 1 / h] };
    this.fbos.push(f);
    return f;
  }

  makeDouble(
    w: number,
    h: number,
    internal: number,
    format: number,
  ): Double | null {
    const a = this.makeFBO(w, h, internal, format);
    const b = this.makeFBO(w, h, internal, format);
    if (!a || !b) return null;
    const d: Double = {
      read: a,
      write: b,
      swap: () => {
        const t = d.read;
        d.read = d.write;
        d.write = t;
      },
    };
    return d;
  }

  blit(target: FBO | null) {
    const gl = this.gl;
    if (!gl) return;
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.w, target.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Free one target. Used so a resize can build its replacements, copy the
   *  live field across and only then release the old ones. */
  free(f: FBO | null) {
    const gl = this.gl;
    if (!gl || !f) return;
    gl.deleteTexture(f.tex);
    gl.deleteFramebuffer(f.fbo);
    this.fbos = this.fbos.filter((x) => x !== f);
  }

  freeDouble(d: Double | null) {
    if (!d) return;
    this.free(d.read);
    this.free(d.write);
  }

  dropTargets() {
    const gl = this.gl;
    if (!gl) return;
    for (const f of this.fbos) {
      gl.deleteTexture(f.tex);
      gl.deleteFramebuffer(f.fbo);
    }
    this.fbos = [];
  }

  destroy() {
    const gl = this.gl;
    if (!gl) return;
    this.dropTargets();
    for (const p of this.programs) gl.deleteProgram(p);
    this.programs = [];
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.vao) gl.deleteVertexArray(this.vao);
    this.buffer = null;
    this.vao = null;
    this.gl = null;
  }
}

export function createInkTank(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const solver = new Solver(canvas);
  if (!solver.init()) {
    solver.destroy();
    return null;
  }
  const gl = solver.gl!;
  const pAdvectVel = solver.program(ADVECT_VEL_SRC);
  const pForce = solver.program(FORCE_SRC);
  const pDiv = solver.program(DIVERGENCE_SRC);
  const pJacobi = solver.program(JACOBI_SRC);
  const pGrad = solver.program(GRADSUB_SRC);
  const pDyeAdvect = solver.program(DYE_ADVECT_SRC);
  const pDyeResolve = solver.program(DYE_RESOLVE_SRC);
  const pRender = solver.program(RENDER_SRC);
  if (
    !pAdvectVel ||
    !pForce ||
    !pDiv ||
    !pJacobi ||
    !pGrad ||
    !pDyeAdvect ||
    !pDyeResolve ||
    !pRender
  ) {
    solver.destroy();
    return null;
  }

  const cssW = width,
    cssH = height;
  const portrait = height > width;
  const simW = portrait ? 144 : 256,
    simH = Math.max(96, Math.round((simW * height) / width));
  const dyeW = portrait ? 576 : 1024;
  let simTime = 0;
  let velocity: Double | null = null,
    dye: Double | null = null,
    pressure: Double | null = null;
  let divergence: FBO | null = null,
    dyeTmpA: FBO | null = null,
    dyeTmpB: FBO | null = null;
  const sp = new Float32Array(SPLATS * 4),
    sf = new Float32Array(SPLATS * 4);
  const sources = () => {
    sp.fill(0);
    sf.fill(0);
    for (let side = 0; side < 2; side++)
      for (let j = 0; j < 3; j++) {
        const i = side * 3 + j,
          t = simTime,
          phase = j * 2.09 + side * 0.7;
        const x = side
          ? 0.967 + 0.012 * Math.sin(t * 0.6 + phase)
          : 0.033 + 0.012 * Math.cos(t * 0.6 + phase);
        const y = 0.22 + j * 0.27 + 0.075 * Math.sin(t * 0.53 + phase);
        const amount =
          (0.75 / 60) * Math.max(0, 1 - Math.max(0, t - 3.0) / 2.8);
        sp.set([x, y, 0.12 + 0.025 * Math.sin(t * 0.3 + phase), amount], i * 4);
        sf.set(
          [
            (side ? -1 : 1) * (90 + 30 * Math.sin(t * 0.7 + phase)),
            65 * Math.cos(t * 0.63 + phase),
            side ? amount : 0,
            0,
          ],
          i * 4,
        );
      }
  };
  const step = (dt: number) => {
    if (!velocity || !dye || !pressure || !divergence || !dyeTmpA || !dyeTmpB)
      return;
    const t = { jacobi: 10, correct: 1 };
    const simTexel = velocity.read.texel;
    const aspect = cssW / Math.max(1, cssH);

    // advect velocity
    solver.use(pAdvectVel);
    solver.tex("u_vel", 0, velocity.read.tex);
    solver.v2("u_texel", simTexel[0], simTexel[1]);
    solver.f("u_dt", dt);
    solver.f("u_diss", Math.exp(-dt * 0.16));
    solver.blit(velocity.write);
    velocity.swap();

    // body forces + vorticity confinement + splats
    solver.use(pForce);
    solver.tex("u_vel", 0, velocity.read.tex);
    solver.tex("u_dye", 1, dye.read.tex);
    solver.v2("u_texel", simTexel[0], simTexel[1]);
    solver.f("u_dt", dt);
    solver.f("u_time", simTime);
    solver.f("u_curlAmt", 24);
    solver.f("u_buoy", 28);
    solver.f("u_ambient", 12);
    solver.f("u_aspect", aspect);
    solver.v4a("u_sp", sp);
    solver.v4a("u_sf", sf);
    solver.blit(velocity.write);
    velocity.swap();

    // divergence
    solver.use(pDiv);
    solver.tex("u_vel", 0, velocity.read.tex);
    solver.v2("u_texel", simTexel[0], simTexel[1]);
    solver.blit(divergence);

    // pressure — warm-started from last frame, so a modest iteration count
    // still converges: the field it is solving barely changed
    solver.use(pJacobi);
    solver.v2("u_texel", simTexel[0], simTexel[1]);
    solver.tex("u_div", 1, divergence.tex);
    for (let i = 0; i < t.jacobi; i++) {
      solver.tex("u_pressure", 0, pressure.read.tex);
      solver.blit(pressure.write);
      pressure.swap();
    }

    solver.use(pGrad);
    solver.tex("u_pressure", 0, pressure.read.tex);
    solver.tex("u_vel", 1, velocity.read.tex);
    solver.v2("u_texel", simTexel[0], simTexel[1]);
    solver.blit(velocity.write);
    velocity.swap();

    // dye: MacCormack forward / backward, then resolve + inject
    const dyeTexel = dye.read.texel;
    solver.use(pDyeAdvect);
    solver.tex("u_vel", 1, velocity.read.tex);
    solver.v2("u_simTexel", simTexel[0], simTexel[1]);
    solver.f("u_dt", dt);
    solver.f("u_dir", 1);
    solver.tex("u_src", 0, dye.read.tex);
    solver.blit(dyeTmpA);
    if (t.correct > 0) {
      solver.f("u_dir", -1);
      solver.tex("u_src", 0, dyeTmpA.tex);
      solver.blit(dyeTmpB);
    }

    solver.use(pDyeResolve);
    solver.tex("u_src", 0, dye.read.tex);
    solver.tex("u_fwd", 1, dyeTmpA.tex);
    solver.tex("u_back", 2, t.correct > 0 ? dyeTmpB.tex : dyeTmpA.tex);
    solver.tex("u_vel", 3, velocity.read.tex);
    solver.v2("u_texel", dyeTexel[0], dyeTexel[1]);
    solver.v2("u_simTexel", simTexel[0], simTexel[1]);
    solver.f("u_dt", dt);
    solver.f("u_diss", Math.exp(-dt * 0.1));
    solver.f("u_accentDiss", Math.exp(-dt * 0.1));
    solver.f("u_correct", t.correct);
    solver.f("u_aspect", aspect);
    solver.v4a("u_sp", sp);
    solver.v4a("u_sf", sf);
    solver.blit(dye.write);
    dye.swap();
  };

  const allocate = () => {
    solver.dropTargets();
    simTime = 0;
    velocity = solver.makeDouble(simW, simH, gl.RG16F, gl.RG);
    dye = solver.makeDouble(
      dyeW,
      Math.round((dyeW * height) / width),
      gl.RG16F,
      gl.RG,
    );
    pressure = solver.makeDouble(simW, simH, gl.R16F, gl.RED);
    divergence = solver.makeFBO(simW, simH, gl.R16F, gl.RED);
    dyeTmpA = solver.makeFBO(
      dyeW,
      Math.round((dyeW * height) / width),
      gl.RG16F,
      gl.RG,
    );
    dyeTmpB = solver.makeFBO(
      dyeW,
      Math.round((dyeW * height) / width),
      gl.RG16F,
      gl.RG,
    );
  };
  const advance = () => {
    simTime += 1 / 60;
    sources();
    step(1 / 60);
  };
  const render = () => {
    if (!dye) return;
    solver.use(pRender);
    solver.tex("u_dye", 0, dye.read.tex);
    solver.v2("u_dyeTexel", ...dye.read.texel);
    solver.blit(null);
  };
  canvas.width = Math.min(width, portrait ? 720 : 1440);
  canvas.height = Math.round((canvas.width * height) / width);
  let current = -1;
  allocate();
  return {
    draw(frame: number) {
      if (frame < current) {
        allocate();
        current = -1;
      }
      if (current < 0) for (let i = 0; i < 150; i++) advance();
      for (let i = current + 1; i <= frame; i++) {
        advance();
        advance();
      }
      current = frame;
      render();
    },
    destroy() {
      solver.destroy();
    },
  };
}
