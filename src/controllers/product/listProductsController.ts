import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Product } from "../../entities/Product";

export const listProductsController = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Product);

    const products = await repo.find({
      relations: {
        categories: true,
        pictures: true,
      },
    });

    if (!products) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(products);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
