import { Component, Input } from '@angular/core';
import { Section } from '../../school/courses/course';

@Component({
  selector: 'app-course-sections',
  templateUrl: './course-sections.component.html',
  styleUrls: ['./course-sections.component.css']
})
export class CourseSectionsComponent {
  @Input() sections: Section[];

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
}
