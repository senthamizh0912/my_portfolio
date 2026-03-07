// =========================================================
//  Subway Surfer Portfolio — Three.js Scene
//  Senthamizharan Velmurugan's Interactive Portfolio
// =========================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { EffectComposer }  from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// ─── Constants ────────────────────────────────────────────
const TRACK_WIDTH   = 12;          // width of the runner track
const TRACK_SPEED   = 0.18;        // base forward speed (z per frame)
const TILE_DEPTH    = 60;          // length of each tile segment
const NUM_TILES     = 6;           // tiles in the pool
const BILLBOARD_GAP = 90;          // z-distance between billboards
const NEON_BLUE     = 0x00d4ff;
const NEON_PURPLE   = 0xa020f0;
const NEON_PINK     = 0xff007f;
const DARK_BG       = 0x050510;

// ─── Portfolio content shown on billboards ─────────────────
const BILLBOARDS = [
    {
        heading : '🎓 About Me',
        lines   : ['CSE Student @ MVIT, Puducherry', 'CGPA: 8.5 / 10', 'Java • Python • AWS • MySQL'],
        color   : NEON_BLUE,
        side    : 'left'
    },
    {
        heading : '📚 Education',
        lines   : ['B.Tech CSE — 2023‑2027', '12th Grade — 83.5%', 'Amalorpavam HSS, Puducherry'],
        color   : NEON_PURPLE,
        side    : 'right'
    },
    {
        heading : '🚀 Project',
        lines   : ['JavaFX News Fetcher App', 'REST API + JSON Parsing', 'Java • JavaFX • GUI'],
        color   : NEON_PINK,
        side    : 'left'
    },
    {
        heading : '💼 Internship',
        lines   : ['AI & GenAI Intern', 'YBI Foundation — Aug 2025', 'Prompt Engineering • AI Models'],
        color   : NEON_BLUE,
        side    : 'right'
    },
    {
        heading : '🏆 Certifications',
        lines   : ['AWS Cloud Foundations (Jan 2026)', 'IBM SkillsBuild — Getting Started AI', 'Python – HackerRank • Full‑Stack – Infosys'],
        color   : NEON_PURPLE,
        side    : 'left'
    },
    {
        heading : '📬 Contact',
        lines   : ['senthamizhvel2005@gmail.com', 'github.com/senthamizh0912', 'linkedin.com/in/senthamizharan-velmurugan'],
        color   : NEON_PINK,
        side    : 'right'
    }
];

// ─── Scene Setup ──────────────────────────────────────────
const canvas   = document.getElementById('threejs-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(DARK_BG);
scene.fog = new THREE.FogExp2(DARK_BG, 0.018);

const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 400);
camera.position.set(0, 5.5, 18);
camera.lookAt(0, 3.5, 0);

// ─── Post-processing Bloom ────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    1.4,  // strength
    0.5,  // radius
    0.15  // threshold
);
composer.addPass(bloom);

// ─── Lighting ─────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x111133, 2));

const pointL1 = new THREE.PointLight(NEON_BLUE, 4, 60);
pointL1.position.set(0, 10, 0);
scene.add(pointL1);

const pointL2 = new THREE.PointLight(NEON_PURPLE, 3, 50);
pointL2.position.set(-8, 8, -20);
scene.add(pointL2);

// ─── Helpers ──────────────────────────────────────────────
function makeMat(color, emissive = 0x000000, opacity = 1, wireframe = false) {
    return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 1.2, transparent: opacity < 1, opacity, wireframe });
}

// ─── Infinite Track Tiles ─────────────────────────────────
const tileGroup = new THREE.Group();
scene.add(tileGroup);

function buildTile(z) {
    const g = new THREE.Group();

    // Floor
    const floorGeo  = new THREE.PlaneGeometry(TRACK_WIDTH, TILE_DEPTH, 6, 20);
    const floorMat  = new THREE.MeshStandardMaterial({ color: 0x080820, emissive: 0x0a0a30 });
    const floor     = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    g.add(floor);

    // Neon grid lines across the floor
    const lineMat = new THREE.LineBasicMaterial({ color: NEON_BLUE, transparent: true, opacity: 0.25 });
    for (let i = -TILE_DEPTH / 2; i <= TILE_DEPTH / 2; i += 6) {
        const pts = [new THREE.Vector3(-TRACK_WIDTH / 2, 0.01, i), new THREE.Vector3(TRACK_WIDTH / 2, 0.01, i)];
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }
    for (let x = -TRACK_WIDTH / 2; x <= TRACK_WIDTH / 2; x += 3) {
        const pts = [new THREE.Vector3(x, 0.01, -TILE_DEPTH / 2), new THREE.Vector3(x, 0.01, TILE_DEPTH / 2)];
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }

    // Side rails
    [-TRACK_WIDTH / 2, TRACK_WIDTH / 2].forEach(sx => {
        const railGeo = new THREE.BoxGeometry(0.15, 0.15, TILE_DEPTH);
        const rail    = new THREE.Mesh(railGeo, makeMat(NEON_BLUE, NEON_BLUE));
        rail.position.set(sx, 0.08, 0);
        g.add(rail);
    });

    // Tunnel arch stripes
    for (let i = -TILE_DEPTH / 2 + 8; i <= TILE_DEPTH / 2; i += 12) {
        const archGeo  = new THREE.TorusGeometry(8, 0.08, 4, 8, Math.PI);
        const arch     = new THREE.Mesh(archGeo, makeMat(NEON_PURPLE, NEON_PURPLE));
        arch.rotation.z = Math.PI;
        arch.position.set(0, 0, i);
        g.add(arch);
    }

    g.position.set(0, 0, z);
    return g;
}

const tiles = [];
for (let i = 0; i < NUM_TILES; i++) {
    const t = buildTile(-i * TILE_DEPTH);
    tiles.push(t);
    tileGroup.add(t);
}

// ─── Runner Character ─────────────────────────────────────
const runnerGroup = new THREE.Group();
scene.add(runnerGroup);
runnerGroup.position.set(0, 0, 12);

const charMat    = makeMat(0x00d4ff, 0x004466);
const darkMat    = makeMat(0x050520, 0x020210);
const faceMatCya = makeMat(0x00eeff, 0x00aacc);

// Body
const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.6), charMat);
body.position.y = 1.9;
runnerGroup.add(body);

// Head
const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), charMat);
head.position.y = 3.05;
runnerGroup.add(head);

// Eyes
[-0.2, 0.2].forEach(ex => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), makeMat(0xffffff, 0xffffff));
    eye.position.set(ex, 3.08, 0.41);
    runnerGroup.add(eye);
});

// Arms
const leftArm  = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), charMat);
const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), charMat);
leftArm.position.set(-0.64, 1.85, 0);
rightArm.position.set(0.64, 1.85, 0);
runnerGroup.add(leftArm, rightArm);

// Legs
const leftLeg  = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.0, 0.38), darkMat);
const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.0, 0.38), darkMat);
leftLeg.position.set(-0.25, 0.7, 0);
rightLeg.position.set(0.25, 0.7, 0);
runnerGroup.add(leftLeg, rightLeg);

// Backpack
const pack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.8, 0.25), makeMat(NEON_PURPLE, NEON_PURPLE, 1));
pack.position.set(0, 1.95, -0.4);
runnerGroup.add(pack);

// Shadow disk
const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.6, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.02;
runnerGroup.add(shadow);

// ─── Billboard Factory ────────────────────────────────────
const billboardMeshes = [];

function buildBillboard(data, zPos) {
    const group = new THREE.Group();
    const w = 9, h = 4.5;
    const side = data.side === 'left' ? -1 : 1;

    // Panel backing
    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x030315, emissive: 0x000030, transparent: true, opacity: 0.92 })
    );
    group.add(panel);

    // Glowing border frame
    const edgeMat = makeMat(data.color, data.color);
    [
        [w, 0.12, 0.12, 0,          h / 2],
        [w, 0.12, 0.12, 0,         -h / 2],
        [0.12, h, 0.12, -w / 2,    0],
        [0.12, h, 0.12,  w / 2,    0]
    ].forEach(([bw, bh, bd, bx, by]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), edgeMat);
        b.position.set(bx, by, 0.07);
        group.add(b);
    });

    // Corner diamonds
    [[w/2, h/2], [-w/2, h/2], [w/2, -h/2], [-w/2, -h/2]].forEach(([cx, cy]) => {
        const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), edgeMat);
        d.position.set(cx, cy, 0.15);
        group.add(d);
    });

    // Pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5.5, 8),
        makeMat(data.color, data.color, 0.8)
    );
    pole.position.set(0, -h / 2 - 2.5, 0);
    group.add(pole);

    // Canvas texture with text
    const texCanvas = document.createElement('canvas');
    texCanvas.width  = 512;
    texCanvas.height = 280;
    const ctx = texCanvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 280);
    grad.addColorStop(0, 'rgba(5,5,25,0.0)');
    grad.addColorStop(1, 'rgba(5,5,25,0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 280);

    // Heading
    const hue = '#' + data.color.toString(16).padStart(6, '0');
    ctx.fillStyle = hue;
    ctx.font = 'bold 44px Outfit, Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = hue;
    ctx.shadowBlur = 18;
    ctx.fillText(data.heading, 256, 66);

    // Lines
    ctx.font = '28px Inter, Arial';
    ctx.fillStyle = '#c8e8ff';
    ctx.shadowColor = 'rgba(0,212,255,0.4)';
    ctx.shadowBlur = 8;
    data.lines.forEach((line, i) => {
        ctx.fillText(line, 256, 120 + i * 54);
    });

    const texture  = new THREE.CanvasTexture(texCanvas);
    const textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(w - 0.3, h - 0.3),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );
    textPlane.position.z = 0.08;
    group.add(textPlane);

    // Position — off to the side, angled inward
    group.position.set(side * (TRACK_WIDTH / 2 + 5.5), 5.5, zPos);
    group.rotation.y = side * (-Math.PI / 7);

    group.userData = { zPos, visible: false, color: data.color };
    scene.add(group);
    billboardMeshes.push(group);
    return group;
}

// Spawn billboards
BILLBOARDS.forEach((data, i) => {
    buildBillboard(data, -(2 + i) * BILLBOARD_GAP);
});

// ─── Stars / Space Dust ───────────────────────────────────
const starGeo  = new THREE.BufferGeometry();
const starCount = 1800;
const starPos   = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i]     = (Math.random() - 0.5) * 300;
    starPos[i + 1] = Math.random() * 80 + 3;
    starPos[i + 2] = (Math.random() - 0.5) * 400 - 50;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.35, transparent: true, opacity: 0.7 })));

// ─── Ground Plane (infinite feel) ─────────────────────────
const groundGeo = new THREE.PlaneGeometry(300, 600);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x030310, emissive: 0x010108 });
const ground    = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.05, -150);
scene.add(ground);

// ─── HUD: scroll hint ─────────────────────────────────────
const hud = document.getElementById('runner-hud');

// ─── State ────────────────────────────────────────────────
let totalZ       = 0;           // total z distance travelled (negative)
let scrollBoost  = 0;           // extra speed from scroll
let mouse        = { x: 0, y: 0 };
let runClock     = 0;
let billboardIdx = 0;          // next billboard to activate
let activeBillboards = new Set();

// ─── Scroll handler ───────────────────────────────────────
window.addEventListener('wheel', e => {
    scrollBoost = Math.min(scrollBoost + e.deltaY * 0.006, 1.4);
}, { passive: true });

window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ─── Resize ───────────────────────────────────────────────
function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// ─── Animate ──────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    runClock += dt;

    const speed = TRACK_SPEED + scrollBoost;
    scrollBoost = Math.max(scrollBoost - dt * 0.9, 0); // decay
    totalZ -= speed;

    // ── Tile recycling ──────────────────────────────────────
    tiles.forEach(tile => {
        tile.position.z = tile.position.z + speed;
        if (tile.position.z > TILE_DEPTH * 0.8) {
            tile.position.z -= NUM_TILES * TILE_DEPTH;
        }
    });

    // ── Runner run cycle ───────────────────────────────────
    const bounce = Math.abs(Math.sin(runClock * 8)) * 0.22;
    runnerGroup.position.y = bounce;

    const legSwing = Math.sin(runClock * 8) * 0.5;
    leftLeg.rotation.x  =  legSwing;
    rightLeg.rotation.x = -legSwing;

    const armSwing = Math.sin(runClock * 8) * 0.45;
    leftArm.rotation.x  = -armSwing;
    rightArm.rotation.x =  armSwing;

    // Head bob
    head.rotation.z = Math.sin(runClock * 4) * 0.06;

    // ── Billboards ─────────────────────────────────────────
    billboardMeshes.forEach(bb => {
        const worldZ = bb.position.z + (-totalZ);

        // fade in as they approach
        const dist = bb.position.z - (-totalZ);
        // dist > 0 means ahead of runner
        if (dist < 80 && dist > -30) {
            const t = 1 - Math.min(Math.abs(dist) / 80, 1);
            bb.children.forEach(c => {
                if (c.material && c.material.transparent) {
                    c.material.opacity = Math.max(c.material.opacity, t * (c.material.transparent ? 0.92 : 1));
                }
            });

            // Float oscillation
            bb.position.y = 5.5 + Math.sin(runClock * 1.5 + bb.position.z * 0.02) * 0.3;

            // Corner diamonds spin
            bb.children.forEach(c => {
                if (c.geometry && c.geometry.type === 'OctahedronGeometry') {
                    c.rotation.y += dt * 2;
                    c.rotation.x += dt * 1.5;
                }
            });
        }
    });

    // ── Camera parallax ────────────────────────────────────
    camera.position.x += (-mouse.x * 2.5 - camera.position.x) * dt * 3;
    camera.position.y += (5.5 - mouse.y * 0.8 - camera.position.y) * dt * 3;
    camera.lookAt(0, 3, 0);

    // ── Neon lights follow runner ───────────────────────────
    pointL1.position.z = runnerGroup.position.z + 5;

    // ── HUD scroll hint ─────────────────────────────────────
    if (hud) {
        const totalDist = Math.abs(totalZ);
        if (totalDist > 50) {
            hud.style.opacity = '0';
        }
    }

    composer.render();
}

animate();
