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
          height: '100px',
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class CollapsibleTagsComponent {
  @Input() tagList!: Tag[];
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

  isOpen: boolean = false;
  tags: string[] = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6'
    , 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6'
    , 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6', 'Tag 6'
    , 'Tag 6', 'Tag 6', 'Tag 6'];

  toggleSection(): void {
    this.isOpen = !this.isOpen;
  }
}
