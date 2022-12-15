import express from "express";
import { salesController } from "../controllers/dashboard/salesController";
import { dashboardAdminSignUpController } from "../controllers/dashboardAccount/adminSignUpController";
import { dashboardSignInController } from "../controllers/dashboardAccount/signInController";

const route = express.Router();

route.post("/admin/signUp", dashboardAdminSignUpController);
route.post("/signIn", dashboardSignInController);

route.get("/sales", salesController);

export default route;
