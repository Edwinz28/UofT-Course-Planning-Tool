import axios from 'axios';

export default axios.create({
  // baseURL: "https://lab3-docker.herokuapp.com/"
  baseURL: "http://127.0.0.1:5000/"
});