import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Film } from '../../types/film.type.js';
import { FilmGenre } from '../../types/film-genre.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, createdDate, genre, released, rating, previewVideoLink, videoLink, starring, director, runTime, commentsCount, userName,
        email, avatarPath, password, posterImage, backgroundImage, backgroundColor]) => ({
        title,
        description,
        postDate: new Date(createdDate),
        genre: FilmGenre[genre as 'comedy' | 'crime' | 'documentary' | 'drama' | 'horror' | 'family' | 'romance' | 'scifi' | 'thriller'],
        released: Number.parseInt(released, 10),
        rating: Number.parseFloat(rating),
        previewVideoLink,
        videoLink,
        starring: starring.split(';').map((name) => ({name})),
        director,
        runTime: Number.parseInt(runTime, 10),
        commentsCount: Number.parseInt(commentsCount, 10),
        user: {userName, email, avatarPath, password},
        posterImage,
        backgroundImage,
        backgroundColor
      }));
  }
}
