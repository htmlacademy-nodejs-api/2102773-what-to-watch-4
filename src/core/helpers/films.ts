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
    userName,
    email,
    avatarPath,
    password,
    posterImage,
    backgroundImage,
    backgroundColor
  ] = filmData.replace('\n', '').split('\t');

  const user = {
    userName,
    email,
    avatarPath,
    password
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    genre,
    released: Number.parseInt(released, 10),
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starring: starring.split(';').map((name) => ({name})),
    director,
    runTime: Number.parseInt(runTime, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    user,
    posterImage,
    backgroundImage,
    backgroundColor
  } as Film;
}
