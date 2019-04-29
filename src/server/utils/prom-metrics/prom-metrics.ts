import { Counter, Histogram } from "prom-client";

export const totalRequests = new Counter({
  name: "turnilo_total_requests",
  help: "Total number of requests recieved",
  labelNames: ["route", "method", "status"]
});

export const requestDuration = new Histogram({
  name: "turnilo_request_duration",
  help: "Request duration",
  labelNames: ["route", "method", "status"]
});
