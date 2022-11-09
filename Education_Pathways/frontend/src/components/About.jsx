import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import './css/navbar.css'

class About extends Component{
    render(){
        return (
            // <div className = "body_text" style={{ marginTop: '50px' }}>
    <div className="page-content pt-50">
      <Container className="course-template" fluid="sm">
            <h2>What is Educational PathWays Plus?</h2>
            <p>Welcome to CARTE's in-development tool for course selection at UofT. Educational Pathways Plus is an all-in-one tool
                where the sole goal is to make course selection as easy as possible for students. Students can search for courses and find information
                on the description, credit type, minor eligibility, course rating and even a student feedback thread. Additionally students can easily favourite
                their courses and come back to them later!
            </p>
            <h3>Development Team: </h3>
            <p>Alexander Olson <a href="https://carte.utoronto.ca/"> (CARTE)</a> </p>
            <p>Student team from <a href="https://shuiblue.github.io/UofT-ECE444/">ECE444-Fall2021</a> : Janelle Cuevas, Jean Lin, Terry Luan, Cansin Varol, Nick Woo</p>
            <p>Student team from <a href="https://shuiblue.github.io/UofT-ECE444/">ECE444-Fall2022</a> : Edwin Zhang, Richard Yang, Yixin Tian, Bojing Jiang</p>
            </Container>
            </div>
        )
    }
}


export default About;