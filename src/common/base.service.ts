import { EntityId } from 'typeorm/repository/EntityId';
import { IBaseService } from './i.base.service';
import { BaseEntity, DeleteResult, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export abstract class BaseService<T extends BaseEntity> implements IBaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async create(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
