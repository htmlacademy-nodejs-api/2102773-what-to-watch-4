import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Film } from '../types/film';
import { Review } from '../types/review';
//import { NewReview } from '../types/new-review';
import { AuthData } from '../types/auth-data';
import { Token } from '../types/token';
//import { NewFilm } from '../types/new-film';
import { APIRoute, DEFAULT_GENRE, NameSpace } from '../const';
//import { User } from '../types/user';
//import { NewUser } from '../types/new-user';
import { dropToken, saveToken } from '../services/token';
import FilmDto from '../dto/film/film.dto.js';
import UpdateFilmDto from '../dto/film/update-film.dto';
import CreateUserDto from '../dto/user/create-user.dto';
import CreateFilmDto from '../dto/film/create-film.dto';
import CommentDto from '../dto/comments/comment.dto';
import CreateCommentDto from '../dto/comments/create-comment.dto';
import UserWithTokenDto from '../dto/user/user-with-token.dto';
import UserDto from '../dto/user/user.dto';

type Extra = {
  api: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<FilmDto[], undefined, { extra: Extra }>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<FilmDto[]>(APIRoute.Films);

    return data;
  }
);

export const fetchFilmsByGenre = createAsyncThunk<
FilmDto[],
  string,
  { extra: Extra }
>(`${NameSpace.Genre}/fetchFilmsByGenre`, async (genre, { extra }) => {
  const { api } = extra;
  let route = `${APIRoute.Genre}/${genre}`;
  if (genre === DEFAULT_GENRE) {
    route = APIRoute.Films;
  }
  const { data } = await api.get<FilmDto[]>(route);

  return data;
});

export const fetchFilm = createAsyncThunk<FilmDto, string, { extra: Extra }>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<FilmDto>(`${APIRoute.Films}/${id}`);

    return data;
  }
);

export const editFilm = createAsyncThunk<FilmDto, UpdateFilmDto, { extra: Extra }>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const { data } = await api.patch<FilmDto>(
      `${APIRoute.Films}/${filmData.id}`,
      filmData
    );

    return data;
  }
);

export const addFilm = createAsyncThunk<FilmDto, CreateFilmDto, { extra: Extra }>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<FilmDto>(APIRoute.Films, filmData);

    return data;
  }
);

export const deleteFilm = createAsyncThunk<FilmDto, string, { extra: Extra }>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.delete<FilmDto>(`${APIRoute.Films}/${id}`);

    return data;
  }
);

export const fetchReviews = createAsyncThunk<
CommentDto[],
  string,
  { extra: Extra }
>(`${NameSpace.Reviews}/fetchReviews`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<CommentDto[]>(`${APIRoute.Comments}/${id}`);

  return data;
});

export const postReview = createAsyncThunk<
  CommentDto,
  { id: Review['id']; review: CreateCommentDto },
  { extra: Extra }
>(`${NameSpace.Reviews}/postReview`, async ({ id, review }, { extra }) => {
  const { api } = extra;
  const { data } = await api.post<CommentDto>(`${APIRoute.NewComment}/${id}`, review);

  return data;
});

export const checkAuth = createAsyncThunk<UserDto, undefined, { extra: Extra }>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<UserDto>(APIRoute.Login);
      return data;
    } catch (error) {
      dropToken();
      return Promise.reject(error);
    }
  }
);

export const login = createAsyncThunk<UserWithTokenDto, AuthData, { extra: Extra }>(
  `${NameSpace.User}/login`,
  async (authData, { extra }) => {
    const { api } = extra;

    const { data } = await api.post<UserWithTokenDto & { token: Token }>(
      APIRoute.Login,
      authData
    );
    const { token } = data;
    saveToken(token);

    return data;
  }
);

export const logout = createAsyncThunk<void, undefined, { extra: Extra }>(
  `${NameSpace.User}/logout`,
  async (_arg, { extra }) => {
    const { api } = extra;
    await api.delete(APIRoute.Logout);
    dropToken();
  }
);

export const fetchFavoriteFilms = createAsyncThunk<
  Film[],
  undefined,
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/fetchFavoriteFilms`, async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<Film[]>(APIRoute.Favorite);

  return data;
});

export const fetchPromo = createAsyncThunk<FilmDto, undefined, { extra: Extra }>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<FilmDto>(APIRoute.Promo);

    return data;
  }
);

export const setFavorite = createAsyncThunk<Film, Film['id'], { extra: Extra }>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Film>(`${APIRoute.Favorite}/${id}`);

    return data;
  }
);

export const unsetFavorite = createAsyncThunk<
  Film,
  Film['id'],
  { extra: Extra }
>(`${NameSpace.FavoriteFilms}/unsetFavorite`, async (id, { extra }) => {
  const { api } = extra;
  const { data } = await api.delete<Film>(`${APIRoute.Favorite}/${id}`);

  return data;
});

export const registerUser = createAsyncThunk<void, CreateUserDto, { extra: Extra }>(
  `${NameSpace.User}/register`,
  async ({ email, password, userName, avatarPath }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<{ id: string }>(APIRoute.Register, {
      email,
      password,
      userName,
    });
    if (avatarPath) {
      const payload = new FormData();
      payload.append('avatar', avatarPath);
      await api.post(`users/${data.id}${APIRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  }
);