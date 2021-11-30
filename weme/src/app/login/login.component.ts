import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { ShareService } from '../_services/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '/src/assets/login-page/vendor/bootstrap/css/bootstrap.min.css',
    '/src/assets/login-page/vendor/animate/animate.css',
    '/src/assets/login-page/vendor/css-hamburgers/hamburgers.min.css',
    '/src/assets/login-page/vendor/animsition/css/animsition.min.css',
    '/src/assets/login-page/css/util.css',
    '/src/assets/login-page/css/main.css',
    '/src/assets/login-page/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
  ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private shareService: ShareService
    ) {
      if(this.authService.userValue) {
        this.router.navigate(['/']);
      }
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['r_url'] || '/';
  }
  
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.shareService.openLoading();

    let val = this.form.value;

    this.authService.login(val.email, val.pass).toPromise()
    .then(res => {
      this.router.navigate([this.returnUrl]);
      this.shareService.closeLoading();
    })
    .catch(err => {
      this.shareService.closeLoading();
      this.alert.error(err);
    });
  }

}
