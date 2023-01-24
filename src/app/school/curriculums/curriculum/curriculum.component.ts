import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../courses/course';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { Router } from '@angular/router';
import { capitalizeString } from 'src/app/services/utilities.service';

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

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url
  }

}
