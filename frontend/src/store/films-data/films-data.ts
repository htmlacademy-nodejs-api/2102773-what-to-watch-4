import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { FilmsState } from '../../types/state';
import { addFilm, deleteFilm, editFilm, fetchFilms } from '../api-actions';
import { adaptFilmToClient, adaptFilmsToClient } from '../../utils/adapters/adaptersToClient';

const initialState: FilmsState = {
  films: [],
  isLoading: false,
};

export const filmsData = createSlice({
  name: NameSpace.Films,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFilms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.films = adaptFilmsToClient(action.payload);
        state.isLoading = false;
      })
      .addCase(fetchFilms.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addFilm.fulfilled, (state, action) => {
        state.films.push(adaptFilmToClient(action.payload));
      })
      .addCase(editFilm.fulfilled, (state, action) => {
        const updatedFilm = action.payload;
        state.films = state.films.map((film) =>
          film.id === adaptFilmToClient(updatedFilm).id ? adaptFilmToClient(updatedFilm) : film
        );
      })
      .addCase(deleteFilm.fulfilled, (state, action) => {
        state.films = state.films.filter(
          (film) => film.id !== adaptFilmToClient(action.payload).id
        );
      });
  },
});
