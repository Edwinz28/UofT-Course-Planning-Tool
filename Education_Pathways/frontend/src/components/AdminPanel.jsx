import React, { Component } from 'react'
import './css/course-description.css'
import './css/AdminPanel.css'
import 'bootstrap/dist/css/bootstrap.css'
import API from '../api'

class AdminPanel extends Component {

  constructor(props){
    super(props)

    this.state = {
      courseCodeTitle: "",
      courseCode: "",
      courseName: "",
      division: "",
      department: "",
      courseDesc: "",
      syllabus: "",
      prerequisites: "",
      corequisites: "",
      exclusions: "",
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
    console.log(this.state)
  }
  
  // Copied from CourseDescription.js and modified
  // todo can see if the previously loaded course infor can be passed as a prop
  // then save that state into this state
  componentDidMount() {
    API.get(`/course/details?code=${this.props.match.params.code}`, {
      code: this.props.courseCode
    })
      .then(res => {
        this.setState({
          // courseCodeTitle is used to store an old version of the course code so that the title does not change
          // when this.state.courseCode changes. IE. The course being edited is ECE444. The user can change this.state.courseCode to "Hello world".
          // The title will still state "ECE444"
          courseCodeTitle: res.data.course.code,

          courseCode: res.data.course.code,
          courseName: res.data.course.name,
          certificate: res.data.course.certificate,
          courseDesc : res.data.course.description,
          graph: res.data.course.graph,
          prerequisites : res.data.course.prereq,
          exclusions : res.data.course.exclusion,
          corequisites : res.data.course.coreq,
          division: res.data.course.division,
          department: res.data.course.department,
          syllabus : "http://courses.skule.ca/course/" + res.data.course.code
        })
    })
  }

  render() {
    return (
      <div className='admin-page'>
          <h1>Admin Panel For: {this.state.courseCodeTitle}</h1>
          <h5>Edit and hit save to update the course information.</h5>
          <br/>
          <form onSubmit={this.handleSubmit} className='search'>
              <label>Course Code:</label>
              <input name='courseCode' placeholder={this.state.courseCode} className='text-input' type='text' value={this.state.courseCode} onChange={this.handleChange}/>
              <label>Course Name:</label>
              <input name='courseName' placeholder={this.state.courseName} className='text-input' type='text' value={this.state.courseName} onChange={this.handleChange}/>
              <label>Division:</label>
              <input name='division' placeholder={this.state.division} className='text-input' type='text' value={this.state.division} onChange={this.handleChange}/>
              <label>Department:</label>
              <input name='department' placeholder={this.state.department} className='text-input' type='text' value={this.state.department} onChange={this.handleChange}/>
              <label>Course Description:</label>
              <textarea name='courseDesc' placeholder={this.state.courseDesc} className='textarea-input' type='text' value={this.state.courseDesc} onChange={this.handleChange}/>
              <label>Syllabus:</label>
              <input name='syllabus' placeholder={this.state.syllabus} className='text-input' type='text' value={this.state.syllabus} onChange={this.handleChange}/>
              <label>Prerequisites:</label>
              <input name='prerequisites' placeholder={this.state.prerequisites} className='text-input' type='text' value={this.state.prerequisites} onChange={this.handleChange}/>
              <label>Corequisites:</label>
              <input name='corequisites' placeholder={this.state.corequisites} className='text-input' type='text' value={this.state.corequisites} onChange={this.handleChange}/>
              <label>Exclusions:</label>
              <input name='exclusions' placeholder={this.state.exclusions} className='text-input' type='text' value={this.state.exclusions} onChange={this.handleChange}/>
              <input type='submit' value='Save. Changes are irreversible!' className='submit-button'/>
          </form>
      </div>
    );
  }
}

export default AdminPanel
