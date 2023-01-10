import { Request, Response } from "express";
import { AppDataSource } from "../../database/data-source";
import { Category } from "../../entities/Category";
import { Product } from "../../entities/Product";
import { ProductPicture } from "../../entities/ProductPicture";
import { uploadFile } from "../../services/googleDrive";

export const createProductController = async (req: Request, res: Response) => {
  req.body.colors = JSON.parse(req.body.colors);
  req.body.categories = JSON.parse(req.body.categories);

  const { title, description, price, quantity, colors, categories } = req.body;

  try {
    if (!title || !description || !price || !quantity) {
      return res.status(422).json({ error: "Fields are required" });
    }

    const productRepo = AppDataSource.getRepository(Product);
    const categoryRepo = AppDataSource.getRepository(Category);
    const pictureRepo = AppDataSource.getRepository(ProductPicture);

    const categoryList = [];

    categories.forEach(async (category) => {
      const categoryAlreadyExist = await categoryRepo.findOne({
        where: {
          name: category.name,
        },
      });

      if (categoryAlreadyExist) {
        categoryList.push(categoryAlreadyExist);
        return;
      }

      const categoryCreated = categoryRepo.create({ name: category.name });
      const res = await categoryRepo.save(categoryCreated);
      categoryList.push(res);
    });

    let picturesUrl = [];

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
      picturesUrl.push(pictureSaved);
    }

    const product = productRepo.create({
      title,
      description,
      price,
      quantity,
      colors: colors.length > 0 ? colors : [],
      categories: categoryList,
      pictures: picturesUrl,
    });

    const productSaved = await productRepo.save(product);

    return res.status(201).json({ ...productSaved });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal server error", details: err });
  }
};
