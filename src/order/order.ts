import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-items";

@Entity({name: "orders"})
export class Order {
 @PrimaryGeneratedColumn() id: number; 
 @Column({nullable: true}) transaction_id: string; 
 @Column()  user_id: number; 
 @Column() ambassador_email: string; 
 @Column() first_name: string; 
 @Column() last_name: string; 
 @Column({nullable: true}) email: string; 
 @Column({nullable: true})  address: string; 
 @Column({nullable: true})  country: string; 
 @Column({nullable: true})  city: string; 
 @Column({nullable: true})  zip: string; 
 @Column({default: false}) complete: boolean; 
 @Column() code: string; 
 
 @OneToMany(() => OrderItem, orderitem => orderitem.order)
 order_items: OrderItem[]; 
}