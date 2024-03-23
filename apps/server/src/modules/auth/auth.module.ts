import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [PassportModule, JwtModule.register({}), TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    ConfigService,
    UserRepository,
    UsersService,
    RefreshTokensRepository,
  ],
})
export class AuthModule {}
