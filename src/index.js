import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import AppStore from './stores';

const appStore = AppStore();

ReactDOM.render(
  <App store={appStore} />,
  document.getElementById('root')
);
