import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../database/data-source";
import { User } from "../../entities/User";

export const signUpController = async (req: Request, res: Response) => {
  const { name, email, lastName, password } = req.body;

  if (!name || !lastName || !email || !password) {
    return res.status(422).json({ error: "Fields are required" });
  }

  try {
    const repo = AppDataSource.getRepository(User);

    const userAlreadyExists = await repo.findOne({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      return res.status(409).json({ error: "User aldready exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = repo.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      favorites: [],
      cart: [],
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
