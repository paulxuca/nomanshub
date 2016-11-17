const THREE = require('three');
// const TWEEN = require('tween.js');
const OrbitControls = require('three-orbitcontrols')

let controls;

const Colors = {
  red : 0xf85051,
  orange: 0xea8962,
  yellow: 0xdacf75,
  beige: 0xccc58f,
  grey: 0xbab7a1,
  blue: 0x4379a8,
  ocean: 0x4993a8,
  green: 0x24a99b
};

const colorsLength = Object.keys(Colors).length;

export const getWindow = () => ({
  HEIGHT: window.innerHeight,
  WIDTH: window.innerWidth,
});

export const getRaycaster = () => new THREE.Raycaster();
export const getMouse = () => new THREE.Vector2();

export const randomRange = (min, max) => Math.floor(Math.random()*(max-min+1)+min);
export const randomColor = () => {
  var colIndx = Math.floor(Math.random()*colorsLength);
  var colorStr = Object.keys(Colors)[colIndx];
  return Colors[colorStr];
}
export const getMaterial = (color) => {
  return new THREE.MeshStandardMaterial({
    color:color,
    roughness:.9,
    transparent: true,
    opacity: 1,
    emissive:0x270000,
    shading:THREE.FlatShading
  });
}

export const shiftPosition = (pos, radius) =>{
  if(Math.abs(pos) < radius){
    if(pos >= 0){
      return pos + radius;
    } else {
      return pos - radius;
    }
  } else {
    return pos;
  }
}

export const rule3 = (v,vmin,vmax,tmin, tmax) => {
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv * 0.06;
}

export const initApp = (height, width) => {
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(75, width / height, .1, 3000);
  camera.position.z = 1;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  const ambientLight = new THREE.AmbientLight(0x663344,2);
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(200,100,200);
  light.castShadow = true;

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);


  return { 
    scene,
    renderer,
    camera,
  };
}

export const screenXY = (obj, camera, renderer) => {
  var vector = new THREE.Vector3();

  var widthHalf = 0.5*renderer.context.canvas.width;
  var heightHalf = 0.5*renderer.context.canvas.height;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;

  return { 
      x: vector.x,
      y: vector.y
  };
};

export const buildSmoothCamera = (camera, position) => {
  camera.lookAt(position);
}

export const point2Distance = (a, b) => Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));