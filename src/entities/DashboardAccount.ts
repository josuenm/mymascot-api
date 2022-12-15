import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("dashboardAccount")
export class DashboardAccount {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @Column("simple-json")
  rules: {
    cud: boolean;
    read: boolean;
  };

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
