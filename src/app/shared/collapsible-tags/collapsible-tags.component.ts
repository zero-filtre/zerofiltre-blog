import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Tag } from 'src/app/articles/article.model';

@Component({
  selector: 'app-collapsible-tags',
  templateUrl: './collapsible-tags.component.html',
  styleUrls: ['./collapsible-tags.component.css'],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('collapsed <=> expanded', [animate('400ms ease-in-out')]),
    ]),
  ],
})
export class CollapsibleTagsComponent {
  @Input() tagList!: Tag[];
  @Input() displayTitle = true;
  @Input() isOpen = false;
  @Output() filterEvent = new EventEmitter<any>();
  @Output() activeTagEvent = new EventEmitter<any>();

  activeTag!: string;

  sendActiveTagToParent(tag: string) {
    this.activeTagEvent.emit(tag);
  }

  filterByTag(tag: string) {
    this.activeTag = tag;
    this.sendActiveTagToParent(tag)
    this.filterEvent.emit(tag);
  }


  toggleSection(): void {
    this.isOpen = !this.isOpen;
  }
}
