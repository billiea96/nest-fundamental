import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(songDto: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songDto.title;
    song.releasedDate = songDto.releasedDate;
    song.duration = songDto.duration;
    song.lyrics = songDto.lyrics;

    const artists = await this.artistRepository.findBy({
      id: In(songDto.artists),
    });

    song.artists = artists;

    return await this.songRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    // throw new Error('Error in Db while fetching record');
    return await this.songRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return await this.songRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }

  async update(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    const songToBeUpdated = await this.songRepository.findOneBy({ id });
    songToBeUpdated.title = recordToUpdate.title ?? songToBeUpdated.title;
    songToBeUpdated.duration =
      recordToUpdate.duration ?? songToBeUpdated.duration;
    songToBeUpdated.releasedDate =
      recordToUpdate.releasedDate ?? songToBeUpdated.releasedDate;
    songToBeUpdated.lyrics = recordToUpdate.lyrics ?? songToBeUpdated.lyrics;

    if (recordToUpdate.artists.length > 1) {
      const artists = await this.artistRepository.findBy({
        id: In(recordToUpdate.artists),
      });

      songToBeUpdated.artists = artists;
    }

    return await this.songRepository.update(id, songToBeUpdated);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('s');
    queryBuilder.orderBy('s.releasedDate', 'DESC');
    return await paginate<Song>(queryBuilder, options);
  }
}
