import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import HUD from './components/HUD';

import Planet from './utils/planet';
import {
  initApp,
  point2Distance,
  buildSmoothCamera,
  screenXY,
} from './utils/space';
import { generateStars } from './utils/stars';
import './App.css';

let scene;
let camera;
let renderer;

const planets = [];

const getPlanetFromIndex = (index) => planets[index].planetObject.parent.position;

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
    this.handleFlag = 0;
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.smoothLookAt = this.smoothLookAt.bind(this);

    const { getUser } = this.props.store.github;
    getUser('kshvmdn').then(() => {
      this.generatePlanet();      
      this.setState({ isLoaded: true });
    });
  }

  componentDidMount() {
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

  handlePrevRepo = () => this.props.store.github.prevRepo();
  handleNextRepo = () => this.props.store.github.nextRepo();


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
    window.addEventListener('mousemove', () => {
      this.handleFlag = 1;
    });
    window.addEventListener('mousedown', () => {
      this.handleFlag = 0;
    });

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mouseup', this.handleMouseUp);
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

  smoothLookAt(position) {
    buildSmoothCamera(camera, position);
  }

  handleMouseUp(e) {
    if (planets && this.handleFlag === 0) {
      const mousePos = {
        x: e.clientX,
        y: e.clientY,
      };

      const firstPlanetPos = screenXY(planets[0].planetObject.parent, camera, renderer);
      let minDistance = point2Distance(mousePos, firstPlanetPos);
      let minIndex = 0;

      for (var i = 1; i < planets.length; i++) {
        const planetPos = screenXY(planets[i].planetObject.parent, camera, renderer);
        const mouseDistance = point2Distance(mousePos, planetPos);
        if (mouseDistance < minDistance) {
          minIndex = i;
          minDistance = mouseDistance;
        }
      }

      if (minDistance < 200) {
        this.props.store.github.selectRepoIndex(minIndex);
        this.smoothLookAt(getPlanetFromIndex(minIndex));
      }     
    }
  }

  handleKeyDown(e) {
    e.preventDefault();
    if ([37, 39].indexOf(e.keyCode) !== -1) {
      if (e.keyCode === 37) this.handlePrevRepo();
      if (e.keyCode === 39) this.handleNextRepo();
    }
    this.smoothLookAt(getPlanetFromIndex(this.props.store.github.selectedRepoIndex));
  }

  render() {
    const { userData, userRepos, selectedRepoIndex } = this.props.store.github;

    return (
      <div className="App">
        {this.state.isLoaded ? <HUD
          repos={userRepos}
          user={userData}
          index={selectedRepoIndex}
          /> : null}
        <div id="universe" />
      </div>
    );
  }
}

export default App;
