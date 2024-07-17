import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult, FindOneOptions, UpdateResult } from 'typeorm';

export interface IBaseService<T> {
  findAll(): Promise<T[]>;

  findOne(options: FindOneOptions<T>): Promise<T>;

  create(data: any): Promise<T>;

  update(id: EntityId, data: any): Promise<UpdateResult>;

  delete(id: EntityId): Promise<DeleteResult>;
}
