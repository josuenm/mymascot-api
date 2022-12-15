import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("user")
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @Column("simple-array")
  favorites: string[];

  @Column("simple-array")
  cart: string[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
