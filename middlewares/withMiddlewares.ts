import { NextApiRequest, NextApiResponse } from "next";
import loggerMiddleware from "../logger/middleware";

type Handler = (req: NextApiRequest, res: NextApiResponse) => void;

const NODE_MIDDLEWARES = [loggerMiddleware];

export const withMiddlewares =
  (handler: Handler) => (req: NextApiRequest, res: NextApiResponse) => {
    const middlewares = [...NODE_MIDDLEWARES];
    const runMiddleware = () => {
      const nextMiddleware = middlewares.shift();
      if (nextMiddleware) {
        // "as any" to support node middlewares
        nextMiddleware(req as any, res as any, runMiddleware);
      } else {
        handler(req, res);
      }
    };
    runMiddleware();
  };
