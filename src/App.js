import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import HUD from './components/HUD';

import Planet from './utils/planet';
import {
  initApp,
  screenXY,
} from './utils/space';
import { generateStars } from './utils/stars';
import './App.css';

let scene;
let camera;
let renderer;

const planets = [];

function animate() {
  for (var i = 0; i < planets.length; i++) {
    planets[i].planetObject.rotation.y -= 0.001;
    planets[i].updateParticlesRotation();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

@inject('store') @observer
class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
    };
  }

  componentWillMount() {
    const { getUser } = this.props.store.github;
    getUser('paulxuca').then(() => {
      this.setState({ isLoaded: true });
      this.generatePlanet();
    });
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleFlag = 0;
  }

  componentDidMount() {
    window.addEventListener('mousemove', () => {
      this.handleFlag = 1;
    });
    window.addEventListener('mousedown', () => {
      this.handleFlag = 0;
    });    
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.handleWindowResize);

    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    const settings = initApp(this.HEIGHT, this.WIDTH);
    scene = settings.scene;
    renderer = settings.renderer;
    camera = settings.camera;

    document.getElementById('universe').appendChild(renderer.domElement);
    generateStars(scene, 300, this.WIDTH, this.HEIGHT);
  }

  generatePlanet() {
    const { userRepos } = this.props.store.github;
    for (var i = 0; i < userRepos.length; i ++) {
      planets.push(
        new Planet({
          scene,
          ageMultiplier: i,
          sizeMultiplier: userRepos[i].size / 40000 + 1,
          stargazerMultiplier: userRepos[i].stargazers_count,
        })
      );
    }
    animate();
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

  handleMouseUp(e) {
    if (this.handleFlag === 0) {
      let min = 10000;
      let minIndex = 0;
      for (var i = 0; i < planets.length; i++) {
        const { x } = screenXY(planets[i].planetObject.parent, camera, renderer);
        if (Math.abs(e.clientX - x) < min) {
          min = Math.abs(e.clientX - x);
          minIndex = i;
        }
      }
      console.log(min, this.props.store.github.userRepos[minIndex]);
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.isLoaded ? <HUD /> : null}
        <div id="universe" />
      </div>
    );
  }
}

export default App;
