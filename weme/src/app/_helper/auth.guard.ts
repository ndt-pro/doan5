import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../_model/user';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authService.userValue;
        if(user) {
            return this.userService.getById(user.id).toPromise()
            .then((user: User) => {
                if(user) {
                    this.authService.updateUser(user);
                    return true;
                }
            });
        }
        this.router.navigate(['/login'], { queryParams: { r_url: state.url } });
        return false;
    }
}