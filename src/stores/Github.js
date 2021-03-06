import { observable, transaction } from 'mobx';
import 'whatwg-fetch';

const toJSON = (s) => s.json();

export default class GithubStore {
  @observable githubUsername;
  @observable userFollowers;
  @observable userData;
  @observable userRepos;
  @observable fetchErrors;
  @observable selectedRepoIndex;
  @observable selectedStarIndex;
  @observable isRepoSelected = true;

  constructor() {
    this.githubUsername = 'paulxuca';
    this.getUser = this.getUser.bind(this);
    this.nextRepo = this.nextRepo.bind(this);
    this.prevRepo = this.prevRepo.bind(this);
  }

  nextRepo() {
    if (this.selectedRepoIndex + 1 < this.userRepos.length) {
      this.selectRepoIndex(this.selectedRepoIndex++);
    } else {
      this.selectRepoIndex(0);
    }
    return this.selectedRepoIndex;
  }

  prevRepo(){
    if (this.selectedRepoIndex - 1 >= 0) {
      this.selectRepoIndex(this.selectedRepoIndex--);
      this.selectedRepoIndex--;
    } else {
      this.selectRepoIndex(this.userRepos.length - 1);
    }
    return this.selectedRepoIndex;
  }

  selectRepoIndex = (i) => {
    this.isRepoSelected = true;    
    this.selectedRepoIndex = i;
  }

  selectStarIndex = (i) => {
    transaction(() => {
      this.isRepoSelected = false;    
      this.selectedStarIndex = i;
    });
  }

  async getUser() {
    const username = this.githubUsername;

    try {
      const [repoData, userData, userFollowers] = await Promise.all([
        fetch(`https://api.github.com/users/${username}/repos?sort=pushed`).then(toJSON),
        fetch(`https://api.github.com/users/${username}`).then(toJSON),
        fetch(`https://api.github.com/users/${username}/following`).then(toJSON),
      ]);

      this.userRepos = repoData;
      this.userData = userData;
      this.userFollowers = userFollowers;
      return this.userRepos;
    } catch (error) {
      console.error(error);
      this.fetchErrors = error;
    }
  }
};
