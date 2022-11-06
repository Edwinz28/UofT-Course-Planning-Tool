import React, { Component } from 'react';
import './css/navbar.css'
import 'bootstrap/dist/css/bootstrap.css';
import logo from './img/logo.png'
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import CourseDescriptionPage from "./CourseDescription";
import SearchResultDisplay from './ResultDisplay'
import FavCourse from './FavCourse';
import CourseGraph from './CourseGraph';
import AdminPanel from './AdminPanel'
import PrivateRoute from './PrivateRoute';
import About from './About'

function CourseDescription (props) {
  let query = useQuery();
  return <CourseDescriptionPage code={query.get("code")} />;
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}


export default class NavbarComp extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: localStorage.getItem('username'),
      login: false,
    }
  }

  componentDidMount() {
    if (localStorage.getItem('username') !== "") {
      this.setState({username: localStorage.getItem('username')})
    }
  }

  logOut = () => {
    localStorage.setItem('username', "");
    this.setState({username: ""})
  }


  render() {
    return (
      <Router>
        <div>
          <Navbar bg="myBlue" variant="dark" sticky="top" expand="lg">
            <Navbar.Brand>
              <img src={logo} alt="" />{" "}
              <Nav.Link as={Link} to="/" style={{ color: "white", display: "inline" }}>
                Education Pathways
              </Nav.Link>
            </Navbar.Brand>
            <Navbar.Collapse>
              <Nav>
                <Nav.Link as={Link} to="/about">
                  About Us
                </Nav.Link>

                <Nav.Link as={Link} to="/fav_course">
                  Favourite List
                </Nav.Link>

                <Nav.Link as={Link} to="/course_graph">
                  Course Graph
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/search">
              <SearchResultDisplay />
            </Route>
            <Route exact path="/courseDetails/:code"
              render={props =>(<CourseDescriptionPage {...props} />)}>
            </Route>
            <Route path="/fav_course">
              <FavCourse/>
            </Route>
            <Route path="/course_graph">
              <CourseGraph/>
            </Route>
            <PrivateRoute exact
              path="/Admin/:code"
              component={props =>(<AdminPanel {...props} />)}>
            </PrivateRoute>
            <Route path="/">
              <SearchResultDisplay />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
