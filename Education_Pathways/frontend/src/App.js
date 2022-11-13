import React, { Component } from 'react'
import NavbarComp from "./components/Navbar.js";
import FooterComp from "./components/Footer.js";
import './App.css';


function App() {
  return (
    <div className='bg' style= {{backgroundColor: '#F2F4F8'}}>
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