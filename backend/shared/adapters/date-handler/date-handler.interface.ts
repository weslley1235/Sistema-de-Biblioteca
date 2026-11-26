export type Mask =
  | 'yyyy-mm-dd'
  | 'yyyy/mm/dd'
  | 'dd-mm-yyyy HH:mm:ss'
  | 'yyyy-mm-dd HH:mm:ss'
  | 'brazillian-format';

export interface IDateHandler {
  format(date: string, mesk: Mask): string;
  diffInDays(date: string, compareTo: string): number;
  diffInMonths(date: string, compareTo: string): number;
}
