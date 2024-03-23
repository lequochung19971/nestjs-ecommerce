import { ConflictException, Injectable } from '@nestjs/common';
import { toQueryResponseDto } from 'src/utils/toDtoArray';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUND } from 'src/constants/salt-round.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { UserNotFound } from './exceptions/user-not-found';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const existedUser = await this.userRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        {
          email: createUserDto.email,
        },
      ],
    });

    if (existedUser) {
      throw new ConflictException(`This user is existed`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUND);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    this.userRepository.save(user);
  }

  async getUsers(params: UserQueryParamsDto) {
    let queryBuilder = this.userRepository.createQueryBuilder('user');

    let totalCount: number;
    if (params.includeTotalCount) {
      totalCount = await queryBuilder.getCount();
    }

    if (params.search?.columns?.length && params.search?.value) {
      queryBuilder = queryBuilder.search(params.search.columns, params.search.value);
    }

    const users = await queryBuilder
      .orderBy(params.orderColumn, params.order)
      .take(params.take)
      .skip(params.skip)
      .getMany();
    return toQueryResponseDto(UserDto, {
      entity: users,
      meta: {
        page: params.page,
        take: params.take,
        totalCount,
      },
    });
  }

  async getUser(id: string) {
    const userEntity = await this.userRepository.findOneBy({
      id,
    });

    if (!userEntity) {
      throw new UserNotFound();
    }

    return userEntity.toDto(UserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userEntity = await this.userRepository.findOneBy({ id });

    if (!userEntity) {
      throw new UserNotFound();
    }

    this.userRepository.merge(userEntity, updateUserDto);

    return (await this.userRepository.save(userEntity)).toDto(UserDto);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new UserNotFound();

    this.userRepository.softDelete(id);
  }
}
