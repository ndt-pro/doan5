import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl + "Notifications/";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
    constructor(
        private _http: HttpClient,
        private toastrService: ToastrService
    ) { }

    getNotificationsById() {
        return this._http
            .get<any[]>(baseUrl + "get-by-user", { headers: environment.headerOptions });
    }

    pushNotification(data) {
        return this._http
            .post(baseUrl, data);
    }

    pushLike(idNewfeed) {
        return this.pushNotification({
            idNewfeed,
            type: 1,
        });
    }

    pushComment(idNewfeed) {
        return this.pushNotification({
            idNewfeed,
            type: 2,
        });
    }

    seeNotification(idNotification) {
        return this._http
            .put(baseUrl + "see-notification", { id: idNotification });
    }

    openToastr(content: string, type: number) {
        let option = {
            closeButton: true,
            timeOut: 4000,
            enableHtml: true,
            progressBar: true,
            positionClass: 'toast-bottom-left'
        };
        let title = "Thông báo";
        if(type == 1) {
            this.toastrService.info(content, title, option);
        } else if (type == 2) {
            this.toastrService.success(content, title, option);
        }
    }
}