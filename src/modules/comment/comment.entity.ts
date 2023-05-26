import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public text!: string;

  @prop({
    ref: FilmEntity,
    required: true
  })
  public filmId!: Ref<FilmEntity>;

  @prop({
    ref: FilmEntity,
    required: true,
  })
  public userId!: Ref<FilmEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
