import { QueryOptions } from 'src/utils/i.options';
import { DeleteResult, FindOneOptions } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;

  findOne(options: FindOneOptions<T>): Promise<T>;

  store(data: any): Promise<T>;

  update(id: number, data: any, options: FindOneOptions<T>): Promise<T>;

  delete(id: number): Promise<DeleteResult>;

  query(
    queryObj: any,
    options?: QueryOptions,
  ): Promise<[number, number, number, T[]]>;

  search(
    queryObj: any,
    options?: QueryOptions,
  ): Promise<[number, number, number, T[]]>;
}
