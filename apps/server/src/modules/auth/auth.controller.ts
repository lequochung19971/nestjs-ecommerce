import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Csrf } from 'src/decorators/csrf.decorator';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';
import { IDecodedRefreshTokenPayload } from './interfaces/decoded-refresh-token-payload.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'Sign In',
  })
  @Post('sign-in')
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(body);
    response.cookie('accessToken', `Bearer ${result.accessToken.token}`, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: new Date(Date.now() + result.accessToken.expiresIn),
      signed: true,
    });
    response.cookie('refreshToken', `Bearer ${result.refreshToken.token}`, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: new Date(Date.now() + result.refreshToken.expiresIn),
      signed: true,
    });
    return result;
  }

  @ApiOperation({
    summary: 'Sign Out',
  })
  @Post('sign-out')
  @Csrf()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: Request) {
    const refreshToken = req.signedCookies.refreshToken as string;

    if (!refreshToken) {
      throw new BadRequestException('There is no refreshToken');
    }
    const refreshTokenPayload: IDecodedRefreshTokenPayload =
      this.jwtService.decode(refreshToken.split(' ')[1]);

    await this.authService.signOut(
      refreshTokenPayload.userId,
      refreshTokenPayload.id,
    );
  }

  @ApiOperation({
    summary: 'Refresh Access Token',
  })
  @Post('refresh')
  @Csrf()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    return this.authService.generateAccessTokenInfo({
      // eslint-disable-next-line dot-notation
      userId: req.user.id,
    });
  }

  @ApiOperation({
    summary: 'Get CSRF Token',
    description: 'Get CSRF Token right after Sign in',
  })
  @Get('csrf')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getCsrfToken(@Req() req: Request) {
    return {
      csrfToken: req.getCsrfToken(),
    };
  }
}
