import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, DEFAULT_GENRE } from '../../const';
import { GenreState } from '../../types/state';
import {
  addFilm,
  deleteFilm,
  editFilm,
  fetchFilmsByGenre,
} from '../api-actions';
import { adaptFilmToClient, adaptFilmsToClient } from '../../utils/adapters/adaptersToClient';

const initialState: GenreState = {
  activeGenre: DEFAULT_GENRE,
  filmsByGenre: [],
  isLoading: false,
};

export const genreData = createSlice({
  name: NameSpace.Genre,
  initialState,
  reducers: {
    setActiveGenre: (state, action) => {
      state.activeGenre = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFilmsByGenre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFilmsByGenre.fulfilled, (state, action) => {
        state.filmsByGenre = adaptFilmsToClient(action.payload);
        state.isLoading = false;
      })
      .addCase(fetchFilmsByGenre.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addFilm.fulfilled, (state, action) => {
        const newFilm = action.payload;
        if (newFilm.genre === state.activeGenre) {
          state.filmsByGenre.push(adaptFilmToClient(newFilm));
        }
      })
      .addCase(editFilm.fulfilled, (state, action) => {
        const updatedFilm = action.payload;
        if (updatedFilm.genre === state.activeGenre) {
          state.filmsByGenre = state.filmsByGenre.map((film) =>
            film.id === adaptFilmToClient(updatedFilm).id ? adaptFilmToClient(updatedFilm) : film
          );
        }
      })
      .addCase(deleteFilm.fulfilled, (state, action) => {
        const deletedFilm = adaptFilmToClient(action.payload);
        if (deletedFilm.genre === state.activeGenre) {
          state.filmsByGenre = state.filmsByGenre.filter(
            (film) => film.id !== deletedFilm.id
          );
        }
      });
  },
});

export const { setActiveGenre } = genreData.actions;
