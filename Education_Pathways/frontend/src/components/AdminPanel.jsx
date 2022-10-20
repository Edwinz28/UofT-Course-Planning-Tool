import React, { Component } from 'react'
import './css/course-description.css'
import './css/AdminPanel.css'
import 'bootstrap/dist/css/bootstrap.css'
import API from '../api'

class AdminPanel extends Component {

  constructor(props){
    super(props)

    this.state = {
      courseCode: "",
      courseName: "",
      division: "Faculty of Applied Science and Engineering",
      department: "Department of Edward S. Rogers Sr. Dept. of Electrical & Computer Engineering",
      courseDesc: "",
      syllabus: "",
      prerequisites: "",
      corequisites: "",
      exclusions: "",
    }
    // Differs from state course
    this.courseCode = this.props.courseCode
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
        console.log(res.data.course)
        this.setState({courseCode: res.data.course.code})
        this.courseCode = res.data.course.code
        this.setState({courseName: res.data.course.name})
        this.setState({courseDesc : res.data.course.description})
        this.setState({graph: res.data.course.graph})
        let prereq_len = res.data.course.prereq.length
        if (prereq_len > 1) {
          let prereq_str = ""
          for (let i = 0; i < prereq_len; i++) {
            prereq_str += res.data.course.prereq[i]
            if (i !== prereq_len - 1) {
              prereq_str += ", "
            }
          }
          this.setState({prerequisites : prereq_str})
        } else {
          this.setState({prerequisites : res.data.course.prereq})
        }
        let coreq_len = res.data.course.coreq.length
        if (coreq_len > 1) {
          let coreq_str = ""
          for (let i = 0; i < coreq_str; i++) {
            coreq_str += res.data.course.coreq[i]
            if (i !== coreq_len - 1) {
              coreq_str += ", "
            }
          }
          this.setState({corequisites : coreq_str})
        } else {
          this.setState({corequisites : res.data.course.coreq})
        }
        let exclusion_len = res.data.course.exclusion.length
        if (exclusion_len > 1) {
          let exclusion_str = ""
          for (let i = 0; i < exclusion_str; i++) {
            exclusion_str += res.data.course.exclusion[i]
            if (i !== exclusion_len - 1) {
              exclusion_str += ", "
            }
          }
          this.setState({exclusions : exclusion_str})
        } else {
          this.setState({exclusions : res.data.course.exclusion})
        }
        let syllabus_link = "http://courses.skule.ca/course/" + this.state.courseCode
        this.setState({syllabus : syllabus_link})
    })
    console.log("new state: ", this.state)
  }

  render() {
    return (
      <div className='admin-page'>
          <h1>Admin Panel For: {this.courseCode}</h1>
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
              <input type='submit' value='Save' className='submit-button'/>
          </form>
      </div>
    );
  }
}

export default AdminPanel
