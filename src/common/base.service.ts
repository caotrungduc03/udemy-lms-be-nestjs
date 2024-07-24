import { BaseEntity, DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { IBaseService } from './i.base.service';

export abstract class BaseService<T extends BaseEntity> implements IBaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: number, data: any, options: FindOneOptions<T>): Promise<T> {
    this.repository.update(id, data);
    return this.findOne(options);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
