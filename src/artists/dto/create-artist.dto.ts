import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateArtistDto {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
