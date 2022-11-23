import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'vimeoUrl'
})
export class VimeoUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(value: string, ...args: any[]): any {
    let url = value?.replace("vimeo.com/", "player.vimeo.com/video/");

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
