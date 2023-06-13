import { inject, injectable } from 'inversify';
import CreateFilmDto from './dto/create-film.dto.js';
import { DocumentType, mongoose, types } from '@typegoose/typegoose';
import { FilmEntity } from './film.entity.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { FilmServiceInterface } from './film-service.interface.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { FilmGenre } from '../../types/film-genre.enum.js';
import { DECIMAL_PLACES_COUNT, DEFAULT_FILM_COUNT } from './film.constant.js';

const ObjectId = mongoose.Types.ObjectId;

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

  public async findByFilmName(filmName: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({title: filmName}).exec();
  }

  public async find(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({}, {}, {limit})
      .populate(['userId'])
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

  public async findByGenre(genreName: FilmGenre & undefined, count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({genre: genreName}, {}, {limit})
      .populate(['userId'])
      .exec();
  }

  public async findFavoriteFilms(count?: number): Promise<DocumentType<FilmEntity>[]> {
    const limit = count ?? DEFAULT_FILM_COUNT;
    return this.filmModel
      .find({isFavorite: true}, {}, {limit})
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
      .populate(['userId'])
      .exec();
  }

  public async addFavorite(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, {isFavorite: true}, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async calculateRating(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    const result = await this.filmModel
      .aggregate([
        { $match: { _id: new ObjectId(filmId) } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          },
        },
        {
          $group: {
            _id: '$_id',
            avgRating: { $max: {$avg: '$comments.rating'} }
          },
        },
      ])
      .exec();

    if (result.length === 0) {
      return null;
    }

    const rating = Number(result[0].avgRating).toFixed(DECIMAL_PLACES_COUNT);
    return await this.filmModel.findByIdAndUpdate(filmId, {rating: rating}, {new: true}).exec();
  }
}

