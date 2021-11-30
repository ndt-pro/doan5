import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeago' })
export class TimeagoPipe implements PipeTransform {
    transform(value: any, type: number = 0) {
        if (value) {
            const differenceInSeconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (differenceInSeconds < 30){
                return 'Vừa xong';
            }

            const timeIntervals = [{
                ' năm trước': 31536000,
                ' tháng trước': 2592000,
                ' tuần trước': 604800,
                ' ngày trước': 86400,
                ' giờ trước': 3600,
                ' phút trước': 60,
                ' giây trước': 1,
            }, {
                ' năm trc': 31536000,
                ' tháng trc': 2592000,
                ' tuần trc': 604800,
                'd trc': 86400,
                'h trc': 3600,
                'p trc': 60,
                's trc': 1,
            }];

            let counter;
            for (const i in timeIntervals[type]) {
                counter = Math.floor(differenceInSeconds / timeIntervals[type][i]);
                if (counter > 0){
                    if (counter === 1) {
                    return counter + i; 
                    } else {
                        return counter + i;
                    }
                }
                    
            }
        }
        return value;
    }
}