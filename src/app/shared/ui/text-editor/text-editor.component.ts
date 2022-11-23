import { Component, Input, OnInit, Output, EventEmitter, HostListener, Inject, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @Input() editorSub$!: any;

  @Input() form!: FormGroup;
  @Input() content!: any;
  @Input() isLoading!: boolean;
  @Input() isPublishing!: boolean;
  @Input() isPublished!: boolean;
  @Input() isSaving!: boolean;
  @Input() isSaved!: boolean;
  @Input() saveFailed!: boolean;

  @Output() publishEvent = new EventEmitter<string>();
  @Output() onFileSelectedEvent = new EventEmitter<string>();

  @ViewChild("editor") editor!: ElementRef;
  activeTab: string = 'editor';
  fullScreenOn = false;
  elem: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private changeDetector: ChangeDetectorRef,
    private seo: SeoService
  ) { }

  setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  handleTab(event: Event, isUp: Boolean = false) {
    if ((event as KeyboardEvent).key === "Tab") {

      event.preventDefault();

      let start = (event.target as HTMLTextAreaElement).selectionStart;
      var end = (event.target as HTMLTextAreaElement).selectionEnd;
      (event.target as HTMLTextAreaElement).value = (event.target as HTMLTextAreaElement).value.substring(0, start) + '    ' + (event.target as HTMLTextAreaElement).value.substring(end);
      (event.target as HTMLTextAreaElement).selectionStart = (event.target as HTMLTextAreaElement).selectionEnd = start + 4;

      let value = (event.target as HTMLTextAreaElement).value;

      this.changeDetector.detectChanges();
      this.editor.nativeElement.focus();

      this.editorSub$.next(value);
    }

    if ((event as KeyboardEvent).key === "Tab" && isUp) {
      event.preventDefault();
      this.changeDetector.detectChanges();
      this.editor.nativeElement.focus();
    }

    let value = (event.target as HTMLTextAreaElement).value;
    this.editorSub$.next(value);
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event: any) {
    this.checkScreenMode();
  }

  checkScreenMode() {
    if (document.fullscreenElement) {
      this.fullScreenOn = true;
    } else {
      this.fullScreenOn = false;
    }
  }

  toggleFullScreen() {
    this.elem = (document as any).querySelector('.editor_sticky_wrapper');
    const textarea = (document as any).querySelector('#content');
    const editotheader = (document as any).querySelector('.editor-header');

    this.elem.addEventListener('fullscreenchange', this.fullscreenchanged);

    if (!this.document.fullscreenElement) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }

      textarea.style.height = '100vh';
      editotheader.style.marginTop = '0';

    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  fullscreenchanged() {
    if (document.fullscreenElement) {
      console.log(`Entered fullscreen mode.`);
    } else {
      console.log('Exit fullscreen mode.');
    }
  };

  onFileSelected($event) {
    this.onFileSelectedEvent.emit($event)
  }

  initPublish() {
    this.publishEvent.emit();
  }

  ngOnInit(): void {
    this.seo.unmountFooter()
    this.checkScreenMode();
    this.elem = document.documentElement;
  }

  ngOnDestroy(): void {
    this.seo.mountFooter();
  }

}
