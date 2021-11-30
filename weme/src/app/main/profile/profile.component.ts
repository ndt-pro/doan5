import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_model/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user_view: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    this.route.paramMap.subscribe((data : any) => {
      let uid = data.params.uid;

      if(uid) {
        this.userService.getById(uid).toPromise()
        .then(res => {
          this.user_view = res;
        })
        .catch(err => this.alert.error(err));
      } else {
        this.user_view = this.authService.userValue;
      }
    });
  }

}
