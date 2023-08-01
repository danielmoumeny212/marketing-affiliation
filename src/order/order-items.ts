import { Column, Entity, JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order";

@Entity({name: "ordersItem"})
export class OrderItem {
 @PrimaryGeneratedColumn() id: number; 
 @Column() product_name: string; 
 @Column() price: number; 
 @Column() quantity: number; 
 @Column() admin_revenue: number; 
 @Column() ambassador_revenue: number; 
 
 @ManyToOne(() => Order , order => order.order_items)
 @JoinColumn({name: 'order_id'})
 order: Order
}
