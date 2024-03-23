import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SALT_ROUND } from 'src/constants/salt-round.constant';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { TokenDto } from './dto/token.dto';
import { UserRepository } from '../users/user.repository';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sing-in-response.dto';
import { UserDto } from '../users/dto/user.dto';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshToken } from './entities/refresh-token.entity';
import { IDecodedRefreshTokenPayload } from './interfaces/decoded-refresh-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly dataSource: DataSource,
  ) {}

  async signIn(data: SignInRequestDto) {
    const { email, password } = data;

    const user = await this.getAuthenticatedUser(email, password);

    const accessToken = await this.generateAccessTokenInfo({
      userId: user.id,
    });

    const uuid = uuidv4();
    const refreshToken = await this.generateRefreshTokenInfo({
      userId: user.id,
      id: uuid,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hashedRefreshToken = await bcrypt.hash(
        refreshToken.token,
        SALT_ROUND,
      );
      const refreshTokenEntity = this.refreshTokensRepository.create({
        id: uuid,
        hashedToken: hashedRefreshToken,
        expiresIn: refreshToken.expiresIn,
      });
      await queryRunner.manager.save(RefreshToken, refreshTokenEntity);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return new SignInResponseDto({
      user: user.toDto(UserDto),
      accessToken,
      refreshToken,
    });
  }

  async signOut(userId: string, id: string) {
    return this.refreshTokensRepository.delete({
      id,
    });
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        email,
      });
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        throw new BadRequestException();
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!!');
    }
  }

  async getMatchedRefreshTokenUser(
    refreshTokenPayload: IDecodedRefreshTokenPayload,
    refreshToken: string,
  ) {
    const user = await this.userRepository.findOneBy({
      id: refreshTokenPayload.userId,
    });

    const refreshTokenEntity = await this.refreshTokensRepository.findOneBy({
      id: refreshTokenPayload.id,
    });

    if (!user || !refreshTokenEntity) {
      throw new UnauthorizedException();
    }

    const isMatched = await bcrypt.compare(
      refreshToken,
      refreshTokenEntity.hashedToken,
    );
    if (!isMatched) {
      throw new BadRequestException('Unmatched');
    }

    return user;
  }

  async generateAccessTokenInfo(payload: { userId: string }) {
    const expiresIn = +this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION_TIME',
    );
    return new TokenDto({
      expiresIn,
      token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn,
      }),
    });
  }

  async generateRefreshTokenInfo(payload: IDecodedRefreshTokenPayload) {
    const expiresIn = +this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    );
    return new TokenDto({
      expiresIn,
      token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn,
      }),
    });
  }
}
