import { Response } from '../../../types';
import {
  IZipCodeProvider,
  ZipcodeResponse,
} from '../zipcode-provider.interface';
import { IHttpRequest } from '../../http-request';

type GetFullAddressResponse = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  ibge: {
    city: string;
    state: string;
  };
};

export class BrasilAPI implements IZipCodeProvider {
  constructor(private readonly http: IHttpRequest) {}

  public async getFullAddress(
    zipcode: string,
  ): Promise<Response<ZipcodeResponse>> {
    const fullAddress = await this.http.get<undefined, GetFullAddressResponse>({
      endpoint: `/api/cep/v1/${zipcode}`,
    });

    if (fullAddress.isFail) {
      console.error(fullAddress.error?.metadata);

      return {
        isFail: true,
        error: fullAddress.error,
      };
    }

    const response = fullAddress.success?.value as GetFullAddressResponse;

    return {
      isFail: false,
      success: {
        value: {
          city: response.city,
          service: 'brasil-api',
          state: response.state,
          street: response.street,
          zipcode: response.cep,
        },
      },
    };
  }
}
