import axios from 'axios';

import { Configs, IHttpRequest } from '../http-request.interface';
import { Response } from '../../../types';

export class Axios implements IHttpRequest {
  public async get<Params, Result>(
    configs: Configs<Params>,
  ): Promise<Response<Result>> {
    try {
      const resposta = await axios.request({
        baseURL: configs.endpoint,
        params: configs.params,
      });

      return {
        isFail: false,
        success: resposta.data,
      };
    } catch (error: any) {
      return {
        isFail: true,
        error: {
          message: error.message,
          metadata: error,
        },
      };
    }
  }
}
