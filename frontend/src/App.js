import logo from './logo.svg';

import './App.css';
import React from 'react';
import './App.css';
import NavBar from './layout/NavBar';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


// function App() {
//   return (
//     <div className="App">
//       <NavBar />
//       <HomePage />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GSCFeature from './components/GSC';
//import NewPage from "./pages/ConnectGSC"; // Import your new page component

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gsc-page" element={<GSCFeature />} />
      </Routes>
    </Router>
  );
}

export default App;
