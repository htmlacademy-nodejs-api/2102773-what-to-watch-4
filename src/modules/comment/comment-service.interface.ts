import { DocumentType } from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceInterface {
  create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByFilmId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
}
