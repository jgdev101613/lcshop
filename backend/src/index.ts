import express from "express";
import { ENV } from "./config/env";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(ENV.PORT, () =>
  console.log(`Server is running on port ${ENV.PORT}`),
);
