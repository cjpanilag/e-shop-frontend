/**
 * Setting API endpoint
 */
let baseURL;

switch (process.env.NODE_ENV) {
  case "production":
    baseURL = "http://set_remote_api_url_here";
    break;
  default:
    baseURL = "http://127.0.0.1:8000/api";
    break;
}

export default baseURL;
