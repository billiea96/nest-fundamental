import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';

import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';
import { Playlist } from './playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Song, Playlist])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
