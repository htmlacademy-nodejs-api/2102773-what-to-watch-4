import UserDto from '../user/user.dto.js';

export default class CreateFilmDto {
  public id!: string;
  public title!: string;
  public description!: string;
  public postDate!: Date;
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
  public rating!: number;
  public commentCount!: number;
  public user!: UserDto;
  public isFavorite!: boolean;
}
