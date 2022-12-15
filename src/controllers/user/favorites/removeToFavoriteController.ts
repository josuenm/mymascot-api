import { Request, Response } from "express";
import { AppDataSource } from "../../../database/data-source";
import { User } from "../../../entities/User";

export const removeToFavoriteController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.user;
  const repo = AppDataSource.getRepository(User);

  try {
    const userFound = await repo.findOne({
      where: {
        id,
      },
    });

    const favorites = userFound.favorites.filter((favorite) =>
      req.body.favorites.some((favToRemove: string) => favToRemove !== favorite)
    );

    await repo.update(
      { id },
      {
        favorites,
      }
    );

    return res.status(200).send();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
