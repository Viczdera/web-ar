import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { loadGLTF } from "./libs/loader.js"

document.addEventListener("DOMContentLoaded", () => {
  async function start() {
    // mockWithVideo("./assets/mock-vid/course-banner1.mp4");
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/card.mind",
    });
    //three init
    const { renderer, scene, camera } = mindarThree;

    // const geometry = new THREE.PlaneGeometry(1, 1);
    // const material = new THREE.MeshBasicMaterial({
    //   color: "#ffffff",
    //   transparent: true,
    //   opacity: 0.4,
    // });
    // const plane = new THREE.Mesh(geometry, material);

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(light);

    //anchor
    const anchor = mindarThree.addAnchor(0);

    //load 3d model then add scene to anchor group
    const gltf = await loadGLTF("./assets/models/musicband-raccoon/scene.gltf");
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -0.5, 0);
    //three group
    anchor.group.add(gltf.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
