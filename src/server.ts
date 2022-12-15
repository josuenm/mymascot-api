import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import "./database/mysql.ts";
import dashboardRoute from "./routes/dashboardRoute";
import productRoute from "./routes/productRoute";
import userRoute from "./routes/userRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/dashboard", dashboardRoute);

app.listen(process.env.PORT, () => console.log("🚀 Server is running"));
