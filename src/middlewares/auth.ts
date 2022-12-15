import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  token = token.slice(7, token.length) as string;

  jwt.verify(token, process.env.JWT_SECRET, async (failed, decoded: string) => {
    if (failed) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: {
        id: decoded,
      },
    });

    req.user = {
      id: user.id,
    };

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    return next();
  });
};
