import CommentDto from '../../dto/comments/comment.dto';
import FilmDto from '../../dto/film/film.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { Film } from '../../types/film';
import { Review } from '../../types/review';
import { User } from '../../types/user';

export const adaptFilmsToClient =
  (films: FilmDto[]): Film[] =>
    films
      .filter((film: FilmDto) =>
        film.user !== null,
      )
      .map((film: FilmDto) => ({
        id: film.id,
        name: film.title,
        posterImage: film.posterImage,
        backgroundImage: film.backgroundImage,
        backgroundColor: film.backgroundColor,
        videoLink: film.videoLink,
        previewVideoLink: film.previewVideoLink,
        description: film.description,
        rating: film.rating,
        director: film.director,
        starring: film.starrings,
        runTime: film.runTime,
        genre: film.genre,
        released: film.released,
        isFavorite: film.isFavorite,
        user: adaptUserToClient(film.user),
      }));

export const adaptFilmToClient =
  (film: FilmDto): Film => ({
    id: film.id,
    name: film.title,
    posterImage: film.posterImage,
    backgroundImage: film.backgroundImage,
    backgroundColor: film.backgroundColor,
    videoLink: film.videoLink,
    previewVideoLink: film.previewVideoLink,
    description: film.description,
    rating: film.rating,
    director: film.director,
    starring: film.starrings,
    runTime: film.runTime,
    genre: film.genre,
    released: film.released,
    isFavorite: film.isFavorite,
    user: adaptUserToClient(film.user),
  });

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.userName,
    email: user.email,
    avatarUrl: user.avatarPath,
  });

export const adaptLoginToClient =
 (user: UserWithTokenDto): User => ({
   name: user.userName,
   email: user.email,
   avatarUrl: user.avatarPath,
   token: user.token,
 });

export const adaptCommentsToClient =
 (comments: CommentDto[]): Review[] =>
   comments
     .filter((comment: CommentDto) =>
       comment.user !== null,
     )
     .map((comment: CommentDto) => ({
       id: comment.id,
       comment: comment.text,
       date: comment.postDate,
       rating: comment.rating,
       user: adaptUserToClient(comment.user),
     }));
