import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Product } from "../../entities/Product";

export const findOneProductController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const repo = AppDataSource.getRepository(Product);

    const productFound = await repo.findOne({
      relations: {
        categories: true,
        pictures: true,
      },
      where: {
        id,
      },
    });

    if (!productFound) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(productFound);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
