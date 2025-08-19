import { Request, Response } from "express";
import express from "express"; // <-- import express so we can use Application type

import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ENV } from "../config/env";

export const setupSwagger = (app: express.Application) => {
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: { title: "PaperMind AI API", version: "1.0.0" },
    },
    apis: ["src/routes/**/*.ts", "src/controllers/**/*.ts"],
  };

  const specs = swaggerJsdoc(options);

  if (ENV.NODE_ENV === "production") {
    // JSON spec only in prod
    app.get("/api-docs.json", (_req: Request, res: Response) => {
      res.json(specs);
    });
    return;
  }

  // Full UI in non-production
  const swaggerUiOptions = { explorer: true } as any;
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  app.get("/", (_req: Request, res: Response) => res.redirect("/api-docs"));
  app.get("/api-docs.json", (_req: Request, res: Response) => res.json(specs));
};
