import React, { Component } from 'react';
import Planet from './utils/Planet';
import './App.css';

const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')


let scene;
let camera;
let renderer;
let light;
let planets = [];


function animate() {
  for (var i = 0; i < planets.length; i++) {
    planets[i].planetObject.rotation.y -= 0.001;
    planets[i].updateParticlesRotation();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

class App extends Component {
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }
  
  componentDidMount() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    console.log(this.HEIGHT, this.WIDTH);
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, this.WIDTH/this.HEIGHT, .1, 2000);
    camera.position.z = 100;
    camera.aspect = this.WIDTH / this.HEIGHT;
    camera.updateProjectionMatrix();
    
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    
    
    
    this.initScene();
  }

  initScene() {
    const ambientLight = new THREE.AmbientLight(0x663344,2);
    scene.add(ambientLight);

    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(200,100,200);
    light.castShadow = true;
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -400;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    document.getElementById('universe').appendChild(renderer.domElement);
    this.generatePlanet();
  }

  generatePlanet() {
    
    for (var i = 0; i < 10; i ++) {
      planets.push(new Planet(this.HEIGHT, this.WIDTH, scene));
    }
    animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  render() {
    return (
      <div className="App">
        <div id="universe" />
      </div>
    );
  }
}

export default App;
