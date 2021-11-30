import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl + "NewfeedComments/";

@Injectable({
  providedIn: 'root'
})

export class NewfeedCommentsService {
    constructor(
        private _http: HttpClient
    ) { }

    getComments(idNewfeed, page) {
        let params = new HttpParams()
        .set('page', page)

        return this._http
            .get(baseUrl + "comment/" + idNewfeed, { headers: environment.headerOptions, params: params });
    }

    postComment(idNewfeed, content) {
        return this._http
            .post(baseUrl, {idNewfeed, content}, { headers: environment.headerOptions });
    }
}
