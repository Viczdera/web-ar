const THREE = window.MINDAR.IMAGE.THREE;
document.addEventListener("DOMContentLoaded", () => {
  async function start() {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/card.mind",
    });
    //three init
    const { renderer, scene, camera } = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 1,
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
