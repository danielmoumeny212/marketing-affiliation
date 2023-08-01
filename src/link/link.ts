import { Product } from "src/product/product";
import { User } from "src/user/user";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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
}