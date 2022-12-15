import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Product } from "./Product";

@Entity("category")
export class Category {
  @PrimaryColumn({ unique: true, nullable: false })
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
