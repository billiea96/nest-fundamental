import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config'

import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('dbHost'),
      port: configService.get<number>('dbPort'),
      username: configService.get<string>('username'),
      password: configService.get<string>('password'),
      database: configService.get<string>('dbName'),
      entities: [User, Playlist, Song, Artist],
      synchronize: false,
      migrations: ['dist/src/db/migrations/*.js'],
    };
  },
};


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/src/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
