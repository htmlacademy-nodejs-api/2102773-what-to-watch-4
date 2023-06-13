import { FilmGenre } from '../../../types/film-genre.enum.js';
import { IsDateString, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export default class UpdateFilmDto {
  @IsOptional()
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  @IsOptional()
  @IsEnum(FilmGenre, {message: 'genre must be comedy, crime, documentary, drama, horror, family, romance, scifi, thriller'})
  public genre!: FilmGenre;

  public released!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starrings!: string[];

  @IsOptional()
  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director!: string;

  public runTime!: number;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
  public isFavorite!: boolean;
  public rating!: number;
}
