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
        .reveal(500);
      }
    }
  }

  render() {
    const { user, repos, index } = this.props;

    return (
      <div className="hudContainer">
        <h2 className="githubUsername">{user.login}<span className="companyName">{user.company}</span></h2>
          <p>
            <span className="repoName baffleRepoName" />
            <span className="repoDesc baffleRepoDesc" />
            {repos && repos[index] && <a
              className="repoLink"
              id="repoLink"
              target="_blank"
              href={repos[index].html_url}
            >
              View on Github <span className="arrowPointer" />
            </a>}
          </p>
      </div>
    );
  }
}