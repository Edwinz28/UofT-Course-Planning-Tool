import React, { useState } from "react";

function CourseProfile(props) {
  const courseProfileList = props.courseProfile.map(course => {return (<li>{course}</li>)});

  return (
    <div>
      <h1>Course Profile</h1>
      <div>{courseProfileList}</div>
    </div>
  );
}

export default CourseProfile;