import { AppComponent } from '../../types/app-component.enum.js';
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { StarringServiceInterface } from './starring-service.interface.js';
import { StarringEntity, StarringModel } from './starring.entity.js';
import StarringService from './starring.service.js';

export function createStarringContainer() {
  const starringContainer = new Container();

  starringContainer.bind<StarringServiceInterface>(AppComponent.StarringServiceInterface).to(StarringService);
  starringContainer.bind<types.ModelType<StarringEntity>>(AppComponent.StarringModel).toConstantValue(StarringModel);

  return starringContainer;
}
