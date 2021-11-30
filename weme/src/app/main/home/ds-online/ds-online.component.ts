import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { User } from 'src/app/_model/user';
import { FileService } from 'src/app/_services/file.service';
import { SocketService } from 'src/app/_services/socket.service';
declare var $: any;

@Component({
  selector: 'app-ds-online',
  templateUrl: './ds-online.component.html',
  styleUrls: ['./ds-online.component.css']
})
export class DsOnlineComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  modal: boolean;
  user_select: User;

  
  @ViewChild(FileUpload, { static: false }) fileupload: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    public socket: SocketService,
    public fileService: FileService,
    private el: ElementRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      content: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  openModalMessage(user) {
    this.user_select = user;
    this.modal = true;
    
    setTimeout(() => {
      this.el.nativeElement.querySelector('[formControlName="content"]').focus();
    }, 250);
  }
  
  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // send message to server
    this.fileService.getEncodeFromImagesBase64(this.fileupload.files)
    .then(data => {
      this.socket.sendMessage(this.user_select.id, this.form.value.content, data);
      setTimeout(() => {
        this.router.navigate(['/chat']);
      }, 500);
    });
  }

}
