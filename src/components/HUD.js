import React from 'react';
import baffle from 'baffle';
import { inject, observer } from 'mobx-react';
import './HUD.css';

@inject('store') @observer
export default class HUD extends React.Component {
  componentWillUpdate(nextProps) {
    if (!!(nextProps.index + 1)) {
      baffle('.baffleRepoName')
        .start()
        .text(() => nextProps.repos[nextProps.index].name)
        .reveal(500);
      if (nextProps.repos[nextProps.index].description) {
        baffle('.baffleRepoDesc')
        .start()
        .text(() => nextProps.repos[nextProps.index].description)
        .reveal(1000);
      }
    }
  }

  render() {
    const { user } = this.props;

    return (
      <div className="hudContainer">
        <h2 className="githubUsername">{user.login}<span className="companyName">{user.company}</span></h2>
          <p>
            <span className="repoName baffleRepoName" />
            <span className="repoDesc baffleRepoDesc" />
          </p>
      </div>
    );
  }
}