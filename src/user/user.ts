import { Exclude } from 'class-transformer';
import { Order } from 'src/order/order';
import {
  Column,
  Entity,
  NoNeedToReleaseEntityManagerError,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  is_ambassador: boolean;

  @OneToMany(() => Order, (order) => order.user, {
    createForeignKeyConstraints: false,
  })
  orders: Order[];

  get revenue(): number {
    return this.orders
      .filter((o) => o.complete)
      .reduce((s, o) => s + o.ambassador_revenue, 0);
  }
}
