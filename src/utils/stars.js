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
  for (var i = 0; i < followers.length; i++) {
    const followerStarGeom = new THREE.SphereGeometry(0.5, 64, 64);
    const followerStarMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const newFollowerStar = createStar(followerStarGeom, followerStarMaterial, 3, WIDTH, HEIGHT);
    scene.add(newFollowerStar);
    followerStars.push(newFollowerStar);
  }
  return followerStars;
}


export const generateStars = (scene, numStars, WIDTH, HEIGHT) => {
  const stars = [];
  
  let totalStars = numStars;
    while(totalStars > 0) {
      const starGeom = new THREE.SphereGeometry(0.5, 32, 32);
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const newStar = createStar(starGeom, starMaterial, 2, WIDTH, HEIGHT);

      scene.add(newStar);
      stars.push(newStar);
      totalStars -= 1;
    }
    return stars;
}
