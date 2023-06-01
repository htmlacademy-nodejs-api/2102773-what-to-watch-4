import { inject, injectable } from 'inversify';
import CreateFilmDto from './dto/create-film.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FilmEntity } from './film.entity.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FilmServiceInterface } from './film-service.interface.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmGenre } from '../../types/film-genre.enum.js';
import { DEFAULT_FILM_COUNT } from './film.constant.js';

@injectable()
export default class FilmService implements FilmServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New filmId created: ${dto.title}`);
    return result;
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).populate(['userId']).exec();
  }

  public async find(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .find()
      .populate(['userId'])
      // .aggregate([
      //   {
      //     $lookup: {
      //       from: 'comments',
      //       let: { id: '$_id'},
      //       pipeline: [
      //         { $match: { $expr: { $in: ['$$id', '$filmId'] } } },
      //         { $project: { rating: 1}}
      //       ],
      //       as: 'rating'
      //     },
      //   },
      //   { $addFields:
      //     { id: { $toString: '$_id'}, commentsCount: { $size: '$comments'} }
      //   },
      // ])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async updateById(filmId: string, dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async findByGenre(genre: FilmGenre, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({genre: genre}, {}, {limit})
      .populate(['userId'])
      .exec();
  }

  public async findPromoById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).populate(['userId']).exec();
  }

  public async findFavoriteFilms(isFavorite: boolean, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({isFavorite: isFavorite}, {}, {limit})
      .populate(['userId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async deleteFavorite(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {isFavorite: false}, {new: true})
      .exec();
  }

  public async addFavorite(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {isFavorite: true}, {new: true})
      .populate(['userId'])
      .exec();
  }
}
