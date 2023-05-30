import {DocumentType} from '@typegoose/typegoose';
import {FilmEntity} from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmGenre } from '../../types/film-genre.enum.js';

export interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  find(): Promise<DocumentType<FilmEntity>[]>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  findByGenre(genre: FilmGenre, count?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromoById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findFavoriteFilms(isFavorite: boolean): Promise<DocumentType<FilmEntity>[]>;
  addFavorite(filmId: string, isFavorite: boolean): Promise<DocumentType<FilmEntity> | null>;
  deleteFavorite(filmId: string, isFavorite: boolean): Promise<DocumentType<FilmEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null>;
}
