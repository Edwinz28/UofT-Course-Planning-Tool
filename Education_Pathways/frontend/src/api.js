import axios from 'axios';

export default axios.create({
  baseURL: "https://education-pathways-plus.herokuapp.com/"
  //  baseURL: "http://localhost:5050/"
});