import { Directive, ElementRef } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[ndt-loading]'
})
export class LoadingDirective {
  
  constructor(el: ElementRef) {
    $(el.nativeElement).addClass('progress-bg');
    $(el.nativeElement).append('<div class="progress-spinner"><div class="sp sp-circle"></div></div>');
 }

}
