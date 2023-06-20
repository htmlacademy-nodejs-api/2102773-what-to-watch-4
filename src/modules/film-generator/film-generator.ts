import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem } from '../../core/helpers/index.js';
import { MockData } from '../../types/mock-data.type.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

enum WeekDay {
  First = 1,
  Last = 7
}

enum Year {
  First = 1925,
  Last = 2023
}

// enum Rating {
//   Max = 10,
//   Min = 0
// }

enum Runtime {
  Max = 10,
  Min = 0
}

enum CommentsCount {
  Max = 10,
  Min = 0
}

export default class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const genre = getRandomItem<string>(this.mockData.genres);
    const director = getRandomItem<string>(this.mockData.directors);
    const starrings = getRandomItem<string[]>(this.mockData.starrings).join(';');
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarPath = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const posterImage = getRandomItem<string>(this.mockData.posterImages);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);
    const videoLink = getRandomItem<string>(this.mockData.videoLinks);
    const previewVideoLink = getRandomItem<string>(this.mockData.previewVideoLinks);
    const postDate = dayjs().subtract(generateRandomValue(WeekDay.First, WeekDay.Last), 'day').toISOString();
    const rating = '0';
    const released = generateRandomValue(Year.First, Year.Last);
    const runTime = generateRandomValue(Runtime.Min, Runtime.Max).toString();
    const commentsCount = generateRandomValue(CommentsCount.Min, CommentsCount.Max).toString();

    return [
      title, description, postDate, genre, released, rating, previewVideoLink, videoLink,
      starrings, director, runTime, commentsCount, userName, email, avatarPath, password, posterImage, backgroundImage, backgroundColor
    ].join('\t');
  }
}
