import React, { Component } from 'react';
import './css/general.css'
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import requisite_label from './img/requisite-label.png'
import API from '../api';
import FavHeart from './FavHeart';
import ReactStars from 'react-stars'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      edit_rating: true,
      rating: 0,
      avg_rating: null,
      is_hss: false,
      is_cs: false,
      reviewer_name: "",
      review: "",
      existing_reviews: [],
      username: localStorage.getItem('username'),
      fav_b: false,
    }
    this.ratingChanged = this.ratingChanged.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addFav = this.addFav.bind(this)
  }

  ratingChanged(newRating) {
    if (this.state.edit_rating === true) {
      this.setState({rating: newRating})
      this.setState({edit_rating: false})

      API.post(`/course/ratings?course_code=${this.state.course_code}&rating=${newRating}`, {}).then(res => {
        this.setState({avg_rating: res.data.avg_rating})
      })
      toast.success("Added " + newRating + " star rating to " + this.state.course_code, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    API.post(`/course/reviews?course_code=${this.state.course_code}&user_name=${this.state.reviewer_name}&review=${this.state.review}`)
    .then(window.location.reload(false))
  }
  
  componentDidMount() {
    API.get(`/course/ratings?course_code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        this.setState({avg_rating: res.data.avg_rating})
      })
   
    API.get(`/check/hss?course_code=${this.props.match.params.code}`,{
      code: this.props.course_code
    })
      .then(res => {
        this.setState({is_hss: res.data})
      })
    
    API.get(`/check/cs?course_code=${this.props.match.params.code}`,{
        code: this.props.course_code
    })
      .then(res => {
        this.setState({is_cs: res.data})
      })

    API.get(`/course/reviews?course_code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        this.setState({existing_reviews: res.data})
      })

    API.get(`/course/details?code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        this.setState({
          course_code: res.data.course.code,
          course_name: res.data.course.name,
          minor: res.data.course.minor,
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
      console.log(courseCode)
      toast.success(courseCode + " Added to Favorites!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
    } else {
      // If course code exists then remove from localStorage and set state
      localStorage.removeItem(courseCode)
      this.setState({fav_b: false})

      // Update to remove course code from favs
      const index = favs.indexOf(courseCode)
      if (favs.length === 1) {
        localStorage.removeItem('favs')
      } else if (index > -1) {
        localStorage.setItem('favs', JSON.stringify(favs.splice(index, 1))) // 2nd param in splice means remove one item only
      }
      toast.success(courseCode + " Removed from Favorites!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
  }

  renderClickableCourses = (courses) => {
    const _render = []
    let coursesArr = courses.split(/[ ,]+/)
    for (let i = 0; i < coursesArr.length; i++) {
      let courseCode = coursesArr[i]
      _render.push(
        <a href={'/courseDetails/'+ courseCode} style={{textDecoration: 'none', color: '#8198B8'}}>
          {courseCode}{(i !== coursesArr.length - 1) ? ', ': ''}
        </a>
      )
    }
    return _render
  }

	render() {
    let avg_rating_text;
    let hss;
    let cs;
    let minor;
    let certificate;
    let reviews;

    if (this.state.avg_rating == null) {
      avg_rating_text = <p> No Ratings Yet </p>
    } else {
      avg_rating_text = <p> Average Rating: {this.state.avg_rating} </p>
    }

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

    if (this.state.minor === '[]') {
      minor = <p> N/A </p>
    } else {
      minor = <p> {this.state.minor} </p>
    }

    if (this.state.certificate === '[]') {
      certificate = <p> N/A </p>
    } else {
      certificate = <p> {this.state.certificate} </p>
    }

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
              <h1>{this.state.course_code} : {this.state.course_name} &nbsp;&nbsp;<FavHeart fav_b={this.state.fav_b} addFav={this.addFav}/></h1>
              {hss}
              {cs}
            </Col>
              {avg_rating_text}
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                <ReactStars
                  count={5}
                  onChange={this.ratingChanged}
                  size={24}
                  edit={this.state.edit_rating}
                  value={this.state.rating}
                  color2={'#ffd700'} />
              </div>
          </Row>
          <Row>
            <Col className="col-item">
              <div style={{display: 'flex', flexDirection: "column", textAlign: 'left'}}>
                <div>
                  <h3> Division: </h3>
                  <p>{this.state.division}</p>
                </div>
                <div>
                  <h3> Division: </h3>
                  <p>{this.state.department}</p>
                </div>
              </div>
            </Col>
            <Col className="col-item">
              <div style={{display: 'flex', flexDirection: "column", textAlign: 'left'}}>
                <div>
                  <h3>Minor:</h3>
                  {minor}
                </div>
                <div>
                  <h3>Certificates:</h3>  
                  {certificate}
                </div>
              </div>
            </Col>
            <Col className="col-item">
              <button className="course_description_button" onClick={this.openLink}>
                Past Tests and Syllabi
              </button>
              <a href={"/Admin/" + this.state.course_code}>
                <button className="course_description_button">
                  Edit Information (Admin)
                </button>
              </a>
            </Col>
          </Row>
          <Row>
            <Col className="col-item">
              <div style={{display: 'flex', flexDirection: "column", textAlign: 'left'}}>
                <h3>Course Description</h3>
                <p>{this.state.course_description}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="col-item">
              <h3 style={{marginRight: "3%"}}>Course Requisites</h3>
            <Row>
              <Col className="requisites-display">
                <h4>Pre-Requisites</h4>
                <p>{this.renderClickableCourses(this.state.prerequisites)}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Co-Requisites</h4>
                <p>{this.renderClickableCourses(this.state.corequisites)}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Exclusion</h4>
                <p>{this.renderClickableCourses(this.state.exclusions)}</p>
              </Col>
            </Row>
            <Row>
              <div className="req-graph">
                <img style={{width: "70%", marginBottom: "3%", marginRight: "9%"}} alt="" src={requisite_label}></img>
              </div>
            </Row>
            </Col>
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
        <ToastContainer
            position="top-center"
            autoClose={500}
            limit={5}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/>
      </div>
		)
	}
}

export default CourseDescriptionPage;
