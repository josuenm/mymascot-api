import { NextFunction, Request, Response } from "express";

export function renameAllFiles(req: Request, _: Response, next: NextFunction) {
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].originalname = `${new Date().getTime()}-${i}-${
      req.files[i].originalname
    }`;
  }
  return next();
}
