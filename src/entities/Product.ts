import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Category } from "./Category";
import { ProductPicture } from "./ProductPicture";

@Entity("product")
export class Product {
  @PrimaryColumn({ unique: true, nullable: false })
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => ProductPicture, (pictures) => pictures.products, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable()
  pictures: ProductPicture[];

  @Column("simple-array")
  colors: string[];

  @ManyToMany(() => Category, (categories) => categories.products, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable()
  categories: Category[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
