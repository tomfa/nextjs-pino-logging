import { Request, Response, NextFunction } from "express";
import httpContext from "express-http-context";
import {
  setHttpContext,
} from "./request.utils";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  httpContext.middleware(req, res, () => {
    setHttpContext(req);
    next();
  });
}
