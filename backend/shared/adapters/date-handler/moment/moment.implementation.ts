import { IDateHandler } from '../date-handler.interface';
import moment from 'moment';

moment.locale('pt-br');

export class Moment implements IDateHandler {
  format(date: string, mask: string): string {
    return moment(date).format(mask);
    
  }
}
