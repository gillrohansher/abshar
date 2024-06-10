import axios from "axios";
import { api_config } from "../apis";

export const APIClient = axios.create({
  baseURL: api_config.baseUrl,
});

export const APIClientGET = axios.create({
  baseURL: api_config.baseUrl,
  method: "GET"
});

export const APIClientPOST = axios.create({
  baseURL: api_config.baseUrl,
  method: "POST"
});

export const APIClientPUT = axios.create({
  baseURL: api_config.baseUrl,
  method: "PUT"
});

export const APIClientDELETE = axios.create({
  baseURL: api_config.baseUrl,
  method: "DELETE"
});
