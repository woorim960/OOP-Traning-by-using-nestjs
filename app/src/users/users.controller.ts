import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { User } from 'src/common/decorators/args/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/metadatas/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

// @Roles('user')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/sign-up')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @Get('/:id')
  // @UseGuards(RolesGuard) // 인가
  @UseGuards(AuthenticationGuard) // 인증
  // @Roles('admin') // Roles 메타데이터 등록 -> 해당 코드로 인해 getUserInfo 메서드는 admin만 이용가능하도록 설정됐다.
  // 메서드의 실행 순서는 반대이므로 AuthenticationGuard가 RolesGuard보다 먼저 수행된다.
  async getUserInfo(
    // @User() user: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
