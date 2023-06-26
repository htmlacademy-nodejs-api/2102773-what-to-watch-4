export default class CreateFilmDto {
  public title!: string;
  public description!: string;
  public postDate!: string;
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
}
