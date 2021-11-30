import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment'

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    transform(text: string, limit: number) {
        if(text.length > limit) {
            return text.substr(0, limit) + "...";
        }
        return text;
    }
}