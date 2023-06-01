import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../core/errors/http-error.js';

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponent.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.delete});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.find();
    this.ok(res, films);
  }


  public async delete(
    { body }: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response
  ): Promise<void> {
    const existFilm = await this.filmService.findById(body._id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Film with name «${body._id}» exists.`,
        'FilmController'
      );
    }

    const result = await this.filmService.deleteById(body);
    this.ok(res, result);
  }
}
