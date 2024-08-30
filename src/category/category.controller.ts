import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public, Roles } from 'src/decorators';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/dtos';
import { CategoryEntity } from 'src/entities';
import { RoleEnum } from 'src/enums';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @Public()
  async find(@Query() queryObj: Object) {
    const [page, limit, total, categories] = await this.categoryService.query(
      queryObj,
      {
        relations: ['parent'],
      },
    );
    const results: Pagination<CategoryDto> = {
      page,
      limit,
      total,
      items: CategoryDto.plainToInstance(categories),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/:id')
  @Public()
  async findById(@Param('id') id: number) {
    const category = await this.categoryService.findById(id, {
      relations: ['parent', 'children'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      CategoryDto.plainToInstance(category),
    );
  }

  @Post('/')
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new category',
      CategoryDto.plainToInstance(category),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.ADMIN)
  async updateById(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category: CategoryEntity = await this.categoryService.updateById(
      id,
      updateCategoryDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a category',
      CategoryDto.plainToInstance(category),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteById(@Param('id') id: number) {
    await this.categoryService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a category');
  }
}
