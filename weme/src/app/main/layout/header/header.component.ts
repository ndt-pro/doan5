import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ShareService } from 'src/app/_services/share.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
    private shareService: ShareService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.user = this.authService.userValue;
  }

  logout() {
    this.authService.logout();
  }

  goIndex() {
    if(this.router.url == '/') {
      this.shareService.input('refresh-newfeeds');
    } else {
      this.router.navigate(['']);
    }
  }

}
