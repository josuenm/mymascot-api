import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../entities/Category";
import { DashboardAccount } from "../entities/DashboardAccount";
import { Product } from "../entities/Product";
import { ProductPicture } from "../entities/ProductPicture";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product, DashboardAccount, Category, ProductPicture],
  migrations: [],
  subscribers: [],
});
