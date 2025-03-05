
import  axios from "axios";

const client= axios.create({baseURL:`http://localhost:8081/api/post/`})

export default client;