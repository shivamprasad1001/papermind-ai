import "express";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
      files?: MulterFile[];
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
