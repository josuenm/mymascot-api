import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { DashboardAccount } from "../../entities/DashboardAccount";

export const dashboardSignInController = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Fields are required" });
  }

  try {
    const repo = AppDataSource.getRepository(DashboardAccount);

    const user = await repo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordIsEqual = await bcrypt.compare(password, user.password);

    if (!passwordIsEqual) {
      return res.status(401).json({ error: "Email or password incorrect" });
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
