import express from "express";
import multer from "multer";
import multerConfig from "../config/uploadImages";
import { createProductController } from "../controllers/product/createProductController";
import { deleteOneProductController } from "../controllers/product/deleteOneProductController";
import { editProductController } from "../controllers/product/editProductController";
import { findOneProductController } from "../controllers/product/findOneProductController";
import { listProductsController } from "../controllers/product/listProductsController";
import { authCud } from "../middlewares/dashboardAuth";
import { renameAllFiles } from "../middlewares/renameUploads";

const route = express.Router();

route.post(
  "/create",
  authCud,
  multer(multerConfig).array("files", 10),
  renameAllFiles,
  createProductController
);
route.put(
  "/edit/:id",
  authCud,
  multer(multerConfig).array("files", 10),
  renameAllFiles,
  editProductController
);
route.delete("/delete/:id", authCud, deleteOneProductController);
route.get("/find/:id", findOneProductController);
route.get("/listAll", listProductsController);

export default route;
