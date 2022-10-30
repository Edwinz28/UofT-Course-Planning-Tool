import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Link, Switch, Route, useRouteMatch} from "react-router-dom";
import CourseDescriptionPage from "./CourseDescription";
import './css/general.css'

function CourseProfile() {
  var courseProfileList = []
  const [cleared, setCleared] = useState(false)

  // Get the 'favs' value which consists of all the course code keys
  let favs = localStorage.getItem('favs') ? JSON.parse(localStorage.getItem('favs')) : []

  for (var i = 0; i < favs.length; i++) {
    let x = favs[i]
    // courseProfileList[i] = JSON.parse(localStorage.getItem(x || ''))
    courseProfileList[i] = x
  }

  const clearProfile = () => {
    localStorage.clear()
    setCleared(true)
  }

  const CustomFavLink = ({ label, to, code }) => {
    let url = `${to}/${code}`

    return (
      <Link to={url}>{label}</Link>
    )
  }

  return (
    <div className="page-content">
      <Container className="course-template" fluid="sm">
        <Row className='pt-3'>
          <Col>
            <h1>Course Profile</h1>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs>
            <button className={"link"} onClick={() => {clearProfile()}}>Clear</button>
          </Col>
        </Row>
        <Row>
          <Router>
            <div>
              {courseProfileList.map(
                element => {
                  return (<li><CustomFavLink label={element} to="/courseDetails" code={element}></CustomFavLink></li>)}
              )}
            </div>

            <Switch>
              {/* <Route path="/courseDetails/:code" children={<CourseDescriptionPage></CourseDescriptionPage>}></Route>  */}
              <Route
                exact
                path="/courseDetails/:code"
                render={props =>(<CourseDescriptionPage {...props} />)}>
              </Route>
            </Switch>
          </Router>
        </Row>
      </Container>
    </div>
  );
}

export default CourseProfile;