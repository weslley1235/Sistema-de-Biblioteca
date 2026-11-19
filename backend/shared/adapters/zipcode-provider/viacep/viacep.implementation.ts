import { Response } from '../../../types';
import {
  IZipCodeProvider,
  ZipcodeResponse,
} from '../zipcode-provider.interface';
import { IHttpRequest } from '../../http-request';

type GetFullAddressResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export class Viacep implements IZipCodeProvider {
  constructor(private readonly http: IHttpRequest) {}

  public async getFullAddress(
    zipcode: string,
  ): Promise<Response<ZipcodeResponse>> {
    const fullAddress = await this.http.get<undefined, GetFullAddressResponse>({
      endpoint: `/ws/${zipcode}/json/`,
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
          city: response.localidade,
          service: 'viacep',
          state: response.estado,
          street: response.logradouro,
          zipcode: response.cep,
        },
      },
    };
  }
}
