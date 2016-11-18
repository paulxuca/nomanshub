import { randomColor, randomRange, getMaterial, shiftPosition, rule3, getWindow } from './space';

const THREE = require('three');

class Particle {
  constructor() {
    const s = 1;
    let geom;
    const randomNumber = Math.random();
    if (randomNumber < .25) {
      geom = new THREE.BoxGeometry(s, s, s);
    } else if (randomNumber < .5) {
      geom = new THREE.CylinderGeometry(0, s, s * 2, 4, 1);
    } else if (randomNumber < .75){
      geom = new THREE.TetrahedronGeometry(s, 2);
    } else {
      geom = new THREE.BoxGeometry(s / 6, s, s);
    }
    const particleColor = randomColor();
    const particleMaterial = getMaterial(particleColor);
    this.mesh = new THREE.Mesh(geom, particleMaterial);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.userData.po = this;
  }
}

class Planet {
  constructor({ scene, ageMultiplier, sizeMultiplier, stargazerMultiplier }) {
    const { HEIGHT, WIDTH } = getWindow();
    const planetRadius = randomRange(20, 80) * sizeMultiplier;   
    this.minRadius = randomRange(planetRadius + 10 , planetRadius + 20);
    this.maxRadius = planetRadius + randomRange(10, 40) * stargazerMultiplier / 10;
    this.minSpeed = randomRange(0,5)*0.1 + randomRange(0,9) * 0.01;
    this.maxSpeed = randomRange(0,5)*0.1 + randomRange(0,9) * 0.01;
    this.minSize = randomRange(1,3) + randomRange(0,9) * 0.01;
    this.maxSize = randomRange(1,3) + randomRange(0,9) * 0.05;
    this.particleCount = randomRange(5, 10) * stargazerMultiplier;

    const planetDetail = randomRange(2, 5);
    const planetGeometry = new THREE.TetrahedronGeometry(planetRadius, planetDetail);


    const planetVerticieNoise = randomRange(1, 5);
    for (var i=0; i < planetGeometry.vertices.length; i++){
      var v = planetGeometry.vertices[i];
      v.x += -planetVerticieNoise/2 + Math.random()*planetVerticieNoise;
      v.y += -planetVerticieNoise/2 + Math.random()*planetVerticieNoise;
      v.z += -planetVerticieNoise/2 + Math.random()*planetVerticieNoise;
    }

    const planetColor = randomColor();
    const planetMaterial = getMaterial(planetColor);
    this.planetObject = new THREE.Mesh(planetGeometry, planetMaterial);
    this.planetObject.castShadow = true;
    this.planetObject.receiveShadow = true;

    const orbitalMesh = new THREE.Object3D();
    this.ringObject = new THREE.Mesh();
    this.constructRing();



    orbitalMesh.add(this.planetObject);
    orbitalMesh.add(this.ringObject);


    orbitalMesh.rotation.x = (Math.random()*2-1) * 2 * Math.PI;
    orbitalMesh.rotation.z = (Math.random()*2-1) * 2 * Math.PI;

    let posX = randomRange(-WIDTH, WIDTH);
    let posY = randomRange(-HEIGHT, HEIGHT);

    posX = shiftPosition(posX, planetRadius);
    posY = shiftPosition(posY, planetRadius);
    
    orbitalMesh.position.set(posX, posY, randomRange(-100 * ageMultiplier, 100 * ageMultiplier) * ageMultiplier / 50);
    this.orbitalMesh = orbitalMesh;
    scene.add(orbitalMesh);
  }

  remove(scene) {
    scene.remove(this.orbitalMesh);
  }

  constructRing() {
    for (var i = 0; i < this.particleCount; i++) {
      const p = new Particle();
      p.mesh.rotation.x = Math.random() * Math.PI;
      p.mesh.rotation.y = Math.random() * Math.PI;
      p.mesh.position.y = -2 + Math.random() * 4;
      this.ringObject.add(p.mesh);
    }
    this.angleStep = Math.PI * 2 / this.particleCount;
    this.updateParticles();
  }

  updateParticlesRotation() {
    for (var i = 0; i < this.particleCount; i++) {
      const currentParticle = this.ringObject.children[i];
      currentParticle.userData.angle += currentParticle.userData.angularSpeed;
      var posX = Math.cos(currentParticle.userData.angle)*currentParticle.userData.distance;
      var posZ = Math.sin(currentParticle.userData.angle)*currentParticle.userData.distance;
      currentParticle.position.x = posX;
      currentParticle.position.z = posZ; 

      currentParticle.rotation.x += Math.random() *.05;
      currentParticle.rotation.y += Math.random() *.05;
      currentParticle.rotation.z += Math.random() *.05;
    }
  }

  updateParticles() {
    for (var i = 0; i < this.particleCount; i ++) {
      const currentParticle = this.ringObject.children[i];    
      const s = this.minSize + Math.random()*(this.maxSize - this.minSize);
      currentParticle.scale.set(s, s, s);
      currentParticle.userData.distance = this.minRadius +  Math.random() * this.maxRadius / 2;
      currentParticle.userData.angle = this.angleStep * i;
      currentParticle.userData.angularSpeed = rule3(currentParticle.userData.distance, this.minRadius, this.maxRadius, this.minSpeed, this.maxSpeed) * 0.05;
    }
  }
}

export const generatePlanets = (scene, userRepos) => {
  const planets = [];
  for (let i = 0; i < userRepos.length; i++) {
    planets.push(
      new Planet({
        scene,
        ageMultiplier: i,
        sizeMultiplier: userRepos[i].size / 40000 + 1,
        stargazerMultiplier: userRepos[i].stargazers_count,
      })
    );
  }
  return planets;
}

export const getPlanetFromIndex = (planets, index) => planets[index].planetObject.parent.position;
