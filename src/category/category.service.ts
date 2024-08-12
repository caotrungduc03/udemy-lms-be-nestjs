import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dtos';
import { CategoryEntity } from 'src/entities';
import { FindOptions } from 'src/utils/options';
import { pickFields } from 'src/utils/pickFields';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }

  async findById(id: number, options?: FindOptions): Promise<CategoryEntity> {
    const { relations = [] } = options || {};
    const category = await this.findOne({
      where: { id },
      relations,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const parent = await this.findById(createCategoryDto.parentId);

    return this.store({
      ...createCategoryDto,
      parent,
    });
  }

  async updateById(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const updateData = pickFields(updateCategoryDto, [
      'categoryName',
      'parentId',
    ]);

    const category = await this.findById(id);
    if (updateData.parentId !== category.parentId) {
      const parent = await this.findById(updateData.parentId);
      category.parent = parent;
    }

    return this.store({
      ...category,
      ...updateData,
    });
  }

  async deleteById(id: number): Promise<CategoryEntity> {
    const category = await this.findById(id);

    await this.categoryRepository.update(
      {
        parentId: category.id,
      },
      {
        parentId: null,
      },
    );

    return this.remove(category);
  }
}
