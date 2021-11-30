import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/user';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { NewfeedCommentsService } from 'src/app/_services/newfeeds.comment.service';
import { NewfeedsService } from 'src/app/_services/newfeeds.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ShareService } from 'src/app/_services/share.service';
import { SocketService } from 'src/app/_services/socket.service';
declare var $: any;

@Component({
  selector: 'app-newfeeds',
  templateUrl: './newfeeds.component.html',
  styleUrls: ['./newfeeds.component.css']
})
export class NewfeedsComponent implements OnInit {
  @Input() user_view: User;
  form: FormGroup;
  timeline: any[];
  loadingUserLikes: boolean;
  newfeedsLike: any[];
  modalUserLikes: boolean;
  page: number = 1;
  pageSize: number = 5;
  loadMoreSpinner: boolean;
  loadOutOfData: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private newfeedsService: NewfeedsService,
    public socket: SocketService,
    private shareService: ShareService,
    private commentService: NewfeedCommentsService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getNewfeed();

    this.shareService.output()
    .subscribe(cmd => {
      if(cmd == 'refresh-newfeeds') {
        this.onRefreshNewFeeds();
      }
    });
    
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  get user() {
    return this.authService.userValue;
  }

  onSubmit(newfeed) {
    if (this.form.invalid) {
      return;
    }
    
    this.shareService.openLoading();

    this.commentService.postComment(newfeed.id, this.form.value.content).toPromise()
    .then(res => {
      if(newfeed.user.id != this.user.id) {
        this.notificationService.pushComment(newfeed.id)
        .subscribe(data => {
          if(data) this.socket.pushNotification(data);
        });
      }
      this.router.navigate(['/comment', newfeed.id]);
      this.shareService.closeLoading();
    })
    .catch(err => {
      this.shareService.closeLoading();
      this.alert.error(err);
    });
  }

  getNewfeed(append?: boolean, callback?) {
    let get = this.newfeedsService.getNewfeed(this.page, this.pageSize);
    if(this.user_view) {
      get = this.newfeedsService.getNewfeedUser(this.user_view.id, this.page, this.pageSize)
    }
    get.subscribe(res => {
      this.loadOutOfData = false;
      if(callback) callback(res);
      if(append) {
        this.timeline = this.timeline.concat(res);
      } else {
        this.timeline = res;
      }
    });
  }

  onDelete(post) {
    this.alert.delete("Bạn có thật sự muốn xóa bài viết này?", () => {
      this.shareService.openLoading();
      this.newfeedsService.delete(post.id).toPromise()
      .then(res => {
        this.shareService.closeLoading();
        this.alert.successCallback("Đã xóa bài viết thành công!", () => {
          this.getNewfeed();
        });
      })
      .catch(err => {
        this.shareService.closeLoading();
        this.alert.error("Không thể thực hiện thao tác: " + err);
      });
    });
  }

  onLike(post) {
    this.newfeedsService.like(post.id).toPromise()
    .then((res: any) => {
      if(res.isLike) {
        post.countLike++;
        post.liked = true;
        
        if(post.user.id != this.user.id) {
          this.notificationService.pushLike(post.id)
          .subscribe(data => {
            if(data) this.socket.pushNotification(data);
          });
        }
      } else {
        post.countLike--;
        post.liked = false;
      }
    });
  }

  openModalUserLikes(post) {
    this.modalUserLikes = true;
    this.loadingUserLikes = true;
    this.newfeedsLike = [];

    this.newfeedsService.getUserLikes(post.id).toPromise()
    .then(res => {
      this.newfeedsLike = res;
      this.loadingUserLikes = false;
    })
    .catch(err => {
      this.loadingUserLikes = false;
    });
  }

  closeModalUserLikes() {
    this.modalUserLikes = false;
    this.loadingUserLikes = false;
  }

  onLoadMore() {
    this.page++;
    this.loadMoreSpinner = true;

    this.getNewfeed(true, (res) => {
      this.loadMoreSpinner = false;
      if(res.length == 0) {
        this.loadOutOfData = true;
      }
    });
  }

  onRefreshNewFeeds() {
    this.shareService.openLoading();
    this.page = 1;
    this.getNewfeed(false, (res) => {
      this.shareService.closeLoading();
      this.autoScroll();
    });
  }

  autoScroll() {
    let scrollTo = $('#scroll-to-top');

    $('html, body').animate({
      scrollTop: scrollTo.offset().top
    }, 800);
  }

}
