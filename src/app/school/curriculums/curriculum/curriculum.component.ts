import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../courses/course';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {
  @Input() course!: Course;
  @Input() lessons!: Lesson[];
  @Input() chapters!: Chapter[];

  constructor() {
    // do nothing.
  }

  ngOnInit(): void {
    // do nothing.
  }

}
