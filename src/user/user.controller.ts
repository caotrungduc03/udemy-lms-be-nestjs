import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateUserDto, UpdateProfileDto, UpdateUserDto } from 'src/dtos';
import { UserDto } from 'src/dtos/user/user.dto';
import { UserEntity } from 'src/entities';
import { CustomParseFilePipe } from 'src/utils/customParseFile.pipe';
import { CustomResponse } from 'src/utils/customResponse';
import { IPagination } from 'src/utils/i.pagination';
import { RoleEnum } from 'src/utils/role.enum';
import { Roles } from 'src/utils/roles.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('/')
  @Roles(RoleEnum.ADMIN)
  async find(@Query() queryObj: Object) {
    const [page, limit, total, users] = await this.userService.query(queryObj, {
      relations: ['role'],
    });
    const results: IPagination<UserDto> = {
      page,
      limit,
      total,
      items: UserDto.plainToInstance(users, ['admin']),
    };

    return new CustomResponse(HttpStatus.OK, 'Success', results);
  }

  @Get('/profile')
  async profile(@Req() request: Request) {
    const userReq = request['user'];
    const user: UserEntity = await this.userService.findById(userReq.userId, {
      relations: ['role'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      UserDto.plainToInstance(user, ['private']),
    );
  }

  @Patch('/profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Req() request: Request,
    @UploadedFile(new CustomParseFilePipe()) file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userReq = request['user'];
    let avatar = null;
    if (file) {
      avatar = await this.cloudinaryService.uploadFile(file);
      updateProfileDto.avatar = avatar.url;
    }

    const user: UserEntity = await this.userService.updateProfile(
      userReq.userId,
      updateProfileDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated profile',
      UserDto.plainToInstance(user, ['private']),
    );
  }

  @Get('/:id')
  @Roles(RoleEnum.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user: UserEntity = await this.userService.findById(id, {
      relations: ['role'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      UserDto.plainToInstance(user, ['admin']),
    );
  }

  @Post('/')
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user: UserEntity = await this.userService.create(createUserDto);

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new user',
      UserDto.plainToInstance(user, ['admin']),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.ADMIN)
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user: UserEntity = await this.userService.updateById(
      id,
      updateUserDto,
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a user',
      UserDto.plainToInstance(user, ['admin']),
    );
  }

  @Delete('/:id')
  @Roles(RoleEnum.ADMIN)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteById(id);

    return new CustomResponse(HttpStatus.OK, 'Deleted a user');
  }
}
