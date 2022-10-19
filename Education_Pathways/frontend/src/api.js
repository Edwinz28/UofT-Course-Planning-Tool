import axios from 'axios';

export default axios.create({
  baseURL: "http://localhost:5000/"
//   baseURL: "http://host.docker.internal:5000/"
});