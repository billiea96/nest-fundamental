import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { Enable2FAType } from './types/auth-types';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PayloadType } from './types/payload.type';
import { ValidateTokenDto } from './dto/validate-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  async signup(@Body() userDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(userDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will give you the access_token in the response',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  async enable2FA(
    @Request() req: { user: PayloadType },
  ): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  async disable2FA(
    @Request() { user }: { user: PayloadType },
  ): Promise<UpdateResult> {
    return await this.authService.disable2FA(user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  async validate2FA(
    @Request() { user }: { user: PayloadType },
    @Body() validateTokenDto: ValidateTokenDto,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      user.userId,
      validateTokenDto.token,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  @ApiBearerAuth('JWT-auth')
  getProfile(@Request() req) {
    delete req.user.password;
    return { msg: 'Authenticated with api key', user: req.user };
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
