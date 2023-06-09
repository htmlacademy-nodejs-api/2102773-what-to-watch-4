import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { PromoState } from '../../types/state';
import { deleteFilm, editFilm, fetchPromo, setFavorite, unsetFavorite } from '../api-actions';
import { adaptFilmToClient } from '../../utils/adapters/adaptersToClient';

const initialState: PromoState = {
  promoFilm: null,
  isLoading: false,
};

export const promoData = createSlice({
  name: NameSpace.Promo,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPromo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPromo.fulfilled, (state, action) => {
        state.promoFilm = adaptFilmToClient(action.payload);
        state.isLoading = false;
      })
      .addCase(fetchPromo.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editFilm.fulfilled, (state, action) => {
        const updatedFilm = action.payload;
        if (updatedFilm.id === state.promoFilm?.id) {
          state.promoFilm = adaptFilmToClient(updatedFilm);
        }
      })
      .addCase(deleteFilm.fulfilled, (state, action) => {
        const deletedFilm = adaptFilmToClient(action.payload);
        if (deletedFilm.id === state.promoFilm?.id) {
          state.promoFilm = null;
        }
      })
      .addCase(setFavorite.fulfilled, (state, action) => {
        state.promoFilm = adaptFilmToClient(action.payload);
      })
      .addCase(unsetFavorite.fulfilled, (state, action) => {
        state.promoFilm = adaptFilmToClient(action.payload);
      });
  },
});
