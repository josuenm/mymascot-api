import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Product } from "../../entities/Product";
import { ProductPicture } from "../../entities/ProductPicture";
import { deleteFile } from "../../services/googleDrive";

export const deleteOneProductController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const productRepo = AppDataSource.getRepository(Product);
    const picturesRepo = AppDataSource.getRepository(ProductPicture);

    const productFound = await productRepo.findOne({
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

    await productRepo.delete({ id });

    if (productFound.pictures.length > 0) {
      for (let i = 0; i < productFound.pictures.length; i++) {
        const fileRes = await deleteFile(productFound.pictures[i].id);
        if (typeof fileRes !== "boolean") {
          throw new Error("Error trying to save file on google drive");
        }
        await picturesRepo.delete({ id: productFound.pictures[i].id });
      }
    }

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Internal error server", details: err });
  }
};
