import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { loadGLTF, loadAudio } from "./libs/loader.js";

document.addEventListener("DOMContentLoaded", () => {
  async function start() {
    // mockWithVideo("./assets/mock-vid/course-banner1.mp4");
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/treekle.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);

    const gltf = await loadGLTF("./assets/models/musicband-raccoon/scene.gltf");
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, -0.3, 0);
    //gltf.scene.rotation.x = Math.PI / 2;

    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);

    const audioClip = await loadAudio("./assets/audio/90s-tv-theme.mp3");
    const listener = new THREE.AudioListener();
    const audio = new THREE.PositionalAudio(listener);

    camera.add(listener);
    audio.setRefDistance(100); 
    audio.setBuffer(audioClip);
    audio.setLoop(true);
    audio.setMaxDistance(200); 
    audio.setVolume(100); 

    anchor.group.add(gltf.scene);
    anchor.group.add(audio);

    anchor.onTargetFound = () => {
      console.log("found");
      action.play();
      audio.play();
    };

    anchor.onTargetLost = () => {
      console.log("not found");
      action.stop();
      audio.pause();
    };

    const clock = new THREE.Clock();

    await mindarThree.start();

    // Stabilize model by damping its movements
    const previousPosition = new THREE.Vector3();
    const previousQuaternion = new THREE.Quaternion();
    const smoothingFactor = 0.1; // Adjust this value for desired smoothness

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);

      // Smooth position and rotation
      gltf.scene.position.lerp(previousPosition, smoothingFactor);
      gltf.scene.quaternion.slerp(previousQuaternion, smoothingFactor);

      previousPosition.copy(gltf.scene.position);
      previousQuaternion.copy(gltf.scene.quaternion);

      renderer.render(scene, camera);
    });
  }

  start();
});
