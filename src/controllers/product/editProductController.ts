import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Category } from "../../entities/Category";
import { Product } from "../../entities/Product";
import { ProductPicture } from "../../entities/ProductPicture";
import { deleteFile, uploadFile } from "../../services/googleDrive";

export const editProductController = async (req: Request, res: Response) => {
  req.body.colors = JSON.parse(req.body.colors);
  req.body.categories = JSON.parse(req.body.categories);
  req.body.pictures = JSON.parse(req.body.pictures);

  const { title, description, price, quantity, categories, colors, pictures } =
    req.body;

  const { id } = req.params;

  if (!title || !description || !price || !quantity) {
    return res.status(422).json({ error: "Fields are required" });
  }

  try {
    const pictureRepo = AppDataSource.getRepository(ProductPicture);
    const productRepo = AppDataSource.getRepository(Product);
    const categoryRepo = AppDataSource.getRepository(Category);

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

    const allCategories = [];

    categories.forEach(async (category) => {
      const categoryAlreadyExist = await categoryRepo.findOne({
        where: {
          name: category.name,
        },
      });
      if (categoryAlreadyExist) {
        allCategories.push(categoryAlreadyExist);
        return;
      }

      const categoryCreated = categoryRepo.create({ name: category.name });
      const res = await categoryRepo.save(categoryCreated);
      allCategories.push(res);
    });

    const deletePicture = [];

    if (productFound.pictures.length > 0) {
      const deletePicturesFound = productFound.pictures.filter((pic) => {
        if (pictures.length === 0) {
          return true;
        }

        return pictures.some((item) => {
          if (!item) {
            return true;
          }
          return pic.id !== item.id;
        });
      });
      deletePicturesFound.forEach((item) => deletePicture.push(item));
    }

    const allPictures = [];

    if (req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const fileRes = await uploadFile(req.files[i]);
        if (typeof fileRes !== "string") {
          throw new Error("Error trying to save file on google drive");
        }

        const pictureCreated = pictureRepo.create({
          id: fileRes,
          url: `https://drive.google.com/uc?export=view&id=${fileRes}`,
        });
        const pictureSaved = await pictureRepo.save(pictureCreated);
        allPictures.push(pictureSaved);
      }
    }

    const productSaved = await productRepo.save({
      id,
      title,
      description,
      price,
      quantity,
      colors,
      categories: allCategories,
      pictures: allPictures,
    });

    if (deletePicture.length > 0) {
      for (let i = 0; i < deletePicture.length; i++) {
        const fileRes = await deleteFile(deletePicture[i].id);
        if (typeof fileRes !== "boolean") {
          throw new Error("Error trying to save file on google drive");
        }
        await pictureRepo.delete({ id: deletePicture[i].id });
      }
    }

    res.status(200).json({
      id,
      title,
      description,
      price,
      quantity,
      colors,
      categories: allCategories,
      pictures: allPictures,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
