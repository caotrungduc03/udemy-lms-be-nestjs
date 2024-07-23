import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  static plainToInstance<T>(this: new (...args: any[]) => T, entity: any): T {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }
}
