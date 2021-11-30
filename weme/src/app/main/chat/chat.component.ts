import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';
import { FileService } from 'src/app/_services/file.service';
import { MessageService } from 'src/app/_services/message.service';
import { SocketService } from 'src/app/_services/socket.service';
declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  form: FormGroup;
  mess_box: any[];
  user_focus: any;
  mess_focus: any[];
  modalFile: boolean;
  fileupload: File[];
  fileupload_preview: any;
  page: number = 1;
  loadMoreSpinner: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public socket: SocketService,
    private authService: AuthService,
    private messageService: MessageService,
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
    let inner = $(".main_content_inner");
    inner.addClass("pt-0");
    inner.css({
      'max-width': '1300px'
    });

    this.messageService.getMessageBox()
    .pipe(map((res: any) => {
      return res.map(data => {
        if(data.lastMessage.fromUserId == this.authService.userValue.id)
          data.lastMessage.content = `Bạn: ${data.lastMessage.content}`;
        return data;
      });
    }))
    .subscribe(res => {
      this.mess_box = res;

      if(this.mess_box.length > 0) this.getAllMessage(this.mess_box[0]);
    });
    
    this.form = this.formBuilder.group({
      content: ['', Validators.required]
    });

    this.socket.readMessage = (res) => {

      this.mess_box.map((mess: any) => {

        if(res.fromUser.id == mess.toUser.id) {
          mess.lastMessage.content = res.content;
          mess.lastMessage.status = 0;
          mess.lastMessage.createdAt = new Date();
        }

      });

      let newMsg = this.messageService.newMessage.filter(mess => {
        return mess.fromUserId == res.fromUser.id;
      });

      if(newMsg.length == 0 && res.fromUser.id != this.user_focus.toUser.id) {
        this.messageService.newMessage.push({ fromUserId: res.fromUser.id });
      } else if(res.fromUser.id == this.user_focus.toUser.id) {
        this.messageService.newMessage = this.messageService.newMessage.filter(mess => {
          return mess.fromUserId != res.fromUser.id;
        });
      }
      
      if(res.fromUser.id == this.user_focus.toUser.id) {
        this.mess_focus.push(res);
        this.autoScroll();
  
        this.user_focus.lastMessage.status = 1;
        
        this.messageService.seeMessage(this.user_focus.toUser.id, this.authService.userValue.id).toPromise()
        .then(() => {
          this.socket.seenMessage(this.user_focus.toUser.id);
        });
      } else {
        return true;
      }
      return false;
    }

    this.socket.getSeenMessage().subscribe(userSeeId => {
      if(this.user_focus.toUser.id == userSeeId) {
        this.mess_focus.map(mess => {
          if(mess.fromUser.id == this.authService.userValue.id) {
            mess.status = 1;
          }
        });
      }
    });
  }
  
  ngOnDestroy(): void {
    let inner = $(".main_content_inner");
    inner.removeClass("pt-0");
    inner.css({
      'max-width': ''
    });

    this.socket.readMessage = (res) => {
      this.socket.initReadMessage(res);
      return true;
    };
  }

  getAllMessage(inbox) {
    this.user_focus = inbox;

    this.messageService.getMessage(inbox.toUser.id, 1)
    .subscribe((res: any[]) => {

      this.mess_focus = res.slice().reverse();

      this.messageService.newMessage = this.messageService.newMessage.filter(mess => {
        return mess.fromUserId != inbox.toUser.id;
      });
      
      this.messageService.seeMessage(inbox.toUser.id, this.authService.userValue.id).toPromise()
      .then(res => {
        this.user_focus.lastMessage.status = 1;
        this.socket.seenMessage(inbox.toUser.id);
      });

      setTimeout(() => {
        this.autoScroll();
      }, 700);

    });
    
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    
    // send message to server
    this.fileService.getEncodeFromImagesBase64(this.fileupload)
    .then(data => {
      this.socket.sendMessage(this.user_focus.toUser.id, this.form.value.content, data);
    });

    // push message to array
    this.fileService.getEncodeFromImages(this.fileupload)
    .then(data => {
      let mess = {
        fromUser: {
          id: this.authService.userValue.id,
          fullName: this.authService.userValue.fullName,
          avatar: this.authService.userValue.avatar,
        },
        toUser: {
          id: this.user_focus.toUser.id,
          fullName: this.user_focus.toUser.fullName,
          avatar: this.user_focus.toUser.avatar,
        },
        content: this.form.value.content,
        media: data,
        status: 0,
      };
  
      this.mess_focus.push(mess);

      this.user_focus.lastMessage.content = `Bạn: ${this.form.value.content}`;
      this.user_focus.lastMessage.status = 1;
      this.form.patchValue({ content: '' });
      this.fileupload_preview = undefined;
      this.fileupload = undefined;
      this.autoScroll();
    });

  }

  autoScroll() {
    let container = $('#message-content'),
        scrollTo = $('#scroll-to-bottom');

    container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
    });
  }

  openSelectFileUpload() {
    $("input[data-upload]").click();
  }

  selectFileUpload(files) {
    this.fileupload = files;
    
    this.fileService.getEncodeFromImages(this.fileupload)
    .then(data => {
      this.fileupload_preview = data;
    });
  }

  remeveAllFileUpload() {
    this.fileupload_preview = undefined;
    this.fileupload = undefined;
  }

  onLoadMore() {
    this.page++;
    this.loadMoreSpinner = true;
    this.messageService.getMessage(this.user_focus.toUser.id, this.page)
    .subscribe((res: any[]) => {
      this.loadMoreSpinner = false;
      this.mess_focus = res.slice().reverse().concat(this.mess_focus);
    });
  }

}