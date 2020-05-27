import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link,
  Switch
} from "react-router-dom"
import './App.css';

function App() {
  return (
    <div className="App">
      <ol>
        <li>
          <Link to = "/Accounts"
        </li>
      </ol>
    </div>
  );
}

export default App;
