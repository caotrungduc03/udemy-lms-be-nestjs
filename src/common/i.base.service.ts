import { DeleteResult, FindOneOptions } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;

  findOne(options: FindOneOptions<T>): Promise<T>;

  store(data: any): Promise<T>;

  update(id: number, data: any, options: FindOneOptions<T>): Promise<T>;

  delete(id: number): Promise<DeleteResult>;

  query(queryObj: any): Promise<[number, number, number, T[]]>;
}
