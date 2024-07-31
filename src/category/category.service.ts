import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dtos';
import { CategoryEntity } from 'src/entities';
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

  async findById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const parent = await this.findById(createCategoryDto.parentId);

    return this.categoryRepository.save({ ...createCategoryDto, parent });
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
    if (updateData.parentId) {
      const parent = await this.findById(updateData.parentId);
      category.parent = parent;
    }

    return this.categoryRepository.save({
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
    await this.categoryRepository.delete(id);

    return category;
  }
}
