import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "orders"})
export class Order {
 @PrimaryGeneratedColumn() id: number; 
 @Column({nullable: true}) transaction_id: string; 
  user_id: number; 
  ambassador_email: string; 
  first_name: string; 
  last_name: string; 
  email: string; 
  address: string; 
  country: string; 
  city: string; 
  zip: string; 
  complete: boolean; 
}