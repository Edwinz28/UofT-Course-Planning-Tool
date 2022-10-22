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
import data from './course_profile_mock.json'

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
      reviewer_name: "",
      review: "",
      existing_reviews: [],
      username: localStorage.getItem('username'),
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    })
  }

  openLink = () => {
    const newWindow = window.open(this.state.syllabus, '_blacnk', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  }

	render() {
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
            <Col xs={8}>
              <h1>{this.state.course_code} : {this.state.course_name}</h1>
            </Col>
            {/* <Col xs={4}>
              <img src={star} onClick={this.check_star} alt="" />
            </Col> */}
            <Col className="col-item">
              <h3>Course Profile</h3>
              <button className={"link"} onClick={() => {this.props.save(`${this.state.course_code} : ${this.state.course_name}`)}}>Save</button>
            </Col>
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
              <p>{this.state.certificate}</p>
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
