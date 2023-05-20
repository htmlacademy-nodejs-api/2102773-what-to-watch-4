import { defaultClasses } from '@typegoose/typegoose';
import typegoose, {getModelForClass} from '@typegoose/typegoose';
import { Starring } from '../../types/starring.type.js';

const {prop, modelOptions} = typegoose;

export interface StarringEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'starrings'
  }
})
export class StarringEntity extends defaultClasses.TimeStamps implements Starring {
  @prop({required: true, trim: true})
  public name!: string;
}

export const StarringModel = getModelForClass(StarringEntity);
