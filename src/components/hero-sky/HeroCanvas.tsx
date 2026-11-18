import { useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const NIGHT_MAP = `${import.meta.env.BASE_URL}textures/earth-night.webp`;

const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const earthFragment = /* glsl */ `
  uniform sampler2D uNight;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 sampleColor = texture2D(uNight, vUv).rgb;
    float lum = dot(sampleColor, vec3(0.299, 0.587, 0.114));
    vec3 cities = sampleColor * vec3(1.25, 1.02, 0.72) * 1.45;
    vec3 ground = vec3(0.007, 0.012, 0.026);
    vec3 color = mix(ground, cities, smoothstep(0.012, 0.2, lum));
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.6);
    color += rim * vec3(0.25, 0.58, 0.95) * 0.5;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.45);
    gl_FragColor = vec4(vec3(0.40, 0.76, 1.0), fresnel * 0.92);
  }
`;

const starVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aCross;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vCross;
  void main() {
    vColor = aColor;
    vCross = aCross;
    float twinkle = 0.62 + 0.38 * sin(uTime * (0.45 + aSeed * 1.4) + aSeed * 18.0);
    vAlpha = twinkle;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * (22.0 / -mv.z), 0.6, 3.6);
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vCross;
  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float disk = smoothstep(1.0, 0.15, length(p));
    float arms = max(
      smoothstep(0.22, 0.0, abs(p.x)) * smoothstep(1.0, 0.2, abs(p.y)),
      smoothstep(0.22, 0.0, abs(p.y)) * smoothstep(1.0, 0.2, abs(p.x))
    );
    float shape = mix(disk, max(disk, arms * 0.9), vCross);
    if (shape < 0.03) discard;
    gl_FragColor = vec4(vColor, shape * vAlpha);
  }
`;

interface MeteorSpec {
  delay: number;
  duration: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  length: number;
  color: string;
}

const METEORS: MeteorSpec[] = [
  {
    delay: 2.2,
    duration: 14,
    from: new THREE.Vector3(-2.9, 0.83, 2.5),
    to: new THREE.Vector3(2.91, 0.76, 2.5),
    length: 1.35,
    color: '#e7f1ff',
  },
  {
    delay: 8.4,
    duration: 16,
    from: new THREE.Vector3(1.47, 0.94, 2.2),
    to: new THREE.Vector3(3.44, 0.69, 2.2),
    length: 1.05,
    color: '#9fd4ff',
  },
  {
    delay: 5.1,
    duration: 15,
    from: new THREE.Vector3(-2.51, -0.31, 3),
    to: new THREE.Vector3(2.52, -0.39, 3),
    length: 1.45,
    color: '#ffb15a',
  },
];

const travelerVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const travelerFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 lightDir = normalize(vec3(-0.45, 0.82, 0.55));
    float wrap = clamp(dot(n, lightDir) * 0.45 + 0.62, 0.0, 1.0);
    vec3 color = mix(vec3(0.74, 0.77, 0.81), vec3(0.98, 0.97, 0.94), wrap);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(n, halfDir), 0.0), 36.0);
    color += spec * 0.5;
    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.2);
    color += fres * vec3(0.78, 0.86, 0.96) * 0.22;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function makeMeteorTexture() {
  const width = 512;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  const image = ctx.createImageData(width, height);
  const data = image.data;
  for (let x = 0; x < width; x += 1) {
    const along = x / (width - 1);
    const fade = along * along * along;
    const head = Math.exp(-((along - 1) ** 2) / 0.0016);
    for (let y = 0; y < height; y += 1) {
      const ny = ((y + 0.5) / height) * 2 - 1;
      const half = 0.04 + along * 0.14;
      const body = Math.exp(-(ny * ny) / (half * half * 2));
      const glow = Math.exp(-(ny * ny) / 0.2) * head;
      const alpha = Math.min(1, fade * body + glow * 0.95);
      const pixel = (y * width + x) * 4;
      data[pixel] = 255;
      data[pixel + 1] = 255;
      data[pixel + 2] = 255;
      data[pixel + 3] = Math.round(alpha * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStars() {
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const crosses = new Float32Array(count);
  let i = 0;
  let guard = 0;
  while (i < count && guard < 8000) {
    guard += 1;
    const radius = 9 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const yLift = Math.random() ** 0.65;
    const phi = yLift * Math.PI * 0.72;
    const y = Math.cos(phi) * radius;
    const ring = Math.sin(phi) * radius;
    const x = Math.cos(theta) * ring;
    const z = Math.sin(theta) * ring;
    if (y < -1.2) continue;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y - 0.4;
    positions[i * 3 + 2] = z;
    const roll = Math.random();
    const bright = roll > 0.965;
    const mid = roll > 0.78;
    sizes[i] = bright ? 2.5 : mid ? 1.55 : 1.05;
    crosses[i] = bright ? 1 : 0;
    seeds[i] = Math.random();
    if (roll > 0.99) colors.set([1, 0.78, 0.55], i * 3);
    else if (roll > 0.9) colors.set([0.72, 0.84, 1], i * 3);
    else colors.set([0.92, 0.95, 1], i * 3);
    i += 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, i * 3), 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors.subarray(0, i * 3), 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes.subarray(0, i), 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds.subarray(0, i), 1));
  geometry.setAttribute('aCross', new THREE.BufferAttribute(crosses.subarray(0, i), 1));
  return geometry;
}

function ClearColor() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const apply = () => {
      const oled = document.documentElement.classList.contains('oled-mode');
      gl.setClearColor(oled ? '#000000' : '#08090d', 1);
      invalidate();
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [gl, invalidate]);
  return null;
}

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pointer;
}

function useNightTexture() {
  return useTexture(NIGHT_MAP, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 8;
  });
}

function Earth({ still }: { still: boolean }) {
  const night = useNightTexture();
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (still || !mesh.current) return;
    mesh.current.rotation.y += delta * 0.0012;
  });
  return (
    <group rotation={[0.28, 0.55, 0.08]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 80, 80]} />
        <shaderMaterial
          uniforms={{ uNight: { value: night } }}
          vertexShader={earthVertex}
          fragmentShader={earthFragment}
        />
      </mesh>
      <mesh scale={1.045}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Starfield({ still }: { still: boolean }) {
  const stillRef = useRef(still);
  useEffect(() => {
    stillRef.current = still;
  }, [still]);
  const points = useMemo(() => {
    const geometry = makeStars();
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const cloud = new THREE.Points(geometry, material);
    cloud.onBeforeRender = () => {
      if (stillRef.current) return;
      material.uniforms.uTime.value = performance.now() / 1000;
    };
    return cloud;
  }, []);
  useEffect(() => () => {
    points.geometry.dispose();
    const material = points.material;
    if (material instanceof THREE.Material) material.dispose();
  }, [points]);
  return <primitive object={points} />;
}

function Meteors({ still }: { still: boolean }) {
  const texture = useMemo(() => makeMeteorTexture(), []);
  const refs = useRef<(THREE.Sprite | null)[]>([]);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    METEORS.forEach((meteor, index) => {
      const sprite = refs.current[index];
      if (!sprite) return;
      const material = sprite.material as THREE.SpriteMaterial;
      if (still) {
        material.opacity = 0;
        return;
      }
      const cycle = ((elapsed - meteor.delay) % meteor.duration + meteor.duration) % meteor.duration;
      const t = cycle / meteor.duration;
      if (t > 0.16) {
        material.opacity = 0;
        return;
      }
      const along = t / 0.16;
      material.opacity = Math.sin(along * Math.PI);
      sprite.position.lerpVectors(meteor.from, meteor.to, along);
      material.rotation = Math.atan2(meteor.to.y - meteor.from.y, meteor.to.x - meteor.from.x);
    });
  });
  return (
    <>
      {METEORS.map((meteor, index) => (
        <sprite
          key={meteor.delay}
          ref={(node) => { refs.current[index] = node; }}
          scale={[meteor.length, 0.07, 1]}
          position={meteor.from}
        >
          <spriteMaterial
            map={texture}
            color={meteor.color}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0}
          />
        </sprite>
      ))}
    </>
  );
}

const ndc = new THREE.Vector3();
const anchor = new THREE.Vector3();
const edge = new THREE.Vector3();
const ray = new THREE.Vector3();

function pointOnCanvas(
  camera: THREE.Camera,
  width: number,
  height: number,
  sx: number,
  sy: number,
  z: number,
  target: THREE.Vector3,
) {
  ndc.set((sx / width) * 2 - 1, -(sy / height) * 2 + 1, 0.5);
  ndc.unproject(camera);
  ray.copy(ndc).sub(camera.position);
  const travel = (z - camera.position.z) / ray.z;
  target.copy(camera.position).addScaledVector(ray, travel);
}

function Stage({ still }: { still: boolean }) {
  const earth = useRef<THREE.Group>(null);
  const traveler = useRef<THREE.Group>(null);
  const stars = useRef<THREE.Group>(null);
  const pointer = usePointer();

  useFrame((state, delta) => {
    const width = state.size.width;
    const height = Math.max(state.size.height, 1);
    const aspect = width / height;
    const wide = aspect >= 2.7;
    const earthY = width < 480 ? -3.46 : -3.25;
    let sx = width * 0.078;
    let sy = height * 0.2;
    let radPx = Math.min(44, width * 0.046);
    if (width < 480) {
      sx = 40;
      sy = 34;
      radPx = 16;
    } else if (width < 720) {
      sx = 42;
      sy = 30;
      radPx = 16;
    } else if (wide) {
      sx = 118;
      sy = 76;
      radPx = 62;
    }
    pointOnCanvas(state.camera, width, height, sx, sy, 2.2, anchor);
    pointOnCanvas(state.camera, width, height, sx + radPx, sy, 2.2, edge);
    const scale = Math.max(anchor.distanceTo(edge), 0.02);
    const sway = still ? 0 : 1;
    const px = pointer.current.x * sway;
    const py = pointer.current.y * sway;
    const damp = still ? 1 : 1 - Math.pow(0.001, delta);
    if (stars.current) {
      stars.current.position.x += (px * 0.18 - stars.current.position.x) * damp;
      stars.current.position.y += (-py * 0.1 - stars.current.position.y) * damp;
    }
    if (earth.current) {
      earth.current.position.x += (px * 0.05 - earth.current.position.x) * damp;
      earth.current.position.y += (earthY - py * 0.03 - earth.current.position.y) * damp;
    }
    if (traveler.current) {
      traveler.current.position.x += (anchor.x + px * 0.16 - traveler.current.position.x) * damp;
      traveler.current.position.y += (anchor.y - py * 0.08 - traveler.current.position.y) * damp;
      traveler.current.position.z += (anchor.z - traveler.current.position.z) * damp;
      const next = traveler.current.scale.x + (scale - traveler.current.scale.x) * damp;
      traveler.current.scale.setScalar(next);
    }
  });

  return (
    <>
      <group ref={stars}>
        <Starfield still={still} />
        <Meteors still={still} />
      </group>
      <group ref={earth} position={[0.3, -2.05, 0]} scale={2.15}>
        <Earth still={still} />
      </group>
      <group ref={traveler} position={[-2.2, 0.7, 2.2]} scale={0.2}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial vertexShader={travelerVertex} fragmentShader={travelerFragment} />
        </mesh>
      </group>
    </>
  );
}

function SkyScene({ still }: { still: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [invalidate, still]);
  return (
    <>
      <ClearColor />
      <Stage still={still} />
    </>
  );
}

export default function HeroCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setStill(motion.matches);
    syncMotion();
    motion.addEventListener('change', syncMotion);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => {
      motion.removeEventListener('change', syncMotion);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.42, 5.6], fov: 28, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        frameloop={still || !active ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <SkyScene still={still} />
      </Canvas>
    </div>
  );
}
