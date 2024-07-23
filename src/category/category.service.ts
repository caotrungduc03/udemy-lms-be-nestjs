import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dtos';
import { CategoryEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
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
    return this.categoryRepository.save(createCategoryDto);
  }

  async updateById(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findById(id);

    if (updateCategoryDto.parentId) {
      const parent = await this.findById(updateCategoryDto.parentId);
      category.parent = parent;
    }

    return this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
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
