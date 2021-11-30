import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../_lib/base.component';
import { FileService } from '../_services/file.service';
import { NotificationService } from '../_services/notification.service';
import { SocketService } from '../_services/socket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private socket: SocketService,
    private fileService: FileService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadScripts();
    this.socket.on();

    // lắng nghe người gửi tin nhắn từ socket
    this.socket.getMessage().subscribe(res => {
      if(this.socket.readMessage(res)) {
        this.fileService.playMessageSound();
      }
    });
  }
}