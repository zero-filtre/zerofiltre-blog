import { Pipe, PipeTransform } from '@angular/core';
import { Article } from 'src/app/articles/article.model';
import { Course } from 'src/app/school/courses/course';
import { Lesson } from 'src/app/school/lessons/lesson';

@Pipe({
  name: 'slugify'
})
export class SlugUrlPipe implements PipeTransform {

  transform(object: Article | Course | Lesson, ...args: any[]): any {

    const slug = object?.id + '-' + object?.title
    return slug.toLowerCase().trim()
      .replace(/[^\w\-çîéèœô]+/g, ' ')
      .trim()
      .replace(/\s+/g, '-')

  }

}
