import { Starring } from './starring.type.js';
import { User } from './user.type.js';

export type Film = {
  title: string;
  description: string;
  postDate: Date;
  genre: string;
  released: number;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starring: Starring[];
  director: string;
  runTime: number;
  commentsCount: number;
  user: User;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
}
