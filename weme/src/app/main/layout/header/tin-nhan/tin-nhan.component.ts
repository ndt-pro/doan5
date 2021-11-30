import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-tin-nhan',
  templateUrl: './tin-nhan.component.html',
  styleUrls: ['./tin-nhan.component.css']
})
export class TinNhanComponent implements OnInit {

  constructor(
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.messageService.countNewMessage().toPromise()
    .then(res => {
      this.messageService.newMessage = res;
    });
  }

  get count() {
    return this.messageService.newMessage && this.messageService.newMessage.length;
  }

}
