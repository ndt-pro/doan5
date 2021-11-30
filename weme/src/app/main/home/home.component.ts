import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { FileService } from 'src/app/_services/file.service';
import { NewfeedsService } from 'src/app/_services/newfeeds.service';
import { ShareService } from 'src/app/_services/share.service';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  modal: boolean;
  
  @ViewChild(FileUpload, { static: false }) fileupload: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fileService: FileService,
    private alert: AlertService,
    private newfeedsService: NewfeedsService,
    private el: ElementRef,
    public socket: SocketService,
    private shareService: ShareService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  get user() {
    return this.authService.userValue;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.closeModal();
    setTimeout(() => {
      this.shareService.openLoading();
  
      this.fileService.getEncodeFromImagesBase64(this.fileupload.files)
      .then(data => {
        let formData = {
          content: this.form.value.content,
          media: data
        };
  
        this.newfeedsService.post(formData)
        .subscribe(res => {
          this.shareService.closeLoading();
          this.shareService.input('refresh-newfeeds');
          this.alert.success("Đăng tải trạng thái thành công.");
        }, err => {
          this.shareService.closeLoading();
          this.alert.error("Đăng tải trạng thái thất bại.");
        });
      });
    }, 400);
  }

  openModal() {
    this.form.patchValue({
      content: ''
    });
    this.fileupload.clear();
    this.modal = true;
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="content"]').focus();
    }, 250);
  }

  closeModal() {
    this.modal = false;
  }

}
