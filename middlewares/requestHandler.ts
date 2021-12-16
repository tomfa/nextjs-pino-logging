import nc from "next-connect";
import logMiddleware from "../logger/middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { RequestContext } from "../logger/types";
import { getHttpContext } from "../logger/request.utils";
import Logger from "../logger";

export default function requestHandler<T>() {
  // Context of express-http-context is not set inside onError handler
  //   and instead set manually here from a middleware
  let context: RequestContext | undefined;

  return nc<NextApiRequest, NextApiResponse<T>>({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
      Logger.error(String(err), { ...context, stack: err.stack })
      res.status(500).send({message: "An error occured" });
    },
    onNoMatch: (req, res, next) => {
      res.status(404).end("Page is not found");
    },
  })
    .use(logMiddleware)
    .use((req, res, next) => {
      context = getHttpContext();
      next();
    });
}
