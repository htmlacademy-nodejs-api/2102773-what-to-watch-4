import { Expose, Type } from 'class-transformer';
import { FilmGenre } from '../../../types/film-genre.enum.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class FilmsListRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose({ name: 'createdAt'})
  public postDate!: Date;

  @Expose()
  public genre!: FilmGenre;

  @Expose()
  public previewVideoLink!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public posterImage!: string;

  @Expose()
  public commentCount!: number;
}
