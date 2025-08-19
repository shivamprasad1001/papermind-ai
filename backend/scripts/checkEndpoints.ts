// checkEndpoints.ts
import axios from "axios";

const baseURL = "http://localhost:3001/api";

const endpoints = [
  { method: "post", url: "/chat", data: { message: "Hello" } },
  { method: "post", url: "/pdf/upload", data: {} }, // you’d need file here
  { method: "post", url: "/pinecone/query", data: { query: "test" } },
  { method: "get", url: "/history" },
];

(async () => {
  for (const ep of endpoints) {
    try {
      const res = await axios({ method: ep.method as any, url: baseURL + ep.url, data: ep.data });
      console.log(` ${ep.method.toUpperCase()} ${ep.url} → ${res.status}`);
    } catch (err: any) {
      console.log(` ${ep.method.toUpperCase()} ${ep.url} → ${err.response?.status || err.message}`);
    }
  }
})();
