import { IHttpRequest, Response, Axios } from '../../../shared';
import {
  BrasilAPI,
  IZipCodeProvider,
  Viacep,
  ZipcodeResponse,
  ZipcodeServices,
} from '../../../shared/adapters/zipcode-provider';

class GetAddress {
  constructor(private readonly zipCodeProvider: IZipCodeProvider) {}

  public async execute(zipcode: string): Promise<Response<ZipcodeResponse>> {
    return await this.zipCodeProvider.getFullAddress(zipcode);
  }
}

export class GetAddressFactory {
  public static factory(
    zipCodeService: ZipcodeServices,
    http: IHttpRequest,
  ): GetAddress {
    const services: Record<ZipcodeServices, IZipCodeProvider> = {
      'brasil-api': new BrasilAPI(http),
      viacep: new Viacep(http),
    };

    const selectService = services[zipCodeService];

    return new GetAddress(selectService);
  }
}
