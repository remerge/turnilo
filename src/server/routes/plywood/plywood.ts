/*
 * Copyright 2015-2016 Imply Data, Inc.
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Timezone } from "chronoshift";
import { Request, Response, Router } from "express";
import * as onFinished from "on-finished";
import { Dataset, Expression } from "plywood";
import * as metrics from "../../utils/prom-metrics/prom-metrics";
import { SettingsGetter } from "../../utils/settings-manager/settings-manager";

export function plywoodRouter(getSettings: SettingsGetter) {

  const router = Router();

  // Add request metrics
  router.use((req: Request, res: Response, done) => {
    const stopRequestTimer = metrics.plywoodRequestDuration.startTimer();

    onFinished(res, function(err, res) {
      stopRequestTimer({ dataCube: req.body.dataCube, status: res.statusCode });
    });

    if (done) {
      done();
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    const { dataSource, expression, timezone } = req.body;
    const dataCube = req.body.dataCube || dataSource; // back compat

    if (typeof dataCube !== "string") {
      res.status(400).send({
        error: "must have a dataCube"
      });
      return;
    }

    let queryTimezone: Timezone = null;
    if (typeof timezone === "string") {
      try {
        queryTimezone = Timezone.fromJS(timezone);
      } catch (e) {
        res.status(400).send({
          error: "bad timezone",
          message: e.message
        });
        return;
      }
    }

    let ex: Expression = null;
    try {
      ex = Expression.fromJS(expression);
    } catch (e) {
      res.status(400).send({
        error: "bad expression",
        message: e.message
      });
      return;
    }

    let settings;
    try {
      settings = await getSettings();
    } catch (e) {
      res.status(400).send({ error: "failed to get settings" });
      return;
    }

    const myDataCube = settings.getDataCube(dataCube);
    if (!myDataCube) {
      res.status(400).send({ error: "unknown data cube" });
      return;
    }

    if (!myDataCube.executor) {
      res.status(400).send({ error: "un queryable data cube" });
      return;
    }

    const requestDecoratorContext: Record<string, any> = {};
    // "native" clusters are not defined, maybe they should be defined as some stub object
    if (myDataCube.cluster) {
      const timeout = myDataCube.cluster.getTimeout();
      req.setTimeout(timeout, null);
      requestDecoratorContext.requestDeadline = Date.now() + timeout;
    }
    const maxQueries = myDataCube.getMaxQueries();
    try {
      const data = await myDataCube.executor(
        ex,
        { maxQueries, timezone: queryTimezone },
        { decoratorContext: requestDecoratorContext }
      );

      const reply: any = {
        result: Dataset.isDataset(data) ? data.toJS() : data
      };
      res.json(reply);
    } catch (error) {
      console.log("error:", error.message);
      metrics.plywoodErrors.inc({ dataCube });
      if (error.hasOwnProperty("stack")) {
        console.log((<any> error).stack);
      }
      res.status(500).send({
        error: "could not compute",
        message: error.message
      });
    }
  });

  return router;
}
