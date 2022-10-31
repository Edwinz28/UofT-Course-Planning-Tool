import React, { Component } from 'react';
import './css/course-description.css'
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import requisite_label from './img/requisite-label.png'
import empty_star from './img/star.png'
import API from '../api';
import FavHeart from './FavHeart';

let star = empty_star;

class CourseDescriptionPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      course_code: "",
      course_name: "",
      division: "",
      department: "",
      graph : "",
      course_description: "",
      syllabus: "",
      prerequisites: "",
      corequisites: "",
      exclusions: "",
      starred: false,
      graphics: [],
      is_hss: false,
      is_cs: false,
      reviewer_name: "",
      review: "",
      existing_reviews: [],
      username: localStorage.getItem('username'),
      fav_b: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addFav = this.addFav.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    // TODO backend call
    console.log(this.state.reviewer_name, this.state.review)
    console.log(API.post(`/course/reviews?course_code=${this.state.course_code}&user_name=${this.state.reviewer_name}&review=${this.state.review}`))
    window.location.reload(false)
  }
  
  componentDidMount() {
    API.get(`/check/hss?course_code=${this.props.match.params.code}`,{
      code: this.props.course_code
    })
      .then(res => {
        this.setState({is_hss: res.data})
        console.log(this.state.is_hss)
      })
    
    API.get(`/check/cs?course_code=${this.props.match.params.code}`,{
        code: this.props.course_code
    })
      .then(res => {
        this.setState({is_cs: res.data})
        console.log(this.state.is_hss)
      })

    API.get(`/course/reviews?course_code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        console.log(res.data)
        this.setState({existing_reviews: res.data})
        console.log(this.state.existing_reviews)
        console.log(this.state.existing_reviews.length)
      })

    API.get(`/course/details?code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        this.setState({
          course_code: res.data.course.code,
          course_name: res.data.course.name,
          certificate: res.data.course.certificate,
          course_description : res.data.course.description,
          graph: res.data.course.graph,
          prerequisites : res.data.course.prereq,
          exclusions : res.data.course.exclusion,
          corequisites : res.data.course.coreq,
          division: res.data.course.division,
          department: res.data.course.department,
          syllabus : "http://courses.skule.ca/course/" + res.data.course.code
        })
        
        let temp_graph = []
        //temp_graph.push(<ShowGraph graph_src={this.state.graph}></ShowGraph>)
        this.setState({graphics: temp_graph})

        // Set favourite flag state (true if this course is favourited by the user)
        this.setState({fav_b: ((localStorage.getItem('favs') || '').includes(this.state.course_code))})
    })

  }

  openLink = () => {
    const newWindow = window.open(this.state.syllabus, '_blacnk', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null
    }
  }

  addFav = () => {
    let courseCode = this.state.course_code
    let storage = localStorage.getItem(courseCode)
    let favs = localStorage.getItem('favs') ? JSON.parse(localStorage.getItem('favs')) : []

    if (storage == null) {
      // If course code doesn't exist then add it to localStorage. Can also pass other course data in value and set State
      localStorage.setItem(courseCode, JSON.stringify({'saved': 1}))
      this.setState({fav_b: true})

      // Update to add course code to favs as a list of keys
      localStorage.setItem('favs', JSON.stringify([...favs, courseCode]))
    } else {
      // If course code exists then remove from localStorage and set state
      localStorage.removeItem(courseCode)
      this.setState({fav_b: false})

      // Update to remove course code from favs
      const index = favs.indexOf(courseCode)
      if (favs.length == 1) {
        localStorage.removeItem('favs')
      } else if (index > -1) {
        localStorage.setItem('favs', JSON.stringify(favs.splice(index, 1))) // 2nd param in splice means remove one item only
      }
    }
  }

	render() {
    let hss;
    let cs;
    let certificate;

    if (this.state.is_hss) {
      hss = <p> This Course is an eligible HSS </p>
    } else {
      hss = <p/>
    }

    if (this.state.is_cs) {
      cs = <p> This Course is an eligible CS </p>

    } else {
      cs = <p/>
    }

    if (this.state.certificate == '[]') {
      certificate = <p> N/A </p>
    } else {
      certificate = <p> {this.state.certificate} </p>
    }

    let reviews;
    if (this.state.existing_reviews.length > 0) {
      reviews = this.state.existing_reviews.map((item, i) => (
                <Container className="course-template">
                  <Card style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Card.Body style={{ width: 1000, height: 150 }}>
                      <Card.Title> {item.name} </Card.Title>
                      <Card.Text> {item.review} </Card.Text>
                    </Card.Body>
                  </Card>
                </Container> ))
    } else {
      reviews = <p> No reviews have been left for this course, be the first! </p>
    }

		return(
      <div className="page-content">
        <Container className="course-template">
          <Row float="center" className="course-title">
            <Col xs={12}>
              <h1>{this.state.course_code} : {this.state.course_name}<FavHeart fav_b={this.state.fav_b} addFav={this.addFav}/></h1>
              {hss}
              {cs}
            </Col>
            {/* <Col xs={4}>
              <img src={star} onClick={this.check_star} alt="" />
            </Col> */}
          </Row>
          <Row>
            <Col className="col-item">
              <h3>Division</h3>
              <p>{this.state.division}</p>
            </Col>
            <Col className="col-item">
              <h3>Department</h3>
              <p>{this.state.department}</p>
            </Col>
            <Col className="col-item">
              <h3>Certificate</h3>
              {certificate}
            </Col>
            <Col className="col-item">
              <h3>Past Tests and Syllabi</h3>
              <button className={"link"} onClick={this.openLink}>View</button>
            </Col>
            <Col className="col-item">
              <h3>Edit Information</h3>
              <a href={"/Admin/" + this.state.course_code}>
                <button className={"link"}>Edit</button>
              </a>
            </Col>
          </Row>
          <Row className="col-item course-description">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <h3>Course Description</h3>
              <p>{this.state.course_description}</p>
            </div>
          </Row>
          <Row className="col-item course-requisite">
            <Row>
              <h3>Course Requisites</h3>
            </Row>
            <Row>
              <Col className="requisites-display">
                <h4>Pre-Requisites</h4>
                <p>{this.state.prerequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Co-Requisites</h4>
                <p>{this.state.corequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Exclusion</h4>
                <p>{this.state.exclusions}</p>
              </Col>
            </Row>
            <Row>
              <div className={"req-graph"}>
                <img style={{width: "70%", marginBottom: "3%"}} alt="" src={requisite_label}></img>
                <img src={`data:image/jpeg;base64,${this.state.graph}`} alt="" ></img>
              </div>
            </Row>
          </Row>
        </Container>
        <Container className="course-template">
          <h1>Submit a Review</h1>
          <form onSubmit={this.handleSubmit}>
          <div class="form-group" style={{paddingLeft: "20px", paddingRight: "20px"}}>
            <label for="reviewer_name">Name</label>
            <input
              type="text" name="reviewer_name" class="form-control" id="reviewer_name" 
              value={this.state.reviewer_name} placeholder="Name" onChange={this.handleChange} required>
            </input>
          </div>
          <div class="form-group" style={{padding: "20px"}}>
            <label for="Review">Review</label>
            <textarea
              type="text" name="review" style={{ height: 150 }} class="form-control" id="review" 
              value={this.state.review} placeholder="Add Your Review For the Course..." onChange={this.handleChange} required>
            </textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        </Container>
        <Container className="course-template">
          <h1>Student Reviews</h1>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <tbody>
                <tr>
                  {reviews}
                </tr>
              </tbody>
          </div>
        </Container>
      </div>
		)
	}
}

export default CourseDescriptionPage;
