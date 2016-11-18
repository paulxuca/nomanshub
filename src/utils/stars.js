import { randomRange } from './space';
const THREE = require('three');


const createStar = (gem, mat, scale, WIDTH, HEIGHT) => {
  const sphere = new THREE.Mesh(gem, mat);
  sphere.position.x = randomRange(-WIDTH, WIDTH);
  sphere.position.y = randomRange(-HEIGHT, HEIGHT);

    // Then set the z position to where it is in the loop (distance of camera)
  sphere.position.z = randomRange(-500, 500);

    // scale it up a bit
  sphere.scale.x = sphere.scale.y = scale;
  return sphere;
}

export const generateFollowerStars = (scene, followers, WIDTH, HEIGHT) => {
  const followerStars = [];

}


export const generateStars = (scene, numStars, WIDTH, HEIGHT) => {
  const stars = [];
  
  let totalStars = numStars;
    while(totalStars > 0) {
      const starGeom = new THREE.SphereGeometry(0.5, 32, 32);
      const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const newStar = createStar(starGeom, starMaterial, 2, WIDTH, HEIGHT);

      scene.add(newStar);
      stars.push(newStar);
      totalStars -= 1;
    }
    return stars;
}
