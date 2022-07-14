import { isPlatformServer } from '@angular/common';
import { Directive, Inject, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appShellRender]'
})
export class AppShellRenderDirective {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }

  }

}
