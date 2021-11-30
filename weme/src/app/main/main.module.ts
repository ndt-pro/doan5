import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { ChatComponent } from './chat/chat.component';
import { DsOnlineComponent } from './home/ds-online/ds-online.component';
import { TinNhanComponent } from './layout/header/tin-nhan/tin-nhan.component';
import { ThongBaoComponent } from './layout/header/thong-bao/thong-bao.component';
import { ProfileComponent } from './profile/profile.component';
import { ShareModule } from '../share/share.module';
import { NewfeedsComponent } from './newfeeds/newfeeds.component';
import { EditProfileComponent } from './profile/edit/edit-profile.component';
import { CommentComponent } from './newfeeds/comment/comment.component';

export const mainRoutes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
          path: '', component: HomeComponent
      },
      {
          path: 'chat', component: ChatComponent
      },
      {
          path: 'profile', component: ProfileComponent
      },
      {
          path: 'profile/edit', component: EditProfileComponent
      },
      {
          path: 'profile/:uid', component: ProfileComponent
      },
      {
          path: 'comment/:cid', component: CommentComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    ChatComponent,
    DsOnlineComponent,
    TinNhanComponent,
    ThongBaoComponent,
    ProfileComponent,
    EditProfileComponent,
    NewfeedsComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(mainRoutes),
  ]
})
export class MainModule { }
