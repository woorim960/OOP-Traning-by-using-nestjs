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
  @UseGuards(AuthenticationGuard)
  async getUserInfo(
    // @User() user: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
