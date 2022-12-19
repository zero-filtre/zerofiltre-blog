import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../courses/course';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {
  @Input() course!: Course;
  @Input() lessons!: Lesson[];
  @Input() chapters!: Chapter[];
  @Input() canAccessCourse!: boolean;

  currentRoute: string

  constructor(private router: Router) {
    // do nothing.
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url
  }

}
