import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import applicationsRouter from "./routes/applications.js";

const app = express();
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist");

app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const port = process.env.PORT || 5000;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  });
