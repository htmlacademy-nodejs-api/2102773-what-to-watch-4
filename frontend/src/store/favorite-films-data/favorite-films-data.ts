import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { FavoriteFilmsState } from '../../types/state';
import {
  deleteFilm,
  editFilm,
  fetchFavoriteFilms,
  setFavorite,
  unsetFavorite,
} from '../api-actions';
import { adaptFilmToClient, adaptFilmsToClient } from '../../utils/adapters/adaptersToClient';

const initialState: FavoriteFilmsState = {
  favoriteFilms: [],
  isLoading: false,
};

export const favoriteFilmsData = createSlice({
  name: NameSpace.FavoriteFilms,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFavoriteFilms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavoriteFilms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteFilms = adaptFilmsToClient(action.payload);
      })
      .addCase(fetchFavoriteFilms.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(setFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteFilms = state.favoriteFilms.concat(adaptFilmToClient(action.payload));
      })
      .addCase(setFavorite.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(unsetFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unsetFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteFilms = state.favoriteFilms.filter(
          (favoriteFilm) => favoriteFilm.id !== action.payload.id
        );
      })
      .addCase(unsetFavorite.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editFilm.fulfilled, (state, action) => {
        const updatedFilm = action.payload;
        if (updatedFilm.isFavorite) {
          state.favoriteFilms = state.favoriteFilms.map((film) =>
            film.id === adaptFilmToClient(updatedFilm).id ? adaptFilmToClient(updatedFilm) : film
          );
        }
      })
      .addCase(deleteFilm.fulfilled, (state, action) => {
        const deletedFilm = action.payload;
        if (deletedFilm.isFavorite) {
          state.favoriteFilms = state.favoriteFilms.filter(
            (film) => film.id !== deletedFilm.id
          );
        }
      });
  },
});
