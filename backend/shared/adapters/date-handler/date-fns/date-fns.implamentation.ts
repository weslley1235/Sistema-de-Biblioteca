import {
  format as datefnsFormat,
  differenceInDays,
  differenceInMonths,
} from 'date-fns';
import { IDateHandler, Mask } from '../date-handler.interface';

const fromTo: Record<Mask, string> = {
  'dd-mm-yyyy HH:mm:ss': 'dd-MM-yyyy hh:mm:ss',
  'yyyy-mm-dd HH:mm:ss': 'yyyy-MM-dd hh:mm:ss',
  'yyyy-mm-dd': 'yyyy-MM-dd',
  'yyyy/mm/dd': 'yyyy/MM/dd',
  'brazillian-format': 'dd/MM/yyyy',
};

export class DateFns implements IDateHandler {
  diffInMonths(date: string, compareTo: string): number {
    return differenceInMonths(date, compareTo);
  }

  diffInDays(date: string, compareTo: string): number {
    return differenceInDays(date, compareTo);
  }

  format(date: string, mesk: Mask): string {
    return datefnsFormat(date, fromTo[mesk]);
  }
}
