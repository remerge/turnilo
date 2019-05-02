import { Counter, Histogram } from "prom-client";

export const totalRequests = new Counter({
  name: "turnilo_total_requests",
  help: "Total number of requests recieved",
  labelNames: ["host", "route", "method", "status"]
});

export const requestDuration = new Histogram({
  name: "turnilo_request_duration",
  help: "Request duration",
  labelNames: ["host", "route", "method", "status"]
});

export const plywoodTimeouts = new Counter({
  name: "turnilo_plywood_timeouts",
  help: "Total number of timeouts from plywood",
  labelNames: ["host"]
});
