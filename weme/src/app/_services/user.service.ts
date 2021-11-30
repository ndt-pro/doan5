import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_model/user';

const baseUrl = environment.apiUrl + "Users/";

@Injectable({
  providedIn: 'root'
})

export class UserService {
    constructor(
        private _http: HttpClient
    ) { }

    getAll() {
        return this._http
            .get<User[]>(baseUrl, { headers: environment.headerOptions });
    }

    getById(uid) {
        return this._http
            .get<User>(baseUrl + uid, { headers: environment.headerOptions });
    }

    create(data) {
        return this._http
            .post(baseUrl + "/register", data, { headers: environment.headerOptions });
    }

    update(data) {
        return this._http
            .put(baseUrl, data);
    }
}
