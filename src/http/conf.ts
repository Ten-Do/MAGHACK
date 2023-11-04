export const BASE_CONFIG = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
};

const SERVER_API = "http://localhost:8080/api/v1/";

export const ENDPOINTS = {
  getMETA: SERVER_API + "report-job/get-metadata",
  getOLAP: SERVER_API + "olap/get-cube",
};
