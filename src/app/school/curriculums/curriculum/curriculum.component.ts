import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../../courses/course';
import { Lesson } from '../../lessons/lesson';
import { Chapter } from '../../chapters/chapter';
import { Router } from '@angular/router';
import { capitalizeString } from 'src/app/services/utilities.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CourseService } from '../../courses/course.service';

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
  @Input() isSubscriber!: boolean;
  @Input() canEdit: boolean = true;

  currentRoute: string

  constructor(
    private router: Router,
    private courseService: CourseService
  ) {
    // do nothing.
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  dropChapters(event: CdkDragDrop<Chapter[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Chapter

      this.courseService.moveChapter(draggedElement.id, currPosition)
        .subscribe(_data => console.log('DRAGGED RESPONSE CHAPTER'));
    }
  }

  dropLessons(event: CdkDragDrop<Lesson[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Lesson

      this.courseService.moveLesson(draggedElement.chapterId, draggedElement.id, currPosition)
        .subscribe(_data => console.log('DRAGGED RESPONSE LESSON'));
    }
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url
  }

}
