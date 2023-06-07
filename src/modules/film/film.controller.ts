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

const PROMO_FILM_NAME = 'No Country for Old Men';

type ParamsFilmDetails = {
  filmId: string;
} | ParamsDictionary

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.find});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.findPromoFilm});
    this.addRoute({path: '/:filmId', method: HttpMethod.Delete, handler: this.deleteFilm});
    this.addRoute({path: '/:filmId', method: HttpMethod.Patch, handler: this.updateFilm});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:filmId', method: HttpMethod.Get, handler: this.findById});
    this.addRoute({path: '/genre', method: HttpMethod.Post, handler: this.findFilmsByGenre});
    this.addRoute({path: '/favorite', method: HttpMethod.Post, handler: this.favoriteFilms});
    this.addRoute({path: '/favorite/:id/:1', method: HttpMethod.Post, handler: this.addFavoriteFilm});
    this.addRoute({path: '/favorite/:id/:0', method: HttpMethod.Put, handler: this.deleteFavoriteFilm});
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
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

    const result = await this.filmService.create(body);
    const film = await this.filmService.findById(result.id);
    this.created(
      res,
      fillDTO(FilmRdo, film)
    );
  }

  public async find(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    this.ok(res, fillDTO(FilmRdo, films));
  }

  public async findById(
    {params}: Request<ParamsFilmDetails>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const film = await this.filmService.findById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(FilmRdo, film));
  }

  public async findPromoFilm(_req: Request, res: Response): Promise<void> {
    const promoFilm = await this.filmService.findByFilmName(PROMO_FILM_NAME);
    this.ok(
      res,
      fillDTO(FilmRdo, promoFilm)
    );
  }

  public async findFilmsByGenre(
    { body, query }: Request<Record<string, unknown>, Record<string, unknown>, FilmGenreDto, RequestQuery>,
    res: Response
  ): Promise<void> {
    const filmsByGenre = await this.filmService.findByGenre(body.genre, query.limit);
    this.ok(res, filmsByGenre);
  }

  public async favoriteFilms(_req: Request, res: Response): Promise<void> {
    const favoriteFilms = await this.filmService.findFavoriteFilms();
    this.ok(res, fillDTO(FilmRdo, favoriteFilms));
  }

  public async addFavoriteFilm(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const favorite = await this.filmService.addFavorite(id);
    this.ok(res, fillDTO(FilmRdo, favorite));
  }

  public async deleteFavoriteFilm(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const favorite = await this.filmService.deleteFavorite(id);
    this.ok(res, fillDTO(FilmRdo, favorite));
  }

  public async deleteFilm(
    {params}: Request<ParamsFilmDetails>,
    res: Response
  ): Promise<void> {
    const {filmId} = params;
    const result = await this.filmService.deleteById(filmId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }

    this.noContent(res, result);
  }

  public async updateFilm(
    {body, params}: Request<ParamsFilmDetails, Record<string, unknown>, UpdateFilmDto>,
    res: Response
  ): Promise<void> {
    const updateFilm = await this.filmService.updateById(params.filmId, body);

    if (!updateFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${params.filmId} not found.`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(FilmRdo, updateFilm));
  }
}
