import { Request } from "express";
import multer from "multer";

export default {
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowMimes = ["image/jpeg", "image/pjpeg", "image/jpg", "image/png"];

    if (allowMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
};
