import { IsString, Length, Max, Min } from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  public userId!: string;

  @Min(1, {message: 'Minimum rating is 1'})
  @Max(10, {message: 'Maximum rating is 10'})
  public rating!: number;
}
