export default class UpdateFilmDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public genre!: string;
  public released!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starrings!: string[];
  public director!: string;
  public runTime!: number;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
  public isFavorite!: boolean;
  public rating!: number;
}
