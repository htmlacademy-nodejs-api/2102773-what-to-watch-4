import { FilmServiceInterface } from '../../modules/film/film-service.interface.js';
import { FilmModel } from '../../modules/film/film.entity.js';
import FilmService from '../../modules/film/film.service.js';
import { StarringServiceInterface } from '../../modules/starring/starring-service.interface.js';
import { StarringModel } from '../../modules/starring/starring.entity.js';
import StarringService from '../../modules/starring/starring.service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserModel } from '../../modules/user/user.entity.js';
import UserService from '../../modules/user/user.service.js';
import { Film } from '../../types/film.type.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createFilm, getErrorMessage, getMongoURI } from '../helpers/index.js';
import ConsoleLoggerService from '../logger/console.service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { CliCommandInterface } from './cli-command.interface.js';

const DEFAULT_DB_PORT = '27017';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private starringService!: StarringServiceInterface;
  private filmService!: FilmServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.filmService = new FilmService(this.logger, FilmModel);
    this.starringService = new StarringService(this.logger, StarringModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveFilm(film: Film) {
    const starrings = [];
    const user = await this.userService.findOrCreate({
      ...film.user,
    }, this.salt);

    for (const {name} of film.starring) {
      const existStarring = await this.starringService.findByStarringNameOrCreate(name, {name});
      starrings.push(existStarring.id);
    }

    await this.filmService.create({
      ...film,
      starrings,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createFilm(line);
    await this.saveFilm(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
