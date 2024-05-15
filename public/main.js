import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { loadGLTF, loadAudio } from "./libs/loader.js";

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
    gltf.scene.position.set(0, -0.3, 0);
    //gltf.scene.rotation.x = Math.PI / 2;

    //gltf animation
    const mixer=new THREE.AnimationMixer(gltf.scene)
    const action=mixer.clipAction(gltf.animations[0])
    //audio
    const audioClip = await loadAudio("./assets/audio/90s-tv-theme.mp3");
    const listener = new THREE.AudioListener();
    const audio = new THREE.PositionalAudio(listener);

    

    //camera
    camera.add(listener);
    //we want to position our ears to camera to mimic distance from sound(staging effect)
    //set ref distance
    audio.setRefDistance(100)
    audio.setBuffer(audioClip)
    audio.setLoop(true)
    audio.setVolume(4)
    audio.setMaxDistance (200)

    //three group
    anchor.group.add(gltf.scene);
    anchor.group.add(audio);


    anchor.onTargetFound = () => {
      console.log("found");
      action.play()
      audio.play()
    };
    anchor.onTargetLost = () => {
      console.log("not found");
      action.stop()
      audio.pause()
    };

    //manage mixer time
    const clock=new THREE.Clock()

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      //update animation
      mixer.update(clock.getDelta())
      renderer.render(scene, camera);
    });
  }
  start();
});
