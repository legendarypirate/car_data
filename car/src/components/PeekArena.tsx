"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";

type FeedItem = { id: number; name: string };

const BOT_NAMES = ["BOT Skullhead", "BOT Blackwell", "BOT Ash"];

export function PeekArena() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [kills, setKills] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState("Click to lock mouse · one dies, the next peeks");
  const startedRef = useRef(false);
  const onKillRef = useRef<(name: string) => void>(() => {});
  const onStatusRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    onKillRef.current = (name) => {
      setKills((n) => n + 1);
      const id = Date.now() + Math.random();
      setFeed((items) => [{ id, name }, ...items].slice(0, 4));
    };
    onStatusRef.current = setStatus;
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#b7c4c8");
    scene.fog = new THREE.Fog("#c5d0d4", 12, 42);

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.08,
      80,
    );
    camera.position.set(0, 1.55, 9);

    scene.add(new THREE.HemisphereLight("#fff4e6", "#6b5a45", 1.15));
    const sun = new THREE.DirectionalLight("#ffe2c0", 1.4);
    sun.position.set(-8, 14, 6);
    sun.castShadow = true;
    scene.add(sun);
    scene.add(new THREE.AmbientLight("#8aa0aa", 0.35));

    const stone = (hex: string) =>
      new THREE.MeshStandardMaterial({ color: hex, roughness: 0.92, metalness: 0.04 });

    const walls: THREE.Box3[] = [];
    const addBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      const box = new THREE.Box3().setFromObject(mesh);
      box.expandByScalar(-0.02);
      walls.push(box);
      return mesh;
    };

    addBox(18, 0.2, 36, 0, 0, -4, stone("#cbb79a"));
    addBox(18, 0.4, 36, 0, 8.2, -4, stone("#d8c7ab"));
    addBox(1.4, 8, 36, -5.2, 4, -4, stone("#b79f7d"));
    addBox(1.4, 8, 36, 5.2, 4, -4, stone("#b79f7d"));
    addBox(12, 9, 1.6, 0, 4.5, -18, stone("#a58b68"));
    addBox(2.2, 5, 2.4, -2.6, 2.5, -1.2, stone("#9d8866"));
    addBox(2.4, 6, 2.6, 2.8, 3, -3.4, stone("#a8906c"));
    addBox(1.8, 4.5, 1.8, -3.1, 2.25, -8.5, stone("#8f7a5a"));
    addBox(3.4, 3.2, 1.4, 0, 1.6, -17.1, stone("#7d684c"));

    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 4.2, 0.6),
      stone("#8c7658"),
    );
    arch.position.set(0, 3.4, -17.2);
    scene.add(arch);

    const gun = new THREE.Group();
    const gunMat = (color: string) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.72), gunMat("#2a1b3d"));
    body.position.set(0.22, -0.22, -0.55);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.12), gunMat("#7c3aed"));
    mag.position.set(0.22, -0.38, -0.42);
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.38), gunMat("#22d3ee"));
    barrel.position.set(0.22, -0.16, -0.98);
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.22), gunMat("#f472b6"));
    stock.position.set(0.22, -0.24, -0.18);
    gun.add(body, mag, barrel, stock);
    camera.add(gun);
    scene.add(camera);

    type Bot = {
      name: string;
      group: THREE.Group;
      cover: THREE.Vector3;
      peek: THREE.Vector3;
      hp: number;
      state: "cover" | "peeking" | "live" | "dead";
      t: number;
      nextShot: number;
    };

    const makeBot = (name: string, cover: THREE.Vector3, peek: THREE.Vector3, live: boolean) => {
      const group = new THREE.Group();
      const bodyMesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.28, 0.9, 4, 8),
        new THREE.MeshStandardMaterial({ color: "#2d3a2f" }),
      );
      bodyMesh.position.y = 0.95;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: "#c4a574" }),
      );
      head.position.y = 1.62;
      const rifle = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, 0.7),
        new THREE.MeshStandardMaterial({ color: "#1f2933" }),
      );
      rifle.position.set(0.22, 1.15, -0.25);
      group.add(bodyMesh, head, rifle);
      group.position.copy(live ? peek : cover);
      scene.add(group);
      return {
        name,
        group,
        cover,
        peek,
        hp: 100,
        state: live ? "live" : "cover",
        t: 0,
        nextShot: 1.4,
      } as Bot;
    };

    const bots: Bot[] = [
      makeBot("BOT Skullhead", new THREE.Vector3(0.35, 0, -6.2), new THREE.Vector3(0.35, 0, -6.2), true),
      makeBot("BOT Blackwell", new THREE.Vector3(2.55, 0, -3.3), new THREE.Vector3(1.05, 0, -3.6), false),
      makeBot("BOT Ash", new THREE.Vector3(-2.7, 0, -8.4), new THREE.Vector3(-0.9, 0, -8.1), false),
    ];
    let nextPeek = 1;

    const keys: Record<string, boolean> = {};
    const velocity = new THREE.Vector3();
    let yaw = 0;
    let pitch = 0;
    let recoil = 0;
    let locked = false;
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    const player = new THREE.Vector3(0, 1.55, 9);
    const tracers: { line: THREE.Line; life: number }[] = [];

    const canMove = (from: THREE.Vector3, to: THREE.Vector3) => {
      const probe = to.clone();
      probe.y = 0.9;
      const sphere = new THREE.Sphere(probe, 0.28);
      return !walls.some((w) => w.intersectsSphere(sphere));
    };

    const shootFrom = (origin: THREE.Vector3, dir: THREE.Vector3, fromPlayer: boolean) => {
      raycaster.set(origin, dir.clone().normalize());
      if (fromPlayer) {
        const hits = bots
          .filter((b) => b.state === "live" || b.state === "peeking")
          .map((b) => ({ bot: b, hit: raycaster.intersectObject(b.group, true)[0] }))
          .filter((x) => x.hit)
          .sort((a, b) => (a.hit.distance || 99) - (b.hit.distance || 99));
        const first = hits[0];
        if (first?.bot) {
          first.bot.hp = 0;
          first.bot.state = "dead";
          first.bot.group.rotation.z = 1.35;
          first.bot.group.position.y = 0.15;
          onKillRef.current(first.bot.name);
          if (nextPeek < bots.length) {
            const incoming = bots[nextPeek];
            incoming.state = "peeking";
            incoming.t = 0;
            nextPeek += 1;
            onStatusRef.current(`${first.bot.name} down · ${incoming.name} peeking`);
          } else if (bots.every((b) => b.state === "dead")) {
            onStatusRef.current("All peekers down. Click to reset.");
          }
        }
      } else {
        const dist = origin.distanceTo(camera.position);
        const spread = 0.045;
        const aimed = dir
          .clone()
          .add(new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, 0))
          .normalize();
        raycaster.set(origin, aimed);
        const hit = raycaster.intersectObject(camera, false);
        if (dist < 22 && Math.random() > 0.55) {
          recoil += 0.08;
        }
        void hit;
      }

      const end = origin.clone().add(dir.clone().setLength(18));
      const geom = new THREE.BufferGeometry().setFromPoints([origin.clone(), end]);
      const line = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({ color: fromPlayer ? "#f8fafc" : "#f97316", transparent: true, opacity: 0.7 }),
      );
      scene.add(line);
      tracers.push({ line, life: 0.08 });
    };

    const onKey = (e: KeyboardEvent, down: boolean) => {
      keys[e.code] = down;
    };
    const onMouse = (e: MouseEvent) => {
      if (!locked) return;
      yaw -= e.movementX * 0.0022;
      pitch -= e.movementY * 0.0022;
      pitch = Math.max(-1.2, Math.min(1.2, pitch));
    };
    const onKeyDown = (e: KeyboardEvent) => onKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => onKey(e, false);
    const onClick = () => {
      if (!startedRef.current) return;
      if (!locked) {
        renderer.domElement.requestPointerLock();
        return;
      }
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const origin = camera.position.clone().add(dir.clone().multiplyScalar(0.4));
      shootFrom(origin, dir, true);
      recoil = 0.12;
    };
    const onLock = () => {
      locked = document.pointerLockElement === renderer.domElement;
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onLock);
    window.addEventListener("resize", onResize);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.033);
      if (!startedRef.current) {
        renderer.render(scene, camera);
        return;
      }

      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const wish = new THREE.Vector3();
      if (keys.KeyW) wish.add(forward);
      if (keys.KeyS) wish.sub(forward);
      if (keys.KeyD) wish.add(right);
      if (keys.KeyA) wish.sub(right);
      if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(6.2 * dt);

      const next = player.clone().add(wish);
      if (canMove(player, next)) player.copy(next);
      player.y = 1.55;
      recoil *= Math.pow(0.04, dt);
      camera.position.copy(player);
      camera.rotation.set(pitch + recoil, yaw, 0, "YXZ");
      gun.position.set(0.02, -0.01 - recoil * 0.4, recoil * 0.2);

      bots.forEach((bot) => {
        if (bot.state === "dead") return;
        if (bot.state === "peeking") {
          bot.t = Math.min(1, bot.t + dt * 2.4);
          bot.group.position.lerpVectors(bot.cover, bot.peek, 1 - Math.pow(1 - bot.t, 3));
          if (bot.t >= 1) bot.state = "live";
        }
        const toPlayer = player.clone().sub(bot.group.position);
        toPlayer.y = 0;
        bot.group.lookAt(player.x, bot.group.position.y, player.z);
        if (bot.state === "live") {
          bot.nextShot -= dt;
          if (bot.nextShot <= 0) {
            bot.nextShot = 0.9 + Math.random() * 0.5;
            const muzzle = bot.group.position.clone().add(new THREE.Vector3(0, 1.2, 0));
            const dir = camera.position.clone().sub(muzzle).normalize();
            shootFrom(muzzle, dir, false);
          }
        }
      });

      tracers.forEach((tr) => {
        tr.life -= dt;
        if (tr.life <= 0) {
          scene.remove(tr.line);
          tr.line.geometry.dispose();
          (tr.line.material as THREE.Material).dispose();
        }
      });
      for (let i = tracers.length - 1; i >= 0; i--) if (tracers[i].life <= 0) tracers.splice(i, 1);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onLock);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#10151c]">
      <div ref={mountRef} className="h-full w-full" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-0 h-2 w-[2px] -translate-x-1/2 bg-white/90" />
        <div className="absolute bottom-0 left-1/2 h-2 w-[2px] -translate-x-1/2 bg-white/90" />
        <div className="absolute left-0 top-1/2 h-[2px] w-2 -translate-y-1/2 bg-white/90" />
        <div className="absolute right-0 top-1/2 h-[2px] w-2 -translate-y-1/2 bg-white/90" />
      </div>

      <div className="absolute right-5 top-5 space-y-1 text-right text-[12px] font-semibold text-white drop-shadow">
        {feed.map((item) => (
          <div key={item.id} className="rounded bg-black/45 px-2 py-1">
            You <span className="text-orange-300">AK</span> {item.name}
          </div>
        ))}
      </div>

      <div className="absolute left-5 top-5 text-white">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">Peek drill</p>
        <p className="text-sm font-semibold">{status}</p>
        <p className="text-[12px] text-white/70">Kills {kills}</p>
      </div>

      <p className="absolute bottom-5 left-5 text-[12px] text-white/70">
        WASD move · mouse look · click shoot
      </p>
      <Link
        href="/"
        className="absolute bottom-5 right-5 text-[12px] text-white/70 underline-offset-2 hover:text-white hover:underline"
      >
        Back to NDA AUTO
      </Link>

      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            mountRef.current?.querySelector("canvas")?.requestPointerLock();
          }}
          className="absolute inset-0 z-10 grid place-items-center bg-black/55 text-white"
        >
          <span className="rounded-xl border border-white/20 bg-black/50 px-8 py-5 text-center">
            <span className="block text-lg font-semibold">One bot dies. Another peeks.</span>
            <span className="mt-2 block text-sm text-white/70">Click to start</span>
          </span>
        </button>
      )}
    </div>
  );
}
