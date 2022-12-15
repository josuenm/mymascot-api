import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Product } from "./Product";

@Entity("product_picture")
export class ProductPicture {
  @PrimaryColumn({ unique: true, nullable: false })
  id: string;

  @Column({ unique: true, nullable: false })
  url: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
