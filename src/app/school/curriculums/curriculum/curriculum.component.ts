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
  @Input() mobileQuery: MediaQueryList;

  currentRoute: string
  expandedIndex = 0;

  constructor(
    private router: Router,
    private courseService: CourseService
  ) {
    // do nothing.
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  dropLessons(event: CdkDragDrop<Lesson[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex;
      const prevPosition = event.previousIndex;
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Lesson

      if (currPosition != prevPosition) {
        this.courseService.moveLesson(draggedElement.chapterId, draggedElement.id, currPosition)
          .subscribe(_data => console.log('DRAGGED LESSON'));
      }
    }
  }

  dropChapters(event: CdkDragDrop<Chapter[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      const currPosition = event.currentIndex + 1;
      const prevPosition = event.previousIndex + 1;
      const draggedElement = event.item.dropContainer.data[event.currentIndex] as Chapter

      if (currPosition != prevPosition) {
        this.courseService.moveChapter(draggedElement.id, currPosition)
          .subscribe(_data => console.log('DRAGGED CHAPTER'))
      }
    }
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url
  }

}
