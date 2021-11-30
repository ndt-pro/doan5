import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { FileUpload } from 'primeng/fileupload';
import { User } from 'src/app/_model/user';
import { AlertService } from 'src/app/_services/alert.service';
import { FileService } from 'src/app/_services/file.service';
import { ShareService } from 'src/app/_services/share.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  dateFormat: any;
  locale_vn: any;
  
  @ViewChild(FileUpload, { static: false }) file_avatar: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private alert: AlertService,
    private fileService: FileService,
    private shareService: ShareService
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;

    this.dateFormat = "dd/mm/yy";
    
    this.locale_vn = {
      "firstDayOfWeek": 1,
      "dayNames": [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7"
      ],
      "dayNamesShort": [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7"
      ],
      "dayNamesMin": [
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7"
      ],
      "monthNames": [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
      ],
      "monthNamesShort": [
        "Th 1",
        "Th 2",
        "Th 3",
        "Th 4",
        "Th 5",
        "Th 6",
        "Th 7",
        "Th 8",
        "Th 9",
        "Th 10",
        "Th 11",
        "Th 12"
      ],
      "today": "Hôm nay",
      "clear": "Xóa"
    };
    
    this.form = this.formBuilder.group({
      full_name: [this.user.fullName, Validators.required],
      phone_number: [this.user.phoneNumber, [Validators.required, Validators.pattern('^(0)[0-9]{9}$')]],
      address: [this.user.address, Validators.required],
      story: [this.user.story],
      birthday: [!this.user.birthday ? new Date() : new Date(this.user.birthday), Validators.required],
    });
  }

  get user(): User {
    return this.authService.userValue;
  }

  get f() {
    return this.form.controls;
  }

  logout() {
    this.authService.logout();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.shareService.openLoading();

    let val = this.form.value;

    let file = this.file_avatar.files[0];

    let formData = {
      FullName: val.full_name,
      PhoneNumber: val.phone_number,
      Address: val.address,
      Story: val.story,
      Birthday: val.birthday,
      Avatar: undefined,
    };

    this.fileService.getEncodeFromImage(file).subscribe(data => {
      if(data != null) {
        formData.Avatar = data;
      }

      this.userService.update(formData).toPromise()
      .then(res => {
        this.shareService.closeLoading();
        this.alert.successCallback("Đã sửa thông tin thành công!", () => {
          location.reload();
        });
      })
      .catch(err => {
        this.shareService.closeLoading();
        this.alert.error(err);
      });
    });

  }

}
