import { Response } from './response.type';

export interface IEntity {
  validate(): Response<void>;
}
