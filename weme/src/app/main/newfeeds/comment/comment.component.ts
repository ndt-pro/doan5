import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { NewfeedCommentsService } from 'src/app/_services/newfeeds.comment.service';
import { NewfeedsService } from 'src/app/_services/newfeeds.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ShareService } from 'src/app/_services/share.service';
import { SocketService } from 'src/app/_services/socket.service';
declare var $: any;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  form: FormGroup;
  newfeed_view: any;
  loadingUserLikes: boolean;
  newfeedsLike: any[];
  modalUserLikes: boolean;
  comments: any[];
  loadMore: boolean;
  loadMoreSpinner: boolean;
  page: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private newfeedsService: NewfeedsService,
    private commentService: NewfeedCommentsService,
    private shareService: ShareService,
    private alert: AlertService,
    private authService: AuthService,
    public socket: SocketService,
    private notificationService: NotificationService,
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      let cid = data.params.cid;

      this.newfeedsService.getNewfeedById(cid)
      .subscribe(res => {
        this.newfeed_view = res;
      });

      this.commentService.getComments(cid, this.page)
      .subscribe((res: any) => {
        this.comments = res.results.slice().reverse();
        this.loadMore = res.currentPage < res.pageCount;
      });
    });
    
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
    });
  }

  get user() {
    return this.authService.userValue;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    
    this.shareService.openLoading();

    this.commentService.postComment(this.newfeed_view.id, this.form.value.content).toPromise()
    .then(res => {
      if(this.newfeed_view.user.id != this.user.id) {
        this.notificationService.pushComment(this.newfeed_view.id)
        .subscribe(data => {
          if(data) this.socket.pushNotification(data);
        });
      }
      this.comments.push(res);
      this.form.patchValue({
        content: ''
      });
      this.shareService.closeLoading();
    })
    .catch(err => {
      this.shareService.closeLoading();
      this.alert.error(err);
    });
  }

  onDelete(post) {
    this.alert.delete("Bạn có thật sự muốn xóa bài viết này?", () => {
      this.shareService.openLoading();
      this.newfeedsService.delete(post.id).toPromise()
      .then(res => {
        this.shareService.closeLoading();
        this.alert.successCallback("Đã xóa bài viết thành công!", () => {
          this.router.navigate(['/']);
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
      
      if(post.user.id != this.user.id) {
        this.notificationService.pushLike(post.id)
        .subscribe(data => {
          if(data) this.socket.pushNotification(data);
        });
      }
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
    this.commentService.getComments(this.newfeed_view.id, this.page)
    .subscribe((res: any) => {
      this.loadMoreSpinner = false;
      this.comments = res.results.slice().reverse().concat(this.comments);
      this.loadMore = res.currentPage < res.pageCount;
    });
  }

  focusComment() {
    $("[formControlName='content']").focus();
  }

}
