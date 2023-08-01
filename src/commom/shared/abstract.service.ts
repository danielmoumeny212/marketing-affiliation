import { Repository } from "typeorm";

export abstract class AbstractService <T = any> {
  protected constructor(
    protected readonly repository: Repository<T>
  ){}

  async save (options){
    return this.repository.save(options);
  }

  
  async findOne(options): Promise<T | undefined> {
    return this.repository.findOne({
      where: options
    });
  }

  async update(id: number, options){
    return this.repository.update(id, options); 
  }

  async find(options = {}):Promise<T[]>{
    return this.repository.find(
      options
    )
  }

  async delete(options){
     return await this.repository.delete(options); 
  }
}