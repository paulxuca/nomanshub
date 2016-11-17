import { observable } from 'mobx';
import 'whatwg-fetch';

const toJSON = (s) => s.json();

export default class GithubStore {
  @observable userData;
  @observable fetchErrors;
  @observable selectedRepoIndex;

  constructor() {
    this.getUser = this.getUser.bind(this);
  }

  selectRepoIndex = (i) => this.selectedRepoIndex = i;

  async getUser(username) {
    try {
      const fetchData = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed`).then(toJSON);
      this.userRepos = fetchData;
      const userData = await fetch(`https://api.github.com/users/${username}`).then(toJSON);
      this.userData = userData;
      return this.userData;
    } catch (error) {
      console.error(error);
      this.fetchErrors = error;
    }
  }
};
