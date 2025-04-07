import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const user = await this.userRepository.findOneBy({
      id: createArtistDto.userId,
    });

    return await this.artistRepository.save({ user });
  }

  async findArtist(userId: number): Promise<Artist> {
    return this.artistRepository.findOneBy({ user: { id: userId } });
  }
}
