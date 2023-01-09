import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { DashboardAccount } from "../../entities/DashboardAccount";

export const dashboardSignUpController = async (
  req: Request,
  res: Response
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "Fields are required" });
  }

  try {
    const repo = AppDataSource.getRepository(DashboardAccount);

    const userAlreadyExists = await repo.findOne({
      where: {
        email,
      },
    });

    if (!userAlreadyExists) {
      return res.status(409).json({ error: "User aldready exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = repo.create({
      name,
      email,
      password: hashedPassword,
      rules: {
        cud: false,
        read: true,
      },
    });

    const savedUser = await repo.save(user);

    const token = jwt.sign(savedUser.id, process.env.JWT_SECRET);

    return res.status(201).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
