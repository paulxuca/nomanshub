import { observable } from 'mobx';
import 'whatwg-fetch';

const toJSON = (s) => s.json();

export default class GithubStore {
  @observable githubUsername;
  @observable userFollowers;
  @observable userData;
  @observable userRepos;
  @observable fetchErrors;
  @observable selectedRepoIndex;

  constructor() {
    this.getUser = this.getUser.bind(this);
    this.nextRepo = this.nextRepo.bind(this);
    this.prevRepo = this.prevRepo.bind(this);
  }

  nextRepo() {
    if (this.selectedRepoIndex + 1 < this.userRepos.length) {
      this.selectedRepoIndex++;
    } else {
      this.selectedRepoIndex = 0;
    }
  }

  prevRepo(){
    if (this.selectedRepoIndex - 1 >= 0) {
      this.selectedRepoIndex--;
    } else {
      this.selectedRepoIndex = this.userRepos.length - 1;
    }
  }

  selectRepoIndex = (i) => this.selectedRepoIndex = i;

  async getUser(username) {
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
