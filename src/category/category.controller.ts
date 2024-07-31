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
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/dtos';
import { CategoryEntity } from 'src/entities';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { Public } from 'src/utils/public.decorator';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @Public()
  async find(@Query() queryObj: Object) {
    const [page, limit, total, categories] = await this.categoryService.query(
      queryObj,
      ['parent', 'children'],
    );
    const results: IPagination<CategoryDto> = {
      page,
      limit,
      total,
      items: CategoryDto.plainToInstance(categories),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
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

  @Get('/:id')
  @Public()
  async findById(@Param('id') id: number) {
    const category = await this.categoryService.findById(id);

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
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
