import { CustomBaseEntity } from 'src/common/customBase.entity';
import { PriceTypeEnum } from 'src/enums';
import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ExerciseEntity } from './exercise.entity';
import { LessonEntity } from './lesson.entity';
import { ProgressEntity } from './progress.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'courses',
})
export class CourseEntity extends CustomBaseEntity {
  @Column({
    name: 'course_name',
  })
  courseName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'cover_image',
    nullable: true,
  })
  coverImage: string;

  @Column({
    name: 'price_type',
    type: 'enum',
    enum: PriceTypeEnum,
    default: PriceTypeEnum.FREE,
  })
  priceType: PriceTypeEnum;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({
    name: 'language',
  })
  language: string;

  @Column({
    name: 'status',
    type: 'boolean',
    default: false,
  })
  status: boolean;

  @Column({
    name: 'author_id',
  })
  authorId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.author)
  @JoinColumn({
    name: 'author_id',
  })
  author: UserEntity;

  @Column({
    name: 'category_id',
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

  @OneToMany(
    () => ProgressEntity,
    (progress: ProgressEntity) => progress.course,
  )
  progress: ProgressEntity[];

  @OneToMany(() => LessonEntity, (lesson: LessonEntity) => lesson.course)
  lessons: LessonEntity[];

  @OneToMany(
    () => ExerciseEntity,
    (exercise: ExerciseEntity) => exercise.course,
  )
  exercises: ExerciseEntity[];

  @BeforeRemove()
  async beforeRemove(): Promise<void> {
    if (this.lessons) {
      await Promise.all(this.lessons.map((question) => question.remove()));
    }

    if (this.exercises) {
      await Promise.all(this.exercises.map((question) => question.remove()));
    }
  }
}
