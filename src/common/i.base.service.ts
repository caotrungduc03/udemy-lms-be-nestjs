import { DeleteResult, FindOneOptions } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;

  findOne(options: FindOneOptions<T>): Promise<T>;

  create(data: any): Promise<T>;

  update(id: number, data: any, options: FindOneOptions<T>): Promise<T>;

  delete(id: number): Promise<DeleteResult>;
}
