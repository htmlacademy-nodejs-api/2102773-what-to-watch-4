import { FilmGenre } from '../../../types/film-genre.enum.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public genre!: FilmGenre;
  public released!: number;
  public rating!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starrings!: string[];
  public director!: string;
  public runTime!: number;
  public userId!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
