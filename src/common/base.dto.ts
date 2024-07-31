import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  @Expose()
  id: number;

  @Expose({
    groups: ['public', 'admin'],
  })
  createdAt: Date;

  @Expose({
    groups: ['admin'],
  })
  updatedAt: Date;

  @Expose({
    groups: ['admin'],
  })
  deletedAt: Date;

  static plainToInstance<T>(
    this: new (...args: any[]) => T,
    entity: any,
    groups?: string[],
  ): T {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
      groups,
    });
  }
}
