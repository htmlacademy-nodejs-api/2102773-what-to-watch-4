import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { MAX_COMMENTS_COUNT } from './comment.constant.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, filmId});
    this.logger.info(`New comment for ${filmId} created`);
    return comment.populate('userId');
  }

  public async findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    const limit = MAX_COMMENTS_COUNT;
    return this.commentModel
      .find({filmId}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate('userId')
      .exec();
  }

}
