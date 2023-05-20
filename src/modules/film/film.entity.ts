import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { FilmGenre } from '../../types/film-genre.enum.js';
import { StarringEntity } from '../starring/starring.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'films'
  }
})

export class FilmEntity extends defaultClasses.TimeStamps {

  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: FilmGenre
  })
  public genre!: FilmGenre;

  @prop({required: true})
  public released!: number;

  @prop({required: true})
  public rating!: number;

  @prop({trim: true, required: true})
  public previewVideoLink!: string;

  @prop({trim: true, required: true})
  public videoLink!: string;

  @prop({
    ref: StarringEntity,
    required: true,
    default: [],
    _id: false
  })
  public starrings!: Ref<StarringEntity>[];

  @prop({trim: true, required: true})
  public director!: string;

  @prop({required: true})
  public runTime!: number;

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({trim: true, required: true})
  public posterImage!: string;

  @prop({trim: true, required: true})
  public backgroundImage!: string;

  @prop({trim: true, required: true})
  public backgroundColor!: string;
}

export const FilmModel = getModelForClass(FilmEntity);
