import { DocumentType } from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import LoginUserDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  exists(documentId: string): Promise<boolean>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  addFavoriteFilm(userId: string, filmId: string): Promise<DocumentType<UserEntity> | null>;
  deleteFavoriteFilm(userId: string, filmId: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
