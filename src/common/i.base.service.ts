import { QueryOptions } from 'src/utils/options';
import { DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm';

export interface IBaseService<T> {
  findAll(options: FindManyOptions<T>): Promise<T[]>;

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
