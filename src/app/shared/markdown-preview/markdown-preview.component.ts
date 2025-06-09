import { Component, Input, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import * as joypixels from 'emoji-toolkit';

@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.css'],
})
export class MarkdownPreviewComponent implements OnInit {
  @Input() data: string = '';
  @Input() lineNumbers: boolean = true;
  @Input() emoji: boolean = true;
  // readonly clipboardButton = ClipboardButtonComponent;

  constructor(private readonly markdownService: MarkdownService) {
    // Configuration des hooks pour le traitement des images
    this.markdownService.renderer.image = ({ href, title, text }) => {
      const imgClass = 'rounded-lg shadow-lg max-w-full h-auto';
      return `<img src="${href}" alt="${text}" title="${
        title ?? text
      }" class="${imgClass}" loading="lazy">`;
    };

    // Configuration du support des emojis
    if (this.emoji) {
      const originalTextRenderer = this.markdownService.renderer.text;
      this.markdownService.renderer.text = (token) => {
        if (typeof token === 'string') {
          return joypixels.shortnameToUnicode(token);
        }
        return originalTextRenderer.call(this.markdownService.renderer, token);
      };
    }
  }

  ngOnInit(): void {
    // Initialisation de Prism pour la coloration syntaxique
    if (typeof window !== 'undefined') {
      const Prism = (window as any).Prism;
      if (Prism) {
        Prism.highlightAll();
      }
    }
  }
}
