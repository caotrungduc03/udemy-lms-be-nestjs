import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  @Expose()
  id: number;

  @Expose({
    groups: ['public', 'admin'],
  })
  createdAt: Date;

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
