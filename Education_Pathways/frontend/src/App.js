import React, { useState } from 'react'
import NavbarComp from "./components/Navbar.js";
import FooterComp from "./components/Footer.js";
import './App.css';


function App() {
  const [ courseProfile, setCourseProfile ] = useState([]);

  return (
    <div>
    <div className="App">
      <NavbarComp courseProfile={courseProfile} setCourseProfile={setCourseProfile} />
    </div>

    <div className="App">
      <FooterComp/>
    </div>
    </div>
  );

 

}


export default App;