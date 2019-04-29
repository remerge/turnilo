import * as Rollbar from "rollbar";

const ROLLBAR = (window as any)["__CONFIG__"].appSettings.rollbar;

let export_rollbar: any = null;
if (ROLLBAR && ROLLBAR.client_token) {
  const rollbarConfig = {
    accessToken: ROLLBAR.client_token,
    captureUncaught: true,
    captureUnhandledRejections: true,
    reportLevel: ROLLBAR.report_level || "error" as Rollbar.Level,
    payload: {
      environment: ROLLBAR.environment || "development"
    }
  };
  export_rollbar = new Rollbar(rollbarConfig);
}
export const rollbar = export_rollbar;
