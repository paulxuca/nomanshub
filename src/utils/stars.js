import { randomRange } from './space';
const THREE = require('three');

export const generateStars = (scene, numStars, WIDTH, HEIGHT) => {
  const stars = [];
  let totalStars = numStars;
    while(totalStars > 0) {
      const starGeom = new THREE.SphereGeometry(0.5, 32, 32);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphere = new THREE.Mesh(starGeom, starMaterial);

      sphere.position.x = randomRange(-WIDTH, WIDTH);
      sphere.position.y = randomRange(-HEIGHT, HEIGHT);

        // Then set the z position to where it is in the loop (distance of camera)
      sphere.position.z = randomRange(-500, 500);

        // scale it up a bit
      sphere.scale.x = sphere.scale.y = 2;

        //add the sphere to the scene
      scene.add(sphere);
      stars.push(sphere);
      totalStars -= 1;
    }
    return stars;
}