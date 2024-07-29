import { CustomBaseEntity } from 'src/common/customBase.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({
  name: 'categories',
})
export class CategoryEntity extends CustomBaseEntity {
  @Column({
    name: 'category_name',
    nullable: false,
    unique: true,
  })
  categoryName: string;

  @Column({
    name: 'parent_id',
    nullable: true,
    default: null,
  })
  parentId: number | null;

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.children,
  )
  @JoinColumn({
    name: 'parent_id',
  })
  parent: CategoryEntity;

  @OneToMany(
    () => CategoryEntity,
    (category: CategoryEntity) => category.parent,
  )
  children: CategoryEntity[];

  @OneToMany(() => CourseEntity, (course: CourseEntity) => course.category)
  courses: CourseEntity[];
}
