import { Component, Input } from '@angular/core';
import { Chapter } from 'src/app/school/chapters/chapter';
import { Course } from 'src/app/school/courses/course';
import { Lesson } from 'src/app/school/lessons/lesson';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-course-detail-summary',
  templateUrl: './course-detail-summary.component.html',
  styleUrls: ['./course-detail-summary.component.css']
})
export class CourseDetailSummaryComponent {
  @Input() course: Course;
  @Input() enrolled: boolean;
  @Input() chapters: Chapter[];

  constructor(private paymentService: PaymentService) { }

  buyCourse() {
    const payload = { productId: +this.course.id, productType: 'COURSE' };
    const type = 'basic';

    this.paymentService.openPaymentDialog(payload, type, this.course);
  }

  getLessonsCount(chapters: Chapter[]) {
    return chapters?.reduce((acc, curr) => {
      return acc + curr.lessons.length;
    }, 0);
  }

  getLessons(chapters: Chapter[]) {
    return chapters?.reduce((acc, curr) => {
      return acc.concat(curr.lessons);
    }, []);
  }

  getLessonsResourceCount(lessons: Lesson[]) {
    return lessons?.reduce((acc, curr) => {
      return acc + curr.resources.length;
    }, 0);
  }

  ngOnInit(): void {
    // Do nothing
  }

}
