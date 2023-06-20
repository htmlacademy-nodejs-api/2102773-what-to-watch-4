import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';
import CreateFilmDto from './dto/create-film.dto.js';
import FilmRdo from './rdo/film.rdo.js';
import { fillDTO } from '../../core/helpers/index.js';
import UpdateFilmDto from './dto/update-film.dto.js';
import { RequestQuery } from '../../types/request-query.type.js';
import FilmGenreDto from './dto/film-genre.dto.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import { ValidateObjectIdMiddleware } from '../../core/middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middleware/private-route.middleware.js';
import { PROMO_FILM_NAME } from './film.constant.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
//import FavoriteUserRdo from '../user/rdo/favorite-user.rdo.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';

type ParamsFilmDetails = {
  filmId: string;
} | ParamsDictionary

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromoFilm});
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavoriteFilms,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFilmDto)
      ]
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')
      ]
    });
    this.addRoute({path: '/genre', method: HttpMethod.Post, handler: this.findFilmsByGenre});
    this.addRoute({
      path: '/favorite/:filmId/',
      method: HttpMethod.Patch,
      handler: this.addOrDeleteFavoriteFilm,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('filmId')
      ]
    });

    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'),
      ]
    });
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response,
  ): Promise<void> {
    const existsFilm = await this.filmService.findByFilmName(body.title);

    if (existsFilm) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with name «${body.title}» exists.`,
        'FilmController'
      );
    }

    const result = await this.filmService.create({ ...body, userId: user.id,});
    const film = await this.filmService.findById(result.id);
    this.created(
      res,
      fillDTO(FilmRdo, film)
    );
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    this.ok(res, fillDTO(FilmRdo, films));
  }

  public async show(
    {params}: Request<ParamsFilmDetails>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);
    this.ok(res, fillDTO(FilmRdo, film));
  }

  public async getPromoFilm(_req: Request, res: Response): Promise<void> {
    const promoFilm = await this.filmService.findByFilmName(PROMO_FILM_NAME);
    this.ok(res, fillDTO(FilmRdo, promoFilm));
  }

  public async findFilmsByGenre(
    { body, query }: Request<Record<string, unknown>, Record<string, unknown>, FilmGenreDto, RequestQuery>,
    res: Response
  ): Promise<void> {
    const filmsByGenre = await this.filmService.findByGenre(body.genre, query.limit);
    this.ok(res, fillDTO(FilmRdo, filmsByGenre));
  }

  public async getFavoriteFilms({ user }: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response,): Promise<void> {
    const favoriteFilms = await this.filmService.findFavoriteFilms(user.id);
    this.ok(res, fillDTO(FilmRdo, favoriteFilms));
  }

  public async addOrDeleteFavoriteFilm(
    {params, user}: Request<ParamsFilmDetails, Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    await this.userService.addFavoriteFilm(user.id, filmId);
    const films = await this.filmService.findById(filmId);
    this.ok(res, {...fillDTO(FilmRdo, films), isFavorite: true});
  }

  public async delete(
    {params}: Request<ParamsFilmDetails>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const result = await this.filmService.deleteById(filmId);
    this.noContent(res, result);
  }

  public async update(
    {body, params}: Request<ParamsFilmDetails, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const updateFilm = await this.filmService.updateById(params.filmId, body);
    this.ok(res, fillDTO(FilmRdo, updateFilm));
  }

  public async getComments(
    {params}: Request<ParamsFilmDetails, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
