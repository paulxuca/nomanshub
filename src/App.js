import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import HUD from './components/HUD';

import {
  generatePlanets,
  getPlanetFromIndex,
} from './utils/Planet';
import {
  initApp,
  point2Distance,
  buildSmoothCamera,
  screenXY,
  updateTween,
} from './utils/space';
import {
  generateStars,
  generateFollowerStars,
} from './utils/stars';
import './App.css';

let scene;
let camera;
let renderer;
let controls;
let planets;
let followerStars;

function animate() {
  for (var i = 0; i < planets.length; i++) {
    planets[i].planetObject.rotation.y -= 0.001;
    planets[i].updateParticlesRotation();
  }
  renderer.render(scene, camera);
  updateTween();
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
    getUser().then(() => {
      this.generatePlanet();
      followerStars = generateFollowerStars(scene, this.props.store.github.userFollowers, this.WIDTH, this.HEIGHT);
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
    controls = settings.controls;

    document.getElementById('universe').appendChild(renderer.domElement);
    generateStars(scene, 300, this.WIDTH, this.HEIGHT);
  }

  handlePrevRepo = () => this.props.store.github.prevRepo();
  handleNextRepo = () => this.props.store.github.nextRepo();


  generatePlanet() {
    const { userRepos } = this.props.store.github;
    planets = generatePlanets(scene, userRepos);

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

      const starsAndPlanets = planets.concat(followerStars);
      const firstEntityPos = screenXY(starsAndPlanets[0].planetObject.parent, camera, renderer);
      let minDistance = point2Distance(mousePos, firstEntityPos);
      let minIndex = 0;

      for (let i = 0; i < starsAndPlanets.length; i++) {
        let entity;
        if (starsAndPlanets[i].type === 'Planet') {
          entity = starsAndPlanets[i].planetObject.parent;
        } else {
          entity = starsAndPlanets[i];
        }

        const pos = screenXY(entity, camera, renderer);
        const mDistance = point2Distance(mousePos, pos);
        if (mDistance < minDistance) {
          minIndex = i;
          minDistance = mDistance;
        }
      }
      
      if (minDistance < 50
        || (starsAndPlanets[minIndex].type !== 'Planet' && minDistance < 250)) {
        let entity;
        if (starsAndPlanets[minIndex].type === 'Planet') {
          entity = getPlanetFromIndex(planets, minIndex);
          this.props.store.github.selectRepoIndex(minIndex);
        } else {
          this.props.store.github.selectStarIndex(minIndex - planets.length - 1);
          entity = starsAndPlanets[minIndex];
        }

        this.smoothLookAt(entity.position);
      }
    }
  }

  handleKeyDown(e) {
    if ([37, 39].indexOf(e.keyCode) !== -1) {
      let newIndex;
      if (e.keyCode === 37) newIndex = this.handlePrevRepo();
      if (e.keyCode === 39) newIndex = this.handleNextRepo();
      const nextRepoLookAt = getPlanetFromIndex(planets, newIndex);
      this.smoothLookAt(nextRepoLookAt.position); 
    }
  }

  render() {
    const {
      userData,
      userRepos,
      selectedRepoIndex,
      selectedStarIndex,
      isRepoSelected,
      userFollowers,
  } = this.props.store.github;

    console.log(userFollowers, selectedStarIndex);

    return (
      <div className="App">
        {this.state.isLoaded ? <HUD
          selectedRepo={userRepos[selectedRepoIndex]}
          selectedFollower={userFollowers[selectedStarIndex]}
          user={userData}
          isRepo={isRepoSelected}
          /> : null}
        <div id="universe" />
      </div>
    );
  }
}

export default App;
