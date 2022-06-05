import 'react-app-polyfill/stable';
//import reportWebVitals from './reportWebVitals';
import React, { lazy } from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Page from './page';

import App from "./App";
import NotFound from "./NotFound"

import Home from "./routes/home";

import Stats from "./routes/profile/stats";
import Preferences from "./routes/profile/preferences";

const Game = lazy(() => import("./routes/game/play"));


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>

          <Route index element={
            <Page title="Home">
              <Home />
            </Page>
          } />

          <Route path='*' element={
            <Page title="404">
              <NotFound />
            </Page>
          } />
          
          <Route path="profile">
            <Route index element={
              <p>To be done</p>
            } />

            <Route path="stats" element={
              <Page title="Stats">
                <Stats />
              </Page>
            } />

            <Route path="preferences" element={
              <Page title="Preferences">
                <Preferences />
              </Page>
            } />
          </Route>

          <Route path="game">
            <Route path="play" element={
              <Page title="Match">
                <Game />
              </Page>
            } />
          </Route>
        
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
