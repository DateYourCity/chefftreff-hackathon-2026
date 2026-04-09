"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

type Props = {
  modelPath: string; // e.g. "/models/model.dae"
};

export default function SimpleDAEViewer({ modelPath }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const safeModelPath = typeof modelPath === "string" ? modelPath.trim() : "";
    if (!safeModelPath) {
      console.error("SimpleDAEViewer: modelPath is missing or invalid", modelPath);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 5.2);
    scene.add(light);

    const clock = new THREE.Clock();
    const mixer = { current: null as THREE.AnimationMixer | null };

    const loader = new ColladaLoader();
    loader.load(
      safeModelPath,
      (collada) => {
        if (!collada?.scene) return;
        const model = collada.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        model.rotation.y = THREE.MathUtils.degToRad(45);

        scene.add(model);

        const animations = model.animations ?? [];
        if (animations.length > 0) {
          mixer.current = new THREE.AnimationMixer(model);
          const action = mixer.current.clipAction(animations[0]);
          action.play();
        }
      },
      undefined,
      (err) => console.error("Error loading DAE:", err)
    );

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    onResize();
    window.addEventListener("resize", onResize);

    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      mixer.current?.update(delta);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelPath]);

  return <div ref={containerRef} className="w-full h-full" />;
}