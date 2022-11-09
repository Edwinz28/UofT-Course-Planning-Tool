import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import './css/general.css'

function FavCourse () {
  var courseProfileList = []
  const [cleared, setCleared] = useState(false)

  // Get the 'favs' value which consists of all the course code keys
  let favs = localStorage.getItem('favs') ? JSON.parse(localStorage.getItem('favs')) : []

  courseProfileList = favs

  {/* Commented out for now but may be useful if want to render more information for each course and merely use favs like a array storing lookup keys
  for (var i = 0; i < favs.length; i++) {
    let x = favs[i]
    courseProfileList[i] = JSON.parse(localStorage.getItem(x || ''))
  }
  */}

  const clearProfile = () => {
    localStorage.clear()
    setCleared(true)
  }

  return (
    <div className="page-content pt-50">
      <Container className="course-template" fluid="sm">
        <Row>
          <h1>Favourite List</h1>
          <p>All your favourited courses will be saved here for you easy access! You may also clear your current list to start a new one by clicking on the "Clear" button below.</p>
        </Row>
        <Row>
            <div>
              {courseProfileList.map(
                code => {
                  return (<div><a href={`courseDetails/${code}`} style={{textDecoration: "none"}}>{code}</a></div>)
                }
              )}
            </div>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs>
            <button className={"link"} onClick={() => {clearProfile()}}>Clear</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FavCourse;