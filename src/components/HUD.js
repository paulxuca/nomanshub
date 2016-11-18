import React from 'react';
import baffle from 'baffle';
import { observer } from 'mobx-react';
import './HUD.css';

@observer
export default class HUD extends React.Component {
  componentDidMount() {
    this.baffleRepoName = baffle('.baffleRepoName');
    this.baffleRepoDesc = baffle('.baffleRepoDesc');
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isRepo && nextProps.selectedRepo) {
     this.baffleRepoName
        .start()
        .text(() => nextProps.selectedRepo.name)
        .reveal(500);
      if (nextProps.selectedRepo.description) {
        this.baffleRepoDesc
        .start()
        .text(() => nextProps.selectedRepo.description)
        .reveal(500);
      }
    } else {
      this.baffleRepoName.text(() => '');
      this.baffleRepoDesc.text(() => '');
    }
  }

  render() {
    const { user, selectedRepo, isRepo, selectedFollower } = this.props;

    return (
      <div className="hudContainer">
        <h2 className={`githubUsername ${!isRepo && 'githubFollower'}`}>
          {isRepo ?
            <span>{user.login}</span> :
            <span>{selectedFollower.login}</span>
          }
          <span className="companyName">{user.company}</span>
        </h2>
          <p>
            <span className="repoName baffleRepoName" />
            <span className="repoDesc baffleRepoDesc" />
            {isRepo && selectedRepo && <a
              className="repoLink"
              id="repoLink"
              target="_blank"
              href={selectedRepo.html_url}
            >
              View on Github <span className="arrowPointer" />
            </a>}
          </p>
      </div>
    );
  }
}