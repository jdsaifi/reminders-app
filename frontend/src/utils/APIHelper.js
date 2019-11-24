import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3001/api/v1",
  // baseURL: "https://reminders-app-backend.herokuapp.com/api/v1",
  responseType: "json"
});