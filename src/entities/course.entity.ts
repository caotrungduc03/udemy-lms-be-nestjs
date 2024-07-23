import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'courses',
})
export class CourseEntity extends CustomBaseEntity {
  @Column({
    name: 'course_name',
    nullable: false,
  })
  courseName: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    name: 'cover_image',
  })
  coverImage: string;

  @Column({
    name: 'price_type',
    enum: ['free', 'paid'],
    nullable: false,
  })
  priceType: string;

  @Column({
    nullable: false,
  })
  price: number;

  language: string;

  @Column({
    name: 'author_id',
    nullable: false,
  })
  authorId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.courses, {
    eager: true,
  })
  @JoinColumn({
    name: 'author_id',
  })
  author: UserEntity;
}
