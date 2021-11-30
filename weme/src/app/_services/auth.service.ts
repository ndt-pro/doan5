import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_model/user';

const baseUrl = environment.apiUrl + "Users";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private _http: HttpClient,
        private _router: Router
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    register(data) {
        return this._http.post(baseUrl + "/register", data, { headers: environment.headerOptions });
    }

    login(email: string, password: string) {
        return this._http.post<any>(baseUrl + "/login", {
            Email: email,
            Password: password
        }, { headers: environment.headerOptions })
        .pipe(map(data => {
            data.user.token = data.token;

            localStorage.setItem('user', JSON.stringify(data.user));
            this.userSubject.next(data.user);
            
            return data.user;
        }));
    }

    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this._router.navigate(['/login']);
    }

    updateUser(user: User) {
        user.token = this.userValue.token;

        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }
}
