import React, { Component } from 'react'
import NavbarComp from "./components/Navbar.js";
import FooterComp from "./components/Footer.js";
import './App.css';


function App() {

  return (
    <div className='bg'
      style={{ backgroundImage: `url("/ut-bg-min.jpg")`
    }}>
      <div className="App">
        <NavbarComp  />
      </div>

      {/* <div>
        <FooterComp/>
      </div> */}
    </div>
  );

 

}


export default App;