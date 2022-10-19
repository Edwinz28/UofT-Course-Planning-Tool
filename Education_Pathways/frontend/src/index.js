import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import { CookiesProvider } from 'react-cookie';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <CookiesProvider>
    <App /> 
  </CookiesProvider>, rootElement
);

