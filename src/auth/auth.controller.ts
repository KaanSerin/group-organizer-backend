import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../validators';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResponse = await this.authService.login(body);
    res.cookie('auth', authResponse.access_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
    return authResponse.user;
  }

  @Post('register')
  async register(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResponse = await this.authService.register(data);
    res.cookie('auth', authResponse.access_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
    return authResponse.user;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    res.cookie('auth', '', {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 0,
    });

    res.status(HttpStatus.NO_CONTENT);
    return;
  }
}
