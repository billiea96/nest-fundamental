import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlists/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'Jane',
    description: 'Provide the first name of the user',
  })
  firstName: string;

  @Column()
  @ApiProperty({
    example: 'Doe',
    description: 'provide the lastName of the user',
  })
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'jane_doe@gmail.com',
    description: 'Provide the email of the user',
  })
  email: string;

  @Column()
  @Exclude()
  @ApiProperty({
    example: 'test123#@',
    description: 'Provide the password of the user',
  })
  password: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column({ nullable: true })
  apiKey: string;

  @Column()
  phone: string;
}
