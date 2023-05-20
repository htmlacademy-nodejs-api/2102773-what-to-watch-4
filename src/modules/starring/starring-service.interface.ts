import CreateStarringDto from './dto/create-starring.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {StarringEntity} from './starring.entity.js';

export interface StarringServiceInterface {
  create(dto: CreateStarringDto): Promise<DocumentType<StarringEntity>>;
  findByStarringId(starringId: string): Promise<DocumentType<StarringEntity> | null>;
  findByStarringName(starringName: string): Promise<DocumentType<StarringEntity> | null>;
  findByStarringNameOrCreate(starringName: string, dto: CreateStarringDto): Promise<DocumentType<StarringEntity>>;
}
