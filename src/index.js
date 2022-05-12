console.log(Modernizr);
if (! (Modernizr.promises && Modernizr.es6array && es6object) ) {
  import 'react-app-polyfill/ie9';
  import 'react-app-polyfill/stable';
}

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
        
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
