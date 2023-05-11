import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem } from '../../core/helpers/index.js';
import { MockData } from '../../types/mock-data.type.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const FIRST_YEAR = 1925;

const LAST_WEEK_DAY = 7;
const LAST_YEAR = 2023;

const MAX_RATING = 10;
const MAX_RUNTIME = 300;
const MAX_COMMENTS_COUNT = 100;

const MIN_RATING = 0;
const MIN_RUNTIME = 10;
const MIN_COMMENTS_COUNT = 0;

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const genre = getRandomItem<string>(this.mockData.genres);
    const director = getRandomItem<string>(this.mockData.directors);
    const starring = getRandomItem<string[]>(this.mockData.starrings).join(';');
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarPath = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const posterImage = getRandomItem<string>(this.mockData.posterImages);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLinks);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const released = dayjs().subtract(generateRandomValue(FIRST_YEAR, LAST_YEAR), 'year').toISOString();
    const runTime = generateRandomValue(MIN_RUNTIME, MAX_RUNTIME).toString();
    const commentsCount = generateRandomValue(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).toString();

    return [
      title, description, postDate, genre, released, rating, previewVideoLink, videoLink,
      starring, director, runTime, commentsCount, userName, email, avatarPath, password, posterImage, backgroundImage, backgroundColor
    ].join('\t');
  }
}
