import { FilmGenre } from '../../../types/film-genre.enum.js';
import { Contains, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateFilmDto {
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsEnum(FilmGenre, {message: 'genre must be comedy, crime, documentary, drama, horror, family, romance, scifi, thriller'})
  public genre!: FilmGenre;

  public released!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starrings!: string[];

  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director!: string;

  public runTime!: number;

  public userId!: string;

  @IsString({message: 'posterImage is required'})
  @Contains('.jpg', {message: 'posterImage format must be jpeg'})
  public posterImage!: string;

  @IsString({message: 'backgroundImage is required'})
  public backgroundImage!: string;

  public backgroundColor!: string;

  public rating!: number;
}
