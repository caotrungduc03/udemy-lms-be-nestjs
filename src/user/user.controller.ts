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
import { Roles } from 'src/decorators';
import { CreateUserDto, UpdateProfileDto, UpdateUserDto } from 'src/dtos';
import { UserDto } from 'src/dtos/user/user.dto';
import { RoleEnum } from 'src/enums';
import { CustomParseFilePipe } from 'src/utils/customParseFile.pipe';
import { CustomResponse } from 'src/utils/customResponse';
import { Pagination } from 'src/utils/pagination';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('/')
  @Roles(RoleEnum.ADMIN)
  async find(@Query() query: Object) {
    const [page, limit, total, users] = await this.userService.query(query);
    const results: Pagination<UserDto> = {
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
    const user = await this.userService.findById(userReq.userId, {
      relations: ['role'],
    });

    return new CustomResponse(
      HttpStatus.OK,
      'Success',
      UserDto.plainToInstance(user, ['private']),
    );
  }

  @Get('/:id')
  @Roles(RoleEnum.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id, {
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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(new CustomParseFilePipe()) file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (file) {
      let imageUpload = await this.cloudinaryService.uploadFile(file);
      createUserDto.avatar = imageUpload.url;
    }
    const user = await this.userService.create(
      CreateUserDto.plainToClass(createUserDto),
    );

    return new CustomResponse(
      HttpStatus.CREATED,
      'Created a new user',
      UserDto.plainToInstance(user, ['admin']),
    );
  }

  @Put('/:id')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(new CustomParseFilePipe()) file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (file) {
      let imageUpload = await this.cloudinaryService.uploadFile(file);
      updateUserDto.avatar = imageUpload.url;
    }

    const user = await this.userService.updateById(
      id,
      UpdateUserDto.plainToClass(updateUserDto),
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated a user',
      UserDto.plainToInstance(user, ['admin']),
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
    if (file) {
      let imageUpload = await this.cloudinaryService.uploadFile(file);
      updateProfileDto.avatar = imageUpload.url;
    }

    const user = await this.userService.updateProfile(
      userReq.userId,
      UpdateProfileDto.plainToClass(updateProfileDto),
    );

    return new CustomResponse(
      HttpStatus.OK,
      'Updated profile',
      UserDto.plainToInstance(user, ['private']),
    );
  }

  @Patch('/:id/status')
  @Roles(RoleEnum.ADMIN)
  async updateStatus(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.updateStatus(id);

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
