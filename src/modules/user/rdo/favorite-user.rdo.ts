import { Expose } from 'class-transformer';

export default class FavoriteUserRdo {
  @Expose()
  public email!: string ;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public userName!: string;

  @Expose()
  public favoriteFilms!: string[];
}
