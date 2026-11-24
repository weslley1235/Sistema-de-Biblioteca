import { IDateHandler } from "../date-handler.interface";
import { format as datefnsFormat, compareAsc } from 'date-fns';

export class DateFns implements IDateHandler{
    format(date: string, mesk: string): string {
        return datefnsFormat(date, mesk)
    }
}