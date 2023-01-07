import express from "express";
import { salesController } from "../controllers/dashboard/salesController";
import { dashboardSignInController } from "../controllers/dashboardAccount/signInController";
import { dashboardSignUpController } from "../controllers/dashboardAccount/signUpController";

const route = express.Router();

route.post("/signIn", dashboardSignInController);
route.post("/signUp", dashboardSignUpController);

route.get("/sales", salesController);

export default route;
