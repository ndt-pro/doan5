import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { GetImagePipe } from '../_pipe/getimage.pipe';
import { LoadingDirective } from '../_directive/loading.directive';
import { TruncatePipe } from '../_pipe/truncate.pipe';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TimeagoPipe } from '../_pipe/timeago.pipe';
import { TimeVnPipe } from '../_pipe/timevn.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    GetImagePipe,
    TruncatePipe,
    TimeagoPipe,
    TimeVnPipe,
    LoadingDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    CalendarModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    InfiniteScrollModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    DialogModule,
    ButtonModule,
    EditorModule,
    FileUploadModule,
    TooltipModule,
    InfiniteScrollModule,
    GetImagePipe,
    TruncatePipe,
    TimeagoPipe,
    TimeVnPipe,
    LoadingDirective,
    CommonModule
  ]
})
export class ShareModule { }
