import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { ShareService } from '../_services/share.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css',
    '/src/assets/login-page/vendor/bootstrap/css/bootstrap.min.css',
    '/src/assets/login-page/vendor/animate/animate.css',
    '/src/assets/login-page/vendor/css-hamburgers/hamburgers.min.css',
    '/src/assets/login-page/vendor/animsition/css/animsition.min.css',
    '/src/assets/login-page/css/util.css',
    '/src/assets/login-page/css/main.css',
    '/src/assets/login-page/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
  ]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private shareService: ShareService
    ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^(0)[0-9]{9}$')]],
      pass: ['', Validators.required],
      pass_confirm: ['', Validators.required],
    }, {
      validator: this.confirm_password_validate('pass', 'pass_confirm')
    });
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

    let user = {
      Email: val.email,
      Password: val.pass,
      FullName: val.full_name,
      PhoneNumber: val.phone_number,
      Address: "Mặc định",
    };

    this.authService.register(user).toPromise()
    .then(user => {
      this.shareService.closeLoading();
      this.alert.registerSuccess();
    })
    .catch(err => {
      this.shareService.closeLoading();
      this.alert.error(err);
    });
  }

  confirm_password_validate(pass: string, pass_confirm: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[pass];
        const matchingControl = formGroup.controls[pass_confirm];

        if (matchingControl.errors && !matchingControl.errors.confirm_password) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirm_password: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

}