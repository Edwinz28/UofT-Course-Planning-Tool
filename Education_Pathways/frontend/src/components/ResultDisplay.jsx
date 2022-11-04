import React, { Component } from "react";
import Result from './Results'
import './css/Result.css'
import Label from './Label'
import "./css/styles.css";
import API from '../api';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class SearchResultDisplay extends Component{

  constructor() {
    super();
    this.state = {
      input: "",
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getData(this.state.input)
  }

  getData = (input) => {
    API.get(`/searchc?input=${input}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({results: []})
          if (!res.data) {
            toast.error("No Matching Courses Found!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          } else if (res.data.length > 0) {
            let len = res.data.length
            let result_temp = []
            result_temp.push(<Label></Label>)
            for (let i = 0; i < len; i++) {
                result_temp.push(<Result key={res.data[i]._id} course_code={res.data[i].code} course_name={res.data[i].name} minor={res.data[i].minor} certificate={res.data[i].certificate}></Result>)
            }
            this.setState({results: result_temp})
          } 
          else {
            // Should never get here
            toast.error("Internal Error.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          }
        } else if (res.status === 400) {
            toast.error("System Error. Please Refresh!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
        }
    })
  }

  render(){
    return (
      <div className="SearchQuery">
        <div style={{ marginTop: "10%" }}>
            <h1> Education Pathways</h1>
            <br></br>
            <form onSubmit={this.handleSubmit} className={"search"}>
                <input placeholder={"Search for course code"} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
                <input type="submit" value="Search" className={"submit-button"}/>
            </form>
        </div>

        <div className={"search-result-display"} >
            {this.state.results}
        </div>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            limit={1}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/>
      </div>
    );
  }
}

export default SearchResultDisplay;
