import { CustomBaseEntity } from 'src/common/customBase.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { LessonEntity } from './lesson.entity';
import { ProgressEntity } from './progress.entity';
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

  @Column({
    name: 'language',
    nullable: false,
    default: 'English',
  })
  language: string;

  @Column({
    name: 'author_id',
    nullable: false,
  })
  authorId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.author)
  @JoinColumn({
    name: 'author_id',
  })
  author: UserEntity;

  @Column({
    name: 'category_id',
    nullable: false,
  })
  categoryId: number;

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.courses,
  )
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;

  @ManyToMany(
    () => ProgressEntity,
    (progress: ProgressEntity) => progress.course,
  )
  progress: ProgressEntity[];

  @OneToMany(() => LessonEntity, (lesson: LessonEntity) => lesson.course)
  lessons: LessonEntity[];
}
