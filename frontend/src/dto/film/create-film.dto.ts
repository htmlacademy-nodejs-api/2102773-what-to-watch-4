enum FilmGenre {
  comedy = 'Comedy',
  crime = 'Crime',
  documentary = 'Documentary',
  drama = 'Drama',
  horror = 'Horror',
  family = 'Family',
  romance = 'Romance',
  scifi = 'Scifi',
  thriller = 'Thriller',
}

export default class CreateFilmDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public genre!: FilmGenre;
  public released!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starrings!: string[];
  public director!: string;
  public runTime!: number;
  public userId!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
  public rating!: number;
}
