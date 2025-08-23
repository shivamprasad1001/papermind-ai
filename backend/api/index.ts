import { Request, Response } from "express";
import app from "../src/app";
import serverless from "serverless-http";

const handler = serverless(app);

export default async function (req: Request, res: Response) {
  return handler(req, res);
}
