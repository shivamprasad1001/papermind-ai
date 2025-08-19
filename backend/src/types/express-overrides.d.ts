import "express";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      body: any; // loosen type for now
    }

    interface Response {
      // extend for streaming use cases
      setHeader(key: string, value: string): this;
      flushHeaders?(): void;
      write?(chunk: any): void;
      end?(chunk?: any): void;
    }
  }
}
