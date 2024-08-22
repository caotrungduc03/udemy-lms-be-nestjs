import { BadRequestException } from '@nestjs/common';
import {
  BaseEntity,
  Brackets,
  DeleteResult,
  EntityMetadata,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryOptions } from '../utils/options';
import { IBaseService } from './i.base.service';

export abstract class BaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
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

  async remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }

  protected columnExists(
    columnName: string,
    metadata: EntityMetadata,
  ): boolean {
    return metadata.columns.some(
      (column) => column.propertyName === columnName,
    );
  }

  protected applyPagination(
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number,
  ): SelectQueryBuilder<T> {
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);
    return queryBuilder;
  }

  protected applyRelations(
    queryBuilder: SelectQueryBuilder<T>,
    relations: string[],
  ): SelectQueryBuilder<T> {
    relations.forEach((relation) => {
      const [relationName, subRelation] = relation.split('.');

      if (subRelation) {
        queryBuilder.leftJoinAndSelect(
          `${relationName}.${subRelation}`,
          subRelation,
        );
      } else {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    });
    return queryBuilder;
  }

  protected applyFiltering(
    queryBuilder: SelectQueryBuilder<T>,
    filter: any,
    metadata: EntityMetadata,
  ): SelectQueryBuilder<T> {
    Object.keys(filter).forEach((key) => {
      if (this.columnExists(key, metadata)) {
        const value = filter[key];
        if (Array.isArray(value)) {
          queryBuilder.andWhere(
            new Brackets((qb) => {
              value.forEach((item, index) => {
                const numericItem = Number(item);
                if (!isNaN(numericItem)) {
                  qb.andWhere(`entity.${key} = :${key}_${index}`, {
                    [`${key}_${index}`]: numericItem,
                  });
                } else {
                  qb.andWhere(`entity.${key} ILIKE :${key}_${index}`, {
                    [`${key}_${index}`]: `%${item}%`,
                  });
                }
              });
            }),
          );
        } else {
          const numericValue = Number(value);
          if (!isNaN(numericValue)) {
            queryBuilder.andWhere(`entity.${key} = :${key}`, {
              [key]: numericValue,
            });
          } else {
            queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
              [key]: `%${value}%`,
            });
          }
        }
      }
    });

    return queryBuilder;
  }

  protected applySorting(
    queryBuilder: SelectQueryBuilder<T>,
    sort: string,
    metadata: EntityMetadata,
  ): SelectQueryBuilder<T> {
    const [sortColumn, sortOrder] = sort.split(':');
    if (this.columnExists(sortColumn, metadata)) {
      queryBuilder.orderBy(
        `entity.${sortColumn}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }
    return queryBuilder;
  }

  async query(
    query: any,
    options?: QueryOptions,
  ): Promise<[page: number, limit: number, total: number, data: T[]]> {
    let { page = 1, limit = 10, sort = 'id:desc', ...filter } = query;
    const { relations = [] } = options || {};
    page = Number(page);
    limit = Math.min(Number(limit), 100);

    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    const queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder('entity');

    this.applyRelations(queryBuilder, relations);

    const metadata: EntityMetadata = this.repository.metadata;
    this.applyFiltering(queryBuilder, filter, metadata);
    this.applyPagination(queryBuilder, page, limit);
    this.applySorting(queryBuilder, sort, metadata);

    const [data, total] = await queryBuilder.getManyAndCount();

    return [page, limit, total, data];
  }

  protected applySearch(
    queryBuilder: SelectQueryBuilder<T>,
    search: string,
    columns: string[],
    metadata: EntityMetadata,
  ): SelectQueryBuilder<T> {
    if (search && columns.length > 0) {
      const searchConditions = columns
        .filter((column) => this.columnExists(column, metadata))
        .map((column) => `entity.${column} LIKE :search`)
        .join(' OR ');

      if (searchConditions) {
        queryBuilder.andWhere(`(${searchConditions})`, {
          search: `%${search}%`,
        });
      }
    }
    return queryBuilder;
  }

  async search(
    query: any,
    options?: QueryOptions,
  ): Promise<[page: number, limit: number, total: number, data: T[]]> {
    let {
      page = 1,
      limit = 10,
      sort = 'id:desc',
      q = '',
      columns = [],
    } = query;
    const { relations = [] } = options || {};
    page = Number(page);
    limit = Math.min(Number(limit), 100);

    if (isNaN(page) || page < 0 || isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination params');
    }

    const queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder('entity');

    this.applyRelations(queryBuilder, relations);

    const metadata: EntityMetadata = this.repository.metadata;
    this.applySearch(queryBuilder, q, columns, metadata);
    this.applyPagination(queryBuilder, page, limit);
    this.applySorting(queryBuilder, sort, metadata);

    const [data, total] = await queryBuilder.getManyAndCount();

    return [page, limit, total, data];
  }
}
