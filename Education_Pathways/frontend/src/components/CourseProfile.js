import React, { Component } from "react";
import { Cookies, useCookies } from 'react-cookie'


function CourseProfile() {
  const [cookies] = useCookies(['cp'])

  return (
    <div>
      <h1>Course Profile</h1>
      <p>{cookies.cp}</p>
    </div>
  );
}

export default CourseProfile;