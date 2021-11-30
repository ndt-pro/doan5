import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl + "Newfeeds/";

@Injectable({
  providedIn: 'root'
})

export class NewfeedsService {
    constructor(
        private _http: HttpClient
    ) { }

    getNewfeed(page, pageSize) {
        let params = new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize);

        return this._http
            .get<any[]>(baseUrl, { headers: environment.headerOptions, params: params })
            .pipe(map((res: any[]) => {
                return res.map(data => {
                    data.media = JSON.parse(data.media);
                    return data;
                });
            }));
    }

    getNewfeedById(idNewfeed) {
        return this._http
            .get(baseUrl + idNewfeed, { headers: environment.headerOptions })
            .pipe(map((res: any) => {
                res.media = JSON.parse(res.media);
                return res;
            }));
    }

    getNewfeedUser(idUser, page, pageSize) {
        let params = new HttpParams()
        .set('page', page)
        .set('pageSize', pageSize);

        return this._http
            .get(baseUrl + "get-newfeeds-user/" + idUser, { headers: environment.headerOptions, params: params })
            .pipe(map((res: any[]) => {
                return res.map(data => {
                    data.media = JSON.parse(data.media);
                    return data;
                });
            }));
    }

    getUserLikes(idNewfeed) {
        return this._http
            .get<any[]>(baseUrl + "get-user-likes/" + idNewfeed, { headers: environment.headerOptions });
    }

    post(data) {
        return this._http
            .post(baseUrl + "post-newfeed", data);
    }

    like(idNewfeed) {
        return this._http
            .post(baseUrl + "like-newfeed", {
                idNewfeed
            });
    }

    delete(idNewfeed) {
        let params = new HttpParams()
        .set('idPost', idNewfeed);
        
        return this._http
            .delete(baseUrl, { headers: environment.headerOptions, params: params });
    }
}
