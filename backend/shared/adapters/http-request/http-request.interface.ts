import { Response } from '../../types';

export type Configs<Params> = {
  endpoint: string;
  params?: Params;
};

export interface IHttpRequest {
  get<Params, Result>(configs: Configs<Params>): Promise<Response<Result>>;
}
