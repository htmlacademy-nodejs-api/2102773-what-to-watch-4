import { UserEntity } from './user.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';
import UpdateUserDto from './dto/update-user.dto.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel
      .exists({_id: documentId})) !== null;
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async addFavoriteFilm(userId: string, filmId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findById(userId);

    if (! user) {
      return null;
    }

    const favoriteFilmsId = user.favoriteFilms;
    const index = favoriteFilmsId.indexOf(filmId);
    if (index === -1) {
      favoriteFilmsId.push(filmId);
    }
    return this.userModel.findByIdAndUpdate(userId, {favoriteFilms: favoriteFilmsId});
  }

  public async deleteFavoriteFilm(userId: string, filmId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userModel.findById(userId);

    if (! user) {
      return null;
    }

    const favoriteFilmsId = user.favoriteFilms;
    const index = favoriteFilmsId.indexOf(filmId);
    if (index !== -1) {
      favoriteFilmsId.splice(index, 1);
    }
    return this.userModel.findByIdAndUpdate(userId, {favoriteFilms: favoriteFilmsId});
  }

}
