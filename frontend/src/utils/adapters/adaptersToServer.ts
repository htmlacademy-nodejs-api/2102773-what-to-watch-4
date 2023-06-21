import CreateCommentDto from '../../dto/comments/create-comment.dto';
import CreateFilmDto from '../../dto/film/create-film.dto';
import UpdateFilmDto from '../../dto/film/update-film.dto';
import CreateUserDto from '../../dto/user/create-user.dto';
import { Film } from '../../types/film';
import { NewFilm } from '../../types/new-film';
import { NewReview } from '../../types/new-review';
import { NewUser } from '../../types/new-user';
import { getTime } from '../utils';

export const adaptSignupToServer =
  (user: NewUser): CreateUserDto => ({
    userName: user.name,
    email: user.email,
    avatarPath: ' ',
    password: user.password,
  });

export const adaptEditFilmToServer =
  (film: Film): UpdateFilmDto => ({
    id: film.id,
    title: film.name,
    description: film.description,
    released: film.released,
    previewVideoLink: film.previewVideoLink,
    videoLink: film.videoLink,
    starrings: film.starring,
    director: film.director,
    runTime: film.runTime,
    posterImage: film.posterImage,
    backgroundImage: film.backgroundImage,
    backgroundColor: film.backgroundColor,
    isFavorite: film.isFavorite,
    rating: film.rating,
    genre: film.genre,
  });

export const adaptCreateFilmToServer =
  (film: NewFilm): CreateFilmDto => ({
    title: film.name,
    description: film.description,
    released: film.released,
    previewVideoLink: film.previewVideoLink,
    videoLink: film.videoLink,
    starrings: film.starring,
    director: film.director,
    runTime: film.runTime,
    posterImage: film.posterImage,
    backgroundImage: film.backgroundImage,
    backgroundColor: film.backgroundColor,
    genre: film.genre,
    postDate: getTime()
  });

export const adaptCreateCommentToServer =
  (comment: NewReview): CreateCommentDto => ({
    text: comment.comment,
    rating: comment.rating,
  });

export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };
