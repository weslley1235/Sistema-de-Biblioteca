import { Response } from '../../types';

export type ZipcodeServices = 'viacep' | 'brasil-api';

export type ZipcodeResponse = {
  zipcode: string;
  state: string;
  city: string;
  street: string;
  service: ZipcodeServices;
};

export interface IZipCodeProvider {
  getFullAddress(zipcode: string): Promise<Response<ZipcodeResponse>>;
}
