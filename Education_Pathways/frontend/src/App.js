import React, { Component } from 'react'
import NavbarComp from "./components/Navbar.js";
import FooterComp from "./components/Footer.js";
import { Row, Col } from 'react-bootstrap';
import './App.css';


function App() {

  return (
    <div className='bg'
      style={{ backgroundImage: `url("https://images.unsplash.com/photo-1576485976138-6c3cff620ae8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")`
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