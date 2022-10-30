import React, { useState } from 'react'
import NavbarComp from "./components/Navbar.js";
import FooterComp from "./components/Footer.js";
import './App.css';


function App() {

  return (
    <div>
    <div className="App">
      <NavbarComp  />
    </div>

    <div className="App">
      <FooterComp/>
    </div>
    </div>
  );

 

}


export default App;