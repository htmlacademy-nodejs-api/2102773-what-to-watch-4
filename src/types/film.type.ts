import { FilmGenre } from './film-genre.enum.js';
import { User } from './user.type.js';

export type Film = {
  title: string;
  description: string;
  postDate: Date;
  genre: FilmGenre;
  released: number;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starrings: string[];
  director: string;
  runTime: number;
  commentsCount: number;
  user: User;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  isFavorite: boolean;
}
