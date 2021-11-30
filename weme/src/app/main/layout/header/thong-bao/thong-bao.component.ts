import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';
import { FileService } from 'src/app/_services/file.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-thong-bao',
  templateUrl: './thong-bao.component.html',
  styleUrls: ['./thong-bao.component.css']
})
export class ThongBaoComponent implements OnInit {
  notifications: any[];

  constructor(
    private socket: SocketService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private fileService: FileService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.notifications = [];

    this.notificationService.getNotificationsById()
    .subscribe(res => {
      this.notifications = res;
    });

    // lắng nghe thông báo từ socket
    this.socket.getNotification()
    .subscribe(res => {
      this.notifications.unshift(res);
      this.fileService.playNotificationSound();
      this.notificationService.openToastr(`<strong>${res.fromUser.fullName}</strong> ${res.content}`, res.type);
    });
  }

  get user() {
    return this.authService.userValue;
  }

  get count() {
    return this.notifications.filter(noti => noti.status == 0).length;
  }

  openNotitfication(notification) {
    this.notificationService.seeNotification(notification.id)
    .subscribe(res => {
      notification.status = 1;
      this.router.navigate(['/comment', notification.rememberId]);
    });
  }

}
