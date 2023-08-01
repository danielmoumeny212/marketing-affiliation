import { Order } from "src/order/order";
import { Product } from "src/product/product";
import { User } from "src/user/user";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: "links"})
export class Links {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  code: string; 
  
  @ManyToOne(() => User)
  @JoinColumn({name: "user_id"})
  user: User; 
  
  @ManyToMany(() => Product)
  @JoinTable({
    name: "links_products",
    joinColumn: {name: "link_id", referencedColumnName: "id"},
    inverseJoinColumn: {name: "product_id", referencedColumnName: "id"}
})
  products: Product[]

  @OneToMany(() => Order, order => order.link, {
     createForeignKeyConstraints: false,
  })
  @JoinColumn({referencedColumnName: 'code', 
    name: "code",
})
  orders: Order[]
}