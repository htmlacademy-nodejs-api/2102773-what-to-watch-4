import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { StarringServiceInterface } from './starring-service.interface.js';
import { StarringEntity } from './starring.entity.js';
import CreateStarringDto from './dto/create-starring.dto.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';

@injectable()
export default class StarringService implements StarringServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.StarringModel) private readonly starringModel: ModelType<StarringEntity>
  ) {}

  public async create(dto: CreateStarringDto): Promise<DocumentType<StarringEntity>> {
    const result = await this.starringModel.create(dto);
    this.logger.info(`New starring created: ${dto.name}`);
    return result;
  }

  public async findByStarringId(categoryId: string): Promise<DocumentType<StarringEntity> | null> {
    return this.starringModel.findById(categoryId).exec();
  }

  public async findByStarringName(starringName: string): Promise<DocumentType<StarringEntity> | null> {
    return this.starringModel.findOne({name: starringName}).exec();
  }

  public async findByStarringNameOrCreate(starringName: string, dto: CreateStarringDto): Promise<DocumentType<StarringEntity>> {
    const existedStarring = await this.findByStarringName(starringName);

    if (existedStarring) {
      return existedStarring;
    }

    return this.create(dto);
  }
}
