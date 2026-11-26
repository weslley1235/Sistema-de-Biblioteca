import { IDateHandler, Mask } from '../date-handler.interface';
import moment from 'moment';

moment.locale('pt-br');

const fromTo: Record<Mask, string> = {
  'dd-mm-yyyy HH:mm:ss': 'D-MM-YYYY h:mm:ss',
  'yyyy-mm-dd HH:mm:ss': 'YYYY-MM-DD h:mm:ss',
  'yyyy-mm-dd': 'YYYY-MM-DD',
  'yyyy/mm/dd': 'YYYY/MM/DD',
  'brazillian-format': 'DD/MM/YYYY',
};

export class Moment implements IDateHandler {
  diffInMonths(date: string, compareTo: string): number {
    return moment(date).diff(compareTo, 'months');
  }

  diffInDays(date: string, compareTo: string): number {
    return moment(date).diff(compareTo, 'days');
  }

  format(date: string, mask: Mask): string {
    return moment(date).format(fromTo[mask]);
  }
}
