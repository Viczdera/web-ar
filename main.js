// const THREE = window.MINDAR.IMAGE.THREE;
import * as THREE from "three"
import {MindARThree} from "mindar-image-three"
import {mockWithVideo} from "./libs/camera-mock.js"
document.addEventListener("DOMContentLoaded", () => {
  async function start() {
    mockWithVideo("./assets/mock-vid/course-banner1.mp4")
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/course-banner.mind",
    });
    //three init
    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.4,
    });
    const plane = new THREE.Mesh(geometry, material);

    //anchor
    const anchor = mindarThree.addAnchor(0);
    //three group
    anchor.group.add(plane);
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
