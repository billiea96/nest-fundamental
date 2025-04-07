import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = createPlaylistDto.name;

    const songs = await this.songRepository.findBy({
      id: In(createPlaylistDto.songs),
    });
    playlist.songs = songs;

    const user = await this.userRepository.findOneBy({
      id: createPlaylistDto.user,
    });
    playlist.user = user;

    return await this.playlistRepository.save(playlist);
  }
}
