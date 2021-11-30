import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl + "Messages/";

@Injectable({
  providedIn: 'root'
})

export class MessageService {
    newMessage: any[];

    constructor(
        private _http: HttpClient
    ) { }

    countNewMessage() {
        return this._http
            .get<any>(baseUrl + "count-new-message", { headers: environment.headerOptions });
    }

    getMessageBox() {
        return this._http
            .get<any>(baseUrl + "get-mess-box", { headers: environment.headerOptions });
    }

    getMessage(toId, page) {
        let params = new HttpParams()
        .set('to_id', toId)
        .set('page', page);

        return this._http
            .get<any>(baseUrl + "get-all-mess", { headers: environment.headerOptions, params: params})
            .pipe(map((res: any) => {
                return res.map(data => {
                    data.media = JSON.parse(data.media);
                    return data;
                });
            }));
    }

    seeMessage(fromId, toId) {
        let data = {
            fromUserId: fromId,
            toUserId: toId,
        };
        return this._http
            .put(baseUrl + "see-message", data, { headers: environment.headerOptions });
    }
}
