import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
//import reportWebVitals from './reportWebVitals';

import React from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import NotFound from "./NotFound"

import Stats from "./routes/profile/stats";
import Preferences from "./routes/profile/preferences";

import Game from "./routes/game/play";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>

          <Route path='*' element={<NotFound />} />
          
          <Route path="profile">
            <Route path="stats" element={<Stats />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>

          <Route path="game">
            <Route path="play" element={<Game />} />
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
