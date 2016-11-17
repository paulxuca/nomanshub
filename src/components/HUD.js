import React from 'react';
import { inject, observer } from 'mobx-react';
import './HUD.css';

@inject('store') @observer
export default class HUD extends React.Component {
  render() {
    const { userData, userRepos, selectedRepoIndex } = this.props.store.github;

    return (
      <div className="hudContainer">
        <h2 className="githubUsername">{userData.login}<span className="companyName">{userData.company}</span></h2>
        <p>{selectedRepoIndex && userRepos[selectedRepoIndex].name}</p>
      </div>
    );
  }
}