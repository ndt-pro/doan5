import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timevn' })
export class TimeVnPipe implements PipeTransform {
    weekdays = [
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',
        'Chủ nhật',
    ];

    transform(value) {
        
        if (value) {
            value = new Date(value);
            
            const differenceInSeconds = Math.floor((+new Date() - +new Date(value)) / 1000);

            let day = this.addZero(value.getDate());
            let month = this.addZero(value.getMonth() + 1);
            let year = value.getFullYear();
            let hour = this.addZero(value.getHours());
            let minute = this.addZero(value.getMinutes());
            let second = this.addZero(value.getSeconds());
            let weekday = this.weekdays[value.getDay()];

            if(differenceInSeconds < 30) {
                return "Vừa xong";
            }

            if(differenceInSeconds < 1800) {
                return `${hour}:${minute}:${second}`;
            }

            if(differenceInSeconds < 259200) {
                return `${weekday}, lúc ${hour}:${minute}:${second}`;
            }

            return `${day}/${month}/${year}, lúc ${hour}:${minute}:${second}`;
        }
        return value;
    }

    addZero(value) {
        return value < 10 ? "0" + value : value;
    }
}