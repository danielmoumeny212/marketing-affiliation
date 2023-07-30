import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  
  @PrimaryGeneratedColumn() id: number; 

  @Column({length: 255}) name: string; 

  @Column({nullable: true,}) description: string; 

  @Column({length: 255}) image: string; 

  @Column() price: number; 
}