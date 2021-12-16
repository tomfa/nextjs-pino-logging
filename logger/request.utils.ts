import { v4 as uuid } from "uuid";
import { GenericRequest, RequestContext } from "./types";
import httpContext from "express-http-context";
import { Request } from "express";

const decodeb64 = (val: string | undefined): string | undefined => {
  if (!val) {
    return undefined;
  }
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(val, "base64").toString("utf-8");
    }
    if (typeof atob !== "undefined") {
      return atob(val);
    }
  } catch {}
  return undefined;
};

const getSubFromAuthHeader = (
  authheader?: string | string[] | undefined
): string | undefined => {
  if (!authheader || !authheader.length) {
    return undefined;
  }
  const headerValue =
    typeof authheader === "string" ? authheader : authheader[0];
  const jwtToken = headerValue.split(" ").reverse()[0];
  try {
    const jwtContentStr = decodeb64(jwtToken.split(".")[1]);
    if (!jwtContentStr) {
      return undefined;
    }
    return JSON.parse(jwtContentStr).sub;
  } catch {
    return undefined;
  }
};

const getUserId = (req: GenericRequest): string | undefined => {
  const user = req.user;
  if (user?.id || user?.sub) {
    return user?.id || user?.sub;
  }
  return getSubFromAuthHeader(req.headers.authorization);
};

const getOrCreateRequestId = (
  headers: Record<string, string | string[] | undefined>
): string | undefined => {
  const REQ_ID_HEADER = "X-Request-Id";
  const reqIdHeader = Object.keys(headers).find(
    (r) => r.toLowerCase() === REQ_ID_HEADER.toLowerCase()
  );
  const reqIdValue = reqIdHeader && headers[reqIdHeader];
  return reqIdValue ? String(reqIdValue) : uuid();
};

export const setHttpContext = (req: Request) => {
  const reqId = getOrCreateRequestId(req.headers);
  const { url, method, path, query } = req;
  httpContext.set("reqId", reqId);
  httpContext.set("url", url);
  httpContext.set("path", path || url.split('?')[0]);
  httpContext.set("query", query);
  httpContext.set("method", method);
  httpContext.set("userId", getUserId(req));
};

export const getHttpContext = (): RequestContext => {
  const context = {
    url: httpContext.get("url") as string | undefined,
    method: httpContext.get("method") as string | undefined,
    path: httpContext.get("path") as string | undefined,
    query: httpContext.get("query") as Record<string, string> | undefined,
    reqId: httpContext.get("reqId") as string | undefined,
    userId: httpContext.get("userId") as string | undefined,
    extra: httpContext.get("extra") as Record<string, any> | undefined,
  };
  Object.keys(context).forEach((key) => {
    // @ts-ignore
    if (context[key] === undefined) {
      // @ts-ignore
      delete context[key];
    }
  });
  return context;
};
