import { BadRequestException } from '@nestjs/common';
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

  async query(queryObj: any): Promise<[page: number, limit: number, total: number, data: T[]]> {
    let { page = 1, limit = 10, sort = 'id:asc', ...filter } = queryObj;
    page = Number(page);
    limit = Math.min(Number(limit), 100);

    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    const queryBuilder = this.repository.createQueryBuilder('entity');
    const metadata = this.repository.metadata;

    Object.keys(filter).forEach((key) => {
      const columnExists = metadata.columns.some((column) => column.propertyName === key);
      if (columnExists) {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: filter[key] });
      }
    });

    const [sortColumn, sortOrder] = sort.split(':');
    const columnExists = metadata.columns.some((column) => column.propertyName === sortColumn);
    if (columnExists) {
      queryBuilder.orderBy(`entity.${sortColumn}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return [page, limit, total, data];
  }
}
