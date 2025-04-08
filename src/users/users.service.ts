import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: encryptedPassword,
      apiKey: randomUUID(),
      phone: ''
    });
    delete newUser.password;

    return newUser;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }

    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return await this.userRepository.update(
      { id: userId },
      { enable2FA: true, twoFASecret: secret },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return await this.userRepository.findOneBy({ apiKey });
  }
}
