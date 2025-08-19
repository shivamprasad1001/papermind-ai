import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";
import serverless from "serverless-http";

const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
