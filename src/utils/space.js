const THREE = require('three');

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