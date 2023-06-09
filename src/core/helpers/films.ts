import { FilmGenre } from '../../types/film-genre.enum.js';
import { Film } from '../../types/film.type.js';

export function createFilm(filmData: string): Film {
  const [
    title,
    description,
    createdDate,
    genre,
    released,
    rating,
    previewVideoLink,
    videoLink,
    starring,
    director,
    runTime,
    commentsCount,
    name,
    email,
    avatar,
    password,
    posterImage,
    backgroundImage,
    backgroundColor
  ] = filmData.replace('\n', '').split('\t');

  const user = {
    name,
    email,
    avatar,
    password
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    genre: FilmGenre[genre as 'comedy' | 'crime' | 'documentary' | 'drama' | 'horror' | 'family' | 'romance' | 'scifi' | 'thriller'],
    released: Number.parseInt(released, 10),
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starrings: starring.split(';').map((userName) => (userName)),
    director,
    runTime: Number.parseInt(runTime, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    user,
    posterImage,
    backgroundImage,
    backgroundColor
  } as Film;
}
