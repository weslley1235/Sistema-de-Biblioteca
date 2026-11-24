type Mask = 'yyyy-mm-dd' | 'yyyy/mm/dd' | 'dd-mm-yyyy-HH:mm:ss'

export interface IDateHandler {
  format(date: string, mesk: Mask): string;
}