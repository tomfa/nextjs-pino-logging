import nc from "next-connect";
import logMiddleware from "../logger/middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default function requestHandler<T>() {
  return nc<NextApiRequest, NextApiResponse<T>>({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
      res.status(500).send('An error occured');
    },
    onNoMatch: (req, res, next) => {
      res.status(404).end("Page is not found");
    },
  }).use(logMiddleware);
}
