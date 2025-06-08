import { Component, Input, OnInit, Output, EventEmitter, HostListener, Inject, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';
import { MarkdownService } from 'ngx-markdown';

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
  @Input() imageBtn: boolean = true;
  @Input() fullscreenBtn: boolean = true;
  @Input() showFullscreenPublishBtn: boolean = false;
  @Input() height: number = 100;
  @Input() showLineNumbers: boolean = true;
  @Input() enableEmoji: boolean = true;

  @Output() publishEvent = new EventEmitter<string>();
  @Output() onFileSelectedEvent = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild("editor") editor!: ElementRef;
  activeTab: string = 'editor';
  fullScreenOn = false;
  elem: any;
  private lastCursorPosition: number = 0;

  constructor(
    @Inject(DOCUMENT) private readonly document: any,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly seo: SeoService,
    private readonly markdownService: MarkdownService
  ) { }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    if (tabName === 'editor') {
      setTimeout(() => {
        this.editor.nativeElement.focus();
        this.editor.nativeElement.setSelectionRange(this.lastCursorPosition, this.lastCursorPosition);
      });
    }
  }

  handleTab(event: Event, isUp = false) {
    if ((event as KeyboardEvent).key === "Tab") {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start === end) {
        // Simple tab insertion
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      } else {
        // Multi-line tab handling
        const selectedText = textarea.value.substring(start, end);
        const lines = selectedText.split('\n');
        
        if ((event as KeyboardEvent).shiftKey) {
          // Remove tabs
          const processedLines = lines.map(line => line.startsWith('    ') ? line.substring(4) : line);
          const newText = processedLines.join('\n');
          textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
          textarea.selectionStart = start;
          textarea.selectionEnd = start + newText.length;
        } else {
          // Add tabs
          const processedLines = lines.map(line => '    ' + line);
          const newText = processedLines.join('\n');
          textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
          textarea.selectionStart = start;
          textarea.selectionEnd = start + newText.length;
        }
      }

      this.lastCursorPosition = textarea.selectionStart;
      this.handleContentChange(textarea.value);
    }
  }

  handleContentChange(value: string) {
    this.editorSub$.next(value);
    this.contentChange.emit(value);
  }

  insertMarkdownSyntax(syntax: string, placeholder: string = '') {
    const textarea = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertion = '';
    switch(syntax) {
      case 'bold':
        insertion = `**${selectedText || 'texte en gras'}**`;
        break;
      case 'italic':
        insertion = `*${selectedText || 'texte en italique'}*`;
        break;
      case 'link':
        insertion = `[${selectedText || 'texte du lien'}](url)`;
        break;
      case 'code':
        insertion = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText || 'votre code'}\n\`\`\``
          : `\`${selectedText || 'code'}\``;
        break;
      case 'image':
        insertion = `![${placeholder || 'alt text'}](url)`;
        break;
      default:
        insertion = placeholder;
    }

    textarea.value = textarea.value.substring(0, start) + insertion + textarea.value.substring(end);
    this.handleContentChange(textarea.value);
    
    // Restore focus and update cursor position
    // textarea.focus();
    const newCursorPos = start + insertion.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    this.lastCursorPosition = newCursorPos;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes() {
    this.checkScreenMode();
  }

  checkScreenMode() {
    this.fullScreenOn = !!document.fullscreenElement;
  }

  toggleFullScreen() {
    this.elem = this.document.querySelector('.editor_wrapper');
    if (!this.elem) return;

    if (!this.document.fullscreenElement) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        this.elem.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.insertMarkdownSyntax('image', `![${file.name}](${imageUrl})`);
      };
      reader.readAsDataURL(file);
    }
    this.onFileSelectedEvent.emit(event);
  }

  initPublish() {
    this.publishEvent.emit();
  }

  ngOnInit(): void {
    if (this.fullscreenBtn) this.seo.unmountFooter();
    this.checkScreenMode();
    this.elem = document.documentElement;
  }

  ngOnDestroy(): void {
    if (this.fullscreenBtn) this.seo.mountFooter();
  }
}
